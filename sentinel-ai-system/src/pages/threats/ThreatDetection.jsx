// ============================================
// SentinelAI - Threat Detection Page (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ThreatsDetectionTrend from '../../components/charts/ThreatsDetectionTrend';
import DetectedThreatsTable from '../../components/tables/DetectedThreatsTable';
import ThreatDetailsPanel from '../../components/common/ThreatDetailsPanel';
import { getThreatStats } from '../../services/threatsService';
import { Bug, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';

const ThreatDetection = () => {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [stats, setStats] = useState({
    malware: 0,
    suspicious: 0,
    knownThreats: 0,
    prevented: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getThreatStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch threat stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Malware',
      value: stats.malware.toString(),
      change: '+28%',
      icon: Bug,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      title: 'Suspicious Activity',
      value: stats.suspicious.toString(),
      change: '+16%',
      icon: ShieldAlert,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Known Threats',
      value: stats.knownThreats.toString(),
      change: '+8%',
      icon: ShieldX,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Prevented Threats',
      value: stats.prevented.toString(),
      change: '+35%',
      icon: ShieldCheck,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ];

  return (
    <DashboardLayout
      title="Threat Detection"
      subtitle="Detect today. Prevent tomorrow. Turning threats into understanding."
    >
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

      <div className="mb-6">
        <ThreatsDetectionTrend />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DetectedThreatsTable
            onSelectThreat={setSelectedThreat}
            selectedId={selectedThreat?.name}
          />
        </div>
        <div>
          <ThreatDetailsPanel
            threat={selectedThreat}
            onClose={() => setSelectedThreat(null)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ThreatDetection;