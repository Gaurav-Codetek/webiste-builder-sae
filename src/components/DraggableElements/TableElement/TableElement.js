import React, { useState } from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import './TableElement.css';

const TableElement = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tableData, setTableData] = useState(element.content || {
    headers: ['Column 1', 'Column 2', 'Column 3'],
    rows: [
      ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
      ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
    ]
  });
  
  const { updateElement, deleteElement, selectElement, selectedElement } = useBuilder();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateElement(element.id, { content: tableData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTableData(element.content);
    setIsEditing(false);
  };

  const addRow = () => {
    const newRow = tableData.headers.map(() => 'New cell');
    setTableData(prev => ({
      ...prev,
      rows: [...prev.rows, newRow]
    }));
  };

  const addColumn = () => {
    setTableData(prev => ({
      headers: [...prev.headers, 'New column'],
      rows: prev.rows.map(row => [...row, 'New cell'])
    }));
  };

  const removeRow = (index) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index)
    }));
  };

  const removeColumn = (index) => {
    setTableData(prev => ({
      headers: prev.headers.filter((_, i) => i !== index),
      rows: prev.rows.map(row => row.filter((_, i) => i !== index))
    }));
  };

  const updateCell = (rowIndex, colIndex, value, isHeader = false) => {
    if (isHeader) {
      setTableData(prev => ({
        ...prev,
        headers: prev.headers.map((header, i) => i === colIndex ? value : header)
      }));
    } else {
      setTableData(prev => ({
        ...prev,
        rows: prev.rows.map((row, i) => 
          i === rowIndex 
            ? row.map((cell, j) => j === colIndex ? value : cell)
            : row
        )
      }));
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
  const currentData = element.content || tableData;

  return (
    <div 
      className={`element-wrapper table-element-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={element.style}
    >
      {isEditing ? (
        <div className="table-editor">
          <div className="table-controls">
            <button onClick={addRow} className="table-btn">Add Row</button>
            <button onClick={addColumn} className="table-btn">Add Column</button>
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
          <div className="table-container">
            <table className="editable-table">
              <thead>
                <tr>
                  {tableData.headers.map((header, index) => (
                    <th key={index}>
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => updateCell(0, index, e.target.value, true)}
                        className="table-input header-input"
                      />
                      {tableData.headers.length > 1 && (
                        <button 
                          onClick={() => removeColumn(index)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex}>
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className="table-input"
                        />
                      </td>
                    ))}
                    {tableData.rows.length > 1 && (
                      <td className="row-controls">
                        <button 
                          onClick={() => removeRow(rowIndex)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="table-display">
          <table className="display-table" style={element.style}>
            <thead>
              <tr>
                {currentData.headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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

export default TableElement;
