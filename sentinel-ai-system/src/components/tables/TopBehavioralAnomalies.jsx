// ============================================
// SentinelAI - Top Behavioral Anomalies (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { Clock, MapPin, FileText, Upload, Shield } from 'lucide-react';
import { getTopAnomalies } from '../../services/behaviorService';

const iconMap = [
  { icon: Clock, color: 'text-red-400', bg: 'bg-red-500/10' },
  { icon: MapPin, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Upload, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const TopBehavioralAnomalies = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTopAnomalies();
        setAnomalies(result.data.anomalies);
      } catch (err) {
        console.error('Failed to fetch anomalies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Top Behavioral Anomalies</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            أكثر الانحرافات السلوكية المكتشفة
          </p>
        </div>
        <button className="text-xs text-cyan-400 hover:text-cyan-300">
          View All →
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading...</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-2 text-xs text-sentinel-text-dim pb-2 border-b border-sentinel-border">
            <div className="col-span-1">#</div>
            <div className="col-span-7">Behavior Type</div>
            <div className="col-span-2 text-right">Count</div>
            <div className="col-span-2 text-right">Trend</div>
          </div>

          {anomalies.map((item, i) => {
            const config = iconMap[i % iconMap.length];
            const Icon = config.icon;

            return (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 items-center py-3 hover:bg-sentinel-panel-light/50 rounded-lg px-2 transition-colors cursor-pointer"
              >
                <div className="col-span-1 text-xs text-sentinel-text-dim">{i + 1}</div>
                <div className="col-span-7 flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${config.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  </div>
                  <span className="text-xs text-white">{item.name}</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-xs font-bold text-white">{item.count}</span>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <span className="text-xs font-medium text-red-400">↑ {item.trend}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopBehavioralAnomalies;