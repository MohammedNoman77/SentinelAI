import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { config } from '../config/env.js';
import { hashApiKey } from '../utils/crypto.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'Authentication required' });
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findFirst({ where: { id: payload.userId, isActive: true } });
    if (!user) return res.status(401).json({ status: 'error', message: 'Authentication required' });
    req.user = user; return next();
  } catch { return res.status(401).json({ status: 'error', message: 'Authentication required' }); }
};

export const authenticateAgent = async (req, res, next) => {
  const key = req.get('x-api-key');
  if (!key || key.length > 256) return res.status(401).json({ status: 'error', message: 'Invalid agent credentials' });
  const device = await prisma.device.findUnique({ where: { apiKeyHash: hashApiKey(key) }, include: { user: true } });
  if (!device || !device.user.isActive) return res.status(401).json({ status: 'error', message: 'Invalid agent credentials' });
  req.device = device; req.user = device.user; return next();
};
