// ============================================
// SentinelAI - Endpoints Routes
// ============================================

import express from 'express';
import {
  getEndpoints,
  getEndpointStats,
  getEndpointHealth,
  isolateEndpoint,
  restoreEndpoint,
} from '../controllers/endpointsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', getEndpoints);
router.get('/stats', getEndpointStats);
router.get('/health', getEndpointHealth);

// عزل/استعادة - فقط Responder و Admin
router.post('/:id/isolate', authorize('INCIDENT_RESPONDER', 'SYSTEM_ADMIN'), isolateEndpoint);
router.post('/:id/restore', authorize('INCIDENT_RESPONDER', 'SYSTEM_ADMIN'), restoreEndpoint);

export default router;