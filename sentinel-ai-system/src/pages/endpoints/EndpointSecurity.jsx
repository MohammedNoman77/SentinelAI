// ============================================
// SentinelAI - Endpoint Security Page (Real Data)
// صفحة أمن نقاط النهاية
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import EndpointsTable from '../../components/tables/EndpointsTable';
import EndpointHealthChart from '../../components/charts/EndpointHealthChart';
import EndpointDetailsPanel from '../../components/common/EndpointDetailsPanel';
import { getEndpointStats } from '../../services/endpointsService';
import { Monitor, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';

const EndpointSecurity = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    protected: 0,
    atRisk: 0,
    isolated: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getEndpointStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch endpoint stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Endpoints',
      value: loading ? '...' : stats.total.toString(),
      change: '+3%',
      icon: Monitor,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Protected',
      value: loading ? '...' : stats.protected.toString(),
      change: '+2%',
      icon: ShieldCheck,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      title: 'At Risk',
      value: loading ? '...' : stats.atRisk.toString(),
      change: '+12%',
      icon: ShieldAlert,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Isolated',
      value: loading ? '...' : stats.isolated.toString(),
      change: '+25%',
      icon: Lock,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <DashboardLayout
      title="Endpoint Security"
      subtitle="Monitor, protect, and manage all endpoints across your organization."
    >
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

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <EndpointsTable
            onSelectEndpoint={setSelectedEndpoint}
            selectedId={selectedEndpoint?.id}
          />
        </div>
        <div>
          <EndpointDetailsPanel
            endpoint={selectedEndpoint}
            onClose={() => setSelectedEndpoint(null)}
          />
        </div>
      </div>

      {/* Health Chart */}
      <div className="mt-6">
        <EndpointHealthChart />
      </div>
    </DashboardLayout>
  );
};

export default EndpointSecurity;