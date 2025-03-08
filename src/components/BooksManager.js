import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import BookForm from './BookForm';
import '../styles/BooksManager.css';

const db = getFirestore();

const BooksManager = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksCollection = collection(db, 'books');
      const booksSnapshot = await getDocs(booksCollection);
      const booksList = booksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksList);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('No se pudieron cargar los libros. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      await addDoc(collection(db, 'books'), bookData);
      fetchBooks();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error al añadir el libro. Intenta nuevamente.');
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      const bookRef = doc(db, 'books', editingBook.id);
      await updateDoc(bookRef, bookData);
      fetchBooks();
      setEditingBook(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error al actualizar el libro. Intenta nuevamente.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este libro?')) {
      try {
        await deleteDoc(doc(db, 'books', bookId));
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error al eliminar el libro. Intenta nuevamente.');
      }
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setShowForm(false);
  };

  if (loading && books.length === 0) {
    return <div className="loading">Cargando libros...</div>;
  }

  return (
    <div className="books-manager">
      <div className="books-header">
        <h1>Gestión de Libros</h1>
        {!showForm && (
          <button 
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            Añadir Nuevo Libro
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm ? (
        <BookForm 
          book={editingBook}
          onSubmit={editingBook ? handleUpdateBook : handleAddBook}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          {books.length === 0 ? (
            <div className="empty-state">
              <p>No hay libros disponibles. ¡Añade tu primer libro!</p>
            </div>
          ) : (
            <div className="books-list">
              {books.map(book => (
                <div key={book.id} className="book-card">
                  {book.coverImage && (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="book-cover"
                    />
                  )}
                  <div className="book-details">
                    <h3>{book.title}</h3>
                    <p>{book.description}</p>
                    <p className="book-pages">{book.pages?.length || 0} páginas</p>
                  </div>
                  <div className="book-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEditBook(book)}
                    >
                      Editar
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteBook(book.id)}
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

export default BooksManager;