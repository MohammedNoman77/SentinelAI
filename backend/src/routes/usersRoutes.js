// ============================================
// SentinelAI - Users Routes
// ============================================

import express from 'express';
import {
  getUsers,
  getUserStats,
  getUser,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
  getRolesDistribution,
} from '../controllers/usersController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// جميع المسارات تتطلب تسجيل دخول + صلاحية System Admin
router.use(protect);
router.use(authorize('SYSTEM_ADMIN'));

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.get('/roles-distribution', getRolesDistribution);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.post('/:id/reset-password', resetPassword);
router.delete('/:id', deleteUser);

export default router;