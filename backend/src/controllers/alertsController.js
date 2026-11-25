// ============================================
// SentinelAI - Alerts Controller
// ============================================

import prisma from '../config/prisma.js';

export const getAlertsCount = async (req, res, next) => {
  try {
    const [alertsCount, incidentsCount] = await Promise.all([
      prisma.alert.count({ where: { status: 'NEW' } }),
      prisma.incident.count({
        where: { status: { in: ['OPEN', 'IN_PROGRESS', 'INVESTIGATING'] } },
      }),
    ]);
    res.json({
      status: 'success',
      data: { count: alertsCount + incidentsCount },
    });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await prisma.alert.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        incident: { select: { incidentId: true, title: true, severity: true } },
      },
    });

    const formatted = alerts.map((a) => ({
      id: a.id,
      title: a.title || a.incident?.title || 'Security Alert',
      severity: a.severity,
      status: a.status,
      time: new Date(a.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      incidentId: a.incident?.incidentId,
    }));

    res.json({ status: 'success', data: { alerts: formatted } });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await prisma.alert.updateMany({
      where: { status: 'NEW' },
      data: { status: 'INVESTIGATING' },
    });
    res.json({ status: 'success', message: 'All alerts marked as read' });
  } catch (error) {
    next(error);
  }
};