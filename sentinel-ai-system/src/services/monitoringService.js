import api from './api';

export const getMonitoringStats = async () => {
  const res = await api.get('/monitoring/stats');
  return res.data;
};

export const getLiveEvents = async () => {
  const res = await api.get('/monitoring/live-events');
  return res.data;
};

export const getTopEventTypes = async () => {
  const res = await api.get('/monitoring/top-event-types');
  return res.data;
};

export const getEventSourcesMap = async () => {
  const res = await api.get('/monitoring/sources-map');
  return res.data;
};

export default {
  getMonitoringStats,
  getLiveEvents,
  getTopEventTypes,
  getEventSourcesMap,
};