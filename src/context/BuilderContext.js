import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BuilderContext = createContext();

const initialState = {
  sections: [],
  selectedElement: null,
  isPreviewMode: false,
  dragOverIndex: null,
  canvasStyle: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  }
};

const builderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SECTION':
      const newSection = {
        id: uuidv4(),
        type: 'section',
        columns: action.payload.columns || 1,
        elements: [],
        style: {
          padding: '40px 20px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f0f0f0',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'stretch',
          gap: '20px',
          transition: 'all 0.3s ease'
        }
      };
      
      if (action.payload.insertIndex !== undefined) {
        const newSections = [...state.sections];
        newSections.splice(action.payload.insertIndex, 0, newSection);
        return {
          ...state,
          sections: newSections,
          dragOverIndex: null
        };
      }
      
      return {
        ...state,
        sections: [...state.sections, newSection],
        dragOverIndex: null
      };
    
    case 'ADD_ELEMENT_TO_SECTION':
      const newElement = {
        id: uuidv4(),
        type: action.payload.type,
        content: action.payload.content,
        style: action.payload.style,
        columnIndex: action.payload.columnIndex || 0,
        order: action.payload.insertIndex ?? 999, // Use insertIndex as order
        link: '',
        openInNewTab: false,
        alt: ''
      };
      
      return {
        ...state,
        sections: state.sections.map(section => {
          if (section.id === action.payload.sectionId) {
            const updatedElements = [...section.elements];
            const columnElements = updatedElements.filter(el => el.columnIndex === action.payload.columnIndex);
            
            // Reorder existing elements if inserting in the middle
            if (action.payload.insertIndex !== undefined && action.payload.insertIndex < columnElements.length) {
              columnElements.forEach((el, idx) => {
                if (idx >= action.payload.insertIndex) {
                  const elementInArray = updatedElements.find(e => e.id === el.id);
                  if (elementInArray) {
                    elementInArray.order = (elementInArray.order || idx) + 1;
                  }
                }
              });
            }
            
            updatedElements.push(newElement);
            
            return {
              ...section,
              elements: updatedElements
            };
          }
          return section;
        })
      };
    
    case 'MOVE_ELEMENT':
      return {
        ...state,
        sections: state.sections.map(section => {
          if (section.id === action.payload.sectionId) {
            const elements = [...section.elements];
            const elementToMove = elements.find(el => el.id === action.payload.elementId);
            
            if (elementToMove) {
              // Update element's position
              elementToMove.columnIndex = action.payload.newColumnIndex;
              elementToMove.order = action.payload.newOrder;
              
              // Reorder other elements in the target column
              const targetColumnElements = elements.filter(el => 
                el.columnIndex === action.payload.newColumnIndex && el.id !== action.payload.elementId
              );
              
              targetColumnElements.forEach((el, idx) => {
                if (idx >= action.payload.newOrder) {
                  el.order = idx + 1;
                }
              });
            }
            
            return {
              ...section,
              elements: elements
            };
          }
          return section;
        })
      };
    
    case 'UPDATE_ELEMENT':
      return {
        ...state,
        sections: state.sections.map(section => ({
          ...section,
          elements: section.elements.map(el =>
            el.id === action.payload.id
              ? { 
                  ...el, 
                  ...action.payload.updates,
                  style: action.payload.updates.style 
                    ? { ...el.style, ...action.payload.updates.style }
                    : el.style
                }
              : el
          )
        })),
        selectedElement: state.selectedElement?.id === action.payload.id
          ? {
              ...state.selectedElement,
              ...action.payload.updates,
              style: action.payload.updates.style
                ? { ...state.selectedElement.style, ...action.payload.updates.style }
                : state.selectedElement.style
            }
          : state.selectedElement
      };
    
    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map(section =>
          section.id === action.payload.id
            ? { 
                ...section, 
                ...action.payload.updates,
                style: action.payload.updates.style
                  ? { ...section.style, ...action.payload.updates.style }
                  : section.style
              }
            : section
        ),
        selectedElement: state.selectedElement?.id === action.payload.id
          ? {
              ...state.selectedElement,
              ...action.payload.updates,
              style: action.payload.updates.style
                ? { ...state.selectedElement.style, ...action.payload.updates.style }
                : state.selectedElement.style
            }
          : state.selectedElement
      };
    
    case 'DELETE_ELEMENT':
      return {
        ...state,
        sections: state.sections.map(section => ({
          ...section,
          elements: section.elements.filter(el => el.id !== action.payload.id)
        })),
        selectedElement: state.selectedElement?.id === action.payload.id ? null : state.selectedElement
      };
    
    case 'DELETE_SECTION':
      return {
        ...state,
        sections: state.sections.filter(section => section.id !== action.payload.id),
        selectedElement: null
      };
    
    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElement: action.payload.element
      };
    
    case 'SET_DRAG_OVER_INDEX':
      return {
        ...state,
        dragOverIndex: action.payload.index
      };
    
    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        isPreviewMode: !state.isPreviewMode,
        selectedElement: null
      };
    
    default:
      return state;
  }
};

export const BuilderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  const addSection = (columns = 1, insertIndex = undefined) => {
    dispatch({
      type: 'ADD_SECTION',
      payload: { columns, insertIndex }
    });
  };

  const addElementToSection = (sectionId, type, content, style, columnIndex, insertIndex) => {
    dispatch({
      type: 'ADD_ELEMENT_TO_SECTION',
      payload: { sectionId, type, content, style, columnIndex, insertIndex }
    });
  };

  const moveElement = (sectionId, elementId, newColumnIndex, newOrder) => {
    dispatch({
      type: 'MOVE_ELEMENT',
      payload: { sectionId, elementId, newColumnIndex, newOrder }
    });
  };

  const updateElement = (id, updates) => {
    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: { id, updates }
    });
  };

  const updateSection = (id, updates) => {
    dispatch({
      type: 'UPDATE_SECTION',
      payload: { id, updates }
    });
  };

  const deleteElement = (id) => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { id }
    });
  };

  const deleteSection = (id) => {
    dispatch({
      type: 'DELETE_SECTION',
      payload: { id }
    });
  };

  const selectElement = (element) => {
    dispatch({
      type: 'SELECT_ELEMENT',
      payload: { element }
    });
  };

  const setDragOverIndex = (index) => {
    dispatch({
      type: 'SET_DRAG_OVER_INDEX',
      payload: { index }
    });
  };

  const togglePreview = () => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  };

  return (
    <BuilderContext.Provider value={{
      ...state,
      addSection,
      addElementToSection,
      moveElement,
      updateElement,
      updateSection,
      deleteElement,
      deleteSection,
      selectElement,
      setDragOverIndex,
      togglePreview
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
