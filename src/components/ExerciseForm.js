import React, { useState, useEffect } from 'react';
import { uploadImage } from '../services/cloudinary';
import '../styles/ExerciseForm.css';

const ExerciseForm = ({ exercise, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [words, setWords] = useState([
    { quechuaText: '', spanishText: '', audioUrl: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [audioFiles, setAudioFiles] = useState([null]);

  useEffect(() => {
    if (exercise) {
      setTitle(exercise.title || '');
      setDescription(exercise.description || '');
      setImageUrl(exercise.imageUrl || '');
      setPreviewImage(exercise.imageUrl || '');
      setWords(exercise.words || [{ quechuaText: '', spanishText: '', audioUrl: '' }]);
      setAudioFiles(exercise.words ? exercise.words.map(() => null) : [null]);
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
    }
  };

  const handleAddWord = () => {
    setWords([...words, { quechuaText: '', spanishText: '', audioUrl: '' }]);
    setAudioFiles([...audioFiles, null]);
  };

  const handleRemoveWord = (index) => {
    const updatedWords = [...words];
    updatedWords.splice(index, 1);
    setWords(updatedWords);
    
    const updatedAudioFiles = [...audioFiles];
    updatedAudioFiles.splice(index, 1);
    setAudioFiles(updatedAudioFiles);
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
          finalAudioUrl = await uploadImage(audioFiles[index]);
        }
        
        return {
          ...word,
          audioUrl: finalAudioUrl
        };
      }));
      
      const exerciseData = {
        title,
        description,
        imageUrl: finalImageUrl,
        words: finalWords,
        updatedAt: new Date().toISOString()
      };
      
      await onSubmit(exerciseData);
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error al guardar el ejercicio. Intenta nuevamente.');
    } finally {
      setLoading(false);
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
              {word.audioUrl && (
                <audio controls>
                  <source src={word.audioUrl} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleAudioChange(index, e)}
              />
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