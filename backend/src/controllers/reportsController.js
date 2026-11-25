// ============================================
// SentinelAI - Reports Controller (Detailed Version)
// ============================================

import prisma from '../config/prisma.js';

export const getReports = async (req, res, next) => {
  try {
    const { type, search } = req.query;
    const where = {};

    if (type && type !== 'All') where.type = type;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { generator: { select: { name: true, avatar: true } } },
    });

    const formatted = reports.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      status: r.status,
      generatedBy: r.generator?.name || 'System',
      date: new Date(r.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      size: r.fileSize ? `${(r.fileSize / 1000000).toFixed(1)} MB` : '2.4 MB',
      period: r.period || 'Sep 1 - Sep 20, 2026',
    }));

    res.json({
      status: 'success',
      data: { reports: formatted, total: formatted.length },
    });
  } catch (error) {
    next(error);
  }
};

export const getReportStats = async (req, res, next) => {
  try {
    const [total, scheduled, compliance] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'Scheduled' } }),
      prisma.report.count({ where: { type: 'Compliance' } }),
    ]);

    res.json({
      status: 'success',
      data: { total, scheduled, compliance, avgTime: '32s' },
    });
  } catch (error) {
    next(error);
  }
};

export const getReportInsights = async (req, res, next) => {
  try {
    const [highRisk, affectedUsers, affectedEndpoints, resolved] = await Promise.all([
      prisma.incident.count({ where: { severity: 'CRITICAL' } }),
      prisma.user.count(),
      prisma.endpoint.count({ where: { status: 'At Risk' } }),
      prisma.incident.count({ where: { status: 'RESOLVED' } }),
    ]);

    res.json({
      status: 'success',
      data: {
        highRiskIncidents: highRisk,
        affectedUsers,
        affectedEndpoints,
        resolvedIncidents: resolved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// تحليل سلوك الحادثة
// ============================================
function analyzeBehavior(incident) {
  const behaviors = [];
  const title = (incident.title || '').toLowerCase();
  const threatType = (incident.threatType || '').toLowerCase();

  if (title.includes('login') || title.includes('failed')) {
    behaviors.push({
      type: 'Authentication Anomaly',
      description: 'محاولات تسجيل دخول غير معتادة من موقع أو وقت غير طبيعي',
      indicator: 'Multiple failed login attempts from unfamiliar source',
      risk: 'High',
    });
  }

  if (title.includes('powershell') || threatType.includes('powershell')) {
    behaviors.push({
      type: 'Suspicious Execution',
      description: 'تنفيذ أوامر PowerShell مشفرة (Encoded Command)',
      indicator: 'T1059 - Command and Scripting Interpreter',
      risk: 'Critical',
    });
  }

  if (title.includes('data access') || title.includes('exfiltration')) {
    behaviors.push({
      type: 'Data Access Anomaly',
      description: 'الوصول إلى كميات كبيرة من الملفات في وقت قصير',
      indicator: 'Unusual volume of file access compared to baseline',
      risk: 'High',
    });
  }

  if (title.includes('phishing')) {
    behaviors.push({
      type: 'Social Engineering',
      description: 'محاولة تصيّد إلكتروني عبر البريد الإلكتروني',
      indicator: 'Suspicious email with malicious link/attachment',
      risk: 'High',
    });
  }

  if (title.includes('malware') || threatType.includes('malware')) {
    behaviors.push({
      type: 'Malicious Payload',
      description: 'تنزيل أو تنفيذ ملف خبيث على نقطة النهاية',
      indicator: 'Trojan/Malware detection signature match',
      risk: 'Critical',
    });
  }

  if (title.includes('c2') || title.includes('command and control')) {
    behaviors.push({
      type: 'C2 Communication',
      description: 'اتصال بخادم تحكم وسيطرة معروف',
      indicator: 'Outbound connection to known malicious IP',
      risk: 'Critical',
    });
  }

  if (title.includes('policy') || title.includes('usb')) {
    behaviors.push({
      type: 'Policy Violation',
      description: 'انتهاك سياسة أمنية (توصيل جهاز USB غير مصرح)',
      indicator: 'Unauthorized device connection',
      risk: 'Medium',
    });
  }

  if (title.includes('privilege') || title.includes('escalation')) {
    behaviors.push({
      type: 'Privilege Escalation',
      description: 'محاولة الحصول على صلاحيات أعلى من المسموح',
      indicator: 'Unauthorized privilege elevation attempt',
      risk: 'High',
    });
  }

  if (behaviors.length === 0) {
    behaviors.push({
      type: 'General Anomaly',
      description: 'سلوك غير طبيعي تم اكتشافه بواسطة محرك التحليل',
      indicator: 'Pattern deviates from established baseline',
      risk: 'Medium',
    });
  }

  return behaviors;
}

// ============================================
// ربط الأحداث متعددة المراحل
// ============================================
function detectMultiStageAttack(incidents) {
  const correlations = [];

  const failedLogins = incidents.filter((i) =>
    (i.title || '').toLowerCase().includes('login')
  );
  const powershell = incidents.filter((i) =>
    (i.title || '').toLowerCase().includes('powershell') ||
    (i.threatType || '').toLowerCase().includes('powershell')
  );
  const c2 = incidents.filter((i) =>
    (i.title || '').toLowerCase().includes('c2') ||
    (i.title || '').toLowerCase().includes('command')
  );
  const malware = incidents.filter((i) =>
    (i.title || '').toLowerCase().includes('malware')
  );
  const dataAccess = incidents.filter((i) =>
    (i.title || '').toLowerCase().includes('data')
  );

  if (failedLogins.length > 0 && dataAccess.length > 0) {
    correlations.push({
      name: 'Multi-Stage Attack: Credential Compromise → Data Exfiltration',
      stages: [
        { name: 'Initial Access', detail: failedLogins[0].title, severity: 'High' },
        { name: 'Data Access', detail: dataAccess[0].title, severity: 'Critical' },
      ],
      confidence: 87,
      description:
        'تم ربط محاولات تسجيل الدخول المتكررة مع الوصول غير الطبيعي للبيانات. النمط يشير إلى هجوم متعدد المراحل هدفه سحب البيانات.',
    });
  }

  if (malware.length > 0 && c2.length > 0) {
    correlations.push({
      name: 'Multi-Stage Attack: Malware Execution → C2 Beaconing',
      stages: [
        { name: 'Execution', detail: malware[0].title, severity: 'Critical' },
        { name: 'C2 Communication', detail: c2[0].title, severity: 'Critical' },
      ],
      confidence: 92,
      description:
        'تم ربط تنفيذ البرمجية الخبيثة مع محاولات الاتصال بخادم C2. هذا يشير إلى نقطة نهاية مصابة تستخدم كبوابة للهجوم.',
    });
  }

  if (powershell.length > 0 && failedLogins.length > 0) {
    correlations.push({
      name: 'Multi-Stage Attack: Initial Access → Code Execution',
      stages: [
        { name: 'Initial Access', detail: failedLogins[0].title, severity: 'High' },
        { name: 'Execution', detail: powershell[0].title, severity: 'High' },
      ],
      confidence: 78,
      description:
        'ربط محاولات الوصول الأولية مع تنفيذ أوامر PowerShell، مما يشير إلى سلسلة هجوم منظمة (T1059).',
    });
  }

  return correlations;
}

// ============================================
// تنزيل تقرير تفصيلي
// ============================================
export const downloadReport = async (req, res, next) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: { generator: { select: { name: true } } },
    });

    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Report not found' });
    }

    const [incidents, threats, endpoints, users, alerts] = await Promise.all([
      prisma.incident.findMany({
        orderBy: { detectedAt: 'desc' },
        include: { assignee: { select: { name: true } } },
      }),
      prisma.threat.findMany({ orderBy: { detectedAt: 'desc' } }),
      prisma.endpoint.findMany({ orderBy: { lastSeen: 'desc' } }),
      prisma.user.findMany({ select: { name: true, nameAr: true, role: true, email: true } }),
      prisma.alert.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
    ]);

    const stats = {
      totalIncidents: incidents.length,
      criticalIncidents: incidents.filter((i) => i.severity === 'CRITICAL').length,
      highIncidents: incidents.filter((i) => i.severity === 'HIGH').length,
      resolvedIncidents: incidents.filter((i) => i.status === 'RESOLVED').length,
      totalThreats: threats.length,
      totalEndpoints: endpoints.length,
      atRiskEndpoints: endpoints.filter((e) => e.status === 'At Risk').length,
      isolatedEndpoints: endpoints.filter((e) => e.status === 'Isolated').length,
      protectedEndpoints: endpoints.filter((e) => e.status === 'Protected').length,
      totalUsers: users.length,
      totalAlerts: alerts.length,
    };

    const correlations = detectMultiStageAttack(incidents);

    const incidentDetails = incidents.map((inc) => {
      const behaviors = analyzeBehavior(inc);
      const affectedEndpoint = endpoints.find(
        (e) => e.endpointId === inc.affectedDevice
      );

      const networkImpact = {
        scope:
          inc.sourceType === 'NETWORK' ? 'Network-Wide' :
          inc.sourceType === 'EDR' ? 'Single Endpoint' :
          inc.sourceType === 'IDENTITY' ? 'Identity Service' :
          inc.sourceType === 'CLOUD' ? 'Cloud Infrastructure' :
          inc.sourceType === 'EMAIL' ? 'Email Service' :
          'Endpoint',
        affectedDevices: inc.affectedDevice ? 1 : 0,
        externalConnections: inc.maliciousIp ? 1 : 0,
      };

      const endpointImpact = {
        status: affectedEndpoint?.status || 'Unknown',
        threatsCount: affectedEndpoint?.threatsCount || 0,
        os: affectedEndpoint?.os || '—',
        ip: affectedEndpoint?.ipAddress || '—',
        user: affectedEndpoint?.user || '—',
        agentVersion: affectedEndpoint?.agentVersion || '—',
        lastSeen: affectedEndpoint?.lastSeen
          ? new Date(affectedEndpoint.lastSeen).toLocaleString()
          : '—',
        needsIsolation:
          (affectedEndpoint?.threatsCount || 0) > 2 || inc.severity === 'CRITICAL',
      };

      return {
        id: inc.incidentId,
        title: inc.title,
        description: inc.description,
        severity: inc.severity,
        status: inc.status,
        sourceType: inc.sourceType,
        detectedAt: new Date(inc.detectedAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        affectedDevice: inc.affectedDevice,
        affectedUser: inc.affectedUser,
        maliciousIp: inc.maliciousIp,
        fileHash: inc.fileHash,
        threatType: inc.threatType,
        mitreTactic: inc.mitreTactic,
        mitreTechnique: inc.mitreTechnique,
        assignee: inc.assignee?.name || 'Unassigned',
        behaviors,
        networkImpact,
        endpointImpact,
      };
    });

    // بناء HTML
    const incidentCardsHtml = incidentDetails
      .map((inc, idx) => {
        const behaviorsHtml = inc.behaviors
          .map(
            (b) => `
        <div class="behavior-box">
          <div class="behavior-title">⚠️ ${b.type} · <span style="color: #dc2626;">${b.risk}</span></div>
          <div class="behavior-desc">${b.description}</div>
          <div class="behavior-indicator">Indicator: ${b.indicator}</div>
        </div>
      `
          )
          .join('');

        const recommendations = [];
        if (inc.endpointImpact.needsIsolation)
          recommendations.push(
            '<li style="color: #dc2626;"><strong>عزل فوري</strong> لنقطة النهاية ' +
              (inc.affectedDevice || '') +
              ' لمنع انتشار التهديد</li>'
          );
        if (inc.maliciousIp)
          recommendations.push(
            '<li>حظر عنوان IP الخبيث <strong>' +
              inc.maliciousIp +
              '</strong> على مستوى الجدار الناري</li>'
          );
        if (inc.fileHash)
          recommendations.push(
            '<li>إضافة Hash الملف <strong>' + inc.fileHash + '</strong> إلى قائمة الحظر</li>'
          );
        if (inc.affectedUser)
          recommendations.push(
            '<li>إعادة تعيين بيانات الاعتماد للمستخدم <strong>' +
              inc.affectedUser +
              '</strong></li>'
          );
        if (inc.threatType)
          recommendations.push(
            '<li>البحث عن أنماط مشابهة لـ <strong>' +
              inc.threatType +
              '</strong> في باقي الأجهزة</li>'
          );
        recommendations.push(
          '<li>مراجعة الأحداث المرتبطة بهذه الحادثة خلال الـ 24 ساعة الماضية</li>'
        );
        if (inc.mitreTechnique)
          recommendations.push(
            '<li>تحديث قواعد الكشف لتشمل تقنية <strong>' +
              inc.mitreTechnique +
              '</strong></li>'
          );

        return `
      <div class="incident-card">
        <div class="incident-header">
          <div>
            <div class="incident-title">${idx + 1}. ${inc.title}</div>
            <div class="incident-id">${inc.id} · ${inc.detectedAt}</div>
          </div>
          <div class="badges">
            <span class="badge ${inc.severity.toLowerCase()}">${inc.severity}</span>
            <span class="badge ${inc.status === 'OPEN' ? 'open' : inc.status === 'RESOLVED' ? 'resolved' : 'progress'}">${inc.status}</span>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-item"><div class="detail-label">الجهاز المصاب</div><div class="detail-value">${inc.affectedDevice || 'غير محدد'}</div></div>
          <div class="detail-item"><div class="detail-label">المستخدم المتأثر</div><div class="detail-value">${inc.affectedUser || 'غير محدد'}</div></div>
          <div class="detail-item"><div class="detail-label">عنوان IP الخبيث</div><div class="detail-value ${inc.maliciousIp ? 'bad' : ''}">${inc.maliciousIp || 'لا يوجد'}</div></div>
          <div class="detail-item"><div class="detail-label">نوع التهديد</div><div class="detail-value">${inc.threatType || 'غير محدد'}</div></div>
          <div class="detail-item"><div class="detail-label">MITRE Tactic</div><div class="detail-value">${inc.mitreTactic || 'غير محدد'}</div></div>
          <div class="detail-item"><div class="detail-label">MITRE Technique</div><div class="detail-value">${inc.mitreTechnique || 'غير محدد'}</div></div>
          <div class="detail-item"><div class="detail-label">المصدر</div><div class="detail-value">${inc.sourceType || 'System'}</div></div>
          <div class="detail-item"><div class="detail-label">المسؤول</div><div class="detail-value">${inc.assignee}</div></div>
        </div>

        <h4 style="color: #0B1120; margin: 20px 0 15px 0; font-size: 15px;">🧠 السلوكيات المكتشفة</h4>
        ${behaviorsHtml}

        <h4 style="color: #0B1120; margin: 20px 0 15px 0; font-size: 15px;">💥 تحليل التأثير</h4>
        <div class="impact-grid">
          <div class="impact-card network">
            <div class="impact-title">🌐 تأثير الشبكة</div>
            <div class="impact-row"><span class="label">النطاق:</span><span class="value">${inc.networkImpact.scope}</span></div>
            <div class="impact-row"><span class="label">الأجهزة المتأثرة:</span><span class="value ${inc.networkImpact.affectedDevices > 0 ? 'danger' : 'ok'}">${inc.networkImpact.affectedDevices}</span></div>
            <div class="impact-row"><span class="label">الاتصالات المشبوهة:</span><span class="value ${inc.networkImpact.externalConnections > 0 ? 'danger' : 'ok'}">${inc.networkImpact.externalConnections}</span></div>
          </div>
          <div class="impact-card endpoint">
            <div class="impact-title">💻 تأثير نقطة النهاية</div>
            <div class="impact-row"><span class="label">الحالة:</span><span class="value ${inc.endpointImpact.status === 'Isolated' || inc.endpointImpact.status === 'At Risk' ? 'danger' : 'ok'}">${inc.endpointImpact.status}</span></div>
            <div class="impact-row"><span class="label">عدد التهديدات:</span><span class="value ${inc.endpointImpact.threatsCount > 2 ? 'danger' : ''}">${inc.endpointImpact.threatsCount}</span></div>
            <div class="impact-row"><span class="label">نظام التشغيل:</span><span class="value">${inc.endpointImpact.os}</span></div>
            <div class="impact-row"><span class="label">IP:</span><span class="value">${inc.endpointImpact.ip}</span></div>
            <div class="impact-row"><span class="label">المستخدم:</span><span class="value">${inc.endpointImpact.user}</span></div>
            <div class="impact-row"><span class="label">الوكيل:</span><span class="value">v${inc.endpointImpact.agentVersion}</span></div>
          </div>
        </div>

        <div class="recommendations">
          <h3>🎯 الإجراءات الموصى بها</h3>
          <ul>${recommendations.join('')}</ul>
        </div>
      </div>
    `;
      })
      .join('');

    const correlationsHtml = correlations
      .map(
        (corr) => `
      <div class="correlation-box">
        <div class="correlation-title">⚠️ ${corr.name}</div>
        <div class="correlation-desc">${corr.description}</div>
        <div style="font-size: 12px; color: #78350f; margin-bottom: 5px;"><strong>مستوى الثقة:</strong> ${corr.confidence}%</div>
        <div class="stages">${corr.stages.map((s) => `<span class="stage">${s.name}: ${s.detail}</span>`).join('')}</div>
      </div>
    `
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>${report.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', 'Tahoma', Arial, sans-serif; background: #f0f2f5; color: #1a1a1a; line-height: 1.6; }
  .container { max-width: 1200px; margin: 0 auto; background: white; }
  .header { background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; padding: 40px; text-align: center; }
  .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: bold; }
  .header p { opacity: 0.9; font-size: 16px; }
  .header .logo { font-size: 60px; margin-bottom: 15px; }
  .section { padding: 30px 40px; }
  .section-title { font-size: 22px; color: #0B1120; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #06b6d4; display: flex; align-items: center; gap: 10px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
  .stat-card { background: #f9fafb; border-radius: 12px; padding: 20px; border-right: 4px solid #06b6d4; }
  .stat-card.critical { border-color: #ef4444; }
  .stat-card.high { border-color: #f59e0b; }
  .stat-card.success { border-color: #10b981; }
  .stat-label { font-size: 13px; color: #6b7280; margin-bottom: 8px; }
  .stat-value { font-size: 32px; font-weight: bold; color: #0B1120; }
  .stat-sub { font-size: 12px; color: #10b981; margin-top: 5px; }
  .meta-info { background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
  .meta-item { padding: 10px; background: white; border-radius: 8px; }
  .meta-label { font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; }
  .meta-value { font-size: 14px; font-weight: 600; color: #0B1120; }
  .incident-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .incident-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #f3f4f6; }
  .incident-title { font-size: 18px; font-weight: bold; color: #0B1120; margin-bottom: 5px; }
  .incident-id { font-size: 12px; color: #6b7280; font-family: monospace; }
  .badges { display: flex; gap: 8px; }
  .badge { padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; }
  .badge.critical { background: #fee2e2; color: #dc2626; }
  .badge.high { background: #fed7aa; color: #ea580c; }
  .badge.medium { background: #fef3c7; color: #ca8a04; }
  .badge.low { background: #dbeafe; color: #2563eb; }
  .badge.open { background: #dbeafe; color: #2563eb; }
  .badge.progress { background: #ede9fe; color: #7c3aed; }
  .badge.resolved { background: #d1fae5; color: #059669; }
  .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
  .detail-item { padding: 12px; background: #f9fafb; border-radius: 8px; }
  .detail-label { font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; }
  .detail-value { font-size: 13px; font-weight: 500; color: #1a1a1a; font-family: monospace; }
  .detail-value.bad { color: #dc2626; font-weight: bold; }
  .behavior-box { background: #fef2f2; border-right: 4px solid #ef4444; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
  .behavior-title { font-weight: bold; color: #991b1b; margin-bottom: 8px; font-size: 14px; }
  .behavior-desc { font-size: 13px; color: #7f1d1d; margin-bottom: 5px; }
  .behavior-indicator { font-size: 12px; color: #6b7280; font-family: monospace; background: white; padding: 5px 10px; border-radius: 4px; display: inline-block; }
  .impact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px; }
  .impact-card { padding: 15px; border-radius: 8px; border: 1px solid; }
  .impact-card.network { background: #eff6ff; border-color: #bfdbfe; }
  .impact-card.endpoint { background: #fef3c7; border-color: #fde68a; }
  .impact-title { font-weight: bold; font-size: 13px; margin-bottom: 10px; }
  .impact-row { font-size: 12px; margin-bottom: 5px; display: flex; justify-content: space-between; }
  .impact-row .label { color: #6b7280; }
  .impact-row .value { font-weight: 600; color: #1a1a1a; }
  .impact-row .value.danger { color: #dc2626; }
  .impact-row .value.ok { color: #10b981; }
  .correlation-box { background: linear-gradient(135deg, #fef3c7, #fed7aa); border-right: 4px solid #f59e0b; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
  .correlation-title { font-size: 16px; font-weight: bold; color: #92400e; margin-bottom: 10px; }
  .correlation-desc { font-size: 13px; color: #78350f; margin-bottom: 15px; }
  .stages { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
  .stage { background: white; padding: 8px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; color: #92400e; border: 2px solid #f59e0b; }
  .recommendations { background: #ecfdf5; border-right: 4px solid #10b981; padding: 20px; border-radius: 12px; margin-top: 20px; }
  .recommendations h3 { color: #065f46; margin-bottom: 12px; font-size: 15px; }
  .recommendations ul { list-style: none; padding: 0; }
  .recommendations li { padding: 8px 0; color: #047857; font-size: 13px; }
  .recommendations li::before { content: '✓ '; color: #10b981; font-weight: bold; }
  .footer { background: #0B1120; color: white; padding: 30px; text-align: center; font-size: 13px; }
  .footer p { opacity: 0.7; margin-bottom: 5px; }
  @media print { body { background: white; } .incident-card { page-break-inside: avoid; } }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">🛡️</div>
    <h1>${report.name}</h1>
    <p>SentinelAI Security Report · تم الإنشاء بواسطة ${report.generator?.name || 'System'}</p>
    <p style="margin-top: 10px; font-size: 14px;">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
  </div>

  <div class="section">
    <h2 class="section-title"><span>📊</span> الملخص التنفيذي</h2>
    <div class="meta-info">
      <div class="meta-item"><div class="meta-label">نوع التقرير</div><div class="meta-value">${report.type}</div></div>
      <div class="meta-item"><div class="meta-label">الفترة</div><div class="meta-value">${report.period || 'Sep 1 - Sep 20, 2026'}</div></div>
      <div class="meta-item"><div class="meta-label">الحالة</div><div class="meta-value">${report.status}</div></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card critical"><div class="stat-label">إجمالي الحوادث</div><div class="stat-value">${stats.totalIncidents}</div><div class="stat-sub">${stats.criticalIncidents} حرجة · ${stats.highIncidents} عالية</div></div>
      <div class="stat-card high"><div class="stat-label">التهديدات</div><div class="stat-value">${stats.totalThreats}</div><div class="stat-sub">${stats.totalAlerts} تنبيه</div></div>
      <div class="stat-card"><div class="stat-label">الأجهزة المراقبة</div><div class="stat-value">${stats.totalEndpoints}</div><div class="stat-sub">${stats.atRiskEndpoints} معرّضة للخطر</div></div>
      <div class="stat-card success"><div class="stat-label">الحوادث المحلولة</div><div class="stat-value">${stats.resolvedIncidents}</div><div class="stat-sub">${stats.protectedEndpoints} جهاز محمي</div></div>
    </div>
    <div style="background: #eff6ff; padding: 20px; border-radius: 12px; border-right: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; margin-bottom: 10px; font-size: 15px;">📝 ملخص التحليل</h3>
      <p style="color: #1e3a8a; font-size: 14px; line-height: 1.8;">
        تم اكتشاف <strong>${stats.totalIncidents} حادثة أمنية</strong> خلال الفترة المحددة، منها 
        <strong style="color: #dc2626;">${stats.criticalIncidents} حادثة حرجة</strong> و
        <strong style="color: #ea580c;">${stats.highIncidents} حادثة عالية الخطورة</strong>.
        تم تحليل السلوك لكل حادثة وربط الأحداث متعددة المراحل، مما أسفر عن اكتشاف 
        <strong style="color: #f59e0b;">${correlations.length} هجوم متعدد المراحل</strong>.
      </p>
    </div>
  </div>

  ${
    correlations.length > 0
      ? `
  <div class="section">
    <h2 class="section-title"><span>🔗</span> الهجمات متعددة المراحل المكتشفة</h2>
    <p style="color: #6b7280; margin-bottom: 20px; font-size: 13px;">تم ربط الأحداث التالية تلقائياً بواسطة محرك Correlation.</p>
    ${correlationsHtml}
  </div>
  `
      : ''
  }

  <div class="section">
    <h2 class="section-title"><span>🚨</span> تحليل تفصيلي للحوادث (${incidents.length} حادثة)</h2>
    <p style="color: #6b7280; margin-bottom: 20px; font-size: 13px;">لكل حادثة: الجهاز المصاب، السلوك المكتشف، تأثير الشبكة، وتأثير نقطة النهاية.</p>
    ${incidentCardsHtml}
  </div>

  <div class="section">
    <h2 class="section-title"><span>📋</span> التوصيات العامة</h2>
    <div class="recommendations">
      <h3>بناءً على تحليل كل البيانات:</h3>
      <ul>
        <li>تفعيل المصادقة متعددة العوامل (MFA) لجميع الحسابات ذات الصلاحيات</li>
        <li>مراجعة وتحديث قواعد الكشف بناءً على أحدث استخبارات التهديدات</li>
        <li>عزل الأجهزة التي تحتوي على أكثر من تهديدين (${stats.atRiskEndpoints} جهاز)</li>
        <li>إجراء فحص شامل لجميع نقاط النهاية المشتبه بها</li>
        <li>تدريب الموظفين على التعرف على هجمات التصيّد الإلكتروني</li>
        <li>تطبيق مبدأ الصلاحيات الأقل (Least Privilege)</li>
        <li>تفعيل التسجيل المركزي لجميع الأنظمة الحساسة</li>
      </ul>
    </div>
  </div>

  <div class="footer">
    <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">🛡️ SENTINELAI</p>
    <p>Intelligence in Every Behavior</p>
    <p style="margin-top: 15px;">© 2026 SentinelAI · All Rights Reserved</p>
  </div>
</div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${report.name.replace(/\s+/g, '_')}.html"`
    );
    res.send(html);
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req, res, next) => {
  try {
    const { name, type, period } = req.body;
    const userId = req.user.id;

    if (!name || !type) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and type are required',
      });
    }

    const report = await prisma.report.create({
      data: {
        name,
        type,
        period: period || 'Sep 1 - Sep 30, 2026',
        status: 'completed',
        generatedBy: userId,
        fileSize: Math.floor(Math.random() * 2000000) + 1000000,
      },
    });

    res.status(201).json({ status: 'success', data: { report } });
  } catch (error) {
    next(error);
  }
};