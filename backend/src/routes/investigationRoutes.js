// ============================================
// SentinelAI - Investigation Routes
// ============================================

import express from 'express';
import {
  getInvestigationStats,
  getEventsTimeline,
  getRelatedEntities,
  searchInvestigation,
  getAIFindings,
} from '../controllers/investigationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getInvestigationStats);
router.get('/timeline', getEventsTimeline);
router.get('/entities', getRelatedEntities);
router.post('/search', searchInvestigation);
router.get('/ai-findings', getAIFindings);

export default router;