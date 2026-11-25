import api from './api';

export const getReports = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/reports?${query}`);
  return res.data;
};

export const getReportStats = async () => {
  const res = await api.get('/reports/stats');
  return res.data;
};

export const getReportInsights = async () => {
  const res = await api.get('/reports/insights');
  return res.data;
};

export default { getReports, getReportStats, getReportInsights };