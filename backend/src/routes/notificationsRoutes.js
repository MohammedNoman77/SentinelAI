// ============================================
// SentinelAI - Notifications Routes
// ============================================

import express from 'express';
import {
  getUnreadCount,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from '../controllers/notificationsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.post('/mark-all-read', markAllAsRead);
router.post('/:id/read', markAsRead);

export default router;