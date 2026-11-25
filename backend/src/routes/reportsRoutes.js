// ============================================
// SentinelAI - Reports Routes
// ============================================

import express from 'express';
import {
  getReports,
  getReportStats,
  getReportInsights,
  downloadReport,
  generateReport,
} from '../controllers/reportsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', getReports);
router.get('/stats', getReportStats);
router.get('/insights', getReportInsights);
router.get('/:id/download', downloadReport);
router.post('/', generateReport);

export default router;