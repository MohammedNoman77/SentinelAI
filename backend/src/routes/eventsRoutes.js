import express from 'express';
import { protect, authenticateAgent } from '../middleware/authMiddleware.js';
import { handleIngestEvent } from '../controllers/eventsController.js';

const router = express.Router();

const authenticateDashboardOrAgent = (req, res, next) => {
  if (req.headers['x-api-key']) {
    return authenticateAgent(req, res, next);
  }
  return protect(req, res, next);
};

router.post('/ingest', authenticateDashboardOrAgent, handleIngestEvent);

export default router;
