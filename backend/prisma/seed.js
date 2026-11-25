// ============================================
// SentinelAI - Seed Database
// ============================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...\n');

  // Clean existing data
  console.log('Cleaning existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.timelineEntry.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.investigation.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.threat.deleteMany();
  await prisma.securityEvent.deleteMany();
  await prisma.endpoint.deleteMany();
  await prisma.report.deleteMany();
  await prisma.dataSource.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('Creating users...');
  const password = await bcrypt.hash('admin123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'analyst@sentinel.ai',
        password,
        name: 'Abdulrahman',
        nameAr: 'عبدالرحمن',
        role: 'SOC_ANALYST',
        avatar: 'AA',
      },
    }),
    prisma.user.create({
      data: {
        email: 'responder@sentinel.ai',
        password,
        name: 'Badea Aljouni',
        nameAr: 'بديع الجوني',
        role: 'INCIDENT_RESPONDER',
        avatar: 'BA',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@sentinel.ai',
        password,
        name: 'System Admin',
        nameAr: 'مسؤول النظام',
        role: 'SYSTEM_ADMIN',
        avatar: 'SA',
      },
    }),
    prisma.user.create({
      data: {
        email: 'owner@sentinel.ai',
        password,
        name: 'Personal Owner',
        nameAr: 'المستخدم الشخصي',
        role: 'PERSONAL_USER',
        avatar: 'PO',
      },
    }),
    prisma.user.create({
      data: {
        email: 'employee@sentinel.ai',
        password,
        name: 'Mohammed Employee',
        nameAr: 'محمد الموظف',
        role: 'EMPLOYEE',
        avatar: 'ME',
      },
    }),
  ]);

  console.log(`   Created ${users.length} users\n`);

  // Create data sources
  console.log('Creating data sources...');
  const sources = await Promise.all([
    prisma.dataSource.create({ data: { name: 'Microsoft Defender', type: 'EDR' } }),
    prisma.dataSource.create({ data: { name: 'Azure AD', type: 'IDENTITY' } }),
    prisma.dataSource.create({ data: { name: 'Palo Alto Firewall', type: 'NETWORK' } }),
    prisma.dataSource.create({ data: { name: 'AWS CloudTrail', type: 'CLOUD' } }),
  ]);
  console.log(`   Created ${sources.length} data sources\n`);

  // Create incidents
  console.log('Creating incidents...');
  const incidents = await Promise.all([
    prisma.incident.create({
      data: {
        incidentId: 'INC-2026-1042',
        title: 'Suspicious login from new location',
        description: 'Login attempt from unusual geographic location',
        severity: 'HIGH',
        status: 'OPEN',
        sourceType: 'IDENTITY',
        assignedTo: users[0].id,
        affectedUser: 'johndoe',
        maliciousIp: '203.0.113.45',
      },
    }),
    prisma.incident.create({
      data: {
        incidentId: 'INC-2026-1041',
        title: 'Malware detected on endpoint',
        description: 'Trojan.Win32 detected and quarantined',
        severity: 'CRITICAL',
        status: 'IN_PROGRESS',
        sourceType: 'EDR',
        assignedTo: users[1].id,
        affectedDevice: 'WS-1042',
        affectedUser: 'ahmed.s',
        maliciousIp: '185.199.110.3',
        fileHash: '3f2a6b7e9c4d1',
        threatType: 'Trojan.Win32',
        mitreTactic: 'Execution',
        mitreTechnique: 'T1059',
      },
    }),
    prisma.incident.create({
      data: {
        incidentId: 'INC-2026-1040',
        title: 'Unusual data access pattern',
        severity: 'MEDIUM',
        status: 'OPEN',
        sourceType: 'CLOUD',
        assignedTo: users[0].id,
      },
    }),
    prisma.incident.create({
      data: {
        incidentId: 'INC-2026-1039',
        title: 'Multiple failed login attempts',
        severity: 'HIGH',
        status: 'INVESTIGATING',
        sourceType: 'IDENTITY',
      },
    }),
    prisma.incident.create({
      data: {
        incidentId: 'INC-2026-1038',
        title: 'Suspicious process execution',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        sourceType: 'EDR',
        assignedTo: users[1].id,
      },
    }),
    prisma.incident.create({
      data: {
        incidentId: 'INC-2026-1037',
        title: 'Possible phishing activity',
        severity: 'HIGH',
        status: 'OPEN',
        sourceType: 'EMAIL',
      },
    }),
    prisma.incident.create({
      data: {
        incidentId: 'INC-2026-1036',
        title: 'Policy violation: USB device',
        severity: 'LOW',
        status: 'CLOSED',
        sourceType: 'ENDPOINT',
      },
    }),
    prisma.incident.create({
      data: {
        incidentId: 'INC-2026-1035',
        title: 'Data exfiltration attempt',
        severity: 'CRITICAL',
        status: 'IN_PROGRESS',
        sourceType: 'NETWORK',
        assignedTo: users[1].id,
      },
    }),
  ]);
  console.log(`   Created ${incidents.length} incidents\n`);

  // Create alerts
  console.log('Creating alerts...');
  await Promise.all([
    prisma.alert.create({
      data: {
        title: 'Suspicious login detected',
        severity: 'HIGH',
        status: 'NEW',
        ruleId: 'RULE-001',
        incidentId: incidents[0].id,
      },
    }),
    prisma.alert.create({
      data: {
        title: 'Malware signature match',
        severity: 'CRITICAL',
        status: 'INVESTIGATING',
        ruleId: 'RULE-002',
        incidentId: incidents[1].id,
      },
    }),
    prisma.alert.create({
      data: {
        title: 'Multiple failed logins',
        severity: 'HIGH',
        status: 'NEW',
        ruleId: 'RULE-003',
        incidentId: incidents[3].id,
      },
    }),
  ]);
  console.log('   Created 3 alerts\n');

  // Create threats
  console.log('Creating threats...');
  await Promise.all([
    prisma.threat.create({ data: { name: 'Trojan.Win32', type: 'Malware', severity: 'CRITICAL', source: 'WS-1042', status: 'detected', mitreTactic: 'Execution', mitreTechnique: 'T1059' } }),
    prisma.threat.create({ data: { name: 'Suspicious PowerShell', type: 'Suspicious Activity', severity: 'HIGH', source: '192.168.1.56', status: 'investigating' } }),
    prisma.threat.create({ data: { name: 'C2 Communication', type: 'Known Threat', severity: 'HIGH', source: '203.0.113.45', status: 'detected' } }),
    prisma.threat.create({ data: { name: 'Suspicious DNS Query', type: 'Policy Violation', severity: 'MEDIUM', source: '10.0.0.25', status: 'resolved' } }),
    prisma.threat.create({ data: { name: 'Credential Dumping', type: 'Suspicious Activity', severity: 'HIGH', source: 'WS-0098', status: 'investigating' } }),
    prisma.threat.create({ data: { name: 'Malicious File Download', type: 'Malware', severity: 'CRITICAL', source: '185.199.110.3', status: 'detected' } }),
  ]);
  console.log('   Created 6 threats\n');

  // Create endpoints
  console.log('Creating endpoints...');
  await Promise.all([
    prisma.endpoint.create({ data: { endpointId: 'WS-1042', hostname: 'DESKTOP-AHMED', os: 'Windows 11', ipAddress: '192.168.1.42', user: 'ahmed.s', status: 'At Risk', threatsCount: 3, agentVersion: '4.2.1' } }),
    prisma.endpoint.create({ data: { endpointId: 'WS-1041', hostname: 'LAPTOP-SARAH', os: 'Windows 10', ipAddress: '192.168.1.56', user: 'sarah.m', status: 'Protected', threatsCount: 0, agentVersion: '4.2.1' } }),
    prisma.endpoint.create({ data: { endpointId: 'WS-1040', hostname: 'DESKTOP-JOHN', os: 'Windows 11', ipAddress: '192.168.1.10', user: 'johndoe', status: 'Isolated', threatsCount: 7, agentVersion: '4.2.1' } }),
    prisma.endpoint.create({ data: { endpointId: 'WS-1039', hostname: 'MACBOOK-FAISAL', os: 'macOS 14', ipAddress: '192.168.1.20', user: 'faisal.k', status: 'Protected', threatsCount: 0, agentVersion: '4.1.8' } }),
    prisma.endpoint.create({ data: { endpointId: 'WS-1038', hostname: 'SERVER-DB-01', os: 'Ubuntu 22.04', ipAddress: '10.0.0.5', user: 'system', status: 'Protected', threatsCount: 0, agentVersion: '4.2.1' } }),
    prisma.endpoint.create({ data: { endpointId: 'WS-1037', hostname: 'DESKTOP-MARYAM', os: 'Windows 10', ipAddress: '192.168.1.77', user: 'maryam.a', status: 'At Risk', threatsCount: 2, agentVersion: '4.2.0' } }),
    prisma.endpoint.create({ data: { endpointId: 'WS-1036', hostname: 'LAPTOP-OMAR', os: 'Windows 11', ipAddress: '192.168.1.88', user: 'omar.r', status: 'Protected', threatsCount: 0, agentVersion: '4.2.1' } }),
    prisma.endpoint.create({ data: { endpointId: 'WS-1035', hostname: 'DESKTOP-KHALID', os: 'Windows 10', ipAddress: '192.168.1.99', user: 'khalid.m', status: 'Offline', threatsCount: 0, agentVersion: '4.1.5' } }),
  ]);
  console.log('   Created 8 endpoints\n');

  // Create reports
  console.log('Creating reports...');
  await Promise.all([
    prisma.report.create({ data: { name: 'Security Overview Report', type: 'Executive', status: 'completed', generatedBy: users[0].id, fileSize: 2400000, period: 'Sep 1 - Sep 20, 2026' } }),
    prisma.report.create({ data: { name: 'Threat Detection Report', type: 'Threats', status: 'completed', fileSize: 1800000 } }),
    prisma.report.create({ data: { name: 'Incident Response Report', type: 'Incidents', status: 'completed', generatedBy: users[1].id } }),
    prisma.report.create({ data: { name: 'Compliance (NCA) Report', type: 'Compliance', status: 'completed' } }),
  ]);
  console.log('   Created 4 reports\n');

  console.log('========================================');
  console.log('Database seeded successfully!');
  console.log('========================================\n');
  console.log('Login credentials (password: admin123):');
  console.log('   analyst@sentinel.ai     -> SOC_ANALYST');
  console.log('   responder@sentinel.ai   -> INCIDENT_RESPONDER');
  console.log('   admin@sentinel.ai       -> SYSTEM_ADMIN');
  console.log('   owner@sentinel.ai       -> PERSONAL_USER');
  console.log('   employee@sentinel.ai    -> EMPLOYEE');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
