import express from 'express';
import {
  getMonitoringStats,
  getLiveEvents,
  getTopEventTypes,
  getEventSourcesMap,
} from '../controllers/monitoringController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/stats', getMonitoringStats);
router.get('/live-events', getLiveEvents);
router.get('/top-event-types', getTopEventTypes);
router.get('/sources-map', getEventSourcesMap);

export default router;