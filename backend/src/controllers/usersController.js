// ============================================
// SentinelAI - Users Controller
// إدارة المستخدمين والأدوار
// UC-05-02: Manage User Accounts and Roles
// ============================================

import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

// ============================================
// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
// ============================================
export const getUsers = async (req, res, next) => {
  try {
    const { role, status, search, limit = 100, offset = 0 } = req.query;

    const where = {};

    if (role && role !== 'All') {
      where.role = role;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          nameAr: true,
          role: true,
          avatar: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      nameAr: u.nameAr,
      role: u.role,
      avatar: u.avatar,
      isActive: u.isActive,
      lastLogin: u.lastLogin
        ? new Date(u.lastLogin).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Never',
      createdAt: new Date(u.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }));

    res.json({
      status: 'success',
      data: {
        users: formatted,
        pagination: { total, limit: parseInt(limit), offset: parseInt(offset) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin only)
// ============================================
export const getUserStats = async (req, res, next) => {
  try {
    const [total, active, inactive, admins, analysts, responders] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: 'SYSTEM_ADMIN' } }),
      prisma.user.count({ where: { role: 'SOC_ANALYST' } }),
      prisma.user.count({ where: { role: 'INCIDENT_RESPONDER' } }),
    ]);

    res.json({
      status: 'success',
      data: { total, active, inactive, admins, analysts, responders },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin only)
// ============================================
export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        nameAr: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin only)
// ============================================
export const createUser = async (req, res, next) => {
  try {
    const { email, password, name, nameAr, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, password, and name are required',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatar = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        nameAr: nameAr || null,
        role: role || 'EMPLOYEE',
        avatar,
        isActive: true,
      },
    });

    // تسجيل العملية
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE_USER',
        resource: user.id,
        details: { email: user.email, name: user.name, role: user.role },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          nameAr: user.nameAr,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Private (Admin only)
// ============================================
export const updateUser = async (req, res, next) => {
  try {
    const { name, nameAr, role, isActive } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!existingUser) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // منع الأدمن من إلغاء تفعيل نفسه
    if (
      existingUser.id === req.user.id &&
      isActive !== undefined &&
      isActive === false
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot deactivate your own account',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(nameAr !== undefined && { nameAr }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_USER',
        resource: updatedUser.id,
        details: { email: updatedUser.email, changes: { name, nameAr, role, isActive } },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          nameAr: updatedUser.nameAr,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          isActive: updatedUser.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Reset user password
// @route   POST /api/users/:id/reset-password
// @access  Private (Admin only)
// ============================================
export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!existingUser) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.params.id },
      data: { password: hashedPassword },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'RESET_PASSWORD',
        resource: req.params.id,
        details: { targetEmail: existingUser.email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      status: 'success',
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
// ============================================
export const deleteUser = async (req, res, next) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!existingUser) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // منع الأدمن من حذف نفسه
    if (existingUser.id === req.user.id) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot delete your own account',
      });
    }

    await prisma.user.delete({ where: { id: req.params.id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETE_USER',
        resource: req.params.id,
        details: { email: existingUser.email, name: existingUser.name },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get roles distribution
// @route   GET /api/users/roles-distribution
// @access  Private (Admin only)
// ============================================
export const getRolesDistribution = async (req, res, next) => {
  try {
    const [personal, employee, analyst, responder, admin] = await Promise.all([
      prisma.user.count({ where: { role: 'PERSONAL_USER' } }),
      prisma.user.count({ where: { role: 'EMPLOYEE' } }),
      prisma.user.count({ where: { role: 'SOC_ANALYST' } }),
      prisma.user.count({ where: { role: 'INCIDENT_RESPONDER' } }),
      prisma.user.count({ where: { role: 'SYSTEM_ADMIN' } }),
    ]);

    res.json({
      status: 'success',
      data: {
        distribution: [
          { name: 'Personal User', value: personal, color: '#3b82f6' },
          { name: 'Employee', value: employee, color: '#6b7280' },
          { name: 'SOC Analyst', value: analyst, color: '#06b6d4' },
          { name: 'Incident Responder', value: responder, color: '#f59e0b' },
          { name: 'System Admin', value: admin, color: '#ef4444' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};