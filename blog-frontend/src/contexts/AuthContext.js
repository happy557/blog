import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('user/');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [fetchUserData]); 

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('token/', {
        username,
        password,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      await fetchUserData();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      await axiosInstance.post('register/', {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};