import { Router } from 'express';
import { enroll, heartbeat } from '../controllers/agentController.js';
import { authenticateAgent } from '../middleware/authMiddleware.js';
import { rateLimit } from '../middleware/rateLimit.js';
const router = Router();
router.post('/enroll', rateLimit({ windowMs: 15 * 60_000, max: 10 }), enroll);
router.post('/heartbeat', rateLimit({ windowMs: 60_000, max: 120, key: (req) => `agent:${req.get('x-api-key') || req.ip}` }), authenticateAgent, heartbeat);
export default router;
