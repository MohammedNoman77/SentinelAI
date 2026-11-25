// ============================================
// SentinelAI - Notifications Controller
// ============================================

import prisma from '../config/prisma.js';

// ============================================
// @desc    Get unread alerts count
// @route   GET /api/notifications/unread-count
// ============================================
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await prisma.alert.count({
      where: { status: 'NEW' },
    });

    res.json({
      status: 'success',
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get recent notifications
// @route   GET /api/notifications
// ============================================
export const getNotifications = async (req, res, next) => {
  try {
    const alerts = await prisma.alert.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        incident: { select: { incidentId: true, title: true } },
      },
    });

    const formatted = alerts.map((a) => ({
      id: a.id,
      title: a.title || a.incident?.title || 'New alert',
      severity: a.severity,
      status: a.status,
      time: new Date(a.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      incidentId: a.incident?.incidentId,
      isRead: a.status !== 'NEW',
    }));

    res.json({
      status: 'success',
      data: { notifications: formatted },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Mark all alerts as read
// @route   POST /api/notifications/mark-all-read
// ============================================
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await prisma.alert.updateMany({
      where: { status: 'NEW' },
      data: { status: 'INVESTIGATING' },
    });

    res.json({
      status: 'success',
      data: { updated: result.count },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Mark single notification as read
// @route   POST /api/notifications/:id/read
// ============================================
export const markAsRead = async (req, res, next) => {
  try {
    await prisma.alert.update({
      where: { id: req.params.id },
      data: { status: 'INVESTIGATING' },
    });

    res.json({
      status: 'success',
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};