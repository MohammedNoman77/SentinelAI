// ============================================
// SentinelAI - Authentication Controller
// ============================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import config from '../config/env.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  nameAr: user.nameAr,
  role: user.role,
  avatar: user.avatar,
});

export const register = async (req, res, next) => {
  try {
    const { email, password, name, nameAr } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email, password, and name',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();
    if (!EMAIL_PATTERN.test(normalizedEmail) || normalizedName.length < 2 || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        status: 'error',
        message: `Use a valid email and name; passwords must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: normalizedName,
        nameAr: typeof nameAr === 'string' ? nameAr.trim() || null : null,
        role: 'EMPLOYEE',
        avatar: normalizedName.split(/\s+/).map((part) => part[0]).join('').toUpperCase().slice(0, 2),
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      data: {
        user: publicUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Account is deactivated',
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = generateToken(user.id);

    res.json({
      status: 'success',
      data: {
        user: publicUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        nameAr: true,
        role: true,
        avatar: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
