/*
 * UPDATED FILE: src/services/api.js
 *
 * FIX: Using `import.meta.env.VITE_API_BASE_URL` as defined in your .env file.
 * FIX: Corrected a syntax error in the request interceptor.
 */
import axios from 'axios';

// Get tokens from localStorage
const getAuthTokens = () => {
  try {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  } catch (e) {
    console.error('Could not parse auth tokens', e);
    return null;
  }
};

// Use the VITE_API_BASE_URL from your .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === 1. Request Interceptor ===
// Add the Authorization header to every request if tokens exist
api.interceptors.request.use(
  (config) => {
    const tokens = getAuthTokens();
    if (tokens) {
      // FIX: Removed the stray 'f' character that was here
      config.headers['Authorization'] = 'Bearer ' + tokens.access;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === 2. Response Interceptor (for Token Refresh) ===
// This handles 401 Unauthorized errors by trying to refresh the token.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const tokens = getAuthTokens();

    // Check if it's a 401 error, we have a refresh token, and we're not already refreshing
    if (error.response?.status === 401 && tokens?.refresh && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If we are already refreshing, wait for the new token
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const rs = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: tokens.refresh,
        });

        const newTokens = { ...tokens, access: rs.data.access };
        localStorage.setItem('authTokens', JSON.stringify(newTokens));
        api.defaults.headers.common['Authorization'] = 'Bearer ' + rs.data.access;
        originalRequest.headers['Authorization'] = 'Bearer ' + rs.data.access;

        processQueue(null, rs.data.access);
        return api(originalRequest); // Retry the original request with the new token

      } catch (refreshError) {
        // If refresh fails, log everyone out
        console.error('Token refresh failed', refreshError);
        localStorage.removeItem('authTokens');
        delete api.defaults.headers.common['Authorization'];
        processQueue(refreshError, null);
        
        // Redirect to login
        // We can't use useNavigate() here, so we do a full page reload
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For any other errors, just reject
    return Promise.reject(error);
  }
);

export default api;