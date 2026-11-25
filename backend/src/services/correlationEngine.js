import prisma from '../config/prisma.js';

const SEVERITY_RANK = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

function maxSeverity(a, b) {
  return (SEVERITY_RANK[a] || 1) >= (SEVERITY_RANK[b] || 1) ? a : b;
}

export async function correlateAlert(alert, event = {}, meta = {}, db = prisma) {
  if (!['HIGH', 'CRITICAL'].includes(alert.severity)) {
    return null;
  }

  const windowStart = new Date(Date.now() - 30 * 60 * 1000);
  const matchFilters = [];
  if (event.sourceIp) matchFilters.push({ maliciousIp: event.sourceIp });
  if (event.deviceId) matchFilters.push({ affectedDevice: event.deviceId });
  if (event.userAccount || event.userEmail) {
    matchFilters.push({ affectedUser: event.userAccount || event.userEmail });
  }

  let incident = null;
  if (matchFilters.length > 0) {
    incident = await db.incident.findFirst({
      where: {
        status: { in: ['OPEN', 'INVESTIGATING'] },
        detectedAt: { gte: windowStart },
        OR: matchFilters,
      },
      orderBy: { detectedAt: 'desc' },
    });
  }

  if (incident) {
    const escalatedSeverity = maxSeverity(incident.severity, alert.severity);
    incident = await db.incident.update({
      where: { id: incident.id },
      data: {
        severity: escalatedSeverity,
        maliciousIp: incident.maliciousIp || event.sourceIp || null,
        affectedDevice: incident.affectedDevice || event.deviceId || null,
        affectedUser: incident.affectedUser || event.userAccount || event.userEmail || null,
        mitreTactic: incident.mitreTactic || meta.mitreTactic || null,
        mitreTechnique: incident.mitreTechnique || meta.mitreTechnique || null,
      },
    });
  } else {
    const incidentCode = `INC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    incident = await db.incident.create({
      data: {
        incidentId: incidentCode,
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        status: 'OPEN',
        affectedDevice: event.deviceId || null,
        affectedUser: event.userAccount || event.userEmail || null,
        maliciousIp: event.sourceIp || null,
        threatType: alert.category || 'MULTI_STAGE_THREAT',
        mitreTactic: meta.mitreTactic || null,
        mitreTechnique: meta.mitreTechnique || null,
      },
    });
  }

  await db.alert.update({
    where: { id: alert.id },
    data: { incidentId: incident.id },
  });

  await db.timelineEntry.create({
    data: {
      incidentId: incident.id,
      title: 'Alert Correlated to Incident',
      description: `Correlated alert "${alert.title}" (${alert.ruleId || 'RULE'})`,
      category: 'CORRELATION',
    },
  });

  return incident;
}
