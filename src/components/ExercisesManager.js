import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import ExerciseForm from './ExerciseForm';
import '../styles/ExercisesManager.css';

const db = getFirestore();

const ExercisesManager = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const exercisesCollection = collection(db, 'verbalExercises');
      const exercisesSnapshot = await getDocs(exercisesCollection);
      const exercisesList = exercisesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExercises(exercisesList);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('No se pudieron cargar los ejercicios. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = async (exerciseData) => {
    try {
      await addDoc(collection(db, 'verbalExercises'), exerciseData);
      fetchExercises();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
      alert('Error al añadir el ejercicio. Intenta nuevamente.');
    }
  };

  const handleUpdateExercise = async (exerciseData) => {
    try {
      const exerciseRef = doc(db, 'verbalExercises', editingExercise.id);
      await updateDoc(exerciseRef, exerciseData);
      fetchExercises();
      setEditingExercise(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating exercise:', error);
      alert('Error al actualizar el ejercicio. Intenta nuevamente.');
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este ejercicio?')) {
      try {
        await deleteDoc(doc(db, 'verbalExercises', exerciseId));
        fetchExercises();
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Error al eliminar el ejercicio. Intenta nuevamente.');
      }
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingExercise(null);
    setShowForm(false);
  };

  if (loading && exercises.length === 0) {
    return <div className="loading">Cargando ejercicios...</div>;
  }

  return (
    <div className="exercises-manager">
      <div className="exercises-header">
        <h1>Gestión de Ejercicios de Fluidez Verbal</h1>
        {!showForm && (
          <button 
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            Añadir Nuevo Ejercicio
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm ? (
        <ExerciseForm 
          exercise={editingExercise}
          onSubmit={editingExercise ? handleUpdateExercise : handleAddExercise}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          {exercises.length === 0 ? (
            <div className="empty-state">
              <p>No hay ejercicios disponibles. ¡Añade tu primer ejercicio!</p>
            </div>
          ) : (
            <div className="exercises-list">
              {exercises.map(exercise => (
                <div key={exercise.id} className="exercise-card">
                  {exercise.imageUrl && (
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.title}
                      className="exercise-image"
                    />
                  )}
                  <div className="exercise-details">
                    <h3>{exercise.title}</h3>
                    <p>{exercise.description}</p>
                    <p className="exercise-words">{exercise.words?.length || 0} palabras</p>
                  </div>
                  <div className="exercise-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEditExercise(exercise)}
                    >
                      Editar
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteExercise(exercise.id)}
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

export default ExercisesManager;