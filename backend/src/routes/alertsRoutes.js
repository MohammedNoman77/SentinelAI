// ============================================
// SentinelAI - Alerts Routes
// ============================================

import express from 'express';
import {
  getAlertsCount,
  getAlerts,
  markAllAsRead,
} from '../controllers/alertsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/count', getAlertsCount);
router.get('/', getAlerts);
router.post('/mark-all-read', markAllAsRead);

export default router;