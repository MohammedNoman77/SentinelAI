// ============================================
// SentinelAI - Main Server
// ============================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env.js';
import prisma from './config/prisma.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import incidentsRoutes from './routes/incidentsRoutes.js';
import threatsRoutes from './routes/threatsRoutes.js';
import investigationRoutes from './routes/investigationRoutes.js';
import endpointsRoutes from './routes/endpointsRoutes.js';
import behaviorRoutes from './routes/behaviorRoutes.js';
import responseRoutes from './routes/responseRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import monitoringRoutes from './routes/monitoringRoutes.js';
import alertsRoutes from './routes/alertsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const allowedOrigins = config.clientUrl.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include local scripts and health checks.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SentinelAI Backend is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.get('/api/health/db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ status: 'ok', database: 'connected', userCount });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/threats', threatsRoutes);
app.use('/api/investigation', investigationRoutes);
app.use('/api/endpoints', endpointsRoutes);
app.use('/api/behavior', behaviorRoutes);
app.use('/api/response', responseRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/events', eventsRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Route ${req.originalUrl} not found` });
});

// Error
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: config.nodeEnv === 'production'
      ? 'Internal Server Error'
      : (err.message || 'Internal Server Error'),
  });
});

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🛡️  SentinelAI Backend Server            ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║   ✅  Status:      Running                 ║`);
  console.log(`║   🌐  Port:        ${PORT}                    ║`);
  console.log(`║   🔗  URL:         http://localhost:${PORT}   ║`);
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

export default app;
