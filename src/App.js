import React from 'react';
import { BuilderProvider } from './context/BuilderContext';
import DragDropProvider from './components/DragDropProvider/DragDropProvider';
import Toolbar from './components/Toolbar/Toolbar';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';
import PropertyPanel from './components/PropertyPanel/PropertyPanel';
import PreviewMode from './components/PreviewMode/PreviewMode';
import { useBuilder } from './context/BuilderContext';
import './App.css';

const AppContent = () => {
  const { isPreviewMode } = useBuilder();

  if (isPreviewMode) {
    return <PreviewMode />;
  }

  return (
    <div className="app">
      <Toolbar />
      <div className="app-content">
        <Sidebar />
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  );
};

function App() {
  return (
    <BuilderProvider>
      <DragDropProvider>
        <AppContent />
      </DragDropProvider>
    </BuilderProvider>
  );
}

export default App;
