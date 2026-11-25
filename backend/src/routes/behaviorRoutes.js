import express from 'express';
import {
  getBehaviorStats,
  getBehaviorOverview,
  getBehaviorInsights,
  getTopAnomalies,
  getRiskDistribution,
} from '../controllers/behaviorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/stats', getBehaviorStats);
router.get('/overview', getBehaviorOverview);
router.get('/insights', getBehaviorInsights);
router.get('/anomalies', getTopAnomalies);
router.get('/risk-distribution', getRiskDistribution);

export default router;