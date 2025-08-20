import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import './PropertyPanel.css';

const PropertyPanel = () => {
  const { selectedElement, updateElement, updateSection } = useBuilder();
  
  // Local state for form values
  const [formValues, setFormValues] = useState({});
  const isUpdatingRef = useRef(false);

  // Sync form values with selected element
  useEffect(() => {
    if (selectedElement && !isUpdatingRef.current) {
      const newFormValues = {
        content: selectedElement.content || '',
        link: selectedElement.link || '',
        openInNewTab: selectedElement.openInNewTab || false,
        alt: selectedElement.alt || '',
        ...selectedElement.style
      };
      
      setFormValues(newFormValues);
    }
  }, [selectedElement]);

  // Real-time update function
  const updateProperty = (property, value, isStyleProperty = true) => {
    if (!selectedElement) return;
    
    isUpdatingRef.current = true;
    
    // Update local state immediately
    setFormValues(prev => ({
      ...prev,
      [property]: value
    }));
    
    // Update global state immediately
    setTimeout(() => {
      if (selectedElement.type === 'section') {
        updateSection(selectedElement.id, {
          style: { ...selectedElement.style, [property]: value }
        });
      } else {
        if (isStyleProperty) {
          updateElement(selectedElement.id, {
            style: { ...selectedElement.style, [property]: value }
          });
        } else {
          updateElement(selectedElement.id, { [property]: value });
        }
      }
      isUpdatingRef.current = false;
    }, 0);
  };

  // Handle content changes
  const handleContentChange = (value) => {
    updateProperty('content', value, false);
  };

  // Handle style changes (immediate update)
  const handleStyleChange = (property, value) => {
    updateProperty(property, value, true);
  };

  // Handle non-style property changes
  const handlePropertyChange = (property, value) => {
    updateProperty(property, value, false);
  };

  // Handle multiple property updates (for alignment buttons)
  const handleMultipleUpdates = (updates) => {
    if (!selectedElement) return;
    
    isUpdatingRef.current = true;
    
    // Update local state
    setFormValues(prev => ({
      ...prev,
      ...updates
    }));
    
    // Update global state
    setTimeout(() => {
      updateElement(selectedElement.id, {
        style: { ...selectedElement.style, ...updates }
      });
      isUpdatingRef.current = false;
    }, 0);
  };

  if (!selectedElement) {
    return (
      <div className="property-panel">
        <div className="property-panel-header">
          <h3>Properties</h3>
        </div>
        <div className="no-selection">
          <div className="help-content">
            <h4>How to use:</h4>
            <ul>
              <li>Drag sections from sidebar to create layout</li>
              <li>Drop elements into sections</li>
              <li>Click any element to edit properties</li>
              <li>Double-click text to edit content</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="property-panel">
      <div className="property-panel-header">
        <h3>Properties</h3>
        <span className="element-type">{selectedElement.type}</span>
      </div>
      
      {/* Image-specific properties */}
      {selectedElement.type === 'image' && (
        <>
          <div className="property-section">
            <h4>Image Source</h4>
            <div className="property-field">
              <label>Image URL:</label>
              <input
                type="url"
                value={formValues.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="property-field">
              <label>Alt Text:</label>
              <input
                type="text"
                value={formValues.alt || ''}
                onChange={(e) => handlePropertyChange('alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </div>

          <div className="property-section">
            <h4>Image Size</h4>
            <div className="property-row">
              <div className="property-field">
                <label>Width:</label>
                <input
                  type="text"
                  value={formValues.width || '100%'}
                  onChange={(e) => handleStyleChange('width', e.target.value)}
                  placeholder="100% or 300px"
                />
              </div>
              <div className="property-field">
                <label>Height:</label>
                <input
                  type="text"
                  value={formValues.height || 'auto'}
                  onChange={(e) => handleStyleChange('height', e.target.value)}
                  placeholder="auto or 200px"
                />
              </div>
            </div>
            <div className="property-field">
              <label>Max Width:</label>
              <input
                type="text"
                value={formValues.maxWidth || '100%'}
                onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                placeholder="100%"
              />
            </div>
            <div className="property-field">
              <label>Object Fit:</label>
              <select
                value={formValues.objectFit || 'cover'}
                onChange={(e) => handleStyleChange('objectFit', e.target.value)}
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="scale-down">Scale Down</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="property-section">
            <h4>Image Alignment</h4>
            <div className="alignment-buttons">
              <button
                className={`align-btn ${formValues.display === 'block' && formValues.marginLeft === 'auto' && formValues.marginRight === 'auto' ? 'active' : ''}`}
                onClick={() => handleMultipleUpdates({
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  float: 'none'
                })}
                title="Center"
              >
                ⬛
              </button>
              <button
                className={`align-btn ${formValues.float === 'left' ? 'active' : ''}`}
                onClick={() => handleMultipleUpdates({
                  float: 'left',
                  display: 'inline-block',
                  marginLeft: '0',
                  marginRight: '20px'
                })}
                title="Float Left"
              >
                ⬅️
              </button>
              <button
                className={`align-btn ${formValues.float === 'right' ? 'active' : ''}`}
                onClick={() => handleMultipleUpdates({
                  float: 'right',
                  display: 'inline-block',
                  marginLeft: '20px',
                  marginRight: '0'
                })}
                title="Float Right"
              >
                ➡️
              </button>
              <button
                className={`align-btn ${!formValues.float || formValues.float === 'none' ? 'active' : ''}`}
                onClick={() => handleMultipleUpdates({
                  float: 'none',
                  display: 'inline-block',
                  marginLeft: '0',
                  marginRight: '0'
                })}
                title="Inline"
              >
                📄
              </button>
            </div>
          </div>

          <div className="property-section">
            <h4>Border & Effects</h4>
            <div className="property-field">
              <label>Border Radius:</label>
              <div className="border-radius-controls">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={parseInt(formValues.borderRadius) || 0}
                  onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                />
                <span>{parseInt(formValues.borderRadius) || 0}px</span>
              </div>
            </div>
            <div className="property-field">
              <label>Border:</label>
              <input
                type="text"
                value={formValues.border || 'none'}
                onChange={(e) => handleStyleChange('border', e.target.value)}
                placeholder="2px solid #333"
              />
            </div>
            <div className="property-field">
              <label>Box Shadow:</label>
              <select
                value={formValues.boxShadow || 'none'}
                onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              >
                <option value="none">None</option>
                <option value="0 2px 8px rgba(0,0,0,0.1)">Light</option>
                <option value="0 4px 16px rgba(0,0,0,0.15)">Medium</option>
                <option value="0 8px 32px rgba(0,0,0,0.2)">Strong</option>
                <option value="0 12px 48px rgba(0,0,0,0.3)">Very Strong</option>
              </select>
            </div>
            <div className="property-field">
              <label>Opacity:</label>
              <div className="opacity-controls">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(parseFloat(formValues.opacity) || 1) * 100}
                  onChange={(e) => handleStyleChange('opacity', e.target.value / 100)}
                />
                <span>{Math.round((parseFloat(formValues.opacity) || 1) * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="property-section">
            <h4>Spacing</h4>
            <div className="property-row">
              <div className="property-field">
                <label>Margin:</label>
                <input
                  type="text"
                  value={formValues.margin || '0px'}
                  onChange={(e) => handleStyleChange('margin', e.target.value)}
                  placeholder="10px or 10px 20px"
                />
              </div>
              <div className="property-field">
                <label>Padding:</label>
                <input
                  type="text"
                  value={formValues.padding || '0px'}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  placeholder="10px or 10px 20px"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Button-specific properties */}
      {selectedElement.type === 'button' && (
        <>
          <div className="property-section">
            <h4>Button Content & Link</h4>
            <div className="property-field">
              <label>Button Text:</label>
              <input
                type="text"
                value={formValues.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div className="property-field">
              <label>Link URL (optional):</label>
              <input
                type="url"
                value={formValues.link || ''}
                onChange={(e) => handlePropertyChange('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="property-field checkbox-field">
              <label>
                <input
                  type="checkbox"
                  checked={formValues.openInNewTab || false}
                  onChange={(e) => handlePropertyChange('openInNewTab', e.target.checked)}
                />
                Open in new tab
              </label>
            </div>
          </div>

          <div className="property-section">
            <h4>Button Style</h4>
            <div className="property-field">
              <label>Background:</label>
              <input
                type="color"
                value={formValues.backgroundColor || '#3498db'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
            </div>
            <div className="property-field">
              <label>Border:</label>
              <input
                type="text"
                value={formValues.border || 'none'}
                onChange={(e) => handleStyleChange('border', e.target.value)}
                placeholder="2px solid #333"
              />
            </div>
            <div className="property-field">
              <label>Border Radius:</label>
              <input
                type="text"
                value={formValues.borderRadius || '5px'}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                placeholder="5px"
              />
            </div>
          </div>
        </>
      )}

      {/* Content section for other text elements */}
      {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'paragraph') && (
        <div className="property-section">
          <h4>Content</h4>
          <div className="property-field">
            <label>Text:</label>
            <textarea
              value={formValues.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={selectedElement.type === 'paragraph' ? 4 : 3}
            />
          </div>
        </div>
      )}

      {/* Section Properties */}
      {selectedElement.type === 'section' && (
        <div className="property-section">
          <h4>Section Settings</h4>
          <div className="property-field">
            <label>Background Color:</label>
            <input
              type="color"
              value={formValues.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            />
          </div>
          <div className="property-field">
            <label>Padding:</label>
            <input
              type="text"
              value={formValues.padding || '40px 20px'}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              placeholder="40px 20px"
            />
          </div>
          <div className="property-field">
            <label>Min Height:</label>
            <input
              type="text"
              value={formValues.minHeight || '100px'}
              onChange={(e) => handleStyleChange('minHeight', e.target.value)}
              placeholder="100px"
            />
          </div>
        </div>
      )}

      {/* Typography section for text elements */}
      {selectedElement.type !== 'section' && selectedElement.type !== 'image' && selectedElement.type !== 'spacer' && selectedElement.type !== 'video' && selectedElement.type !== 'table' && (
        <div className="property-section">
          <h4>Typography</h4>
          <div className="property-field">
            <label>Font Size:</label>
            <input
              type="text"
              value={formValues.fontSize || '16px'}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              placeholder="16px"
            />
          </div>
          <div className="property-field">
            <label>Color:</label>
            <input
              type="color"
              value={formValues.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>
          <div className="property-field">
            <label>Font Weight:</label>
            <select
              value={formValues.fontWeight || 'normal'}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="600">Semi Bold</option>
              <option value="300">Light</option>
            </select>
          </div>
          <div className="property-field">
            <label>Text Align:</label>
            <select
              value={formValues.textAlign || 'left'}
              onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          <div className="property-field">
            <label>Line Height:</label>
            <input
              type="text"
              value={formValues.lineHeight || '1.6'}
              onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
              placeholder="1.6"
            />
          </div>
        </div>
      )}

      {/* Video properties */}
      {selectedElement.type === 'video' && (
        <div className="property-section">
          <h4>Video Settings</h4>
          <div className="property-field">
            <label>Video URL:</label>
            <input
              type="url"
              value={formValues.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div className="property-field">
            <label>Width:</label>
            <input
              type="text"
              value={formValues.width || '100%'}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="100%"
            />
          </div>
        </div>
      )}

      {/* Spacer properties */}
      {selectedElement.type === 'spacer' && (
        <div className="property-section">
          <h4>Spacer Settings</h4>
          <div className="property-field">
            <label>Height:</label>
            <div className="height-controls">
              <input
                type="range"
                min="10"
                max="200"
                value={parseInt(formValues.height) || 50}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`)}
              />
              <span>{parseInt(formValues.height) || 50}px</span>
            </div>
          </div>
        </div>
      )}

      {/* General spacing for non-section elements */}
      {selectedElement.type !== 'section' && selectedElement.type !== 'image' && (
        <div className="property-section">
          <h4>Spacing</h4>
          <div className="property-field">
            <label>Margin Bottom:</label>
            <input
              type="text"
              value={formValues.marginBottom || '20px'}
              onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
              placeholder="20px"
            />
          </div>
          {selectedElement.type !== 'spacer' && (
            <div className="property-field">
              <label>Padding:</label>
              <input
                type="text"
                value={formValues.padding || '0px'}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                placeholder="10px"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
