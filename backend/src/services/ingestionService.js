import prisma from '../config/prisma.js';

const CATEGORY_MAP = {
  process: 'PROCESS',
  network: 'NETWORK',
  file: 'FILE',
  authentication: 'AUTHENTICATION',
  auth: 'AUTHENTICATION',
  usb: 'USB',
  system: 'SYSTEM',
  browser: 'BROWSER',
};

const SEVERITY_MAP = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  critical: 'CRITICAL',
};

export function normalizeEventPayload(raw = {}, context = {}) {
  if (!raw || typeof raw !== 'object') {
    const err = new Error('Invalid event payload');
    err.status = 400;
    throw err;
  }

  const eventType = String(raw.eventType || raw.event_type || raw.action || '').trim();
  const title = String(raw.title || raw.message || eventType || '').trim();

  if (!eventType || !title) {
    const err = new Error('eventType and title are required');
    err.status = 400;
    throw err;
  }

  const rawCategory = String(raw.category || '').toLowerCase();
  const category = CATEGORY_MAP[rawCategory] || null;

  const rawSeverity = String(raw.severity || 'LOW').toLowerCase();
  const severity = SEVERITY_MAP[rawSeverity] || 'LOW';

  const normalized = {
    eventType,
    title,
    description: raw.description ? String(raw.description) : null,
    severity,
    status: 'NEW',
    category,
    timestamp: raw.timestamp ? new Date(raw.timestamp) : new Date(),
    sourceIp: raw.sourceIp || raw.src_ip || raw.ip || null,
    destinationIp: raw.destinationIp || raw.dst_ip || null,
    destinationPort: raw.destinationPort ? Number(raw.destinationPort) : null,
    userEmail: raw.userEmail || raw.email || null,
    userAccount: raw.userAccount || raw.username || raw.user || null,
    processName: raw.processName || raw.process || null,
    processPath: raw.processPath || null,
    processId: raw.processId ? Number(raw.processId) : null,
    fileName: raw.fileName || raw.file || null,
    sourceId: context.sourceId || raw.sourceId || null,
    deviceId: context.deviceId || raw.deviceId || null,
    userId: context.userId || raw.userId || null,
    rawData: raw,
    metadata: {
      schema: 'OCSF-1.1/ECS-8.x',
      normalizedAt: new Date().toISOString(),
      metric: raw.metric || null,
      metricValue: typeof raw.metricValue === 'number' ? raw.metricValue : null,
      ...(raw.metadata || {}),
    },
  };

  return normalized;
}

export async function ingestEvent(raw, context = {}, db = prisma) {
  const normalized = normalizeEventPayload(raw, context);
  return db.securityEvent.create({ data: normalized });
}
