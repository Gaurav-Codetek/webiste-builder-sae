import React, { useState } from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './ImageCaptionElement.css';

const ImageCaptionElement = ({ element }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [tempData, setTempData] = useState(element.content || {
    imageUrl: 'https://via.placeholder.com/600x400/3498db/ffffff?text=Your+Image',
    caption: 'Your caption text here',
    alt: 'Image description'
  });
  const [imageError, setImageError] = useState(false);
  
  const { updateElement, deleteElement, selectElement, selectedElement } = useBuilder();

  const handleDoubleClick = () => {
    setShowEditor(true);
    setTempData(element.content);
  };

  const handleSave = () => {
    updateElement(element.id, { content: tempData });
    setShowEditor(false);
    setImageError(false);
  };

  const handleCancel = () => {
    setTempData(element.content);
    setShowEditor(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    selectElement(element);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const isSelected = selectedElement?.id === element.id;
  const currentData = element.content || tempData;

  return (
    <div 
      className={`element-wrapper image-caption-element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={element.style}
    >
      {showEditor ? (
        <div className="image-caption-editor">
          <div className="editor-field">
            <label>Image URL:</label>
            <input
              type="url"
              value={tempData.imageUrl}
              onChange={(e) => setTempData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="editor-field">
            <label>Alt Text:</label>
            <input
              type="text"
              value={tempData.alt}
              onChange={(e) => setTempData(prev => ({ ...prev, alt: e.target.value }))}
              placeholder="Describe the image"
            />
          </div>
          <div className="editor-field">
            <label>Caption:</label>
            <textarea
              value={tempData.caption}
              onChange={(e) => setTempData(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Enter image caption"
              rows={3}
            />
          </div>
          <div className="editor-controls">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <figure className="image-caption-figure">
          {imageError ? (
            <div className="image-error">
              <span>🖼️</span>
              <p>Image failed to load</p>
            </div>
          ) : (
            <img
              src={currentData.imageUrl}
              alt={currentData.alt}
              className="caption-image"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={element.style}
            />
          )}
          <figcaption className="image-caption">
            {currentData.caption}
          </figcaption>
        </figure>
      )}
      
      <div className="element-controls">
        <button className="control-btn delete" onClick={handleDelete}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ImageCaptionElement;
