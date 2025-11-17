import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Verify token by fetching user profile
          await fetchUserProfile(); 
        } catch (error) {
          console.error("Session expired");
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/users/me/');
      const userData = res.data;
      
      // If student, try to fetch student details too
      if (userData.student_id && !userData.is_staff) {
         try {
             const studentRes = await api.get(`/students/${userData.student_id}/`);
             userData.student_details = studentRes.data;
         } catch (e) {
             console.log("Could not fetch student specific details");
         }
      }
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      
      const userData = await fetchUserProfile();
      
      toast.success(`Welcome back, ${userData.first_name || userData.username}!`);
      
      // Redirect based on role
      if (userData.is_staff) {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/home');
      }
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.detail || 'Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.is_staff }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);