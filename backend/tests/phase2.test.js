import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEventPayload } from '../src/services/ingestionService.js';
import { evaluateEventDetections, evaluateBaselineAnomaly } from '../src/services/detectionEngine.js';
import { correlateAlert } from '../src/services/correlationEngine.js';
import { processTelemetryEvent } from '../src/controllers/eventsController.js';

function createMockDb() {
  const store = {
    events: [],
    alerts: [],
    incidents: [],
    baselines: [],
    anomalies: [],
    timeline: [],
  };

  return {
    store,
    securityEvent: {
      create: async ({ data }) => {
        const rec = { id: `evt_${store.events.length + 1}`, ...data };
        store.events.push(rec);
        return rec;
      },
      update: async ({ where, data }) => {
        const rec = store.events.find((e) => e.id === where.id);
        Object.assign(rec, data);
        return rec;
      },
      count: async ({ where }) => {
        return store.events.filter((e) => {
          if (where.category && e.category !== where.category) return false;
          if (where.OR && where.OR.length > 0) {
            return where.OR.some((cond) =>
              Object.entries(cond).every(([k, v]) => e[k] === v)
            );
          }
          return true;
        }).length;
      },
    },
    behaviorBaseline: {
      findUnique: async ({ where }) => {
        const { deviceId, metric } = where.deviceId_metric;
        return store.baselines.find((b) => b.deviceId === deviceId && b.metric === metric) || null;
      },
      upsert: async ({ where, update, create }) => {
        const { deviceId, metric } = where.deviceId_metric;
        let rec = store.baselines.find((b) => b.deviceId === deviceId && b.metric === metric);
        if (rec) {
          Object.assign(rec, update);
        } else {
          rec = { id: `base_${store.baselines.length + 1}`, ...create };
          store.baselines.push(rec);
        }
        return rec;
      },
    },
    anomaly: {
      create: async ({ data }) => {
        const rec = { id: `anom_${store.anomalies.length + 1}`, ...data };
        store.anomalies.push(rec);
        return rec;
      },
    },
    alert: {
      create: async ({ data }) => {
        const rec = { id: `alt_${store.alerts.length + 1}`, ...data };
        store.alerts.push(rec);
        return rec;
      },
      update: async ({ where, data }) => {
        const rec = store.alerts.find((a) => a.id === where.id);
        Object.assign(rec, data);
        return rec;
      },
    },
    incident: {
      findFirst: async ({ where }) => {
        return store.incidents.find((inc) => {
          if (where.status?.in && !where.status.in.includes(inc.status)) return false;
          if (where.OR && where.OR.length > 0) {
            return where.OR.some((cond) =>
              Object.entries(cond).every(([k, v]) => inc[k] === v)
            );
          }
          return true;
        }) || null;
      },
      create: async ({ data }) => {
        const rec = { id: `inc_${store.incidents.length + 1}`, detectedAt: new Date(), ...data };
        store.incidents.push(rec);
        return rec;
      },
      update: async ({ where, data }) => {
        const rec = store.incidents.find((i) => i.id === where.id);
        Object.assign(rec, data);
        return rec;
      },
    },
    timelineEntry: {
      create: async ({ data }) => {
        const rec = { id: `tl_${store.timeline.length + 1}`, ...data };
        store.timeline.push(rec);
        return rec;
      },
    },
  };
}

test('1. OCSF/ECS Ingestion Normalization validates and normalizes telemetry fields', () => {
  const normalized = normalizeEventPayload({
    event_type: 'process_create',
    title: 'Encoded PowerShell Execution',
    category: 'process',
    severity: 'critical',
    src_ip: '10.0.0.45',
    process: 'powershell.exe',
  });

  assert.equal(normalized.eventType, 'process_create');
  assert.equal(normalized.category, 'PROCESS');
  assert.equal(normalized.severity, 'CRITICAL');
  assert.equal(normalized.sourceIp, '10.0.0.45');
  assert.equal(normalized.processName, 'powershell.exe');
  assert.equal(normalized.metadata.schema, 'OCSF-1.1/ECS-8.x');
});

test('2. Detection Engine triggers Brute Force alert on threshold and correlates into single Incident', async () => {
  const db = createMockDb();

  for (let i = 1; i <= 3; i++) {
    await processTelemetryEvent(
      {
        eventType: 'auth_failed',
        title: 'Failed SSH login attempt',
        category: 'authentication',
        severity: 'MEDIUM',
        sourceIp: '192.168.1.99',
        userAccount: 'root',
      },
      { deviceId: 'dev_1', userId: 'usr_1' },
      db
    );
  }

  assert.equal(db.store.alerts.length, 1);
  assert.equal(db.store.alerts[0].ruleId, 'RULE-AUTH-BRUTEFORCE');
  assert.equal(db.store.incidents.length, 1);
  assert.equal(db.store.incidents[0].maliciousIp, '192.168.1.99');

  // Follow-up malicious PowerShell from same IP correlates into the SAME incident
  await processTelemetryEvent(
    {
      eventType: 'process_create',
      title: 'Suspicious powershell payload',
      category: 'process',
      severity: 'HIGH',
      sourceIp: '192.168.1.99',
      processName: 'powershell.exe',
    },
    { deviceId: 'dev_1', userId: 'usr_1' },
    db
  );

  assert.equal(db.store.alerts.length, 2);
  assert.equal(db.store.incidents.length, 1);
  assert.equal(db.store.incidents[0].severity, 'CRITICAL');
  assert.equal(db.store.timeline.length, 2);
});

test('3. Behavioral Baseline detects 3-sigma anomaly and emits UEBA alert', async () => {
  const db = createMockDb();

  // Seed 5 normal baseline samples (~100 MB outbound)
  for (let i = 0; i < 5; i++) {
    await evaluateBaselineAnomaly(
      {
        id: `evt_b_${i}`,
        deviceId: 'dev_2',
        userId: 'usr_1',
        metadata: { metric: 'outbound_bytes_mb', metricValue: 100 },
      },
      db
    );
  }

  // Spike to 950 MB triggers 3-sigma anomaly + UEBA alert
  const res = await evaluateEventDetections(
    {
      id: 'evt_spike',
      eventType: 'network_flow',
      title: 'Large outbound transfer',
      category: 'NETWORK',
      severity: 'LOW',
      deviceId: 'dev_2',
      userId: 'usr_1',
      metadata: { metric: 'outbound_bytes_mb', metricValue: 950 },
    },
    db
  );

  assert.ok(res.anomaly);
  assert.equal(res.alerts.length, 1);
  assert.equal(res.alerts[0].ruleId, 'RULE-UEBA-BASELINE');
});
