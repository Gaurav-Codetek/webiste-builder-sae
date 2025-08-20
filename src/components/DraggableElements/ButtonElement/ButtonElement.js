import React, { useState } from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './ButtonElement.css';

const ButtonElement = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({
    text: element.content,
    link: element.link || '',
    openInNewTab: element.openInNewTab || false
  });
  
  const { updateElement, deleteElement, selectElement, selectedElement } = useBuilder();

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempData({
      text: element.content,
      link: element.link || '',
      openInNewTab: element.openInNewTab || false
    });
  };

  const handleSave = () => {
    updateElement(element.id, { 
      content: tempData.text,
      link: tempData.link,
      openInNewTab: tempData.openInNewTab
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({
      text: element.content,
      link: element.link || '',
      openInNewTab: element.openInNewTab || false
    });
    setIsEditing(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    selectElement(element);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (element.link) {
      if (element.openInNewTab) {
        window.open(element.link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = element.link;
      }
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const isSelected = selectedElement?.id === element.id;

  return (
    <div 
      className={`element-wrapper button-element-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="button-editor">
          <div className="editor-field">
            <label>Button Text:</label>
            <input
              type="text"
              value={tempData.text}
              onChange={(e) => setTempData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Button text"
            />
          </div>
          <div className="editor-field">
            <label>Link URL (optional):</label>
            <input
              type="url"
              value={tempData.link}
              onChange={(e) => setTempData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>
          <div className="editor-field checkbox-field">
            <label>
              <input
                type="checkbox"
                checked={tempData.openInNewTab}
                onChange={(e) => setTempData(prev => ({ ...prev, openInNewTab: e.target.checked }))}
              />
              Open in new tab
            </label>
          </div>
          <div className="editor-controls">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <button 
          className="button-content" 
          style={element.style}
          onClick={handleButtonClick}
        >
          {element.content}
          {element.link && (
            <span className="link-indicator">
              {element.openInNewTab ? '↗' : '→'}
            </span>
          )}
        </button>
      )}
      
      <div className="element-controls">
        <button className="control-btn delete" onClick={handleDelete}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ButtonElement;
