// ============================================
// SentinelAI - Incidents Controller
// ============================================

import prisma from '../config/prisma.js';

// ============================================
// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private
// ============================================
export const getIncidents = async (req, res, next) => {
  try {
    const {
      status,
      severity,
      search,
      limit = 50,
      offset = 0,
    } = req.query;

    // بناء شرط البحث
    const where = {};

    if (status && status !== 'All') {
      where.status = status;
    }

    if (severity && severity !== 'All') {
      where.severity = severity;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { incidentId: { contains: search, mode: 'insensitive' } },
        { affectedUser: { contains: search, mode: 'insensitive' } },
        { affectedDevice: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { detectedAt: 'desc' },
        include: {
          assignee: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),
      prisma.incident.count({ where }),
    ]);

    // تحويل البيانات للواجهة
    const formatted = incidents.map((inc) => ({
      id: inc.incidentId,
      dbId: inc.id,
      title: inc.title,
      description: inc.description,
      severity: inc.severity,
      status: inc.status,
      source: inc.sourceType || 'System',
      date: new Date(inc.detectedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: new Date(inc.detectedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      affectedDevice: inc.affectedDevice,
      affectedUser: inc.affectedUser,
      maliciousIp: inc.maliciousIp,
      fileHash: inc.fileHash,
      threatType: inc.threatType,
      mitreTactic: inc.mitreTactic,
      mitreTechnique: inc.mitreTechnique,
      assignee: inc.assignee,
    }));

    res.json({
      status: 'success',
      data: {
        incidents: formatted,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + incidents.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single incident
// @route   GET /api/incidents/:id
// @access  Private
// ============================================
export const getIncident = async (req, res, next) => {
  try {
    const incident = await prisma.incident.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { incidentId: req.params.id },
        ],
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true },
        },
        alerts: true,
        timeline: {
          orderBy: { time: 'desc' },
          take: 20,
        },
        evidence: true,
      },
    });

    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found',
      });
    }

    res.json({
      status: 'success',
      data: { incident },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get incident statistics
// @route   GET /api/incidents/stats
// @access  Private
// ============================================
export const getIncidentStats = async (req, res, next) => {
  try {
    const [
      total,
      critical,
      high,
      inProgress,
      resolved,
    ] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({ where: { severity: 'CRITICAL' } }),
      prisma.incident.count({ where: { severity: 'HIGH' } }),
      prisma.incident.count({
        where: { status: { in: ['IN_PROGRESS', 'INVESTIGATING', 'CONTAINMENT'] } },
      }),
      prisma.incident.count({ where: { status: 'RESOLVED' } }),
    ]);

    res.json({
      status: 'success',
      data: {
        total,
        critical,
        high,
        inProgress,
        resolved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update incident status
// @route   PATCH /api/incidents/:id/status
// @access  Private
// ============================================
export const updateIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status is required',
      });
    }

    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'RESOLVED' ? { resolvedAt: new Date() } : {}),
      },
    });

    res.json({
      status: 'success',
      data: { incident },
    });
  } catch (error) {
    next(error);
  }
};