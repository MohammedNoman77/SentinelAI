// ============================================
// SentinelAI - Top Threats Table
// ============================================

import { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, Bug } from 'lucide-react';
import { getTopThreats } from '../../services/dashboardService';

const TopThreatsTable = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTopThreats();
        setThreats(result.data.threats);
      } catch (err) {
        console.error('Failed to fetch threats:', err);
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
          <h3 className="text-lg font-bold text-white">Top Threats</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            أعلى التهديدات المكتشفة
          </p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
        </select>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading...</div>
        </div>
      ) : threats.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sentinel-text-dim text-sm">لا توجد تهديدات</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs text-sentinel-text-dim pb-2 border-b border-sentinel-border">
              <div className="col-span-6">Threat Type</div>
              <div className="col-span-3 text-right">Count</div>
              <div className="col-span-3 text-right">Trend</div>
            </div>

            {threats.map((threat, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 items-center py-2.5 hover:bg-sentinel-panel-light/50 rounded-lg px-2 transition-colors"
              >
                <div className="col-span-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Bug className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-sm text-white truncate">{threat.name}</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-sm font-bold text-white">{threat.count}</span>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-1">
                  {threat.trendUp ? (
                    <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      threat.trendUp ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {threat.trend}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-sentinel-border">
            <button className="w-full flex items-center justify-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              View All Threats
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopThreatsTable;