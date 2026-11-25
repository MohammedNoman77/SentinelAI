// ============================================
// SentinelAI - Incidents Routes
// ============================================

import express from 'express';
import {
  getIncidents,
  getIncident,
  getIncidentStats,
  updateIncidentStatus,
} from '../controllers/incidentsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getIncidents);
router.get('/stats', getIncidentStats);
router.get('/:id', getIncident);
router.patch('/:id/status', updateIncidentStatus);

export default router;