import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import BlogModal from '../BlogModal/BlogModal';
import axios from 'axios'
import './Toolbar.css';

const Toolbar = () => {
  const { isPreviewMode, togglePreview, sections, canvasStyle } = useBuilder();
  const [saveStatus, setSaveStatus] = useState('Save Page');
  const [emailStatus, setEmailStatus] = useState("Send Bulk Email");
  const [updateStatus, setUpdateStatus] = useState("Update");
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const exportHTML = () => {
    const htmlContent = generateHTML(sections);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // const exportJSON = () => {
  //   const jsonData = generateJSON(sections, canvasStyle);
  //   const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'website-data.json';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  const sendEmail = async () => {
    setEmailStatus("Sending...");
    const jsonData = generateJSON(sections, canvasStyle);

    try {
      // Find first content block with valid paragraphs
      const firstValidBlock = jsonData.content.find(block =>
        block.paragraph && block.paragraph.trim() !== ''
      );

      if (!firstValidBlock) {
        alert('No paragraph content found to send in email');
        setEmailStatus('No content to send');
        return;
      }

      // Find first subtitle or use title as fallback
      const firstSubtitle = jsonData.content.find(block =>
        block.subtitle && block.subtitle.trim() !== ''
      )?.subtitle || jsonData.title;

      const resp = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/sendEmail`,
        {
          title: jsonData.title,
          link: `${process.env.REACT_APP_GEN_LINK}/?=${encodeURIComponent(jsonData.title)}`,
          des: firstValidBlock.paragraph.trim(),
          subs: 'subscriber',
        },
        {
          headers: {
            "X-API-KEY": process.env.REACT_APP_AUTH_KEY,
          },
        }
      );

      const data = resp.data.status;
      alert(data);
      setEmailStatus("Email sent!");
      setTimeout(()=>{
        setEmailStatus("Send Bulk Email")
      },3000)
    } catch (err) {
      console.log(err);
      setEmailStatus("Try again!");
    }
  };
  const copyJSONToClipboard = async () => {
    const jsonData = generateJSON(sections, canvasStyle);
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      // You could add a toast notification here
      alert('JSON copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };
  const updateBlogData = async () => {
    const jsonData = generateJSON(sections, canvasStyle);
    setUpdateStatus('Updating...')
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/updateBlog`,
        jsonData
        ,
        {
          headers: {
            'X-API-KEY': process.env.REACT_APP_AUTH_KEY,
          },
        }
      );

      if (response.data.status === 'Success') {
        alert('Blog updated successfully!');
        setUpdateStatus('Updated');
        setTimeout(()=>{
          setUpdateStatus('Update')
        },3000)
        return true;
      }
    } catch (error) {
      console.error('Failed to update blog:', error);
      alert('Failed to update blog');
      setUpdateStatus('Update')
      return false;
    }
  };

  const handleSave = async () => {
    setSaveStatus("Saving...");
    const jsonData = generateJSON(sections, canvasStyle);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/addData`,
        jsonData,
        {
          headers: {
            "X-API-KEY": process.env.REACT_APP_AUTH_KEY,
          },
        }
      );
      const data = response.data;
      if (data.code === 200) {
        setSaveStatus("Saved");
        alert("Blog is Live!")
        setTimeout(() => {
          setSaveStatus("Save");
        }, [3000]);
      } else {
        setSaveStatus("Try again");
      }
    } catch (err) {
      console.log(err);
    }
  };


  const generateHTML = (sections) => {
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
                return `        <h1 style="${elementStyle}">${element.content}</h1>`;
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

  const generateJSON = (sections, canvasStyle) => {
    // First, find the first heading element to use as title
    let extractedTitle = "Generated Website"; // Default fallback
    let foundTitle = false;

    // Search for the first heading in all sections
    for (const section of sections) {
      if (foundTitle) break;

      for (let columnIndex = 0; columnIndex < section.columns; columnIndex++) {
        const columnElements = section.elements
          .filter(el => el.columnIndex === columnIndex)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        for (const element of columnElements) {
          if (element.type === 'heading' && element.content && element.content.trim()) {
            extractedTitle = element.content.trim();
            foundTitle = true;
            break;
          }
        }
        if (foundTitle) break;
      }
    }

    const websiteData = {
      title: extractedTitle,
      category: "Technology",
      date: new Date().toISOString(),
      tag: "website-content",
      content: []
    };

    // Process each section (skip the first heading if it was used as title)
    let skipFirstHeading = foundTitle;

    sections.forEach((section, sectionIndex) => {
      // For each column in the section
      for (let columnIndex = 0; columnIndex < section.columns; columnIndex++) {
        const columnElements = section.elements
          .filter(el => el.columnIndex === columnIndex)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        // Group elements into content blocks
        let currentBlock = {};

        columnElements.forEach((element, elementIndex) => {
          // Skip the first heading if it was used as the title
          if (skipFirstHeading && element.type === 'heading' && element.content.trim() === extractedTitle) {
            skipFirstHeading = false;
            return;
          }

          const contentData = getContentData(element);

          if (contentData) {
            // If we have a subtitle/heading OR text element, start a new block
            if (element.type === 'heading' || element.type === 'text') {
              // Push previous block if it exists
              if (Object.keys(currentBlock).length > 0) {
                websiteData.content.push(currentBlock);
              }
              // Start new block with subtitle
              currentBlock = {
                subtitle: contentData
              };
            }
            // If it's a paragraph, add to current block
            else if (element.type === 'paragraph') {
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
        for (let columnIndex = 0; columnIndex < section.columns; columnIndex++) {
          const columnElements = section.elements
            .filter(el => el.columnIndex === columnIndex)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          columnElements.forEach((element) => {
            // Skip the title heading in simple structure too
            if (skipFirstHeading && element.type === 'heading' && element.content.trim() === extractedTitle) {
              skipFirstHeading = false;
              return;
            }

            const contentData = getContentData(element);
            if (contentData) {
              const block = {};
              if (element.type === 'text') {
                block.subtitle = contentData;
              } else {
                block[element.type] = contentData;
              }
              websiteData.content.push(block);
            }
          });
        }
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

  const openBlogModal = () => {
    setIsBlogModalOpen(true);
  };

  const closeBlogModal = () => {
    setIsBlogModalOpen(false);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1 className="toolbar-title">For P&C <span style={{ fontSize: '15px' }}> with ❤️ by Alpha One</span></h1>
      </div>
      <div className="toolbar-center">
        <button
          className={`toolbar-btn ${!isPreviewMode ? 'active' : ''}`}
          onClick={() => !isPreviewMode || togglePreview()}
        >
          Edit
        </button>
        <button
          className={`toolbar-btn ${isPreviewMode ? 'active' : ''}`}
          onClick={togglePreview}
        >
          Preview
        </button>
      </div>
      <div className="toolbar-right">
        <button className="toolbar-btn blog-list-btn" onClick={openBlogModal}>
          📚 Manage Blogs
        </button>
        <button className="toolbar-btn json-export-btn" onClick={sendEmail}>
          📋 {emailStatus}
        </button>
        <button className="toolbar-btn copy-json-btn" onClick={handleSave}>
          📑 {saveStatus}
        </button>
        <button className="toolbar-btn export-btn" onClick={updateBlogData}>
          📄 {updateStatus}
        </button>
      </div>
      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={closeBlogModal}
      />
    </div>
  );
};

export default Toolbar;
