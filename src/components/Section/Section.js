import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../context/BuilderContext';
import TextElement from '../DraggableElements/TextElement/TextElement';
import ImageElement from '../DraggableElements/ImageElement/ImageElement';
import ButtonElement from '../DraggableElements/ButtonElement/ButtonElement';
import HeadingElement from '../DraggableElements/HeadingElement/HeadingElement';
import SpacerElement from '../DraggableElements/SpacerElement/SpacerElement';
import VideoElement from '../DraggableElements/VideoElement/VideoElement';
import TableElement from '../DraggableElements/TableElement/TableElement';
import ParagraphElement from '../DraggableElements/ParagraphElement/ParagraphElement';
import ImageCaptionElement from '../DraggableElements/ImageCaptionElement/ImageCaptionElement';
import './Section.css';

const Section = ({ section, index }) => {
  const { addElementToSection, deleteSection, selectElement, selectedElement, moveElement } = useBuilder();
  const [dragOverPosition, setDragOverPosition] = useState(null); // { columnIndex, elementIndex }
  const sectionRef = useRef(null);

  const getDefaultContent = (type) => {
    switch (type) {
      case 'heading':
        return 'Your Heading Here';
      case 'text':
        return 'Add your text here. Click to edit this text and make it your own.';
      case 'paragraph':
        return 'This is a paragraph element. Double-click to edit this text. You can write longer content here and it will wrap nicely within the container. Perfect for detailed descriptions and longer text content.';
      case 'image':
        return 'https://via.placeholder.com/600x400/3498db/ffffff?text=Your+Image';
      case 'image-caption':
        return {
          imageUrl: 'https://via.placeholder.com/600x400/3498db/ffffff?text=Your+Image',
          caption: 'Your caption text here',
          alt: 'Image description'
        };
      case 'video':
        return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      case 'button':
        return 'Click Here';
      case 'table':
        return {
          headers: ['Column 1', 'Column 2', 'Column 3'],
          rows: [
            ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
            ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
          ]
        };
      case 'spacer':
        return '';
      default:
        return '';
    }
  };

  const getDefaultStyle = (type) => {
    switch (type) {
      case 'heading':
        return {
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#2c3e50',
          textAlign: 'left',
          marginBottom: '20px',
          lineHeight: '1.2'
        };
      case 'text':
        return {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#2c3e50',
          textAlign: 'left',
          marginBottom: '20px',
          lineHeight: '1.2'
        };
      case 'paragraph':
        return {
          fontSize: '16px',
          color: '#444444',
          lineHeight: '1.8',
          marginBottom: '25px',
          textAlign: 'justify'
        };
      case 'image':
        return {
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '20px'
        };
      case 'image-caption':
        return {
          width: '100%',
          marginBottom: '25px'
        };
      case 'video':
        return {
          width: '100%',
          marginBottom: '25px'
        };
      case 'button':
        return {
          padding: '15px 30px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'inline-block',
          textDecoration: 'none',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          marginBottom: '20px'
        };
      case 'table':
        return {
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '25px',
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        };
      case 'spacer':
        return {
          width: '100%',
          height: '50px',
          backgroundColor: 'transparent'
        };
      default:
        return {};
    }
  };

  const renderElement = (element, elementIndex, columnIndex) => {
    const commonProps = {
      key: element.id,
      element: element,
      elementIndex: elementIndex,
      columnIndex: columnIndex,
      sectionId: section.id,
      onMove: moveElement
    };

    switch (element.type) {
      case 'heading':
        return <DraggableElementWrapper {...commonProps}><HeadingElement element={element} /></DraggableElementWrapper>;
      case 'text':
        return <DraggableElementWrapper {...commonProps}><TextElement element={element} /></DraggableElementWrapper>;
      case 'paragraph':
        return <DraggableElementWrapper {...commonProps}><ParagraphElement element={element} /></DraggableElementWrapper>;
      case 'image':
        return <DraggableElementWrapper {...commonProps}><ImageElement element={element} /></DraggableElementWrapper>;
      case 'image-caption':
        return <DraggableElementWrapper {...commonProps}><ImageCaptionElement element={element} /></DraggableElementWrapper>;
      case 'video':
        return <DraggableElementWrapper {...commonProps}><VideoElement element={element} /></DraggableElementWrapper>;
      case 'button':
        return <DraggableElementWrapper {...commonProps}><ButtonElement element={element} /></DraggableElementWrapper>;
      case 'table':
        return <DraggableElementWrapper {...commonProps}><TableElement element={element} /></DraggableElementWrapper>;
      case 'spacer':
        return <DraggableElementWrapper {...commonProps}><SpacerElement element={element} /></DraggableElementWrapper>;
      default:
        return null;
    }
  };

  const handleSectionClick = (e) => {
    if (e.target === e.currentTarget) {
      selectElement({ ...section, type: 'section' });
    }
  };

  const handleDeleteSection = (e) => {
    e.stopPropagation();
    deleteSection(section.id);
  };

  const isSelected = selectedElement?.id === section.id;
  const columnWidth = `${100 / section.columns}%`;
  const columns = Array.from({ length: section.columns }, (_, i) => i);

  return (
    <div
      ref={sectionRef}
      data-section-index={index}
      className={`section ${isSelected ? 'selected' : ''}`}
      style={section.style}
      onClick={handleSectionClick}
    >
      <div className="section-controls">
        <span className="section-label">Section {index + 1}</span>
        <button className="section-delete" onClick={handleDeleteSection}>
          ×
        </button>
      </div>

      <div className="section-content">
        {columns.map(columnIndex => (
          <ColumnDropZone
            key={columnIndex}
            columnIndex={columnIndex}
            section={section}
            columnWidth={columnWidth}
            addElementToSection={addElementToSection}
            getDefaultContent={getDefaultContent}
            getDefaultStyle={getDefaultStyle}
            renderElement={renderElement}
            dragOverPosition={dragOverPosition}
            setDragOverPosition={setDragOverPosition}
          />
        ))}
      </div>
    </div>
  );
};

