import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/services/api.js';

const AuthContext = createContext();

const jwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      throw new Error("Invalid token: Missing payload");
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT", e);
    throw new Error("Invalid token");
  }
};

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
          // 1. Set auth header
          api.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.access;
          
          // 2. Fetch user's profile
          const userResponse = await api.get('/users/me/');
          let fullUser = userResponse.data;
          
          // --- 3. NEW: IF USER IS A STUDENT, FETCH STUDENT PROFILE ---
          if (fullUser.student_id) {
            try {
              const studentResponse = await api.get(`/students/${fullUser.student_id}/`);
              fullUser.student = studentResponse.data; // Attach student profile
            } catch (e) {
              console.error("Failed to fetch student profile", e);
            }
          }
          // --- END NEW ---

          // 4. Set user
          setUser(fullUser);

        } catch (error) {
          console.error("Auth check failed, token might be invalid", error);
          if (error.response?.status !== 401) {
             logoutUser(false);
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [tokens]); 

  const loginUser = async (username, password) => {
    try {
      // 1. Get tokens
      const tokenResponse = await api.post('/auth/token/', {
        username,
        password,
      });
      const newTokens = tokenResponse.data;
      
      // 2. Set tokens and auth header
      setTokens(newTokens);
      localStorage.setItem('authTokens', JSON.stringify(newTokens));
      api.defaults.headers.common['Authorization'] = 'Bearer ' + newTokens.access;
      
      // 3. Fetch user's profile
      const userResponse = await api.get('/users/me/');
      let fullUser = userResponse.data;

      // --- 4. NEW: IF USER IS A STUDENT, FETCH STUDENT PROFILE ---
      if (fullUser.student_id) {
        try {
          const studentResponse = await api.get(`/students/${fullUser.student_id}/`);
          fullUser.student = studentResponse.data; // Attach student profile
        } catch (e) {
          console.error("Failed to fetch student profile during login", e);
        }
      }
      // --- END NEW ---

      setUser(fullUser);

      // 5. Role-based redirect
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (fullUser.is_staff) { 
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login failed', error);
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid username or password.');
      }
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
    setUser,
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