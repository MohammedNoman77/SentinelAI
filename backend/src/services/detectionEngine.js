import prisma from '../config/prisma.js';

export const DETECTION_RULES = [
  {
    id: 'RULE-AUTH-BRUTEFORCE',
    title: 'Brute Force Authentication Attempt Detected',
    category: 'AUTHENTICATION',
    severity: 'HIGH',
    mitreTactic: 'Credential Access',
    mitreTechnique: 'T1110',
    match: (ev) =>
      ev.category === 'AUTHENTICATION' &&
      /failed|brute|invalid_password/i.test(`${ev.eventType} ${ev.title}`),
    threshold: { count: 3, windowMinutes: 10 },
  },
  {
    id: 'RULE-PROC-SUSPICIOUS',
    title: 'Suspicious Command Interpreter / Living-off-the-Land Execution',
    category: 'PROCESS',
    severity: 'CRITICAL',
    mitreTactic: 'Execution',
    mitreTechnique: 'T1059',
    match: (ev) =>
      /powershell|cmd\.exe|certutil|mshta|mimikatz|encodedcommand/i.test(
        `${ev.processName || ''} ${ev.processPath || ''} ${ev.description || ''} ${ev.title || ''}`
      ),
  },
  {
    id: 'RULE-NET-C2-PORT',
    title: 'Outbound Connection to High-Risk C2 Port',
    category: 'NETWORK',
    severity: 'HIGH',
    mitreTactic: 'Command and Control',
    mitreTechnique: 'T1571',
    match: (ev) => [4444, 1337, 6667, 8443, 9001].includes(Number(ev.destinationPort)),
  },
  {
    id: 'RULE-FILE-RANSOMWARE',
    title: 'Potential Ransomware File Encryption Indicator',
    category: 'FILE',
    severity: 'CRITICAL',
    mitreTactic: 'Impact',
    mitreTechnique: 'T1486',
    match: (ev) =>
      /\.(locked|enc|crypt|encrypted|ryuk)$/i.test(ev.fileName || '') ||
      /ransom|shadow_delete|vssadmin/i.test(`${ev.eventType} ${ev.title}`),
  },
];

export async function evaluateBaselineAnomaly(event, db = prisma) {
  const metric = event.metadata?.metric;
  const value = event.metadata?.metricValue;
  if (!event.deviceId || !event.userId || !metric || typeof value !== 'number') {
    return null;
  }

  const baseline = await db.behaviorBaseline.findUnique({
    where: { deviceId_metric: { deviceId: event.deviceId, metric } },
  });

  if (!baseline || baseline.sampleCount < 5) {
    const nextCount = (baseline?.sampleCount || 0) + 1;
    const nextAvg = baseline
      ? (baseline.avgValue * baseline.sampleCount + value) / nextCount
      : value;
    await db.behaviorBaseline.upsert({
      where: { deviceId_metric: { deviceId: event.deviceId, metric } },
      update: {
        avgValue: nextAvg,
        minValue: baseline ? Math.min(baseline.minValue ?? value, value) : value,
        maxValue: baseline ? Math.max(baseline.maxValue ?? value, value) : value,
        sampleCount: nextCount,
        lastUpdated: new Date(),
      },
      create: {
        userId: event.userId,
        deviceId: event.deviceId,
        metric,
        avgValue: value,
        minValue: value,
        maxValue: value,
        stdDev: Math.max(value * 0.15, 1),
        sampleCount: 1,
      },
    });
    return null;
  }

  const stdDev = baseline.stdDev > 0 ? baseline.stdDev : Math.max(baseline.avgValue * 0.2, 1);
  const zScore = Math.abs(value - baseline.avgValue) / stdDev;

  if (zScore >= 3.0) {
    const score = Math.min(100, Math.round(zScore * 20));
    const severity = score >= 85 ? 'CRITICAL' : score >= 65 ? 'HIGH' : 'MEDIUM';
    return db.anomaly.create({
      data: {
        userId: event.userId,
        deviceId: event.deviceId,
        eventId: event.id,
        title: `Behavioral Deviation on ${metric}`,
        description: `Observed ${metric}=${value} vs baseline avg=${baseline.avgValue.toFixed(2)} (z=${zScore.toFixed(2)})`,
        score,
        severity,
        metric,
        expectedValue: baseline.avgValue,
        actualValue: value,
        deviation: Number(zScore.toFixed(2)),
        context: { rule: 'UEBA-ZSCORE-3SIGMA' },
      },
    });
  }

  return null;
}

export async function evaluateEventDetections(event, db = prisma) {
  const generatedAlerts = [];

  for (const rule of DETECTION_RULES) {
    if (!rule.match(event)) continue;

    if (rule.threshold) {
      const since = new Date(Date.now() - rule.threshold.windowMinutes * 60 * 1000);
      const count = await db.securityEvent.count({
        where: {
          category: rule.category,
          timestamp: { gte: since },
          OR: [
            ...(event.sourceIp ? [{ sourceIp: event.sourceIp }] : []),
            ...(event.deviceId ? [{ deviceId: event.deviceId }] : []),
            ...(event.userAccount ? [{ userAccount: event.userAccount }] : []),
          ],
        },
      });
      if (count < rule.threshold.count) continue;
    }

    const alert = await db.alert.create({
      data: {
        title: rule.title,
        description: event.description || `${rule.title} (${event.eventType})`,
        severity: rule.severity,
        status: 'NEW',
        category: rule.category,
        ruleId: rule.id,
        eventId: event.id,
        deviceId: event.deviceId || null,
        userId: event.userId || null,
      },
    });

    generatedAlerts.push({
      ...alert,
      mitreTactic: rule.mitreTactic,
      mitreTechnique: rule.mitreTechnique,
    });
  }

  const anomaly = await evaluateBaselineAnomaly(event, db);
  if (anomaly) {
    const anomalyAlert = await db.alert.create({
      data: {
        title: `UEBA Anomaly: ${anomaly.title}`,
        description: anomaly.description,
        severity: anomaly.severity,
        status: 'NEW',
        category: 'BEHAVIOR',
        ruleId: 'RULE-UEBA-BASELINE',
        eventId: event.id,
        deviceId: event.deviceId || null,
        anomalyId: anomaly.id,
        userId: event.userId || null,
      },
    });
    generatedAlerts.push({
      ...anomalyAlert,
      mitreTactic: 'Discovery / Exfiltration',
      mitreTechnique: 'T1087',
    });
  }

  return { alerts: generatedAlerts, anomaly };
}
