import React from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './SpacerElement.css';

const SpacerElement = ({ element }) => {
  const { deleteElement, selectElement, selectedElement } = useBuilder();

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
      className={`element-wrapper spacer-element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={element.style}
    >
      <div className="spacer-content">
        <span className="spacer-label">Spacer</span>
      </div>
      
      <div className="element-controls">
        <button className="control-btn delete" onClick={handleDelete}>
          ×
        </button>
      </div>
    </div>
  );
};

export default SpacerElement;
