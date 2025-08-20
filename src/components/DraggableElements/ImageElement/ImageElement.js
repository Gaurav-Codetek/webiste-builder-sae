import React, { useState } from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './ImageElement.css';

const ImageElement = ({ element }) => {
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const [tempUrl, setTempUrl] = useState(element.content);
  const [imageError, setImageError] = useState(false);
  const { updateElement, deleteElement, selectElement, selectedElement } = useBuilder();

  const handleDoubleClick = () => {
    setShowUrlEditor(true);
    setTempUrl(element.content);
  };

  const handleSave = () => {
    updateElement(element.id, { content: tempUrl });
    setShowUrlEditor(false);
    setImageError(false);
  };

  const handleCancel = () => {
    setTempUrl(element.content);
    setShowUrlEditor(false);
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

  return (
    <div 
      className={`element-wrapper image-element-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        float: element.style.float || 'none',
        display: element.style.display || 'inline-block',
        marginLeft: element.style.marginLeft || '0',
        marginRight: element.style.marginRight || '0',
        margin: element.style.margin || '0',
        padding: element.style.padding || '0',
      }}
    >
      {showUrlEditor ? (
        <div className="url-editor">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="url-input"
          />
          <div className="url-controls">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          {imageError ? (
            <div className="image-error" style={element.style}>
              <div className="error-content">
                <span>🖼️</span>
                <p>Image failed to load</p>
                <small>Double-click to change URL</small>
              </div>
            </div>
          ) : (
            <img 
              src={element.content} 
              alt={element.style.alt || 'Image'} 
              className="image-content"
              style={element.style}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
        </>
      )}
      
      <div className="element-controls">
        <button className="control-btn delete" onClick={handleDelete}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ImageElement;
