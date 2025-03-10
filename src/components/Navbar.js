// src/components/Navbar.js (modificado)
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Quechua App CMS</h1>
      </div>
      
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end
          >
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/books" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Libros
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/exercises" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Ejercicios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/narratives" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Narrativas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/users" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Usuarios
          </NavLink>
        </li>
      </ul>
      
      <button className="logout-button" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </nav>
  );
};

export default Navbar;