// New Draggable Element Wrapper
const DraggableElementWrapper = ({ children, element, elementIndex, columnIndex, sectionId, onMove }) => {
  return (
    <div className="draggable-element-container">
      {children}
    </div>
  );
};

const ColumnDropZone = ({
  columnIndex,
  section,
  columnWidth,
  addElementToSection,
  getDefaultContent,
  getDefaultStyle,
  renderElement,
  dragOverPosition,
  setDragOverPosition
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['element', 'existing-element'],
    hover: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;

      const hoverBoundingRect = monitor.getDropResult()?.getBoundingClientRect() ||
        document.querySelector(`[data-column="${section.id}-${columnIndex}"]`)?.getBoundingClientRect();

      if (!hoverBoundingRect) return;

      const clientOffset = monitor.getClientOffset();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      const columnElements = section.elements.filter(el => el.columnIndex === columnIndex);
      let insertIndex = columnElements.length;

      // Calculate insertion position based on mouse position
      for (let i = 0; i < columnElements.length; i++) {
        const elementEl = document.querySelector(`[data-element-id="${columnElements[i].id}"]`);
        if (elementEl) {
          const rect = elementEl.getBoundingClientRect();
          const elementMiddle = rect.top + rect.height / 2;

          if (clientOffset.y < elementMiddle) {
            insertIndex = i;
            break;
          }
        }
      }

      setDragOverPosition({ columnIndex, elementIndex: insertIndex });
    },
    drop: (item, monitor) => {
      if (monitor.getItemType() === 'element') {
        // New element from sidebar
        const defaultContent = getDefaultContent(item.type);
        const defaultStyle = getDefaultStyle(item.type);
        const insertIndex = dragOverPosition?.elementIndex ?? section.elements.filter(el => el.columnIndex === columnIndex).length;

        addElementToSection(section.id, item.type, defaultContent, defaultStyle, columnIndex, insertIndex);
      }

      setDragOverPosition(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }), [section, columnIndex, dragOverPosition]);

  const columnElements = section.elements
    .filter(el => el.columnIndex === columnIndex)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div
      ref={drop}
      className={`section-column ${isOver ? 'column-drag-over' : ''}`}
      style={{ width: columnWidth }}
      data-column={`${section.id}-${columnIndex}`}
    >
      {columnElements.map((element, elementIndex) => (
        <React.Fragment key={element.id}>
          {/* Drop indicator above element */}
          {dragOverPosition?.columnIndex === columnIndex &&
            dragOverPosition?.elementIndex === elementIndex && (
              <div className="element-drop-indicator">
                <div className="drop-indicator-line"></div>
                <span className="drop-indicator-text">Drop element here</span>
              </div>
            )}

          <div data-element-id={element.id}>
            {renderElement(element, elementIndex, columnIndex)}
          </div>
        </React.Fragment>
      ))}

      {/* Drop indicator at the end */}
      {dragOverPosition?.columnIndex === columnIndex &&
        dragOverPosition?.elementIndex === columnElements.length && (
          <div className="element-drop-indicator">
            <div className="drop-indicator-line"></div>
            <span className="drop-indicator-text">Drop element here</span>
          </div>
        )}

      {columnElements.length === 0 && (
        <div className="column-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">⊕</span>
            <p>Drop elements here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section;
