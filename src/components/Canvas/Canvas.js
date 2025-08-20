import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../context/BuilderContext';
import Section from '../Section/Section';
import './Canvas.css';

const Canvas = () => {
  const { sections, addSection, canvasStyle, dragOverIndex, setDragOverIndex } = useBuilder();
  const canvasRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['section', 'element'],
    hover: (item, monitor) => {
      if (item.type === 'section' && monitor.getItemType() === 'section') {
        const hoverBoundingRect = canvasRef.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Calculate which section index to insert at
        let insertIndex = sections.length;
        for (let i = 0; i < sections.length; i++) {
          const sectionElement = document.querySelector(`[data-section-index="${i}"]`);
          if (sectionElement) {
            const rect = sectionElement.getBoundingClientRect();
            const sectionMiddle = rect.top + rect.height / 2;
            
            if (clientOffset.y < sectionMiddle) {
              insertIndex = i;
              break;
            }
          }
        }
        
        setDragOverIndex(insertIndex);
      }
    },
    drop: (item, monitor) => {
      if (monitor.getItemType() === 'section') {
        const insertIndex = dragOverIndex !== null ? dragOverIndex : sections.length;
        addSection(item.columns, insertIndex);
        
        // Smooth scroll to new section
        setTimeout(() => {
          const newSectionElement = document.querySelector(`[data-section-index="${insertIndex}"]`);
          if (newSectionElement) {
            newSectionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 300);
      }
      setDragOverIndex(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [sections, dragOverIndex]);

  // Combine refs
  const combineRefs = (ref1, ref2) => (element) => {
    ref1.current = element;
    ref2(element);
  };

  useEffect(() => {
    if (!isOver) {
      setDragOverIndex(null);
    }
  }, [isOver, setDragOverIndex]);

  return (
    <div className="canvas">
      <div className="canvas-header">
        <h3>Design Canvas</h3>
        <div className="canvas-actions">
          <button onClick={() => addSection(1)} className="add-section-btn">
            + Add Section
          </button>
        </div>
      </div>
      
      <div 
        ref={combineRefs(canvasRef, drop)}
        className={`canvas-content ${isOver ? 'drag-over' : ''}`}
        style={canvasStyle}
      >
        {sections.length === 0 && (
          <div className="canvas-empty-state">
            <div className="empty-state-content">
              <h3>Start Building Your Website</h3>
              <p>Drag section templates from the sidebar to begin</p>
              <div className="quick-actions">
                <button onClick={() => addSection(1)} className="quick-add-btn">
                  Add Single Column
                </button>
                <button onClick={() => addSection(2)} className="quick-add-btn">
                  Add Two Columns
                </button>
              </div>
            </div>
          </div>
        )}
        
        {sections.map((section, index) => (
          <React.Fragment key={section.id}>
            {dragOverIndex === index && (
              <div className="drop-zone-indicator">
                <div className="drop-zone-line"></div>
                <span className="drop-zone-text">Drop section here</span>
              </div>
            )}
            <Section 
              section={section} 
              index={index}
              data-section-index={index}
            />
          </React.Fragment>
        ))}
        
        {dragOverIndex === sections.length && (
          <div className="drop-zone-indicator">
            <div className="drop-zone-line"></div>
            <span className="drop-zone-text">Drop section here</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
