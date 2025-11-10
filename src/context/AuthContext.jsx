/* * UPDATED FILE: src/context/AuthContext.jsx 
 *
 * FIX: `loginUser` and `checkUser` now fetch the `student_id`
 * for non-staff users and attach it to the user object.
 * FIX: Replaced `jwt-decode` import with an inline function.
 * FIX: Changed alias import to relative import for `api.js`.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api.js'; // FIX: Use relative path

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

  /**
   * Fetches full user details and associated student ID (if applicable)
   * from a user ID.
   */
  const getUserDetails = async (userId) => {
    // 1. Fetch user data from /users/{id}/
    const userResponse = await api.get(`/users/${userId}/`);
    const userData = userResponse.data;

    let studentId = null;
    // 2. If user is NOT staff, fetch their student record
    if (!userData.is_staff) {
      try {
        // Fetch student record matching the user_id
        const studentRes = await api.get(`/students/?user=${userId}`); // Use user ID filter
        if (studentRes.data.results && studentRes.data.results.length > 0) {
          studentId = studentRes.data.results[0].id;
        }
      } catch (studentErr) {
        console.error("Could not fetch student record for user", studentErr);
      }
    }
    
    // 3. Return the combined user object
    return { ...userData, student_id: studentId };
  };


  useEffect(() => {
    const checkUser = async () => {
      if (tokens) {
        // api.js interceptor now handles setting the header
        try {
          const decoded = jwtDecode(tokens.access);
          const userId = decoded.user_id;
          
          // Fetch full user details
          const fullUser = await getUserDetails(userId);
          setUser(fullUser);

        } catch (error) {
          console.error("Auth check failed, token might be invalid", error);
          if (error.response?.status !== 401) {
             logoutUser(false); // Log out if it's not a 401 (which interceptor handles)
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
      setTokens(newTokens);
      localStorage.setItem('authTokens', JSON.stringify(newTokens));
      // api.js interceptor will now handle this header
      
      // 2. Get user ID from new token
      const decoded = jwtDecode(newTokens.access);
      const userId = decoded.user_id;

      // 3. Fetch full user details
      const fullUser = await getUserDetails(userId);
      setUser(fullUser);

      // 4. Role-based redirect
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
      // Check if it's a 401, which is the most likely login error
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