import React, { useState, useEffect } from 'react';
import { uploadImage } from '../services/cloudinary';
import '../styles/BookForm.css';

const BookForm = ({ book, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pages, setPages] = useState([{ quechuaText: '', spanishText: '', image: '' }]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [pageFiles, setPageFiles] = useState([null]);

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setDescription(book.description || '');
      setCoverImage(book.coverImage || '');
      setPreviewImage(book.coverImage || '');
      setPages(book.pages || [{ quechuaText: '', spanishText: '', image: '' }]);
      setPageFiles(book.pages ? book.pages.map(() => null) : [null]);
    }
  }, [book]);

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

  const handlePageImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedPageFiles = [...pageFiles];
      updatedPageFiles[index] = file;
      setPageFiles(updatedPageFiles);
      
      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPages = [...pages];
        updatedPages[index] = {
          ...updatedPages[index],
          _previewImage: reader.result // This is just for preview, won't be saved
        };
        setPages(updatedPages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPage = () => {
    setPages([...pages, { quechuaText: '', spanishText: '', image: '' }]);
    setPageFiles([...pageFiles, null]);
  };

  const handleRemovePage = (index) => {
    const updatedPages = [...pages];
    updatedPages.splice(index, 1);
    setPages(updatedPages);
    
    const updatedPageFiles = [...pageFiles];
    updatedPageFiles.splice(index, 1);
    setPageFiles(updatedPageFiles);
  };

  const handlePageChange = (index, field, value) => {
    const updatedPages = [...pages];
    updatedPages[index] = {
      ...updatedPages[index],
      [field]: value
    };
    setPages(updatedPages);
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
      
      // Upload page images if changed
      const finalPages = await Promise.all(pages.map(async (page, index) => {
        let finalPageImage = page.image;
        if (pageFiles[index]) {
          finalPageImage = await uploadImage(pageFiles[index]);
        }
        
        // Remove the preview property
        const { _previewImage, ...pageData } = page;
        
        return {
          ...pageData,
          image: finalPageImage
        };
      }));
      
      const bookData = {
        title,
        description,
        coverImage: finalCoverImage,
        pages: finalPages,
        updatedAt: new Date().toISOString()
      };
      
      await onSubmit(bookData);
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Error al guardar el libro. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form">
      <h2>{book ? 'Editar Libro' : 'Añadir Libro'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ingresa el título del libro"
          />
        </div>
        
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingresa una descripción breve del libro"
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
        
        <h3>Páginas</h3>
        {pages.map((page, index) => (
          <div key={index} className="page-form">
            <h4>Página {index + 1}</h4>
            
            <div className="form-group">
              <label>Texto en Quechua</label>
              <textarea
                value={page.quechuaText}
                onChange={(e) => handlePageChange(index, 'quechuaText', e.target.value)}
                required
                placeholder="Texto en quechua para esta página"
              />
            </div>
            
            <div className="form-group">
              <label>Texto en Español</label>
              <textarea
                value={page.spanishText}
                onChange={(e) => handlePageChange(index, 'spanishText', e.target.value)}
                required
                placeholder="Traducción al español"
              />
            </div>
            
            <div className="form-group">
              <label>Imagen de la Página</label>
              {(page._previewImage || page.image) && (
                <div className="image-preview">
                  <img 
                    src={page._previewImage || page.image} 
                    alt={`Vista previa de página ${index + 1}`}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePageImageChange(index, e)}
              />
            </div>
            
            {pages.length > 1 && (
              <button
                type="button"
                className="remove-page-button"
                onClick={() => handleRemovePage(index)}
              >
                Eliminar Página
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          className="add-page-button"
          onClick={handleAddPage}
        >
          Añadir Página
        </button>
        
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (book ? 'Actualizar Libro' : 'Crear Libro')}
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

export default BookForm;