// ============================================
// SentinelAI - Report Preview Panel (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { FileText, Download, Maximize2, Shield, AlertTriangle, Users, Monitor, CheckCircle } from 'lucide-react';
import { getReportInsights } from '../../services/reportsService';

const ReportPreviewPanel = ({ report }) => {
  const [insights, setInsights] = useState({
    highRiskIncidents: 0,
    affectedUsers: 0,
    affectedEndpoints: 0,
    resolvedIncidents: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getReportInsights();
        setInsights(result.data);
      } catch (err) {
        console.error('Failed to fetch report insights:', err);
      }
    };
    fetchData();
  }, []);

  const insightCards = [
    { title: 'High Risk Incidents', value: insights.highRiskIncidents, change: '+27%', trend: 'up', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Affected Users', value: insights.affectedUsers, change: '-13%', trend: 'down', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Affected Endpoints', value: insights.affectedEndpoints, change: '-18%', trend: 'down', icon: Monitor, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Resolved Incidents', value: insights.resolvedIncidents, change: '+55%', trend: 'up', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Report Preview */}
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Report Preview</h3>
            <p className="text-xs text-sentinel-text-dim mt-1">معاينة التقرير</p>
          </div>
          <button className="p-1.5 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {!report ? (
          <div className="aspect-video rounded-lg bg-sentinel-bg/50 border border-sentinel-border flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-12 h-12 text-sentinel-text-dim mx-auto mb-3" />
              <p className="text-sentinel-text-dim text-sm">
                اختر تقريراً لعرض معاينته
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative aspect-video rounded-lg bg-gradient-to-br from-sentinel-bg to-blue-900/20 border border-sentinel-border mb-4 flex items-center justify-center overflow-hidden">
              <div className="text-center relative z-10">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-sm font-bold text-white">{report.name}</h4>
                <p className="text-[10px] text-sentinel-text-dim mt-1">
                  {report.period}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[10px] text-sentinel-text-dim mb-1">Type</p>
                <p className="text-xs font-medium text-white">{report.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-sentinel-text-dim mb-1">Period</p>
                <p className="text-xs font-medium text-white">{report.period}</p>
              </div>
              <div>
                <p className="text-[10px] text-sentinel-text-dim mb-1">Format</p>
                <p className="text-xs font-medium text-white">PDF</p>
              </div>
              <div>
                <p className="text-[10px] text-sentinel-text-dim mb-1">Size</p>
                <p className="text-xs font-medium text-white">{report.size}</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </>
        )}
      </div>

      {/* Report Insights */}
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Report Insights</h3>
            <p className="text-xs text-sentinel-text-dim mt-1">ملخص الرؤى</p>
          </div>
          <button className="text-xs text-cyan-400 hover:text-cyan-300">
            View Full Report →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {insightCards.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-3 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${item.bg}`}>
                    <Icon className={`w-3 h-3 ${item.color}`} />
                  </div>
                  <p className="text-[10px] text-sentinel-text-dim">{item.title}</p>
                </div>
                <p className="text-xl font-bold text-white">{item.value}</p>
                <p className={`text-[10px] font-medium ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.trend === 'up' ? '↑' : '↓'} {item.change}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewPanel;