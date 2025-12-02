import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor if needed
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const studentAPI = {
  // Create single student
  createStudent: async (studentData) => {
    const response = await apiClient.post('/student', studentData);
    return response.data;
  },

  // Bulk create students via JSON
  bulkCreateStudents: async (data) => {
    const response = await apiClient.post('/student/bulk/json', data);
    return response.data;
  },

  // Get all students with optional query params
  getStudents: async (query = {}) => {
    const response = await apiClient.get('/student', { params: query });
    return response.data;
  },

  // Update student
  updateStudent: async (id, updateData) => {
    const response = await apiClient.patch(`/student/${id}`, updateData);
    return response.data;
  },

  // Delete student (if endpoint exists)
  deleteStudent: async (id) => {
    const response = await apiClient.delete(`/student/${id}`);
    return response.data;
  },
};

export const facultyAPI = {
  // Create single faculty
  createFaculty: async (facultyData) => {
    const response = await apiClient.post('/faculty', facultyData);
    return response.data;
  },

  // Bulk create faculties
  bulkCreateFaculties: async (data) => {
    const response = await apiClient.post('/faculty/bulk', data);
    return response.data;
  },

  // Get all faculties with optional query params
  getFaculties: async (query = {}) => {
    const response = await apiClient.get('/faculty', { params: query });
    return response.data;
  },

  // Get single faculty
  getFaculty: async (id) => {
    const response = await apiClient.get(`/faculty/${id}`);
    return response.data;
  },

  // Update faculty
  updateFaculty: async (id, updateData) => {
    const response = await apiClient.patch(`/faculty/${id}`, updateData);
    return response.data;
  },

  // Delete faculty
  deleteFaculty: async (id) => {
    const response = await apiClient.delete(`/faculty/${id}`);
    return response.data;
  },
};

export default apiClient;
