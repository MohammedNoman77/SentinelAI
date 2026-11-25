// ============================================
// SentinelAI - Agent Routes
// ============================================

import express from 'express';
import {
  registerDevice,
  getDevices,
  heartbeat,
  ingestEvents,
  deleteDevice,
} from '../controllers/agentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// مسارات المستخدم (تتطلب تسجيل دخول)
router.post('/register', protect, registerDevice);
router.get('/devices', protect, getDevices);
router.delete('/devices/:id', protect, deleteDevice);

// مسارات الـ Agent (تتطلب API Key)
router.post('/heartbeat', heartbeat);
router.post('/events', ingestEvents);

export default router;