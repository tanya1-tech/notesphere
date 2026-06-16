import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api'
});

// Request interceptor to add auth token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users/register', formData);
export const getProfile = () => API.get('/users/profile');

// Notes APIs
export const getNotes = (filters) => API.get('/notes', { params: filters });
export const getNote = (id) => API.get(`/notes/${id}`);
export const uploadNote = (formData) => API.post('/notes/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const downloadNote = (id) => API.get(`/notes/${id}/download`, { 
  responseType: 'blob' 
});

// Course APIs
export const getCourseNotes = (courseName, filters = {}) => 
  API.get(`/notes/course/${courseName}`, { params: filters });

export default API;