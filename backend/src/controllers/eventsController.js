import prisma from '../config/prisma.js';
import { ingestEvent } from '../services/ingestionService.js';
import { evaluateEventDetections } from '../services/detectionEngine.js';
import { correlateAlert } from '../services/correlationEngine.js';

export async function processTelemetryEvent(rawEvent, context = {}, db = prisma) {
  const event = await ingestEvent(rawEvent, context, db);
  const { alerts, anomaly } = await evaluateEventDetections(event, db);

  const incidents = [];
  for (const alert of alerts) {
    const incident = await correlateAlert(
      alert,
      event,
      { mitreTactic: alert.mitreTactic, mitreTechnique: alert.mitreTechnique },
      db
    );
    if (incident && !incidents.some((i) => i.id === incident.id)) {
      incidents.push(incident);
    }
  }

  await db.securityEvent.update({
    where: { id: event.id },
    data: { status: alerts.length > 0 ? 'FLAGGED' : 'PROCESSED' },
  });

  return { event, alerts, anomaly, incidents };
}

export async function handleIngestEvent(req, res, next) {
  try {
    const context = {
      userId: req.user?.id || req.device?.userId || null,
      deviceId: req.device?.id || req.body?.deviceId || null,
      sourceId: req.body?.sourceId || null,
    };
    const result = await processTelemetryEvent(req.body, context);
    res.status(201).json({
      status: 'success',
      data: {
        eventId: result.event.id,
        eventStatus: result.alerts.length > 0 ? 'FLAGGED' : 'PROCESSED',
        alertsTriggered: result.alerts.length,
        anomalyDetected: Boolean(result.anomaly),
        correlatedIncidents: result.incidents.map((i) => i.incidentId),
      },
    });
  } catch (error) {
    next(error);
  }
}
