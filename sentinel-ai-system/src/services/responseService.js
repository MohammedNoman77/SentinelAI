import api from './api';

export const getResponseStats = async () => {
  const res = await api.get('/response/stats');
  return res.data;
};

export const getIncidentsForResponse = async () => {
  const res = await api.get('/response/incidents');
  return res.data;
};

export const getResponseWorkflow = async () => {
  const res = await api.get('/response/workflow');
  return res.data;
};

export const getRecommendedActions = async () => {
  const res = await api.get('/response/actions');
  return res.data;
};

export default {
  getResponseStats,
  getIncidentsForResponse,
  getResponseWorkflow,
  getRecommendedActions,
};