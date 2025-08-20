import React, { useState } from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './ParagraphElement.css';

const ParagraphElement = ({ element }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempContent, setTempContent] = useState(element.content);
    const { updateElement, deleteElement, selectElement, selectedElement } = useBuilder();

    const handleDoubleClick = () => {
        setIsEditing(true);
        setTempContent(element.content);
    };

    const handleSave = () => {
        updateElement(element.id, { content: tempContent });
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            setTempContent(element.content);
            setIsEditing(false);
        }
    };

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
            className={`element-wrapper paragraph-element ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <textarea
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyPress}
                    className="paragraph-editor"
                    style={element.style}
                    autoFocus
                    rows={6}
                />
            ) : (
                <p className="paragraph-content" style={element.style}>
                    {element.content}
                </p>
            )}
            

            <div className="element-controls">
                <button className="control-btn delete" onClick={handleDelete}>
                    ×
                </button>
            </div>
        </div>
    );
};

export default ParagraphElement;
