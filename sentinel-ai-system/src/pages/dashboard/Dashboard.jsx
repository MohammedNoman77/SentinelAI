// ============================================
// SentinelAI - Dashboard Page (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SecurityEventsChart from '../../components/charts/SecurityEventsChart';
import EventDistributionChart from '../../components/charts/EventDistributionChart';
import RecentAlertsTable from '../../components/tables/RecentAlertsTable';
import TopThreatsTable from '../../components/tables/TopThreatsTable';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/dashboardService';
import { Activity, AlertTriangle, Laptop, Users, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = stats
    ? [
        { title: 'Total Events', value: stats.totalEvents.value.toLocaleString(), change: stats.totalEvents.change, icon: Activity, tone: 'cyan' },
        { title: 'Active Incidents', value: stats.activeIncidents.value.toString(), change: stats.activeIncidents.change, icon: AlertTriangle, tone: 'rose' },
        { title: 'Monitored Devices', value: stats.monitoredDevices.value.toLocaleString(), change: stats.monitoredDevices.change, icon: Laptop, tone: 'blue' },
        { title: 'Monitored Users', value: stats.monitoredUsers.value.toLocaleString(), change: stats.monitoredUsers.change, icon: Users, tone: 'violet' },
      ]
    : [
        { title: 'Total Events', value: '—', change: '', icon: Activity, tone: 'cyan' },
        { title: 'Active Incidents', value: '—', change: '', icon: AlertTriangle, tone: 'rose' },
        { title: 'Monitored Devices', value: '—', change: '', icon: Laptop, tone: 'blue' },
        { title: 'Monitored Users', value: '—', change: '', icon: Users, tone: 'violet' },
      ];

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Monitor. Detect. Respond. A safer tomorrow through intelligence."
    >
      <section className="sentinel-card relative overflow-hidden rounded-2xl p-5 sm:p-7 mb-6">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-cyan-500/[0.08] to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400 mb-2">Security overview</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome back, {user?.name || 'Analyst'}</h2>
            <p className="text-sm text-sentinel-text-dim">
              {stats?.activeIncidents.value || 0} active incidents require your attention.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
            <div><p className="text-xs text-sentinel-text-dim">Protection status</p><p className="text-sm font-semibold text-emerald-400">Systems operational</p></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          const tones = {
            cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-400',
            rose: 'border-rose-400/20 bg-rose-400/10 text-rose-400',
            blue: 'border-blue-400/20 bg-blue-400/10 text-blue-400',
            violet: 'border-violet-400/20 bg-violet-400/10 text-violet-400',
          };
          return (
            <div key={i} className="sentinel-card group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
              <div className="flex items-start justify-between mb-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tones[stat.tone]}`}><Icon className="h-5 w-5" /></div>
                {stat.change && <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400"><ArrowUpRight className="h-3.5 w-3.5" />{stat.change}</div>}
              </div>
              <p className="text-sm text-sentinel-text-dim mb-1">{stat.title}</p>
              <p className="text-3xl font-bold tracking-tight text-white">{stat.value}</p>
              {stat.change && <p className="mt-2 text-[11px] text-sentinel-text-dim">Compared with previous 24h</p>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SecurityEventsChart />
        </div>
        <div>
          <EventDistributionChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlertsTable />
        <TopThreatsTable />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;