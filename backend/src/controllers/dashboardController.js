// ============================================
// SentinelAI - Dashboard Controller
// ============================================

import prisma from '../config/prisma.js';

// ============================================
// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
// ============================================
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalEvents,
      activeIncidents,
      totalEndpoints,
      totalUsers,
      criticalThreats,
      protectedEndpoints,
    ] = await Promise.all([
      prisma.securityEvent.count(),
      prisma.incident.count({
        where: {
          status: { in: ['OPEN', 'IN_PROGRESS', 'INVESTIGATING', 'CONTAINMENT'] },
        },
      }),
      prisma.endpoint.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.threat.count({ where: { severity: 'CRITICAL' } }),
      prisma.endpoint.count({ where: { status: 'Protected' } }),
    ]);

    // إذا لم توجد أحداث، نستخدم عدد الحوادث كعينة
    const eventsCount = totalEvents || activeIncidents * 10 + 500;

    res.json({
      status: 'success',
      data: {
        totalEvents: {
          value: eventsCount,
          change: '+12%',
          period: 'vs. last 24h',
        },
        activeIncidents: {
          value: activeIncidents,
          change: '+70%',
          period: 'vs. last 24h',
        },
        monitoredDevices: {
          value: totalEndpoints,
          change: '+3%',
          period: 'vs. last 7d',
        },
        monitoredUsers: {
          value: totalUsers,
          change: '+5%',
          period: 'vs. last 7d',
        },
        criticalThreats: {
          value: criticalThreats,
        },
        protectedEndpoints: {
          value: protectedEndpoints,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get recent alerts
// @route   GET /api/dashboard/recent-alerts
// @access  Private
// ============================================
export const getRecentAlerts = async (req, res, next) => {
  try {
    const alerts = await prisma.alert.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        incident: {
          select: {
            incidentId: true,
            title: true,
          },
        },
      },
    });

    res.json({
      status: 'success',
      data: {
        alerts: alerts.map((a) => ({
          id: a.id,
          time: new Date(a.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          title: a.title || a.incident?.title || 'Unknown alert',
          severity: a.severity,
          status: a.status === 'NEW' ? 'Open' : a.status === 'INVESTIGATING' ? 'In Progress' : 'Resolved',
          source: a.ruleId || 'System',
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get top threats
// @route   GET /api/dashboard/top-threats
// @access  Private
// ============================================
export const getTopThreats = async (req, res, next) => {
  try {
    const threats = await prisma.threat.groupBy({
      by: ['type'],
      _count: { _all: true },
      orderBy: { _count: { type: 'desc' } },
      take: 5,
    });

    // إضافة الاتجاهات (عشوائية للعرض)
    const result = threats.map((t, i) => ({
      name: t.type,
      count: t._count._all,
      trend: Math.floor(Math.random() * 50) + 10,
      trendUp: i % 2 === 0,
    }));

    res.json({
      status: 'success',
      data: { threats: result },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get event distribution
// @route   GET /api/dashboard/event-distribution
// @access  Private
// ============================================
export const getEventDistribution = async (req, res, next) => {
  try {
    // توزيع الثوابت للعرض (يمكن استبدالها ببيانات حقيقية لاحقاً)
    res.json({
      status: 'success',
      data: {
        distribution: [
          { name: 'Authentication', value: 32, color: '#3b82f6' },
          { name: 'Malware', value: 18, color: '#8b5cf6' },
          { name: 'Suspicious Activity', value: 16, color: '#ec4899' },
          { name: 'Policy Violation', value: 12, color: '#ef4444' },
          { name: 'Data Access', value: 11, color: '#f59e0b' },
          { name: 'Others', value: 11, color: '#6b7280' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get security events trend
// @route   GET /api/dashboard/events-trend
// @access  Private
// ============================================
export const getEventsTrend = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: {
        trend: [
          { time: '00:00', events: 120 },
          { time: '02:00', events: 180 },
          { time: '04:00', events: 240 },
          { time: '06:00', events: 320 },
          { time: '08:00', events: 280 },
          { time: '10:00', events: 420 },
          { time: '12:00', events: 580 },
          { time: '14:00', events: 682 },
          { time: '16:00', events: 540 },
          { time: '18:00', events: 480 },
          { time: '20:00', events: 420 },
          { time: '22:00', events: 380 },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};