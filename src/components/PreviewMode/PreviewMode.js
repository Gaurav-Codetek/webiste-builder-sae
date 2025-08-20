import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import './PreviewMode.css';

const PreviewMode = () => {
  const { sections, canvasStyle, togglePreview } = useBuilder();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState('desktop');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          togglePreview();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen, togglePreview]);

  // Add the generateJSON function here
  const generateJSON = (sections, canvasStyle) => {
  const websiteData = {
    title: "Generated Website",
    category: "Website",
    date: new Date().toISOString(),
    content: []
  };

  // Process each section
  sections.forEach((section, sectionIndex) => {
    // For each column in the section
    for (let columnIndex = 0; columnIndex < section.columns; columnIndex++) {
      const columnElements = section.elements
        .filter(el => el.columnIndex === columnIndex)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      // Group elements into content blocks
      let currentBlock = {};
      
      columnElements.forEach((element, elementIndex) => {
        const contentData = getContentData(element);
        
        if (contentData) {
          // If we have a subtitle/heading, start a new block
          if (element.type === 'heading') {
            // Push previous block if it exists
            if (Object.keys(currentBlock).length > 0) {
              websiteData.content.push(currentBlock);
            }
            // Start new block with subtitle
            currentBlock = {
              subtitle: contentData
            };
          }
          // If it's a paragraph or text, add to current block
          else if (element.type === 'paragraph' || element.type === 'text') {
            if (currentBlock.paragraph) {
              // If there's already a paragraph, combine them
              currentBlock.paragraph += " " + contentData;
            } else {
              currentBlock.paragraph = contentData;
            }
          }
          // Handle images
          else if (element.type === 'image' || element.type === 'image-caption') {
            currentBlock.image = contentData;
          }
          // Handle videos
          else if (element.type === 'video') {
            currentBlock.video = contentData;
          }
          // Handle buttons as call-to-action
          else if (element.type === 'button') {
            currentBlock.cta = contentData;
          }
          // Handle tables as data
          else if (element.type === 'table') {
            currentBlock.table = contentData;
          }
          // Handle other elements
          else {
            // For standalone elements without subtitle, create individual blocks
            const standaloneBlock = {};
            standaloneBlock[element.type] = contentData;
            websiteData.content.push(standaloneBlock);
          }
        }
      });

      // Push the last block if it exists
      if (Object.keys(currentBlock).length > 0) {
        websiteData.content.push(currentBlock);
      }
    }
  });

  // If no content blocks were created, create a simple structure
  if (websiteData.content.length === 0) {
    sections.forEach((section, sectionIndex) => {
      section.columns.forEach((columnIndex) => {
        const columnElements = section.elements
          .filter(el => el.columnIndex === columnIndex)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        columnElements.forEach((element) => {
          const contentData = getContentData(element);
          if (contentData) {
            const block = {};
            block[element.type] = contentData;
            websiteData.content.push(block);
          }
        });
      });
    });
  }

  return websiteData;
};

const getContentData = (element) => {
  switch (element.type) {
    case 'heading':
      return element.content || '';
    
    case 'text':
    case 'paragraph':
      return element.content || '';
    
    case 'image':
      return {
        url: element.content || '',
        alt: element.alt || '',
        caption: ""
      };
    
    case 'image-caption':
      if (typeof element.content === 'object') {
        return {
          url: element.content.imageUrl || '',
          alt: element.content.alt || '',
          caption: element.content.caption || ''
        };
      }
      return {
        url: element.content || '',
        alt: element.alt || '',
        caption: ""
      };
    
    case 'video':
      return {
        url: element.content || '',
        embed_url: getVideoEmbedUrl(element.content)
      };
    
    case 'button':
      return {
        text: element.content || '',
        link: element.link || '',
        target: element.openInNewTab ? "_blank" : "_self"
      };
    
    case 'table':
      if (typeof element.content === 'object') {
        return {
          headers: element.content.headers || [],
          rows: element.content.rows || []
        };
      }
      return {
        headers: [],
        rows: []
      };
    
    case 'spacer':
      return null; // Skip spacers in content
    
    default:
      return element.content || '';
  }
};

const getVideoEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&');
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?');
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
};

  // Add the exportJSON function
  const exportJSON = () => {
    const jsonData = generateJSON(sections, canvasStyle);
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderElement = (element) => {
    const style = { ...element.style };
    delete style.position; // Remove absolute positioning for preview

    switch (element.type) {
      case 'heading':
        return (
          <h1 key={element.id} style={style}>
            {element.content}
          </h1>
        );
      case 'text':
        return (
          <span key={element.id} style={style}>
            {element.content}
          </span>
        );
      case 'paragraph':
        return (
          <p key={element.id} style={style}>
            {element.content}
          </p>
        );
      case 'image':
        return (
          <img
            key={element.id}
            src={element.content}
            alt={element.alt || 'Image'}
            style={style}
          />
        );
      case 'image-caption':
        const imageData = element.content || {};
        return (
          <figure key={element.id} style={style}>
            <img
              src={imageData.imageUrl || element.content}
              alt={imageData.alt || 'Image'}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
            <figcaption style={{
              marginTop: '12px',
              fontStyle: 'italic',
              color: '#666',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {imageData.caption || 'Caption'}
            </figcaption>
          </figure>
        );
      case 'video':
        const getEmbedUrl = (url) => {
          if (!url) return '';
          if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1].split('&')[0];
            return `https://www.youtube.com/embed/${videoId}`;
          }
          if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
          }
          if (url.includes('vimeo.com/')) {
            const videoId = url.split('vimeo.com/')[1];
            return `https://player.vimeo.com/video/${videoId}`;
          }
          return url;
        };

        return (
          <div key={element.id} style={{ ...style, position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <iframe
              src={getEmbedUrl(element.content)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px'
              }}
              allowFullScreen
            />
          </div>
        );
      case 'button':
        return (
          <button
            key={element.id}
            style={style}
            onClick={() => {
              if (element.link) {
                if (element.openInNewTab) {
                  window.open(element.link, '_blank', 'noopener,noreferrer');
                } else {
                  window.location.href = element.link;
                }
              }
            }}
          >
            {element.content}
            {element.link && (
              <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.8 }}>
                {element.openInNewTab ? '↗' : '→'}
              </span>
            )}
          </button>
        );
      case 'table':
        const tableData = element.content || { headers: [], rows: [] };
        return (
          <table key={element.id} style={style}>
            <thead>
              <tr>
                {(tableData.headers || []).map((header, index) => (
                  <th key={index} style={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    fontWeight: '600',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(tableData.rows || []).map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ padding: '12px' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'spacer':
        return <div key={element.id} style={style}></div>;
      default:
        return null;
    }
  };

  const renderSection = (section) => {
    const columnWidth = `${100 / section.columns}%`;
    const columns = Array.from({ length: section.columns }, (_, i) => i);

    return (
      <section key={section.id} style={section.style} className="preview-section">
        <div className="preview-section-content">
          {columns.map(columnIndex => (
            <div
              key={columnIndex}
              className="preview-column"
              style={{ width: columnWidth }}
            >
              {section.elements
                .filter(el => el.columnIndex === columnIndex)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(renderElement)
              }
            </div>
          ))}
        </div>
      </section>
    );
  };

  const exportHTML = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateHTML = () => {
    const sectionsHTML = sections.map(section => {
      const sectionStyle = Object.entries(section.style)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

      const columnWidth = `${100 / section.columns}%`;
      const columns = Array.from({ length: section.columns }, (_, i) => i);

      const columnsHTML = columns.map(columnIndex => {
        const columnElements = section.elements
          .filter(el => el.columnIndex === columnIndex)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(element => {
            const elementStyle = Object.entries(element.style)
              .filter(([key]) => key !== 'position')
              .map(([key, value]) => `${key}: ${value}`)
              .join('; ');

            switch (element.type) {
              case 'heading':
                return `        <h1 style="${elementStyle}">${element.content}</h1>`;
              case 'text':
                return `        <span style="${elementStyle}">${element.content}</span>`;
              case 'paragraph':
                return `        <p style="${elementStyle}">${element.content}</p>`;
              case 'image':
                return `        <img src="${element.content}" alt="${element.alt || 'Image'}" style="${elementStyle}" />`;
              case 'button':
                const buttonAction = element.link
                  ? `onclick="window.${element.openInNewTab ? 'open' : 'location.href='}('${element.link}'${element.openInNewTab ? ', "_blank"' : ''})"`
                  : '';
                return `        <button style="${elementStyle}" ${buttonAction}>${element.content}</button>`;
              case 'video':
                return `        <div style="${elementStyle}"><iframe src="${element.content}" frameborder="0" allowfullscreen></iframe></div>`;
              default:
                return '';
            }
          }).join('\n');

        return `      <div style="width: ${columnWidth}; padding: 20px;">
${columnElements}
      </div>`;
      }).join('\n');

      return `    <section style="${sectionStyle}">
      <div style="display: flex; width: 100%;">
${columnsHTML}
      </div>
    </section>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        section { width: 100%; }
        button { cursor: pointer; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
${sectionsHTML}
</body>
</html>`;
  };

  const getDeviceClass = () => {
    switch (deviceView) {
      case 'tablet': return 'device-tablet';
      case 'mobile': return 'device-mobile';
      default: return 'device-desktop';
    }
  };

  return (
    <div className={`preview-mode ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="preview-header">
        <div className="preview-header-left">
          <h2>Preview Mode</h2>
          <div className="device-switcher">
            <button
              className={`device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
              onClick={() => setDeviceView('desktop')}
              title="Desktop View"
            >
              🖥️
            </button>
            <button
              className={`device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
              onClick={() => setDeviceView('tablet')}
              title="Tablet View"
            >
              📱
            </button>
            <button
              className={`device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
              onClick={() => setDeviceView('mobile')}
              title="Mobile View"
            >
              📱
            </button>
          </div>
        </div>

        <div className="preview-actions">
          {/* <button className="preview-btn export-btn" onClick={exportHTML}>
            <span>📥</span> Export HTML
          </button>
          <button className="preview-btn json-btn" onClick={exportJSON}>
            <span>📋</span> Export JSON
          </button>
          <button
            className="preview-btn fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <span>{isFullscreen ? '🗗' : '🗖'}</span>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button> */}
          <button className="preview-btn exit-btn" onClick={togglePreview}>
            <span>←</span> Back to Editor
          </button>
        </div>
      </div>

      <div className={`preview-container ${getDeviceClass()}`}>
        <div className="preview-content" style={canvasStyle}>
          {sections.length === 0 ? (
            <div className="preview-empty">
              <h3>No content to preview</h3>
              <p>Go back to the editor and add some sections and elements</p>
            </div>
          ) : (
            sections.map(renderSection)
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewMode;
