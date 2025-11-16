
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const tokens = getAuthTokens();
    if (tokens?.access) {
      config.headers['Authorization'] = 'Bearer ' + tokens.access;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const tokens = getAuthTokens();

    if (error.response?.status === 401 && tokens?.refresh && !originalRequest._retry) {
      
      if (isRefreshing) {
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
        return api(originalRequest); 

      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        localStorage.removeItem('authTokens');
        delete api.defaults.headers.common['Authorization'];
        processQueue(refreshError, null);
        
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;