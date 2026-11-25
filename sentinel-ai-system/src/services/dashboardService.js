// ============================================
// SentinelAI - Dashboard Service
// ============================================

import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getRecentAlerts = async () => {
  const response = await api.get('/dashboard/recent-alerts');
  return response.data;
};

export const getTopThreats = async () => {
  const response = await api.get('/dashboard/top-threats');
  return response.data;
};

export const getEventDistribution = async () => {
  const response = await api.get('/dashboard/event-distribution');
  return response.data;
};

export const getEventsTrend = async () => {
  const response = await api.get('/dashboard/events-trend');
  return response.data;
};

export default {
  getDashboardStats,
  getRecentAlerts,
  getTopThreats,
  getEventDistribution,
  getEventsTrend,
};