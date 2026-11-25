// ============================================
// SentinelAI - User Behavior Overview (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getBehaviorOverview } from '../../services/behaviorService';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sentinel-panel border border-sentinel-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-sentinel-text-dim mb-2">{label}, 2026</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sentinel-text-dim">{entry.name}</span>
            </div>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const UserBehaviorOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBehaviorOverview();
        setData(result.data.trend);
      } catch (err) {
        console.error('Failed to fetch behavior overview:', err);
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
          <h3 className="text-lg font-bold text-white">User Behavior Overview</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            نظرة عامة على سلوك المستخدمين
          </p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>Last 7 days</option>
          <option>Last 24 hours</option>
          <option>Last 30 days</option>
        </select>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading chart...</div>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="normal"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 3, strokeWidth: 0 }}
                name="Normal Behavior"
              />
              <Line
                type="monotone"
                dataKey="suspicious"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }}
                name="Suspicious Behavior"
              />
              <Line
                type="monotone"
                dataKey="anomalies"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 3, strokeWidth: 0 }}
                name="Anomalies"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default UserBehaviorOverview;