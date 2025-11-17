import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/services/api.js';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

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
        try {
          // Validate token expiration
          const decodedToken = jwtDecode(tokens.access);
          if (decodedToken.exp * 1000 < Date.now()) {
            // Token is expired, try to refresh (interceptor will handle)
            // For now, just logout to be safe if interceptor fails
            console.log("Token expired, interceptor will refresh or logout.");
          }

          api.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.access;
          
          const userResponse = await api.get('/users/me/');
          let fullUser = userResponse.data;
          
          // IF USER IS A STUDENT, FETCH STUDENT PROFILE
          // This matches your backend UserSerializer (student_id)
          if (fullUser.student_id) {
            try {
              const studentResponse = await api.get(`/students/${fullUser.student_id}/`);
              fullUser.student = studentResponse.data; // Attach student profile
            } catch (e) {
              console.error("Failed to fetch student profile", e);
              // Don't fail the whole login, just log the error
            }
          }

          setUser(fullUser);

        } catch (error) {
          console.error("Auth check failed, token might be invalid", error);
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
      
      const userResponse = await api.get('/users/me/');
      let fullUser = userResponse.data;

      if (fullUser.student_id) {
        try {
          const studentResponse = await api.get(`/students/${fullUser.student_id}/`);
          fullUser.student = studentResponse.data;
        } catch (e) {
          console.error("Failed to fetch student profile during login", e);
        }
      }

      setUser(fullUser);

      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (fullUser.is_staff) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
      toast.success(`Welcome, ${fullUser.first_name || fullUser.username}!`);
      
    } catch (error) {
      console.error('Login failed', error);
      if (error.response && error.response.status === 401) {
        toast.error('Invalid username or password.');
        throw new Error('Invalid username or password.');
      }
      toast.error('Login failed. Please try again.');
      throw new Error('Login failed. Please try again.');
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