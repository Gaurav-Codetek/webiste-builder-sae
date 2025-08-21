import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useBuilder } from '../../context/BuilderContext';
import './BlogModal.css';

const BlogModal = ({ isOpen, onClose }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { loadBlogData } = useBuilder();

  // Fetch blogs when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBlogs();
    }
  }, [isOpen]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getAllData`, {
        headers: {
          'X-API-KEY': process.env.REACT_APP_AUTH_KEY,
        },
      });

      if (response.data && response.data.data) {
        setBlogs(response.data.data.reverse());
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      alert('Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }

    setDeletingId(blogTitle);
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/deleteBlog`,
        { title: blogTitle },  // Send title instead of ID
        {
          headers: {
            'X-API-KEY': process.env.REACT_APP_AUTH_KEY,
          },
        }
      );

      // Remove blog from local list based on title
      setBlogs(prev => prev.filter(blog => blog.title !== blogTitle));
      alert('Blog deleted successfully');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  const selectBlog = (blog) => {
    if (window.confirm(`Load "${blog.title}" into the canvas?`)) {
      loadBlogData(blog);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal-container" onClick={e => e.stopPropagation()}>
        <div className="blog-modal-header">
          <h2>Blog Management</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="blog-modal-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <p>No blogs found</p>
            </div>
          ) : (
            <div className="blog-list">
              {blogs.map(blog => (
                <div key={blog._id || blog.id} className="blog-card">
                  <div
                    className="blog-card-content"
                    onClick={() => selectBlog(blog)}
                  >
                    <h3 className="blog-title">{blog.title}</h3>
                    <div className="blog-meta">
                      <span className="blog-category">{blog.category}</span>
                      <span className="blog-date">
                        {new Date(blog.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="blog-preview">
                      {blog.content && blog.content.length > 0 && blog.content[0].paragraph
                        ? `${blog.content.paragraph?.substring(0, 100)}...`
                        : 'No preview available'
                      }
                    </div>
                  </div>

                  <button
                    className={`delete-btn ${deletingId === blog.title ? 'deleting' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlog(blog.title);  // Pass title instead of ID
                    }}
                    disabled={deletingId === blog.title}
                  >
                    {deletingId === blog.title ? (
                      <>
                        <span className="delete-spinner"></span>
                        Deleting...
                      </>
                    ) : (
                      '🗑️ Delete'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="blog-modal-footer">
          <button className="refresh-btn" onClick={fetchBlogs}>
            🔄 Refresh
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
