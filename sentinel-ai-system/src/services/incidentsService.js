// ============================================
// SentinelAI - Incidents Service
// ============================================

import api from './api';

export const getIncidents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await api.get(`/incidents?${query}`);
  return response.data;
};

export const getIncident = async (id) => {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
};

export const getIncidentStats = async () => {
  const response = await api.get('/incidents/stats');
  return response.data;
};

export const updateIncidentStatus = async (id, status) => {
  const response = await api.patch(`/incidents/${id}/status`, { status });
  return response.data;
};

export default {
  getIncidents,
  getIncident,
  getIncidentStats,
  updateIncidentStatus,
};
