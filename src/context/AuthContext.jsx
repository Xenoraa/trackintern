import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const response = await authAPI.verifyToken();
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password, role = 'student') => {
    try {
      let response;

      if (role === 'student') {
        response = await authAPI.studentLogin({ email, password });
      } else {
        response = await authAPI.roleLogin({ email, password, role });
      }

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const studentSignup = async (data) => {
    try {
      const response = await authAPI.studentSignup(data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      toast.success('Registration successful!');
      return { success: true, user };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const verifyEmail = async (email, code) => {
    try {
      await authAPI.verifyEmail({ email, code });
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    studentSignup,
    verifyEmail,
    checkAuth,
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};