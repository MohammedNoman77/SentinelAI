// ============================================
// SentinelAI - Prisma Client Configuration
// ============================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// معالجة إغلاق التطبيق
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;