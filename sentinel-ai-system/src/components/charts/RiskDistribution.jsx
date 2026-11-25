// ============================================
// SentinelAI - Risk Distribution Chart
// مخطط شريطي لتوزيع المخاطر
// ============================================

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { level: 'Low', count: 312, color: '#3b82f6' },
  { level: 'Medium', count: 198, color: '#f59e0b' },
  { level: 'High', count: 87, color: '#ef4444' },
  { level: 'Critical', count: 24, color: '#dc2626' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sentinel-panel border border-sentinel-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-sentinel-text-dim mb-1">{payload[0].payload.level} Risk</p>
        <p className="text-sm font-bold text-white">{payload[0].value} users</p>
      </div>
    );
  }
  return null;
};

const RiskDistribution = () => {
  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Risk Distribution</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            توزيع المخاطر بين المستخدمين
          </p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>All Users</option>
          <option>High Risk Only</option>
        </select>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="level" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6, 182, 212, 0.05)' }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskDistribution;