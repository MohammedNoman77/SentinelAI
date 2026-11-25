// ============================================
// SentinelAI - Incident Response Page (RBAC)
// صفحة الاستجابة للحوادث
// UC-04-05: Execute Response Actions
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ResponseWorkflow from '../../components/common/ResponseWorkflow';
import ResponseActionsPanel from '../../components/common/ResponseActionsPanel';
import IncidentsRequiringResponse from '../../components/tables/IncidentsRequiringResponse';
import { getResponseStats } from '../../services/responseService';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, CheckCircle, RefreshCw, Shield, Eye } from 'lucide-react';

const IncidentResponse = () => {
  const { canExecuteResponse } = useAuth();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [stats, setStats] = useState({
    active: 0,
    contained: 0,
    inRemediation: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getResponseStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch response stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Active Incidents',
      value: stats.active.toString(),
      change: '+12%',
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      title: 'Contained',
      value: stats.contained.toString(),
      change: '+25%',
      icon: Shield,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'In Remediation',
      value: stats.inRemediation.toString(),
      change: '+8%',
      icon: RefreshCw,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Resolved',
      value: stats.resolved.toString(),
      change: '+40%',
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ];

  return (
    <DashboardLayout
      title="Incident Response"
      subtitle="Rapid, coordinated response to security incidents."
    >
      {/* View Only Banner for SOC Analyst */}
      {!canExecuteResponse && (
        <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-400 mb-1">
              View Only Mode
            </p>
            <p className="text-xs text-sentinel-text-dim">
              أنت تتصفح بصلاحيات SOC Analyst. يمكنك مراجعة الحوادث والإجراءات，
              لكن تنفيذ الاستجابة الفعلية يتطلب دور{' '}
              <strong className="text-blue-300">Incident Responder</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-sentinel-panel border border-sentinel-border rounded-xl p-5 hover:border-cyan-400/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-sentinel-text-dim">{stat.title}</p>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-green-400">
                ↑ {stat.change}{' '}
                <span className="text-sentinel-text-dim">vs. last 7 days</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Response Workflow */}
      <div className="mb-6">
        <ResponseWorkflow />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <IncidentsRequiringResponse
            onSelectIncident={setSelectedIncident}
            selectedId={selectedIncident?.id}
          />
        </div>
        <div>
          <ResponseActionsPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IncidentResponse;