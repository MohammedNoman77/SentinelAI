// ============================================
// SentinelAI - Security Monitoring Page (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LiveEventsTable from '../../components/tables/LiveEventsTable';
import TopEventTypes from '../../components/charts/TopEventTypes';
import EventSourcesMap from '../../components/charts/EventSourcesMap';
import SecurityEventsChart from '../../components/charts/SecurityEventsChart';
import EventDistributionChart from '../../components/charts/EventDistributionChart';
import { getMonitoringStats } from '../../services/monitoringService';
import { Activity, AlertTriangle, Users, Laptop, Download, Radio } from 'lucide-react';

const SecurityMonitoring = () => {
  const [stats, setStats] = useState({
    events24h: 0,
    suspiciousEvents: 0,
    uniqueSources: 0,
    activeDevices: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getMonitoringStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch monitoring stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    { title: 'Events (24h)', value: stats.events24h.toLocaleString(), change: '+12%', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { title: 'Suspicious Events', value: stats.suspiciousEvents.toLocaleString(), change: '+28%', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Unique Sources', value: stats.uniqueSources.toLocaleString(), change: '+6%', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Active Devices', value: stats.activeDevices.toString(), change: '+3%', icon: Laptop, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <DashboardLayout
      title="Security Monitoring"
      subtitle="Real-time visibility into your security environment."
    >
      {/* Filter Bar */}
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none">
            <option>All Event Types</option>
            <option>Authentication</option>
            <option>Malware</option>
            <option>Network</option>
          </select>
          <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none">
            <option>All Severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
          </select>
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <Radio className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Live Feed</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-sentinel-panel border border-sentinel-border rounded-xl p-5 hover:border-cyan-400/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-sentinel-text-dim">{stat.title}</p>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-green-400">
                ↑ {stat.change} <span className="text-sentinel-text-dim">vs. last 24h</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SecurityEventsChart />
        </div>
        <div>
          <EventDistributionChart />
        </div>
      </div>

      {/* Live Events + Map */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <LiveEventsTable />
        </div>
        <div>
          <EventSourcesMap />
        </div>
      </div>

      {/* Top Event Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopEventTypes />
      </div>
    </DashboardLayout>
  );
};

export default SecurityMonitoring;