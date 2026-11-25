import express from 'express';
import {
  getResponseStats,
  getIncidentsForResponse,
  getResponseWorkflow,
  getRecommendedActions,
} from '../controllers/responseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/stats', getResponseStats);
router.get('/incidents', getIncidentsForResponse);
router.get('/workflow', getResponseWorkflow);
router.get('/actions', getRecommendedActions);

export default router;