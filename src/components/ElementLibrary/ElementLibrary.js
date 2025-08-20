import React from 'react';
import { useDrag } from 'react-dnd';
import './ElementLibrary.css';

const DraggableElement = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`element-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="element-icon">{icon}</div>
      <span className="element-label">{label}</span>
    </div>
  );
};

const SectionTemplate = ({ columns, label, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'section',
    item: { columns },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`section-template ${isDragging ? 'dragging' : ''}`}
    >
      <div className="element-icon">{icon}</div>
      <span className="element-label">{label}</span>
    </div>
  );
};

const ElementLibrary = () => {
  const elements = [
    { type: 'heading', label: 'Heading', icon: '📰' },
    { type: 'text', label: 'Sub-Heading', icon: '📝' },
    { type: 'paragraph', label: 'Paragraph', icon: '📄' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'image-caption', label: 'Image + Caption', icon: '🏞️' },
    { type: 'video', label: 'Video', icon: '🎥' },
    { type: 'button', label: 'Button', icon: '🔘' },
    { type: 'table', label: 'Table', icon: '📊' },
    { type: 'spacer', label: 'Spacer', icon: '📏' }
  ];

  const sectionTemplates = [
    { columns: 1, label: '1 Column', icon: '▬' },
    { columns: 2, label: '2 Columns', icon: '▬▬' },
    { columns: 3, label: '3 Columns', icon: '▬▬▬' }
  ];

  return (
    <div className="element-library">
      <div className="library-section">
        <h4>Sections</h4>
        <div className="elements-grid">
          {sectionTemplates.map((template) => (
            <SectionTemplate
              key={`section-${template.columns}`}
              columns={template.columns}
              label={template.label}
              icon={template.icon}
            />
          ))}
        </div>
      </div>
      
      <div className="library-section">
        <h4>Elements</h4>
        <div className="elements-grid">
          {elements.map((element) => (
            <DraggableElement
              key={element.type}
              type={element.type}
              label={element.label}
              icon={element.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementLibrary;
