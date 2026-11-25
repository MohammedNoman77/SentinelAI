import crypto from 'crypto';
export const generateSecret = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url');
export const hashApiKey = (value) => crypto.createHash('sha256').update(value).digest('hex');
