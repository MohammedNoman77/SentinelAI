import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { handleIngestEvent } from '../controllers/eventsController.js';

const router = express.Router();

router.post('/ingest', authenticate, handleIngestEvent);

export default router;
