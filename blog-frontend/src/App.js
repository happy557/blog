import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import CreateBlogPostPage from './pages/CreateBlogPostPage';
import EditBlogPostPage from './pages/EditBlogPostPage';
import PrivateRoute from './components/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/posts/:id" element={<BlogPostDetailPage />} />
              <Route 
                path="/posts/create" 
                element={
                  <PrivateRoute>
                    <CreateBlogPostPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/posts/:id/edit" 
                element={
                  <PrivateRoute>
                    <EditBlogPostPage />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;