import React, { useState } from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './HeadingElement.css';

const HeadingElement = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(element.content);
  const { updateElement, deleteElement, selectElement, selectedElement } = useBuilder();

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempContent(element.content);
  };

  const handleSave = () => {
    updateElement(element.id, { content: tempContent });
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setTempContent(element.content);
      setIsEditing(false);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    selectElement(element);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const isSelected = selectedElement?.id === element.id;

  return (
    <div 
      className={`element-wrapper heading-element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={tempContent}
          onChange={(e) => setTempContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          className="heading-editor"
          style={element.style}
          autoFocus
        />
      ) : (
        <h1 className="heading-content" style={element.style}>
          {element.content}
        </h1>
      )}
      
      <div className="element-controls">
        <button className="control-btn delete" onClick={handleDelete}>
          ×
        </button>
      </div>
    </div>
  );
};

export default HeadingElement;
