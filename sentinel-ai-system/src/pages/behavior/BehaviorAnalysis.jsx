// ============================================
// SentinelAI - Behavior Analysis Page (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import UserBehaviorOverview from '../../components/charts/UserBehaviorOverview';
import BehaviorInsights from '../../components/charts/BehaviorInsights';
import RiskDistribution from '../../components/charts/RiskDistribution';
import TopBehavioralAnomalies from '../../components/tables/TopBehavioralAnomalies';
import { getBehaviorStats } from '../../services/behaviorService';
import { Users, Laptop, AlertTriangle, UserX } from 'lucide-react';

const BehaviorAnalysis = () => {
  const [stats, setStats] = useState({
    monitoredUsers: 0,
    monitoredDevices: 0,
    anomaliesDetected: 0,
    highRiskUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getBehaviorStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch behavior stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Monitored Users',
      value: stats.monitoredUsers.toString(),
      change: '+5%',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Monitored Devices',
      value: stats.monitoredDevices.toString(),
      change: '+3%',
      icon: Laptop,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Anomalies Detected',
      value: stats.anomaliesDetected.toString(),
      change: '+28%',
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'High Risk Users',
      value: stats.highRiskUsers.toString(),
      change: '+70%',
      icon: UserX,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <DashboardLayout
      title="Behavior Analysis"
      subtitle="Understand normal behavior. Detect what's not."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <UserBehaviorOverview />
        </div>
        <div>
          <BehaviorInsights />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopBehavioralAnomalies />
        <RiskDistribution />
      </div>
    </DashboardLayout>
  );
};

export default BehaviorAnalysis;