// ============================================
// SentinelAI - Investigation Service
// ============================================

import api from './api';

export const getInvestigationStats = async () => {
  const response = await api.get('/investigation/stats');
  return response.data;
};

export const getEventsTimeline = async () => {
  const response = await api.get('/investigation/timeline');
  return response.data;
};

export const getRelatedEntities = async () => {
  const response = await api.get('/investigation/entities');
  return response.data;
};

export const searchInvestigation = async (query, searchType) => {
  const response = await api.post('/investigation/search', { query, searchType });
  return response.data;
};

export const getAIFindings = async () => {
  const response = await api.get('/investigation/ai-findings');
  return response.data;
};

export default {
  getInvestigationStats,
  getEventsTimeline,
  getRelatedEntities,
  searchInvestigation,
  getAIFindings,
};