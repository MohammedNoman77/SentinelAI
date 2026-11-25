import prisma from '../config/prisma.js';
import { generateSecret, hashApiKey } from '../utils/crypto.js';
const text = (value, max = 128) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export const enrollDevice = async (payload) => {
  const enrollToken = text(payload.enrollToken, 256); const hostname = text(payload.hostname, 128);
  if (!enrollToken || !hostname) return null;
  const user = await prisma.user.findFirst({ where: { enrollToken, isActive: true } }); if (!user) return null;
  const apiKey = generateSecret(); const data = { name: text(payload.name, 128) || hostname, hostname, apiKeyHash: hashApiKey(apiKey), status: 'ONLINE', lastSeen: new Date(), os: text(payload.os), osVersion: text(payload.osVersion), architecture: text(payload.architecture), ipAddress: text(payload.ipAddress, 64), macAddress: text(payload.macAddress, 32), username: text(payload.username), cpuCores: Number.isInteger(payload.cpuCores) ? payload.cpuCores : null, totalRam: Number.isSafeInteger(payload.totalRam) ? BigInt(payload.totalRam) : null, diskSize: Number.isSafeInteger(payload.diskSize) ? BigInt(payload.diskSize) : null, agentVersion: text(payload.agentVersion, 32) };
  const device = await prisma.device.upsert({ where: { userId_hostname: { userId: user.id, hostname } }, create: { userId: user.id, ...data }, update: data });
  return { device: { id: device.id, hostname: device.hostname, name: device.name }, apiKey };
};
export const heartbeat = async (device, payload) => prisma.device.update({ where: { id: device.id }, data: { lastSeen: new Date(), status: device.riskScore >= 60 ? 'AT_RISK' : 'ONLINE', agentVersion: text(payload.agentVersion, 32) || device.agentVersion, ipAddress: text(payload.ipAddress, 64) || device.ipAddress } });
