// ============================================
// SentinelAI - Dashboard Routes
// ============================================

import express from 'express';
import {
  getDashboardStats,
  getRecentAlerts,
  getTopThreats,
  getEventDistribution,
  getEventsTrend,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // جميع المسارات تحتاج مصادقة

router.get('/stats', getDashboardStats);
router.get('/recent-alerts', getRecentAlerts);
router.get('/top-threats', getTopThreats);
router.get('/event-distribution', getEventDistribution);
router.get('/events-trend', getEventsTrend);

export default router;