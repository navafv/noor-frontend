/* UPDATED FILE: src/context/AuthContext.jsx */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(() => {
    try {
      const storedTokens = localStorage.getItem('authTokens');
      return storedTokens ? JSON.parse(storedTokens) : null;
    } catch (error) {
      console.error("Failed to parse auth tokens:", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      if (tokens) {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.access;
        try {
          // Note: Your backend might need to expose user.student_id here
          // I've seen it in StudentDashboard, so I assume /users/me/ has it
          const response = await api.get('/users/me/');
          setUser(response.data);
        } catch (error) {
          console.error("Auth check failed", error);
          logoutUser(false);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [tokens]);

  const loginUser = async (username, password) => {
    try {
      const tokenResponse = await api.post('/auth/token/', {
        username,
        password,
      });
      const newTokens = tokenResponse.data;
      setTokens(newTokens);
      localStorage.setItem('authTokens', JSON.stringify(newTokens));
      api.defaults.headers.common['Authorization'] = 'Bearer ' + newTokens.access;
      
      const userResponse = await api.get('/users/me/');
      setUser(userResponse.data);

      // Role-based redirect
      if (userResponse.data.is_staff) {
        navigate('/admin/dashboard'); // Go to Admin Dashboard
      } else {
        navigate('/student/dashboard'); // Go to Student Dashboard
      }
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Invalid username or password');
    }
  };

  const logoutUser = (redirect = true) => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('authTokens');
    delete api.defaults.headers.common['Authorization'];
    if (redirect) {
      navigate('/login');
    }
  };

  const contextData = {
    user,
    tokens,
    loading,
    loginUser,
    logoutUser,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;