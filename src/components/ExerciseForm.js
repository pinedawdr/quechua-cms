// src/components/ExerciseForm.js
import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { uploadImage } from '../services/cloudinary';
import '../styles/ExerciseForm.css';

const db = getFirestore();

const ExerciseForm = ({ exercise, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('pronunciation'); // Añadido: tipo de ejercicio
  const [difficulty, setDifficulty] = useState('easy'); // Añadido: dificultad
  const [imageUrl, setImageUrl] = useState('');
  const [words, setWords] = useState([
    { quechuaText: '', spanishText: '', audioUrl: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [audioFiles, setAudioFiles] = useState([null]);
  const [audioPreview, setAudioPreview] = useState([false]);

  useEffect(() => {
    if (exercise) {
      setTitle(exercise.title || '');
      setDescription(exercise.description || '');
      setType(exercise.type || 'pronunciation');
      setDifficulty(exercise.difficulty || 'easy');
      setImageUrl(exercise.imageUrl || '');
      setPreviewImage(exercise.imageUrl || '');
      setWords(exercise.words || [{ quechuaText: '', spanishText: '', audioUrl: '' }]);
      setAudioFiles(exercise.words ? exercise.words.map(() => null) : [null]);
      setAudioPreview(exercise.words ? exercise.words.map(word => !!word.audioUrl) : [false]);
    }
  }, [exercise]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedAudioFiles = [...audioFiles];
      updatedAudioFiles[index] = file;
      setAudioFiles(updatedAudioFiles);
      
      // Actualizar la vista previa
      const updatedAudioPreview = [...audioPreview];
      updatedAudioPreview[index] = true;
      setAudioPreview(updatedAudioPreview);
    }
  };

  const handleAddWord = () => {
    setWords([...words, { quechuaText: '', spanishText: '', audioUrl: '' }]);
    setAudioFiles([...audioFiles, null]);
    setAudioPreview([...audioPreview, false]);
  };

  const handleRemoveWord = (index) => {
    const updatedWords = [...words];
    updatedWords.splice(index, 1);
    setWords(updatedWords);
    
    const updatedAudioFiles = [...audioFiles];
    updatedAudioFiles.splice(index, 1);
    setAudioFiles(updatedAudioFiles);
    
    const updatedAudioPreview = [...audioPreview];
    updatedAudioPreview.splice(index, 1);
    setAudioPreview(updatedAudioPreview);
  };

  const handleWordChange = (index, field, value) => {
    const updatedWords = [...words];
    updatedWords[index] = {
      ...updatedWords[index],
      [field]: value
    };
    setWords(updatedWords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload image if changed
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }
      
      // Upload audio files if changed
      const finalWords = await Promise.all(words.map(async (word, index) => {
        let finalAudioUrl = word.audioUrl;
        if (audioFiles[index]) {
          // En lugar de usar uploadImage, usamos una función específica para audio
          finalAudioUrl = await uploadAudio(audioFiles[index]);
        }
        
        return {
          ...word,
          audioUrl: finalAudioUrl
        };
      }));
      
      const exerciseData = {
        title,
        description,
        type,
        difficulty,
        imageUrl: finalImageUrl,
        words: finalWords,
        updatedAt: new Date().toISOString()
      };
      
      // Si estamos editando un ejercicio existente, actualizamos
      if (exercise && exercise.id) {
        await setDoc(doc(db, 'verbalExercises', exercise.id), exerciseData);
      } else {
        // Si es nuevo, usamos la función onSubmit proporcionada
        await onSubmit(exerciseData);
      }
      
      onCancel(); // Cerrar el formulario después de guardar
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error al guardar el ejercicio. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función específica para subir archivos de audio
  const uploadAudio = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'quechua_app_preset');
      
      // Especificar que es un archivo de audio para asegurar el formato correcto
      formData.append('resource_type', 'video'); // Cloudinary usa 'video' para audio también
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dwsht1d0o/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Failed to upload audio');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  };

  return (
    <div className="exercise-form">
      <h2>{exercise ? 'Editar Ejercicio' : 'Añadir Ejercicio'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ingresa el título del ejercicio"
          />
        </div>
        
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingresa una descripción breve del ejercicio"
          />
        </div>
        
        <div className="form-group">
          <label>Tipo de ejercicio</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="pronunciation">Pronunciación</option>
            <option value="vocabulary">Vocabulario</option>
            <option value="conversation">Conversación</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Nivel de dificultad</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="easy">Básico</option>
            <option value="medium">Intermedio</option>
            <option value="hard">Avanzado</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Imagen Principal</label>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Vista previa de imagen" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        
        <h3>Palabras</h3>
        {words.map((word, index) => (
          <div key={index} className="word-form">
            <h4>Palabra {index + 1}</h4>
            
            <div className="form-group">
              <label>Palabra en Quechua</label>
              <input
                type="text"
                value={word.quechuaText}
                onChange={(e) => handleWordChange(index, 'quechuaText', e.target.value)}
                required
                placeholder="Palabra en quechua"
              />
            </div>
            
            <div className="form-group">
              <label>Traducción al Español</label>
              <input
                type="text"
                value={word.spanishText}
                onChange={(e) => handleWordChange(index, 'spanishText', e.target.value)}
                required
                placeholder="Traducción al español"
              />
            </div>
            
            <div className="form-group">
              <label>Audio de Pronunciación</label>
              {(word.audioUrl || audioPreview[index]) && (
                <div className="audio-preview">
                  <audio controls>
                    <source src={word.audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleAudioChange(index, e)}
              />
              <p className="audio-note">
                Importante: Sube un archivo de audio claro, preferiblemente en formato MP3.
              </p>
            </div>
            
            {words.length > 1 && (
              <button
                type="button"
                className="remove-word-button"
                onClick={() => handleRemoveWord(index)}
              >
                Eliminar Palabra
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          className="add-word-button"
          onClick={handleAddWord}
        >
          Añadir Palabra
        </button>
        
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (exercise ? 'Actualizar Ejercicio' : 'Crear Ejercicio')}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;