// ============================================
// SentinelAI - Global Search Controller
// ============================================

import prisma from '../config/prisma.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ status: 'success', data: { results: [] } });
    }

    const query = q.toLowerCase();

    const [incidents, threats, endpoints, users] = await Promise.all([
      prisma.incident.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { incidentId: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.threat.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: 5,
      }),
      prisma.endpoint.findMany({
        where: {
          OR: [
            { hostname: { contains: q, mode: 'insensitive' } },
            { endpointId: { contains: q, mode: 'insensitive' } },
            { ipAddress: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ]);

    const results = [
      ...incidents.map((i) => ({
        type: 'Incident',
        title: i.title,
        subtitle: i.incidentId,
        path: '/alerts',
        severity: i.severity,
      })),
      ...threats.map((t) => ({
        type: 'Threat',
        title: t.name,
        subtitle: t.type,
        path: '/threats',
        severity: t.severity,
      })),
      ...endpoints.map((e) => ({
        type: 'Endpoint',
        title: e.hostname,
        subtitle: e.ipAddress,
        path: '/endpoints',
        severity: e.status,
      })),
      ...users.map((u) => ({
        type: 'User',
        title: u.name,
        subtitle: u.email,
        path: '/dashboard',
        severity: u.role,
      })),
    ];

    res.json({ status: 'success', data: { results, query: q } });
  } catch (error) {
    next(error);
  }
};