import React from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './ContainerElement.css';

const ContainerElement = ({ element }) => {
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
      className={`element-wrapper container-element-wrapper ${isSelected ? 'selected' : ''}`}
      style={element.style}
      onClick={handleClick}
    >
      <div className="container-content">
        <span className="container-label">Container</span>
      </div>
      
      <div className="element-controls">
        <button className="control-btn delete" onClick={handleDelete}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ContainerElement;
