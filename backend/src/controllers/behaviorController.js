// ============================================
// SentinelAI - Behavior Controller
// ============================================

import prisma from '../config/prisma.js';

export const getBehaviorStats = async (req, res, next) => {
  try {
    const [users, endpoints, threats] = await Promise.all([
      prisma.user.count(),
      prisma.endpoint.count(),
      prisma.threat.count(),
    ]);

    res.json({
      status: 'success',
      data: {
        monitoredUsers: users,
        monitoredDevices: endpoints,
        anomaliesDetected: threats,
        highRiskUsers: 17,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBehaviorOverview = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: {
        trend: [
          { date: 'Sep 13', normal: 65, suspicious: 25, anomalies: 8 },
          { date: 'Sep 14', normal: 80, suspicious: 45, anomalies: 12 },
          { date: 'Sep 15', normal: 55, suspicious: 30, anomalies: 5 },
          { date: 'Sep 16', normal: 75, suspicious: 40, anomalies: 10 },
          { date: 'Sep 17', normal: 90, suspicious: 50, anomalies: 35 },
          { date: 'Sep 18', normal: 70, suspicious: 35, anomalies: 8 },
          { date: 'Sep 19', normal: 60, suspicious: 28, anomalies: 6 },
          { date: 'Sep 20', normal: 72, suspicious: 32, anomalies: 9 },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBehaviorInsights = async (req, res, next) => {
  try {
    const users = await prisma.user.count();
    res.json({
      status: 'success',
      data: {
        totalUsers: users,
        distribution: [
          { name: 'Normal', value: 68, color: '#06b6d4' },
          { name: 'Low Risk', value: 18, color: '#10b981' },
          { name: 'Medium Risk', value: 10, color: '#f59e0b' },
          { name: 'High Risk', value: 4, color: '#ef4444' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTopAnomalies = async (req, res, next) => {
  try {
    const threats = await prisma.threat.groupBy({
      by: ['type'],
      _count: { _all: true },
    });

    const anomalies = [
      { name: 'Unusual Login Time', count: 342, trend: 45 },
      { name: 'Access from New Location', count: 287, trend: 28 },
      { name: 'Abnormal File Access', count: 198, trend: 36 },
      { name: 'Unusual Data Transfer', count: 124, trend: 22 },
      { name: 'Privilege Escalation', count: 96, trend: 18 },
    ];

    res.json({ status: 'success', data: { anomalies } });
  } catch (error) {
    next(error);
  }
};

export const getRiskDistribution = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: {
        distribution: [
          { level: 'Low', count: 312, color: '#3b82f6' },
          { level: 'Medium', count: 198, color: '#f59e0b' },
          { level: 'High', count: 87, color: '#ef4444' },
          { level: 'Critical', count: 24, color: '#dc2626' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};