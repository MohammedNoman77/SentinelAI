/*
  Warnings:

  - You are about to drop the column `eventId` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `incidentId` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `ruleId` on the `alerts` table. All the data in the column will be lost.
  - The `status` column on the `alerts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `rawData` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `data_sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `endpoints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evidence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `incidents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `investigations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `threats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timeline_entries` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `alerts` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `alerts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `category` to the `security_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `security_events` table without a default value. This is not possible if the table is not empty.
  - Made the column `deviceId` on table `security_events` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('LAPTOP', 'DESKTOP', 'PHONE', 'TABLET', 'ROUTER', 'OTHER');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'AT_RISK');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('PROCESS', 'NETWORK', 'FILE', 'AUTHENTICATION', 'USB', 'SYSTEM', 'BROWSER');

-- CreateEnum
CREATE TYPE "AnomalyStatus" AS ENUM ('NEW', 'CONFIRMED', 'FALSE_POSITIVE', 'REVIEWED');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');

-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_eventId_fkey";

-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "evidence" DROP CONSTRAINT "evidence_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "incidents" DROP CONSTRAINT "incidents_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "investigations" DROP CONSTRAINT "investigations_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "investigations" DROP CONSTRAINT "investigations_investigatorId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_generatedBy_fkey";

-- DropForeignKey
ALTER TABLE "security_events" DROP CONSTRAINT "security_events_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "timeline_entries" DROP CONSTRAINT "timeline_entries_incidentId_fkey";

-- DropIndex
DROP INDEX "alerts_severity_idx";

-- DropIndex
DROP INDEX "security_events_status_idx";

-- AlterTable
ALTER TABLE "alerts" DROP COLUMN "eventId",
DROP COLUMN "incidentId",
DROP COLUMN "ruleId",
ADD COLUMN     "anomalyId" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AlertStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "security_events" DROP COLUMN "rawData",
DROP COLUMN "sourceId",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "userEmail",
ADD COLUMN     "category" "EventCategory" NOT NULL,
ADD COLUMN     "destinationPort" INTEGER,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "processId" INTEGER,
ADD COLUMN     "processName" TEXT,
ADD COLUMN     "processPath" TEXT,
ADD COLUMN     "userAccount" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "severity" SET DEFAULT 'LOW',
ALTER COLUMN "deviceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "data_sources";

-- DropTable
DROP TABLE "endpoints";

-- DropTable
DROP TABLE "evidence";

-- DropTable
DROP TABLE "incidents";

-- DropTable
DROP TABLE "investigations";

-- DropTable
DROP TABLE "reports";

-- DropTable
DROP TABLE "threats";

-- DropTable
DROP TABLE "timeline_entries";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "IncidentStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "SourceType";

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL DEFAULT 'DESKTOP',
    "os" TEXT,
    "osVersion" TEXT,
    "hostname" TEXT,
    "ipAddress" TEXT,
    "macAddress" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ONLINE',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "apiKey" TEXT NOT NULL,
    "agentVersion" TEXT,
    "agentInstalled" BOOLEAN NOT NULL DEFAULT false,
    "lastHeartbeat" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_baselines" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "avgValue" DOUBLE PRECISION NOT NULL,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "stdDev" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "timeWindow" TEXT NOT NULL DEFAULT '24h',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "behavior_baselines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomalies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "eventId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "metric" TEXT,
    "expectedValue" DOUBLE PRECISION,
    "actualValue" DOUBLE PRECISION,
    "deviation" DOUBLE PRECISION,
    "context" JSONB,
    "status" "AnomalyStatus" NOT NULL DEFAULT 'NEW',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anomalies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_apiKey_key" ON "devices"("apiKey");

-- CreateIndex
CREATE INDEX "devices_userId_idx" ON "devices"("userId");

-- CreateIndex
CREATE INDEX "behavior_baselines_deviceId_idx" ON "behavior_baselines"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_baselines_deviceId_metric_key" ON "behavior_baselines"("deviceId", "metric");

-- CreateIndex
CREATE INDEX "anomalies_userId_idx" ON "anomalies"("userId");

-- CreateIndex
CREATE INDEX "anomalies_deviceId_idx" ON "anomalies"("deviceId");

-- CreateIndex
CREATE INDEX "anomalies_status_idx" ON "anomalies"("status");

-- CreateIndex
CREATE INDEX "recommendations_userId_idx" ON "recommendations"("userId");

-- CreateIndex
CREATE INDEX "alerts_userId_idx" ON "alerts"("userId");

-- CreateIndex
CREATE INDEX "alerts_status_idx" ON "alerts"("status");

-- CreateIndex
CREATE INDEX "security_events_userId_idx" ON "security_events"("userId");

-- CreateIndex
CREATE INDEX "security_events_deviceId_idx" ON "security_events"("deviceId");

-- CreateIndex
CREATE INDEX "security_events_category_idx" ON "security_events"("category");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_baselines" ADD CONSTRAINT "behavior_baselines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_baselines" ADD CONSTRAINT "behavior_baselines_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "security_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_anomalyId_fkey" FOREIGN KEY ("anomalyId") REFERENCES "anomalies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
