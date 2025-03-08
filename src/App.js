import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BooksManager from './components/BooksManager';
import ExercisesManager from './components/ExercisesManager';
import NarrativesManager from './components/NarrativesManager';
import Navbar from './components/Navbar';
import './styles/App.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5N2icFbrrGgRkQD80Dj8jwg7I7u8ner0",
  authDomain: "quechuaapp-87797.firebaseapp.com",
  projectId: "quechuaapp-87797",
  appId: "1:1024003542254:web:a845bcfe4241fd6285f7ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <Router>
      {user ? (
        <div className="app">
          <Navbar onLogout={handleLogout} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<BooksManager />} />
              <Route path="/exercises" element={<ExercisesManager />} />
              <Route path="/narratives" element={<NarrativesManager />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;