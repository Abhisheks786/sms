import axios from 'axios';

// Get base URL from environment variables, fallback to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important if passing cookies/sessions
});

export const checkHealth = async () => {
    const response = await api.get('/api/health');
    return response.data;
};

export const loginAdmin = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
};

// Users
export const createUser = async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
}

export const getStudents = async () => {
    const response = await api.get('/api/students');
    return response.data;
}

// Attendance & Marks
export const markAttendance = async (data) => {
    const response = await api.post('/api/attendance', data);
    return response.data;
}

export const addMark = async (data) => {
    const response = await api.post('/api/marks', data);
    return response.data;
}

export const getMyAttendance = async (studentId) => {
    const response = await api.get(`/api/attendance/${studentId}`);
    return response.data;
}

export const getMyMarks = async (studentId) => {
    const response = await api.get(`/api/marks/${studentId}`);
    return response.data;
}

export default api;
