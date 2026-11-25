// ============================================
// SentinelAI - Popular Reports
// بطاقات التقارير الشائعة
// ============================================

import { FileText, TrendingUp, User, Monitor, Shield, Plus } from 'lucide-react';

const reports = [
  {
    icon: FileText,
    title: 'Executive Summary',
    desc: 'High-level security posture',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    hover: 'hover:border-cyan-400/50',
  },
  {
    icon: TrendingUp,
    title: 'Threat Trends',
    desc: 'Detection and attack trends',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    hover: 'hover:border-purple-400/50',
  },
  {
    icon: User,
    title: 'User Behavior',
    desc: 'Anomalies and risk analysis',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    hover: 'hover:border-blue-400/50',
  },
  {
    icon: Monitor,
    title: 'Endpoint Health',
    desc: 'Device security status',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    hover: 'hover:border-orange-400/50',
  },
  {
    icon: Shield,
    title: 'Compliance Report',
    desc: 'NCA / ISO / Regulatory',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    hover: 'hover:border-green-400/50',
  },
  {
    icon: Plus,
    title: 'Custom Report',
    desc: 'Build your own report',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    hover: 'hover:border-gray-400/50',
  },
];

const PopularReports = () => {
  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Popular Reports</h3>
        <p className="text-xs text-sentinel-text-dim mt-1">التقارير الأكثر استخداماً</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {reports.map((report, i) => {
          const Icon = report.icon;
          return (
            <button
              key={i}
              className={`p-4 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border ${report.hover} transition-all text-left group`}
            >
              <div className={`inline-flex p-2 rounded-lg ${report.bg} mb-3`}>
                <Icon className={`w-5 h-5 ${report.color}`} />
              </div>
              <p className="text-xs font-bold text-white mb-1">{report.title}</p>
              <p className="text-[10px] text-sentinel-text-dim leading-relaxed">
                {report.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PopularReports;