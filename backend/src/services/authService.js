import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { config } from '../config/env.js';
import { generateSecret } from '../utils/crypto.js';
const publicUser = (user, includeEnrollToken = false) => ({ id: user.id, email: user.email, name: user.name, isActive: user.isActive, ...(includeEnrollToken ? { enrollToken: user.enrollToken } : {}) });
export const issueToken = (userId) => jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
export const authenticate = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) return null;
  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
  return { user: publicUser(user), token: issueToken(user.id) };
};
export const createUser = async ({ email, password, name }) => {
  const normalizedEmail = email.trim().toLowerCase();
  if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) throw new Error('EMAIL_EXISTS');
  const user = await prisma.user.create({ data: { email: normalizedEmail, name: name.trim(), password: await bcrypt.hash(password, 12), enrollToken: generateSecret(24) } });
  return { user: publicUser(user), token: issueToken(user.id) };
};
export const getProfile = (user) => publicUser(user, true);
export const rotateEnrollToken = async (userId) => publicUser(await prisma.user.update({ where: { id: userId }, data: { enrollToken: generateSecret(24) } }), true);
export const changePassword = async (user, currentPassword, newPassword) => {
  if (!(await bcrypt.compare(currentPassword, user.password))) return false;
  await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(newPassword, 12) } }); return true;
};
