import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const EditBlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`posts/${id}/`);
        setFormData({
          title: response.data.title,
          content: response.data.content
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setErrors({ submission: 'Failed to fetch the post for editing.' });
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
      await axiosInstance.put(`posts/${id}/`, formData);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setErrors({ submission: 'Failed to update post. Please try again.' });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Edit Blog Post</h1>
      
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
            onClick={() => navigate(`/posts/${id}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPostPage;