// Utility functions for the website builder

export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const getElementDefaultProps = (type) => {
  const defaults = {
    text: {
      content: 'Double click to edit',
      style: {
        fontSize: '16px',
        color: '#333333',
        fontFamily: 'Arial, sans-serif',
        padding: '10px',
        backgroundColor: 'transparent',
        border: 'none',
      }
    },
    image: {
      content: 'https://via.placeholder.com/200x150',
      style: {
        width: '200px',
        height: '150px',
        objectFit: 'cover',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }
    },
    button: {
      content: 'Click me',
      style: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
      }
    },
    container: {
      content: '',
      style: {
        width: '200px',
        height: '150px',
        backgroundColor: '#f8f9fa',
        border: '2px dashed #ddd',
        borderRadius: '4px',
      }
    }
  };

  return defaults[type] || { content: '', style: {} };
};

export const exportToHTML = (elements, canvasStyle) => {
  const elementsHTML = elements.map(element => {
    const styleString = Object.entries(element.style)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
    
    switch (element.type) {
      case 'text':
        return `    <div style="${styleString}">${element.content}</div>`;
      case 'image':
        return `    <img src="${element.content}" style="${styleString}" alt="Image" />`;
      case 'button':
        return `    <button style="${styleString}">${element.content}</button>`;
      case 'container':
        return `    <div style="${styleString}"></div>`;
      default:
        return '';
    }
  }).join('\n');

  const canvasStyleString = Object.entries(canvasStyle)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            ${canvasStyleString}
            position: relative;
        }
    </style>
</head>
<body>
${elementsHTML}
</body>
</html>`;
};
