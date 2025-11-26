import axios from 'axios';

const API_BASE = {
    auth: process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:3001',
    chat: process.env.REACT_APP_CHAT_SERVICE_URL || 'http://localhost:3002',
    admin: process.env.REACT_APP_ADMIN_SERVICE_URL || 'http://localhost:3003',
    ingestion: process.env.REACT_APP_INGESTION_SERVICE_URL || 'http://localhost:3004',
};

// Auth API
export const authAPI = {
    studentSignup: (data) => axios.post(`${API_BASE.auth}/api/auth/student/signup`, data),
    studentLogin: (data) => axios.post(`${API_BASE.auth}/api/auth/student/login`, data),
    adminSignup: (data) => axios.post(`${API_BASE.auth}/api/auth/admin/signup`, data),
    adminLogin: (data) => axios.post(`${API_BASE.auth}/api/auth/admin/login`, data),
    verifyToken: (token) => axios.get(`${API_BASE.auth}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
    }),
};

// Chat API
export const chatAPI = {
    sendMessage: (userId, message, token) => axios.post(
        `${API_BASE.chat}/api/chat/message`,
        { userId, message },
        { headers: { Authorization: `Bearer ${token}` } }
    ),
    getChatHistory: (userId, token) => axios.get(
        `${API_BASE.chat}/api/chat/history/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ),
};

// Admin API
export const adminAPI = {
    getEscalations: (token, status) => {
        const url = status
            ? `${API_BASE.admin}/api/admin/escalations?status=${status}`
            : `${API_BASE.admin}/api/admin/escalations`;
        return axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    resolveEscalation: (id, resolution, token) => axios.post(
        `${API_BASE.admin}/api/admin/escalations/${id}/resolve`,
        { resolution },
        { headers: { Authorization: `Bearer ${token}` } }
    ),
    getDocuments: (token) => axios.get(
        `${API_BASE.admin}/api/admin/documents`,
        { headers: { Authorization: `Bearer ${token}` } }
    ),
    getStats: (token) => axios.get(
        `${API_BASE.admin}/api/admin/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
    ),
};

// Ingestion API
export const ingestionAPI = {
    uploadPDF: (file, title, token) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        return axios.post(
            `${API_BASE.ingestion}/api/ingest/pdf`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    },
    uploadText: (title, content, token) => axios.post(
        `${API_BASE.ingestion}/api/ingest/text`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
    ),
    getDocuments: (token) => axios.get(
        `${API_BASE.ingestion}/api/ingest/documents`,
        { headers: { Authorization: `Bearer ${token}` } }
    ),
};

// Token management
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');
export const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};
export const setUserData = (data) => localStorage.setItem('userData', JSON.stringify(data));
export const removeUserData = () => localStorage.removeItem('userData');
