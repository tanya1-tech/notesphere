import axios from 'axios';

// Use environment variable with fallback
const API_URL = 'https://notesphere-zo8y.onrender.com';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users/register', formData);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (formData) => API.put('/users/profile', formData);

// Notes APIs
// ============ NOTES APIs ============
export const getNotes = (filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
  );
  return API.get('/notes', { params: cleanFilters });
};

export const getNote = (id) => API.get(`/notes/${id}`);

export const uploadNote = (formData, config = {}) => {
  return API.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  });
};

export const downloadNote = (id) => API.get(`/notes/${id}/download`, { 
  responseType: 'blob' 
});

export const deleteNote = (id) => API.delete(`/notes/${id}`);

export const getUserNotes = () => API.get('/notes/user/my-notes');  // ✅ This is correct

// Course APIs
export const getCourseNotes = (courseName, filters = {}) => 
  API.get(`/notes/course/${courseName}`, { params: filters });

// Admin APIs
export const getAllNotes = () => API.get('/notes/debug/all');

export default API;