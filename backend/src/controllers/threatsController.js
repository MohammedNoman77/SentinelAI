// ============================================
// SentinelAI - Threats Controller
// ============================================

import prisma from '../config/prisma.js';

// ============================================
// @desc    Get all threats
// @route   GET /api/threats
// @access  Private
// ============================================
export const getThreats = async (req, res, next) => {
  try {
    const { severity, type, search, limit = 50, offset = 0 } = req.query;

    const where = {};
    if (severity && severity !== 'All') where.severity = severity;
    if (type && type !== 'All') where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { source: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [threats, total] = await Promise.all([
      prisma.threat.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { detectedAt: 'desc' },
      }),
      prisma.threat.count({ where }),
    ]);

    const formatted = threats.map((t) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      severity: t.severity,
      source: t.source,
      status: t.status,
      mitreTactic: t.mitreTactic,
      mitreTechnique: t.mitreTechnique,
      description: t.description,
      detectedAt: new Date(t.detectedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    res.json({
      status: 'success',
      data: {
        threats: formatted,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + threats.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get threat statistics
// @route   GET /api/threats/stats
// @access  Private
// ============================================
export const getThreatStats = async (req, res, next) => {
  try {
    const [total, malware, suspicious, knownThreats, critical] =
      await Promise.all([
        prisma.threat.count(),
        prisma.threat.count({ where: { type: 'Malware' } }),
        prisma.threat.count({ where: { type: 'Suspicious Activity' } }),
        prisma.threat.count({ where: { type: 'Known Threat' } }),
        prisma.threat.count({ where: { severity: 'CRITICAL' } }),
      ]);

    res.json({
      status: 'success',
      data: {
        malware,
        suspicious,
        knownThreats,
        critical,
        total,
        prevented: 412, // ثابت مؤقتاً
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get threats trend (7 days)
// @route   GET /api/threats/trend
// @access  Private
// ============================================
export const getThreatsTrend = async (req, res, next) => {
  try {
    // بيانات تجريبية (يمكن استبدالها ببيانات حقيقية لاحقاً)
    const trend = [
      { date: 'Sep 13', Malware: 32, 'Suspicious Activity': 20, 'Policy Violation': 10, Others: 5 },
      { date: 'Sep 14', Malware: 38, 'Suspicious Activity': 22, 'Policy Violation': 12, Others: 6 },
      { date: 'Sep 15', Malware: 45, 'Suspicious Activity': 28, 'Policy Violation': 14, Others: 7 },
      { date: 'Sep 16', Malware: 52, 'Suspicious Activity': 25, 'Policy Violation': 11, Others: 8 },
      { date: 'Sep 17', Malware: 58, 'Suspicious Activity': 28, 'Policy Violation': 16, Others: 10 },
      { date: 'Sep 18', Malware: 50, 'Suspicious Activity': 26, 'Policy Violation': 15, Others: 9 },
      { date: 'Sep 19', Malware: 42, 'Suspicious Activity': 22, 'Policy Violation': 12, Others: 8 },
      { date: 'Sep 20', Malware: 45, 'Suspicious Activity': 24, 'Policy Violation': 14, Others: 9 },
    ];

    res.json({ status: 'success', data: { trend } });
  } catch (error) {
    next(error);
  }
};