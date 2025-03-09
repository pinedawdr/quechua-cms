import React, { useState, useEffect } from 'react';
import { uploadImage } from '../services/cloudinary';
import '../styles/NarrativeForm.css';

const NarrativeForm = ({ narrative, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryType, setCategoryType] = useState('adventure');
  const [duration, setDuration] = useState('10-15');
  const [coverImage, setCoverImage] = useState('');
  const [scenes, setScenes] = useState([
    {
      quechuaText: '',
      spanishText: '',
      image: '',
      choices: [
        { quechuaText: '', spanishText: '', nextScene: 1 }
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [sceneFiles, setSceneFiles] = useState([null]);

  useEffect(() => {
    if (narrative) {
      setTitle(narrative.title || '');
      setDescription(narrative.description || '');
      setCategoryType(narrative.category || 'adventure');
      setDuration(narrative.duration || '10-15');
      setCoverImage(narrative.coverImage || '');
      setPreviewImage(narrative.coverImage || '');
      setScenes(narrative.scenes || [
        {
          quechuaText: '',
          spanishText: '',
          image: '',
          choices: [
            { quechuaText: '', spanishText: '', nextScene: 1 }
          ]
        }
      ]);
      setSceneFiles(narrative.scenes ? narrative.scenes.map(() => null) : [null]);
    }
  }, [narrative]);

  const handleCategoryChange = (value) => {
    setCategoryType(value);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSceneImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedSceneFiles = [...sceneFiles];
      updatedSceneFiles[index] = file;
      setSceneFiles(updatedSceneFiles);
      
      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedScenes = [...scenes];
        updatedScenes[index] = {
          ...updatedScenes[index],
          _previewImage: reader.result // This is just for preview, won't be saved
        };
        setScenes(updatedScenes);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddScene = () => {
    setScenes([
      ...scenes, 
      {
        quechuaText: '',
        spanishText: '',
        image: '',
        choices: [
          { quechuaText: '', spanishText: '', nextScene: scenes.length + 1 }
        ]
      }
    ]);
    setSceneFiles([...sceneFiles, null]);
  };

  const handleRemoveScene = (index) => {
    const updatedScenes = [...scenes];
    updatedScenes.splice(index, 1);
    
    // Update nextScene references in choices
    updatedScenes.forEach(scene => {
      scene.choices.forEach(choice => {
        if (choice.nextScene > index) {
          choice.nextScene -= 1;
        } else if (choice.nextScene === index) {
          // If referencing the removed scene, point to the end
          choice.nextScene = updatedScenes.length;
        }
      });
    });
    
    setScenes(updatedScenes);
    
    const updatedSceneFiles = [...sceneFiles];
    updatedSceneFiles.splice(index, 1);
    setSceneFiles(updatedSceneFiles);
  };

  const handleSceneChange = (index, field, value) => {
    const updatedScenes = [...scenes];
    updatedScenes[index] = {
      ...updatedScenes[index],
      [field]: value
    };
    setScenes(updatedScenes);
  };

  const handleAddChoice = (sceneIndex) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex].choices.push({
      quechuaText: '',
      spanishText: '',
      nextScene: sceneIndex + 1 < scenes.length ? sceneIndex + 1 : scenes.length
    });
    setScenes(updatedScenes);
  };

  const handleRemoveChoice = (sceneIndex, choiceIndex) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex].choices.splice(choiceIndex, 1);
    setScenes(updatedScenes);
  };

  const handleChoiceChange = (sceneIndex, choiceIndex, field, value) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex].choices[choiceIndex] = {
      ...updatedScenes[sceneIndex].choices[choiceIndex],
      [field]: field === 'nextScene' ? parseInt(value, 10) : value
    };
    setScenes(updatedScenes);
  };

  // Función auxiliar para calcular el número total de opciones
  const calculateTotalChoices = (scenes) => {
    return scenes.reduce((total, scene) => total + (scene.choices ? scene.choices.length : 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload cover image if changed
      let finalCoverImage = coverImage;
      if (coverFile) {
        finalCoverImage = await uploadImage(coverFile);
      }
      
      // Upload scene images if changed
      const finalScenes = await Promise.all(scenes.map(async (scene, index) => {
        let finalSceneImage = scene.image;
        if (sceneFiles[index]) {
          finalSceneImage = await uploadImage(sceneFiles[index]);
        }
        
        // Remove the preview property
        const { _previewImage, ...sceneData } = scene;
        
        return {
          ...sceneData,
          image: finalSceneImage
        };
      }));
      
      const narrativeData = {
        title,
        description,
        coverImage: finalCoverImage,
        category: categoryType,
        duration: duration || '10-15',
        choices: calculateTotalChoices(finalScenes),
        scenes: finalScenes,
        updatedAt: new Date().toISOString()
      };
      
      await onSubmit(narrativeData);
    } catch (error) {
      console.error('Error saving narrative:', error);
      alert('Error al guardar la narrativa. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="narrative-form">
      <h2>{narrative ? 'Editar Narrativa' : 'Añadir Narrativa'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ingresa el título de la narrativa"
          />
        </div>
        
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingresa una descripción breve de la narrativa"
          />
        </div>
        
        <div className="form-group">
          <label>Categoría</label>
          <select
            value={categoryType}
            onChange={(e) => handleCategoryChange(e.target.value)}
            required
          >
            <option value="adventure">Aventura</option>
            <option value="culture">Cultura</option>
            <option value="daily">Cotidiano</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Duración Estimada (minutos)</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ej: 10-15"
          />
        </div>
        
        <div className="form-group">
          <label>Imagen de Portada</label>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Vista previa de portada" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
        </div>
        
        <h3>Escenas</h3>
        <div className="scenes-container">
          {scenes.map((scene, sceneIndex) => (
            <div key={sceneIndex} className="scene-form">
              <div className="scene-header">
                <h4>Escena {sceneIndex + 1}</h4>
                {scenes.length > 1 && (
                  <button
                    type="button"
                    className="remove-scene-button"
                    onClick={() => handleRemoveScene(sceneIndex)}
                  >
                    Eliminar Escena
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label>Texto en Quechua</label>
                <textarea
                  value={scene.quechuaText}
                  onChange={(e) => handleSceneChange(sceneIndex, 'quechuaText', e.target.value)}
                  required
                  placeholder="Texto en quechua para esta escena"
                />
              </div>
              
              <div className="form-group">
                <label>Texto en Español</label>
                <textarea
                  value={scene.spanishText}
                  onChange={(e) => handleSceneChange(sceneIndex, 'spanishText', e.target.value)}
                  required
                  placeholder="Traducción al español"
                />
              </div>
              
              <div className="form-group">
                <label>Imagen de la Escena</label>
                {(scene._previewImage || scene.image) && (
                  <div className="image-preview">
                    <img 
                      src={scene._previewImage || scene.image} 
                      alt={`Vista previa de escena ${sceneIndex + 1}`}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSceneImageChange(sceneIndex, e)}
                />
              </div>
              
              <div className="choices-section">
                <h5>Opciones de Elección</h5>
                {scene.choices.map((choice, choiceIndex) => (
                  <div key={choiceIndex} className="choice-form">
                    <div className="choice-header">
                      <h6>Opción {choiceIndex + 1}</h6>
                      {scene.choices.length > 1 && (
                        <button
                          type="button"
                          className="remove-choice-button"
                          onClick={() => handleRemoveChoice(sceneIndex, choiceIndex)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>Texto en Quechua</label>
                      <input
                        type="text"
                        value={choice.quechuaText}
                        onChange={(e) => handleChoiceChange(sceneIndex, choiceIndex, 'quechuaText', e.target.value)}
                        required
                        placeholder="Texto de la opción en quechua"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Texto en Español</label>
                      <input
                        type="text"
                        value={choice.spanishText}
                        onChange={(e) => handleChoiceChange(sceneIndex, choiceIndex, 'spanishText', e.target.value)}
                        required
                        placeholder="Texto de la opción en español"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Escena Siguiente</label>
                      <select
                        value={choice.nextScene}
                        onChange={(e) => handleChoiceChange(sceneIndex, choiceIndex, 'nextScene', e.target.value)}
                        required
                      >
                        {scenes.map((_, index) => (
                          <option key={index} value={index}>
                            Escena {index + 1}
                          </option>
                        ))}
                        <option value={scenes.length}>Finalizar Narrativa</option>
                      </select>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="add-choice-button"
                  onClick={() => handleAddChoice(sceneIndex)}
                >
                  Añadir Opción
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          className="add-scene-button"
          onClick={handleAddScene}
        >
          Añadir Escena
        </button>
        
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (narrative ? 'Actualizar Narrativa' : 'Crear Narrativa')}
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

export default NarrativeForm;