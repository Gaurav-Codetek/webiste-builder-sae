import React, { useState } from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './VideoElement.css';

const VideoElement = ({ element }) => {
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const [tempUrl, setTempUrl] = useState(element.content);
  const { updateElement, deleteElement, selectElement, selectedElement } = useBuilder();

  const handleDoubleClick = () => {
    setShowUrlEditor(true);
    setTempUrl(element.content);
  };

  const handleSave = () => {
    updateElement(element.id, { content: tempUrl });
    setShowUrlEditor(false);
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

  const getEmbedUrl = (url) => {
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // YouTube short URL
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const isSelected = selectedElement?.id === element.id;

  return (
    <div 
      className={`element-wrapper video-element-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={element.style}
    >
      {showUrlEditor ? (
        <div className="video-url-editor">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            className="video-url-input"
          />
          <div className="video-url-controls">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="video-container">
          <iframe
            src={getEmbedUrl(element.content)}
            frameBorder="0"
            allowFullScreen
            className="video-iframe"
            style={element.style}
          />
        </div>
      )}
      
      <div className="element-controls">
        <button className="control-btn delete" onClick={handleDelete}>
          ×
        </button>
      </div>
    </div>
  );
};

export default VideoElement;
