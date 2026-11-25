// ============================================
// SentinelAI - AI Findings (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Info } from 'lucide-react';
import { getAIFindings } from '../../services/investigationService';

const iconMap = {
  anomaly: AlertTriangle,
  correlation: Brain,
  recommendation: Lightbulb,
  insight: TrendingUp,
};

const colorMap = {
  red: { text: 'text-red-400', bg: 'bg-red-500/10' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10' },
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10' },
};

const AIFindings = () => {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAIFindings();
        setFindings(result.data.findings);
      } catch (err) {
        console.error('Failed to fetch AI findings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">AI Findings</h3>
          <p className="text-xs text-sentinel-text-dim">
            نتائج التحليل بالذكاء الاصطناعي
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-400 font-medium">Active</span>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading findings...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {findings.map((finding, i) => {
            const Icon = iconMap[finding.type] || Brain;
            const colors = colorMap[finding.color] || colorMap.cyan;

            return (
              <div
                key={i}
                className="p-4 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border hover:border-cyan-400/30 transition-colors"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white mb-1">
                      {finding.title}
                    </h4>
                    <p className="text-xs text-sentinel-text-dim leading-relaxed">
                      {finding.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-sentinel-border">
                  <span className="text-[10px] text-sentinel-text-dim whitespace-nowrap">
                    Confidence
                  </span>
                  <div className="flex-1 h-1.5 bg-sentinel-panel-light rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        finding.confidence >= 90
                          ? 'bg-green-500'
                          : finding.confidence >= 80
                          ? 'bg-cyan-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${finding.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white whitespace-nowrap">
                    {finding.confidence}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-sentinel-border">
        <div className="flex items-center gap-2 text-[10px] text-sentinel-text-dim">
          <Info className="w-3 h-3" />
          <span>
            AI findings are explainable and traceable to source data
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIFindings;