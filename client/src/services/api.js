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

export const assignmentAPI = {
  // Assign single activity to faculty
  assignActivity: async (data) => {
    const response = await apiClient.post('/admin/assignment', data);
    return response.data;
  },

  // Bulk assign activities to a faculty
  bulkAssignActivities: async (data) => {
    const response = await apiClient.post('/admin/assignment/bulk', data);
    return response.data;
  },

  // Reassign activity to different faculty
  reassignActivity: async (data) => {
    const response = await apiClient.patch('/admin/assignment/reassign', data);
    return response.data;
  },

  // Get all assignments with optional filters
  getAssignments: async (query = {}) => {
    const response = await apiClient.get('/admin/assignment', { params: query });
    return response.data;
  },

  // Get assignment by activity ID
  getAssignmentByActivityId: async (activityId) => {
    const response = await apiClient.get(`/admin/assignment/activity/${activityId}`);
    return response.data;
  },

  // Unassign activity
  unassignActivity: async (activityId) => {
    const response = await apiClient.delete(`/admin/assignment/activity/${activityId}`);
    return response.data;
  },

  // Get faculty assignment counts
  getFacultyAssignmentCounts: async (instituteId) => {
    const response = await apiClient.get(`/admin/assignment/faculty-counts/${instituteId}`);
    return response.data;
  },

  // Faculty: Get my assigned activities
  getMyAssignedActivities: async (facultyId, instituteId) => {
    const params = instituteId ? { instituteId } : {};
    const response = await apiClient.get(`/faculty/${facultyId}/assignments`, { params });
    return response.data;
  },
};

export const activityAPI = {
  // Get all activities
  getActivities: async (query = {}) => {
    const response = await apiClient.get('/activities', { params: query });
    return response.data;
  },

  // Get single activity
  getActivity: async (id) => {
    const response = await apiClient.get(`/activities/${id}`);
    return response.data;
  },

  // Create activity
  createActivity: async (data) => {
    const response = await apiClient.post('/activities', data);
    return response.data;
  },

  // Update activity
  updateActivity: async (id, data) => {
    const response = await apiClient.patch(`/activities/${id}`, data);
    return response.data;
  },

  // Delete activity
  deleteActivity: async (id) => {
    const response = await apiClient.delete(`/activities/${id}`);
    return response.data;
  },

  // Get student activity stats
  getStudentActivityStats: async (studentId) => {
    const response = await apiClient.get('/activities/stats', { params: { studentId } });
    return response.data;
  },

  // Approve activity
  approveActivity: async (id, remarks = null) => {
    const data = remarks ? { remarks } : {};
    const response = await apiClient.patch(`/activities/${id}/approval`, data);
    return response.data;
  },

  // Reject activity (remarks required)
  rejectActivity: async (id, remarks) => {
    const response = await apiClient.patch(`/activities/${id}/rejected`, { remarks });
    return response.data;
  },
};

export default apiClient;
