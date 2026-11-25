// ============================================
// SentinelAI - Environment Variables
// ============================================

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

if (config.nodeEnv === 'production' && (!config.databaseUrl || !config.jwtSecret || config.jwtSecret.length < 32)) {
  throw new Error('Production requires DATABASE_URL and a JWT_SECRET of at least 32 characters');
}

export default config;
