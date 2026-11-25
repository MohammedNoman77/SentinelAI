// ============================================
// SentinelAI - Endpoints Controller
// ============================================

import prisma from '../config/prisma.js';

export const getEndpoints = async (req, res, next) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    const where = {};

    if (status && status !== 'All' && status !== 'All Endpoints') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { endpointId: { contains: search, mode: 'insensitive' } },
        { hostname: { contains: search, mode: 'insensitive' } },
        { user: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [endpoints, total] = await Promise.all([
      prisma.endpoint.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { lastSeen: 'desc' },
      }),
      prisma.endpoint.count({ where }),
    ]);

    const formatted = endpoints.map((e) => ({
      id: e.endpointId,
      dbId: e.id,
      hostname: e.hostname,
      os: e.os,
      ip: e.ipAddress,
      user: e.user,
      status: e.status,
      threats: e.threatsCount,
      agentVersion: e.agentVersion,
      lastSeen: formatLastSeen(e.lastSeen),
    }));

    res.json({
      status: 'success',
      data: {
        endpoints: formatted,
        pagination: { total, limit: parseInt(limit), offset: parseInt(offset) },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEndpointStats = async (req, res, next) => {
  try {
    const [total, protectedCount, atRisk, isolated] = await Promise.all([
      prisma.endpoint.count(),
      prisma.endpoint.count({ where: { status: 'Protected' } }),
      prisma.endpoint.count({ where: { status: 'At Risk' } }),
      prisma.endpoint.count({ where: { status: 'Isolated' } }),
    ]);

    res.json({
      status: 'success',
      data: { total, protected: protectedCount, atRisk, isolated },
    });
  } catch (error) {
    next(error);
  }
};

export const getEndpointHealth = async (req, res, next) => {
  try {
    const [total, protectedCount, atRisk, isolated, offline] = await Promise.all([
      prisma.endpoint.count(),
      prisma.endpoint.count({ where: { status: 'Protected' } }),
      prisma.endpoint.count({ where: { status: 'At Risk' } }),
      prisma.endpoint.count({ where: { status: 'Isolated' } }),
      prisma.endpoint.count({ where: { status: 'Offline' } }),
    ]);

    const calc = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

    res.json({
      status: 'success',
      data: {
        total,
        distribution: [
          { name: 'Protected', value: calc(protectedCount), count: protectedCount, color: '#10b981' },
          { name: 'At Risk', value: calc(atRisk), count: atRisk, color: '#f59e0b' },
          { name: 'Isolated', value: calc(isolated), count: isolated, color: '#ef4444' },
          { name: 'Offline', value: calc(offline), count: offline, color: '#6b7280' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// عزل جهاز
// ============================================
export const isolateEndpoint = async (req, res, next) => {
  try {
    const endpoint = await prisma.endpoint.findFirst({
      where: {
        OR: [{ id: req.params.id }, { endpointId: req.params.id }],
      },
    });

    if (!endpoint) {
      return res.status(404).json({ status: 'error', message: 'Endpoint not found' });
    }

    const updated = await prisma.endpoint.update({
      where: { id: endpoint.id },
      data: { status: 'Isolated', lastSeen: new Date() },
    });

    // تسجيل العملية في AuditLog
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'ISOLATE_ENDPOINT',
        resource: endpoint.endpointId,
        details: { hostname: endpoint.hostname, previousStatus: endpoint.status },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      status: 'success',
      message: `Endpoint ${endpoint.endpointId} isolated successfully`,
      data: { endpoint: updated },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// استعادة جهاز
// ============================================
export const restoreEndpoint = async (req, res, next) => {
  try {
    const endpoint = await prisma.endpoint.findFirst({
      where: {
        OR: [{ id: req.params.id }, { endpointId: req.params.id }],
      },
    });

    if (!endpoint) {
      return res.status(404).json({ status: 'error', message: 'Endpoint not found' });
    }

    const updated = await prisma.endpoint.update({
      where: { id: endpoint.id },
      data: { status: 'Protected', lastSeen: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'RESTORE_ENDPOINT',
        resource: endpoint.endpointId,
        details: { hostname: endpoint.hostname, previousStatus: endpoint.status },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      status: 'success',
      message: `Endpoint ${endpoint.endpointId} restored successfully`,
      data: { endpoint: updated },
    });
  } catch (error) {
    next(error);
  }
};

function formatLastSeen(date) {
  if (!date) return 'Unknown';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}