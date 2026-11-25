import { Router } from 'express';
import { login, me, password, register, rotateEnrollment } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { rateLimit } from '../middleware/rateLimit.js';
const router = Router();
router.post('/login', rateLimit({ windowMs: 15 * 60_000, max: 10, key: (req) => `login:${req.ip}` }), login);
router.post('/register', rateLimit({ windowMs: 60 * 60_000, max: 5 }), register);
router.get('/me', protect, me); router.post('/enroll-token/rotate', protect, rotateEnrollment); router.post('/password', protect, password);
export default router;
