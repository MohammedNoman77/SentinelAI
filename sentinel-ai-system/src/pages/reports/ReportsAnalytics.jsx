// ============================================
// SentinelAI - Reports & Analytics Page (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ReportsTable from '../../components/tables/ReportsTable';
import ReportPreviewPanel from '../../components/common/ReportPreviewPanel';
import PopularReports from '../../components/common/PopularReports';
import { getReportStats } from '../../services/reportsService';
import { FileText, Calendar, Shield, Clock } from 'lucide-react';

const ReportsAnalytics = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    compliance: 0,
    avgTime: '32s',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getReportStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch report stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Reports',
      value: stats.total.toString(),
      change: '+23%',
      icon: FileText,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Scheduled Reports',
      value: stats.scheduled.toString(),
      change: '+50%',
      icon: Calendar,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Compliance Reports',
      value: stats.compliance.toString(),
      change: '+33%',
      icon: Shield,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Avg. Generation Time',
      value: stats.avgTime,
      change: '-40%',
      icon: Clock,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <DashboardLayout
      title="Reports & Analytics"
      subtitle="Transform security data into actionable intelligence."
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
                <span className="text-sentinel-text-dim">vs. last 30 days</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ReportsTable
            onSelectReport={setSelectedReport}
            selectedId={selectedReport?.id}
          />
        </div>
        <div>
          <ReportPreviewPanel report={selectedReport} />
        </div>
      </div>

      <PopularReports />
    </DashboardLayout>
  );
};

export default ReportsAnalytics;