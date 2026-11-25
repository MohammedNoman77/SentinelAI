// ============================================
// SentinelAI - Behavior Service
// طبقة الاتصال بواجهة تحليل السلوك
// ============================================

import api from "./api";

/**
 * إنشاء دالة طلب GET موحّدة تُعيد res.data مباشرة
 * وتتعامل مع الأخطاء بشكل موحّد
 */
const fetchBehavior = (endpoint) => async () => {
  try {
    const res = await api.get(`/behavior/${endpoint}`);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      `Failed to fetch behavior data: ${endpoint}`;
    console.error(`[behaviorService] ${endpoint}:`, message);
    throw new Error(message);
  }
};

// ============================================
// API Endpoints
// ============================================
export const getBehaviorStats = fetchBehavior("stats");
export const getBehaviorOverview = fetchBehavior("overview");
export const getBehaviorInsights = fetchBehavior("insights");
export const getTopAnomalies = fetchBehavior("anomalies");
export const getRiskDistribution = fetchBehavior("risk-distribution");

export default {
  getBehaviorStats,
  getBehaviorOverview,
  getBehaviorInsights,
  getTopAnomalies,
  getRiskDistribution,
};
