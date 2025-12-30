// src/services/authService.js
import axiosInstance from './axiosInstance';

const authService = {
  signup: (data) => axiosInstance.post('/auth/signup', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  forgotPassword: (data) => axiosInstance.post('/auth/forgot-password', {email:data}),
  resetPassword: (token, data) =>
    axiosInstance.post(`/auth/reset-password/${token}`, data),

  getUserById: (id) => axiosInstance.get(`/auth/users/${id}`),

  // ✅ FIXED
  getMe: () => axiosInstance.get('/auth/me'),
  // Update user details (works for both info and password based on your route)
  updateUser: (id, userData) => axiosInstance.put(`/auth/users/${id}`, userData),
};

export default authService;
