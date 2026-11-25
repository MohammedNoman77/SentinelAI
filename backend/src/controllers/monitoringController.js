// ============================================
// SentinelAI - Monitoring Controller
// ============================================

import prisma from '../config/prisma.js';

export const getMonitoringStats = async (req, res, next) => {
  try {
    const [threats, incidents, endpoints, users] = await Promise.all([
      prisma.threat.count(),
      prisma.incident.count(),
      prisma.endpoint.count(),
      prisma.user.count(),
    ]);

    res.json({
      status: 'success',
      data: {
        events24h: threats * 100 + incidents * 50 + 500,
        suspiciousEvents: threats * 10 + 243,
        uniqueSources: users * 10 + endpoints * 50,
        activeDevices: endpoints,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLiveEvents = async (req, res, next) => {
  try {
    const incidents = await prisma.incident.findMany({
      take: 10,
      orderBy: { detectedAt: 'desc' },
      include: { assignee: { select: { name: true } } },
    });

    const events = incidents.map((inc) => ({
      time: new Date(inc.detectedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      type: inc.title.length > 25 ? inc.title.substring(0, 25) + '...' : inc.title,
      source: inc.maliciousIp || inc.affectedDevice || 'System',
      destination: inc.affectedDevice || 'Internal',
      user: inc.affectedUser || '—',
      severity: inc.severity,
      details: inc.threatType || inc.sourceType || 'Security event',
    }));

    res.json({ status: 'success', data: { events } });
  } catch (error) {
    next(error);
  }
};

export const getTopEventTypes = async (req, res, next) => {
  try {
    const data = [
      { name: 'Failed Login', value: 32, color: '#3b82f6' },
      { name: 'Malware Detection', value: 18, color: '#ef4444' },
      { name: 'Suspicious Activity', value: 16, color: '#f59e0b' },
      { name: 'Policy Violation', value: 12, color: '#a855f7' },
      { name: 'Data Access', value: 11, color: '#8b5cf6' },
      { name: 'Others', value: 11, color: '#6b7280' },
    ];

    res.json({ status: 'success', data: { distribution: data } });
  } catch (error) {
    next(error);
  }
};

export const getEventSourcesMap = async (req, res, next) => {
  try {
    const sources = [
      { country: 'United States', ip: '203.0.113.45', events: 24, level: 'high', x: 22, y: 38 },
      { country: 'Germany', ip: '185.199.110.3', events: 18, level: 'high', x: 52, y: 32 },
      { country: 'China', ip: '112.5.44.21', events: 15, level: 'medium', x: 78, y: 42 },
      { country: 'Brazil', ip: '177.54.10.8', events: 12, level: 'medium', x: 32, y: 68 },
      { country: 'India', ip: '49.36.22.11', events: 9, level: 'low', x: 68, y: 52 },
      { country: 'Russia', ip: '95.163.212.5', events: 7, level: 'low', x: 62, y: 22 },
    ];

    res.json({ status: 'success', data: { sources } });
  } catch (error) {
    next(error);
  }
};