/* UPDATED FILE: src/context/AuthContext.jsx */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/services/api.js';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

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
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      if (tokens) {
        // Set header immediately
        api.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.access;
        try {
          // Decode token to get user ID
          const decoded = jwtDecode(tokens.access);
          const userId = decoded.user_id;

          // Fetch user data from /users/{id}/
          const response = await api.get(`/users/${userId}/`);
          
          // --- FIX: Get student_id from student endpoint ---
          let studentId = null;
          if (!response.data.is_staff) {
            try {
              // Fetch the associated student record
              const studentRes = await api.get(`/students/?user_id=${userId}`);
              if (studentRes.data.results && studentRes.data.results.length > 0) {
                studentId = studentRes.data.results[0].id;
              }
            } catch (studentErr) {
              console.error("Could not fetch student record for user", studentErr);
            }
          }
          
          setUser({ ...response.data, student_id: studentId });
          // --- End Fix ---

        } catch (error) {
          console.error("Auth check failed, token might be invalid", error);
          // Don't logout here, let interceptor handle refresh
          if (error.response?.status !== 401) {
             logoutUser(false); // Log out if it's not a 401 (which interceptor handles)
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [tokens]); // Only re-run when tokens change

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
      
      // Decode token to get user ID
      const decoded = jwtDecode(newTokens.access);
      const userId = decoded.user_id;

      // Fetch user data from /users/{id}/
      const userResponse = await api.get(`/users/${userId}/`);

      // --- FIX: Get student_id from student endpoint ---
      let studentId = null;
      if (!userResponse.data.is_staff) {
        try {
          const studentRes = await api.get(`/students/?user_id=${userId}`);
          if (studentRes.data.results && studentRes.data.results.length > 0) {
            studentId = studentRes.data.results[0].id;
          }
        } catch (studentErr) {
          console.error("Could not fetch student record for user", studentErr);
        }
      }
      
      const fullUser = { ...userResponse.data, student_id: studentId };
      setUser(fullUser);
      // --- End Fix ---

      // Role-based redirect
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (fullUser.is_staff) {
        navigate('/admin/dashboard', { replace: true }); // Go to Admin Dashboard
      } else {
        navigate('/student/dashboard', { replace: true }); // Go to Student Dashboard
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
    setUser, // Expose setUser for profile updates
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;