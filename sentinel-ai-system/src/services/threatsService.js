// ============================================
// SentinelAI - Threats Service
// ============================================

import api from './api';

export const getThreats = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await api.get(`/threats?${query}`);
  return response.data;
};

export const getThreatStats = async () => {
  const response = await api.get('/threats/stats');
  return response.data;
};

export const getThreatsTrend = async () => {
  const response = await api.get('/threats/trend');
  return response.data;
};

export default { getThreats, getThreatStats, getThreatsTrend };