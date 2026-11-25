// ============================================
// SentinelAI - Agent Controller
// يستقبل الأحداث من الـ Agent على الجهاز
// ============================================

import crypto from 'crypto';
import prisma from '../config/prisma.js';

// ============================================
// @desc    Register new device
// @route   POST /api/agent/register
// @access  Private (User logged in)
// ============================================
export const registerDevice = async (req, res, next) => {
  try {
    const { name, type, os, osVersion, hostname, ipAddress, macAddress } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Device name is required' });
    }

    const apiKey = `sat_${crypto.randomBytes(32).toString('hex')}`;

    const device = await prisma.device.create({
      data: {
        userId,
        name,
        type: type || 'DESKTOP',
        os,
        osVersion,
        hostname,
        ipAddress,
        macAddress,
        apiKey,
        agentInstalled: false,
      },
    });

    await prisma.recommendation.create({
      data: {
        userId,
        deviceId: device.id,
        title: 'Install SentinelAI Agent',
        description: `Download and run the agent on ${device.name} to start monitoring.`,
        priority: 'HIGH',
        category: 'SETUP',
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        device: {
          id: device.id,
          name: device.name,
          type: device.type,
          apiKey: device.apiKey,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get all devices
// @route   GET /api/agent/devices
// @access  Private
// ============================================
export const getDevices = async (req, res, next) => {
  try {
    const devices = await prisma.device.findMany({
      where: { userId: req.user.id, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { events: true, anomalies: true, alerts: true },
        },
      },
    });

    const formatted = devices.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      os: d.os,
      osVersion: d.osVersion,
      hostname: d.hostname,
      ipAddress: d.ipAddress,
      status: d.status,
      riskScore: d.riskScore,
      agentInstalled: d.agentInstalled,
      agentVersion: d.agentVersion,
      lastHeartbeat: d.lastHeartbeat,
      lastSeen: d.lastSeen,
      eventsCount: d._count.events,
      anomaliesCount: d._count.anomalies,
      alertsCount: d._count.alerts,
      apiKey: d.apiKey,
    }));

    res.json({ status: 'success', data: { devices: formatted } });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Agent heartbeat
// @route   POST /api/agent/heartbeat
// @access  Agent (via API Key)
// ============================================
export const heartbeat = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ status: 'error', message: 'No API key' });
    }

    const device = await prisma.device.findUnique({ where: { apiKey } });
    if (!device) {
      return res.status(401).json({ status: 'error', message: 'Invalid API key' });
    }

    const { agentVersion, os, osVersion, hostname, ipAddress } = req.body;

    await prisma.device.update({
      where: { id: device.id },
      data: {
        lastHeartbeat: new Date(),
        lastSeen: new Date(),
        status: 'ONLINE',
        agentInstalled: true,
        agentVersion: agentVersion || device.agentVersion,
        os: os || device.os,
        osVersion: osVersion || device.osVersion,
        hostname: hostname || device.hostname,
        ipAddress: ipAddress || device.ipAddress,
      },
    });

    res.json({ status: 'success', message: 'Heartbeat received' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Ingest events from agent
// @route   POST /api/agent/events
// @access  Agent (via API Key)
// ============================================
export const ingestEvents = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ status: 'error', message: 'No API key' });
    }

    const device = await prisma.device.findUnique({ where: { apiKey } });
    if (!device) {
      return res.status(401).json({ status: 'error', message: 'Invalid API key' });
    }

    const { events } = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      return res.json({ status: 'success', data: { saved: 0 } });
    }

    const savedEvents = await Promise.all(
      events.map((evt) =>
        prisma.securityEvent.create({
          data: {
            userId: device.userId,
            deviceId: device.id,
            category: evt.category || 'SYSTEM',
            eventType: evt.eventType || 'unknown',
            severity: evt.severity || 'LOW',
            title: evt.title || 'Unknown event',
            description: evt.description,
            sourceIp: evt.sourceIp,
            destinationIp: evt.destinationIp,
            destinationPort: evt.destinationPort,
            userAccount: evt.userAccount,
            processName: evt.processName,
            processPath: evt.processPath,
            processId: evt.processId,
            fileName: evt.fileName,
            metadata: evt.metadata,
            timestamp: evt.timestamp ? new Date(evt.timestamp) : new Date(),
          },
        })
      )
    );

    await prisma.device.update({
      where: { id: device.id },
      data: { lastSeen: new Date(), lastHeartbeat: new Date(), status: 'ONLINE' },
    });

    res.json({
      status: 'success',
      data: { saved: savedEvents.length },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Delete device
// @route   DELETE /api/agent/devices/:id
// @access  Private
// ============================================
export const deleteDevice = async (req, res, next) => {
  try {
    const device = await prisma.device.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!device) {
      return res.status(404).json({ status: 'error', message: 'Device not found' });
    }

    await prisma.device.update({
      where: { id: device.id },
      data: { isActive: false },
    });

    res.json({ status: 'success', message: 'Device removed' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get agent stats
// @route   GET /api/agent/stats
// @access  Private
// ============================================
export const getAgentStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [devices, events, anomalies, alerts, recommendations] = await Promise.all([
      prisma.device.count({ where: { userId, isActive: true } }),
      prisma.securityEvent.count({ where: { userId } }),
      prisma.anomaly.count({ where: { userId, status: 'NEW' } }),
      prisma.alert.count({ where: { userId, status: 'NEW' } }),
      prisma.recommendation.count({ where: { userId, isCompleted: false, isDismissed: false } }),
    ]);

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const events24h = await prisma.securityEvent.count({
      where: { userId, timestamp: { gte: last24h } },
    });

    res.json({
      status: 'success',
      data: {
        devices,
        events,
        events24h,
        anomalies,
        alerts,
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};