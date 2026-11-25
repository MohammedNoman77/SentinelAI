// ============================================
// SentinelAI - Incident Response Controller
// ============================================

import prisma from '../config/prisma.js';

export const getResponseStats = async (req, res, next) => {
  try {
    const [active, contained, inRemediation, resolved] = await Promise.all([
      prisma.incident.count({
        where: { status: { in: ['OPEN', 'IN_PROGRESS', 'INVESTIGATING'] } },
      }),
      prisma.incident.count({ where: { status: 'CONTAINMENT' } }),
      prisma.incident.count({ where: { status: 'INVESTIGATING' } }),
      prisma.incident.count({ where: { status: 'RESOLVED' } }),
    ]);

    res.json({
      status: 'success',
      data: { active, contained, inRemediation, resolved },
    });
  } catch (error) {
    next(error);
  }
};

export const getIncidentsForResponse = async (req, res, next) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: {
        status: {
          in: ['OPEN', 'IN_PROGRESS', 'INVESTIGATING', 'CONTAINMENT'],
        },
      },
      take: 20,
      orderBy: { detectedAt: 'desc' },
      include: {
        assignee: { select: { name: true, avatar: true } },
      },
    });

    const formatted = incidents.map((inc) => ({
      id: inc.incidentId,
      dbId: inc.id,
      title: inc.title,
      type: inc.threatType || inc.sourceType || 'General',
      severity: inc.severity,
      status: inc.status,
      detectedAt: new Date(inc.detectedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      assignee: inc.assignee,
    }));

    res.json({
      status: 'success',
      data: { incidents: formatted, total: formatted.length },
    });
  } catch (error) {
    next(error);
  }
};

export const getResponseWorkflow = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: {
        incidentId: 'INC-2026-1041',
        steps: [
          { id: 1, name: 'Identify', status: 'Completed', time: 'Sep 20, 10:14 AM' },
          { id: 2, name: 'Contain', status: 'In Progress', time: 'Started 10:28 AM' },
          { id: 3, name: 'Eradicate', status: 'Pending', time: null },
          { id: 4, name: 'Recover', status: 'Pending', time: null },
          { id: 5, name: 'Close', status: 'Pending', time: null },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendedActions = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: {
        actions: [
          { id: 1, icon: 'lock', label: 'Isolate affected endpoint', detail: 'WS-1042', status: 'pending' },
          { id: 2, icon: 'shield', label: 'Block malicious IP', detail: '185.199.110.3', status: 'pending' },
          { id: 3, icon: 'trash', label: 'Terminate malicious process', detail: 'powershell.exe (PID: 4821)', status: 'pending' },
          { id: 4, icon: 'key', label: 'Reset user credentials', detail: 'ahmed.s', status: 'pending' },
          { id: 5, icon: 'search', label: 'Search for similar activity', detail: 'Across all endpoints', status: 'pending' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};