// ============================================
// SentinelAI - Endpoints Service
// ============================================

import api from './api';

export const getEndpoints = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await api.get(`/endpoints?${query}`);
  return response.data;
};

export const getEndpointStats = async () => {
  const response = await api.get('/endpoints/stats');
  return response.data;
};

export const getEndpointHealth = async () => {
  const response = await api.get('/endpoints/health');
  return response.data;
};

export default { getEndpoints, getEndpointStats, getEndpointHealth };