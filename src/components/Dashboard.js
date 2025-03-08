import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const db = getFirestore();

const Dashboard = () => {
  const [stats, setStats] = useState({
    books: 0,
    exercises: 0,
    narratives: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get books count
        const booksSnapshot = await getDocs(collection(db, 'books'));
        const booksCount = booksSnapshot.size;
        
        // Get exercises count
        const exercisesSnapshot = await getDocs(collection(db, 'verbalExercises'));
        const exercisesCount = exercisesSnapshot.size;
        
        // Get narratives count
        const narrativesSnapshot = await getDocs(collection(db, 'narratives'));
        const narrativesCount = narrativesSnapshot.size;
        
        // Get users count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersCount = usersSnapshot.size;
        
        setStats({
          books: booksCount,
          exercises: exercisesCount,
          narratives: narrativesCount,
          users: usersCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Panel de Control</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h2>{stats.books}</h2>
          <p>Libros</p>
          <Link to="/books" className="stat-link">Gestionar</Link>
        </div>
        
        <div className="stat-card">
          <h2>{stats.exercises}</h2>
          <p>Ejercicios</p>
          <Link to="/exercises" className="stat-link">Gestionar</Link>
        </div>
        
        <div className="stat-card">
          <h2>{stats.narratives}</h2>
          <p>Narrativas</p>
          <Link to="/narratives" className="stat-link">Gestionar</Link>
        </div>
        
        <div className="stat-card">
          <h2>{stats.users}</h2>
          <p>Usuarios</p>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-container">
          <Link to="/books" className="action-button">
            Añadir Nuevo Libro
          </Link>
          <Link to="/exercises" className="action-button">
            Crear Ejercicio de Fluidez
          </Link>
          <Link to="/narratives" className="action-button">
            Crear Narrativa Interactiva
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;