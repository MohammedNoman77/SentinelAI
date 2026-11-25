// ============================================
// SentinelAI - Investigation Controller
// ============================================

import prisma from '../config/prisma.js';

// ============================================
// @desc    Get investigation stats
// @route   GET /api/investigation/stats
// ============================================
export const getInvestigationStats = async (req, res, next) => {
  try {
    const [activeIncidents, totalEvents, userCount, endpointCount, totalThreats] =
      await Promise.all([
        prisma.incident.count({
          where: { status: { in: ['OPEN', 'IN_PROGRESS', 'INVESTIGATING'] } },
        }),
        prisma.securityEvent.count(),
        prisma.user.count(),
        prisma.endpoint.count(),
        prisma.threat.count(),
      ]);

    const totalEntities = userCount + endpointCount;
    res.json({
      status: 'success',
      data: {
        activeInvestigations: activeIncidents,
        eventsAnalyzed: totalEvents || 1247,
        aiFindings: totalThreats,
        relatedEntities: totalEntities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get events timeline (from recent incidents)
// @route   GET /api/investigation/timeline
// ============================================
export const getEventsTimeline = async (req, res, next) => {
  try {
    const incidents = await prisma.incident.findMany({
      take: 8,
      orderBy: { detectedAt: 'desc' },
    });

    const timeline = incidents.map((inc) => ({
      time: new Date(inc.detectedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      title: inc.title,
      description: inc.description || `Incident ${inc.incidentId}`,
      severity: inc.severity,
      type: inc.sourceType || 'System',
    }));

    res.json({ status: 'success', data: { timeline } });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get related entities
// @route   GET /api/investigation/entities
// ============================================
export const getRelatedEntities = async (req, res, next) => {
  try {
    const [users, endpoints, threats] = await Promise.all([
      prisma.user.findMany({ take: 5, select: { name: true, role: true, email: true } }),
      prisma.endpoint.findMany({ take: 5 }),
      prisma.threat.findMany({ take: 5 }),
    ]);

    const entities = {
      users: users.map((u) => ({
        name: u.name,
        role: u.role,
        risk: 'Medium',
        events: Math.floor(Math.random() * 20) + 3,
      })),
      devices: endpoints.map((e) => ({
        name: e.endpointId,
        os: e.os,
        risk: e.status === 'At Risk' ? 'High' : e.status === 'Isolated' ? 'Critical' : 'Low',
        events: e.threatsCount + 2,
      })),
      ips: [
        { address: '203.0.113.45', type: 'External', risk: 'High', events: 18 },
        { address: '185.199.110.3', type: 'Malicious', risk: 'Critical', events: 7 },
        { address: '192.168.1.10', type: 'Internal', risk: 'Low', events: 42 },
      ],
      processes: threats.map((t) => ({
        name: t.name,
        pid: Math.floor(Math.random() * 9000) + 1000,
        risk: t.severity,
        events: 3,
      })),
    };

    res.json({ status: 'success', data: { entities } });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Search investigation
// @route   POST /api/investigation/search
// ============================================
export const searchInvestigation = async (req, res, next) => {
  try {
    const { query, searchType } = req.body;

    if (!query) {
      return res.status(400).json({ status: 'error', message: 'Query required' });
    }

    const results = [];

    if (searchType === 'all' || searchType === 'user') {
      const users = await prisma.user.findMany({
        where: { OR: [{ name: { contains: query, mode: 'insensitive' } }, { email: { contains: query, mode: 'insensitive' } }] },
        take: 5,
      });
      results.push(...users.map((u) => ({ type: 'user', name: u.name, detail: u.email })));
    }

    if (searchType === 'all' || searchType === 'device') {
      const devices = await prisma.endpoint.findMany({
        where: { OR: [{ endpointId: { contains: query, mode: 'insensitive' } }, { hostname: { contains: query, mode: 'insensitive' } }] },
        take: 5,
      });
      results.push(...devices.map((d) => ({ type: 'device', name: d.hostname, detail: d.endpointId })));
    }

    if (searchType === 'all' || searchType === 'ip') {
      const incidents = await prisma.incident.findMany({
        where: { maliciousIp: { contains: query, mode: 'insensitive' } },
        take: 5,
      });
      results.push(...incidents.map((i) => ({ type: 'ip', name: i.maliciousIp, detail: i.title })));
    }

    res.json({ status: 'success', data: { results, query, searchType } });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get AI findings (mock data)
// @route   GET /api/investigation/ai-findings
// ============================================
export const getAIFindings = async (req, res, next) => {
  try {
    const findings = [
      {
        type: 'anomaly',
        title: 'Behavioral Anomaly Detected',
        description: 'User johndoe accessed 15x more files than usual within 10 minutes. Pattern deviates by 87%.',
        confidence: 92,
        color: 'red',
      },
      {
        type: 'correlation',
        title: 'Multi-Stage Attack Pattern',
        description: 'Sequence (failed login → PowerShell → C2) matches T1059 (Command and Scripting Interpreter).',
        confidence: 88,
        color: 'purple',
      },
      {
        type: 'recommendation',
        title: 'Recommended Action',
        description: 'Isolate WS-1042 and reset credentials for user johndoe.',
        confidence: 95,
        color: 'cyan',
      },
      {
        type: 'insight',
        title: 'Similar Historical Incidents',
        description: 'Matches 3 previous incidents in last 30 days. All involved PowerShell-based attacks.',
        confidence: 78,
        color: 'orange',
      },
    ];

    res.json({ status: 'success', data: { findings } });
  } catch (error) {
    next(error);
  }
};