// ============================================
// SentinelAI - Users Service
// ============================================

import api from './api';

export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/users?${query}`);
  return res.data;
};

export const getUserStats = async () => {
  const res = await api.get('/users/stats');
  return res.data;
};

export const getUser = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post('/users', data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const resetPassword = async (id, newPassword) => {
  const res = await api.post(`/users/${id}/reset-password`, { newPassword });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const getRolesDistribution = async () => {
  const res = await api.get('/users/roles-distribution');
  return res.data;
};

export default {
  getUsers,
  getUserStats,
  getUser,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
  getRolesDistribution,
};