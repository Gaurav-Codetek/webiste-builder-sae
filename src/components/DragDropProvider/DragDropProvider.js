import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './DragDropProvider.css';

const DragDropProvider = ({ children }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="drag-drop-provider">
        {children}
      </div>
    </DndProvider>
  );
};

export default DragDropProvider;
