import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('posts/');
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available. Be the first to create a post!</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4 mb-4" key={post.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">By {post.author_username}</h6>
                  <p className="card-text">{post.content.length > 100 
                    ? `${post.content.substring(0, 100)}...` 
                    : post.content}
                  </p>
                </div>
                <div className="card-footer">
                  <small className="text-muted">
                    {new Date(post.publication_date).toLocaleDateString()}
                  </small>
                  <Link to={`/posts/${post.id}`} className="btn btn-primary btn-sm float-end">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;