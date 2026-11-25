import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(here, '../../.env') });
const missing = ['DATABASE_URL', 'JWT_SECRET'].filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters long');

export const config = Object.freeze({
  port: Number(process.env.PORT || 5000), nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL, directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET, jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((url) => url.trim()).filter(Boolean),
  allowRegistration: process.env.ALLOW_REGISTRATION === 'true',
});
