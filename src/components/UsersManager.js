// src/components/UsersManager.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';
import '../styles/UsersManager.css';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    lastName: '',
    institution: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('No se pudieron cargar los usuarios. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar el usuario. Intenta nuevamente.');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditRole(user.role || 'user');
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    
    try {
      const userRef = doc(db, 'users', editUser.id);
      await updateDoc(userRef, { 
        role: editRole,
        updatedAt: new Date().toISOString()
      });
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar el usuario. Intenta nuevamente.');
    }
  };

  const handleCancelEdit = () => {
    setEditUser(null);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password || !newUser.name) {
      alert('Por favor completa los campos obligatorios (Email, Contraseña y Nombre)');
      return;
    }
    
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        newUser.email, 
        newUser.password
      );
      
      // Obtener el ID de usuario generado
      const userId = userCredential.user.uid;
      
      // Guardar los datos adicionales en Firestore
      await setDoc(doc(db, 'users', userId), {
        email: newUser.email,
        name: newUser.name,
        lastName: newUser.lastName || '',
        institution: newUser.institution || '',
        role: newUser.role,
        createdAt: new Date().toISOString()
      });
      
      // Limpiar el formulario y actualizar la lista
      setNewUser({
        email: '',
        password: '',
        name: '',
        lastName: '',
        institution: '',
        role: 'user'
      });
      setShowAddForm(false);
      fetchUsers();
      
      alert('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Error al crear el usuario: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  if (loading && users.length === 0) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="users-manager">
      <div className="users-header">
        <h1>Gestión de Usuarios</h1>
        {!showAddForm && !editUser && (
          <button 
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            Añadir Usuario
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showAddForm && (
        <div className="user-form">
          <h2>Añadir Nuevo Usuario</h2>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
                placeholder="Correo electrónico"
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña <span className="required">*</span></label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
                placeholder="Contraseña"
              />
            </div>
            
            <div className="form-group">
              <label>Nombre <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
                placeholder="Nombre"
              />
            </div>
            
            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInputChange}
                placeholder="Apellidos"
              />
            </div>
            
            <div className="form-group">
              <label>Institución</label>
              <input
                type="text"
                name="institution"
                value={newUser.institution}
                onChange={handleInputChange}
                placeholder="Institución educativa"
              />
            </div>
            
            <div className="form-group">
              <label>Rol</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="save-button"
              >
                Crear Usuario
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {editUser && (
        <div className="edit-user-form">
          <h2>Editar Usuario</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {editUser.email}</p>
            <p><strong>Nombre:</strong> {editUser.name} {editUser.lastName}</p>
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select 
              value={editRole} 
              onChange={(e) => setEditRole(e.target.value)}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="form-actions">
            <button 
              className="save-button"
              onClick={handleUpdateUser}
            >
              Guardar Cambios
            </button>
            <button 
              className="cancel-button"
              onClick={handleCancelEdit}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      
      {!showAddForm && !editUser && (
        <div className="users-list">
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No hay usuarios registrados.</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Institución</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.institution || '-'}</td>
                    <td>{user.role || 'user'}</td>
                    <td>
                      <button 
                        className="edit-button"
                        onClick={() => handleEditUser(user)}
                      >
                        Editar
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersManager;