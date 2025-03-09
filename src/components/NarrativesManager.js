import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import NarrativeForm from './NarrativeForm';
import '../styles/NarrativesManager.css';

const NarrativesManager = () => {
  const [narratives, setNarratives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNarrative, setEditingNarrative] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNarratives();
  }, []);

  const fetchNarratives = async () => {
    try {
      setLoading(true);
      const narrativesCollection = collection(db, 'narratives');
      const narrativesSnapshot = await getDocs(narrativesCollection);
      const narrativesList = narrativesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNarratives(narrativesList);
    } catch (error) {
      console.error('Error fetching narratives:', error);
      setError('No se pudieron cargar las narrativas. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNarrative = async (narrativeData) => {
    try {
      await addDoc(collection(db, 'narratives'), narrativeData);
      fetchNarratives();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding narrative:', error);
      alert('Error al añadir la narrativa. Intenta nuevamente.');
    }
  };

  const handleUpdateNarrative = async (narrativeData) => {
    try {
      const narrativeRef = doc(db, 'narratives', editingNarrative.id);
      await updateDoc(narrativeRef, narrativeData);
      fetchNarratives();
      setEditingNarrative(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating narrative:', error);
      alert('Error al actualizar la narrativa. Intenta nuevamente.');
    }
  };

  const handleDeleteNarrative = async (narrativeId) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta narrativa?')) {
      try {
        await deleteDoc(doc(db, 'narratives', narrativeId));
        fetchNarratives();
      } catch (error) {
        console.error('Error deleting narrative:', error);
        alert('Error al eliminar la narrativa. Intenta nuevamente.');
      }
    }
  };

  const handleEditNarrative = (narrative) => {
    setEditingNarrative(narrative);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingNarrative(null);
    setShowForm(false);
  };

  // Función auxiliar para obtener etiqueta de categoría
  const getCategoryLabel = (category) => {
    switch(category) {
      case 'adventure': return 'Aventura';
      case 'culture': return 'Cultura';
      case 'daily': return 'Cotidiano';
      default: return 'Sin categoría';
    }
  };

  if (loading && narratives.length === 0) {
    return <div className="loading">Cargando narrativas...</div>;
  }

  return (
    <div className="narratives-manager">
      <div className="narratives-header">
        <h1>Gestión de Narrativas Interactivas</h1>
        {!showForm && (
          <button 
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            Añadir Nueva Narrativa
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm ? (
        <NarrativeForm 
          narrative={editingNarrative}
          onSubmit={editingNarrative ? handleUpdateNarrative : handleAddNarrative}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          {narratives.length === 0 ? (
            <div className="empty-state">
              <p>No hay narrativas disponibles. ¡Añade tu primera narrativa!</p>
            </div>
          ) : (
            <div className="narratives-list">
              {narratives.map(narrative => (
                <div key={narrative.id} className="narrative-card">
                  {narrative.coverImage && (
                    <img 
                      src={narrative.coverImage} 
                      alt={narrative.title}
                      className="narrative-cover"
                    />
                  )}
                  <div className="narrative-details">
                    <h3>{narrative.title}</h3>
                    <p>{narrative.description}</p>
                    <div className="narrative-metadata">
                      <span className="narrative-category">
                        {getCategoryLabel(narrative.category)}
                      </span>
                      <span className="narrative-scenes">
                        {narrative.scenes?.length || 0} escenas
                      </span>
                      <span className="narrative-choices">
                        {narrative.choices || 0} opciones
                      </span>
                      {narrative.duration && (
                        <span className="narrative-duration">
                          {narrative.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="narrative-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEditNarrative(narrative)}
                    >
                      Editar
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteNarrative(narrative.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NarrativesManager;