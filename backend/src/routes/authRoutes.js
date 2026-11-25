// ============================================
// SentinelAI - Authentication Routes
// ============================================

import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Private Routes
router.get('/me', protect, getMe);

export default router;