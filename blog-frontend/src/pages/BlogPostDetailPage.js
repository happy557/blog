import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';

const BlogPostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`posts/${id}/`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to fetch the post. It may not exist or has been removed.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axiosInstance.delete(`posts/${id}/`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete the post. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const isAuthor = user && post && user.id === post.author;

  return (
    <div className="blog-post-detail">
      <h1 className="mb-3">{post.title}</h1>
      <div className="d-flex justify-content-between mb-3">
        <p className="text-muted">
          By {post.author_username} | {new Date(post.publication_date).toLocaleDateString()}
        </p>
        {isAuthor && (
          <div>
            <Link to={`/posts/${post.id}/edit`} className="btn btn-outline-primary me-2">
              Edit
            </Link>
            <button className="btn btn-outline-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="blog-content">
        {post.content.split('\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">
          Back to Posts
        </Link>
      </div>
    </div>
  );
};

export default BlogPostDetailPage;