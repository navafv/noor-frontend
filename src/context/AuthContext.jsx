/*
 * UPDATED FILE: src/context/AuthContext.jsx
 *
 * CRITICAL FIX: This file contains the primary fix for all login issues.
 * 1. Removed the broken `getUserDetails` function.
 * 2. `checkUser` and `loginUser` now use `/users/me/` which is the correct
 * endpoint for *any* logged-in user to get their *own* profile.
 * This fixes the bug where students couldn't log in.
 * 3. `loginUser` now has correct redirect logic for all 3 roles:
 * - Admin (is_superuser) -> /admin/dashboard
 * - Teacher (is_staff, not superuser) -> /teacher/dashboard
 * - Student (not is_staff) -> /student/dashboard
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/services/api.js'; // <-- FIX: Use alias path

const AuthContext = createContext();

/**
 * A simple, inline polyfill for jwt-decode to avoid import issues.
 * This decodes the payload part of a JWT.
 */
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
          // 1. Set auth header for this request
          api.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.access;
          
          // 2. Fetch user's own profile from the /users/me/ endpoint
          //    This works for ALL roles (Admin, Teacher, Student)
          const userResponse = await api.get('/users/me/');
          const fullUser = userResponse.data;
          
          // 3. Set user
          setUser(fullUser);

        } catch (error) {
          console.error("Auth check failed, token might be invalid", error);
          if (error.response?.status !== 401) {
             // 401s are handled by the interceptor, but other errors (like 500)
             // should log the user out.
             logoutUser(false);
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [tokens]); // Only re-run when tokens change

  const loginUser = async (username, password) => {
    try {
      // 1. Get tokens
      const tokenResponse = await api.post('/auth/token/', {
        username,
        password,
      });
      const newTokens = tokenResponse.data;
      
      // 2. Set tokens and auth header for next request
      setTokens(newTokens);
      localStorage.setItem('authTokens', JSON.stringify(newTokens));
      api.defaults.headers.common['Authorization'] = 'Bearer ' + newTokens.access;
      
      // 3. Fetch user's own profile from /users/me/
      const userResponse = await api.get('/users/me/');
      const fullUser = userResponse.data;
      setUser(fullUser);

      // 4. *** CRITICAL FIX: Role-based redirect ***
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (fullUser.is_superuser) {
        // Role 1: Admin
        navigate('/admin/dashboard', { replace: true });
      } else if (fullUser.is_staff) {
        // Role 2: Teacher
        navigate('/teacher/dashboard', { replace: true });
      } else {
        // Role 3: Student
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