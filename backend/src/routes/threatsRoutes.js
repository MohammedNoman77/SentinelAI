// ============================================
// SentinelAI - Threats Routes
// ============================================

import express from 'express';
import {
  getThreats,
  getThreatStats,
  getThreatsTrend,
} from '../controllers/threatsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getThreats);
router.get('/stats', getThreatStats);
router.get('/trend', getThreatsTrend);

export default router;