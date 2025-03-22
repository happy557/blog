import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const CreateBlogPostPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.title.trim()) tempErrors.title = "Title is required";
    if (!formData.content.trim()) tempErrors.content = "Content is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axiosInstance.post('posts/', formData);
      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({ submission: 'Failed to create post. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Create New Blog Post</h1>
      
      {errors.submission && (
        <div className="alert alert-danger">{errors.submission}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className={`form-control ${errors.content ? 'is-invalid' : ''}`}
            id="content"
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
          ></textarea>
          {errors.content && <div className="invalid-feedback">{errors.content}</div>}
        </div>
        
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPostPage;