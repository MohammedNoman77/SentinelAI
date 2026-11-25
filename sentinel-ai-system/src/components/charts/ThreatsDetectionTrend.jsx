// ============================================
// SentinelAI - Threats Detection Trend
// مخطط متعدد الخطوط لاتجاهات التهديدات
// ============================================

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

const data = [
  { date: 'Sep 13', Malware: 32, 'Suspicious Activity': 20, 'Policy Violation': 10, Others: 5 },
  { date: 'Sep 14', Malware: 38, 'Suspicious Activity': 22, 'Policy Violation': 12, Others: 6 },
  { date: 'Sep 15', Malware: 45, 'Suspicious Activity': 28, 'Policy Violation': 14, Others: 7 },
  { date: 'Sep 16', Malware: 52, 'Suspicious Activity': 25, 'Policy Violation': 11, Others: 8 },
  { date: 'Sep 17', Malware: 58, 'Suspicious Activity': 28, 'Policy Violation': 16, Others: 10 },
  { date: 'Sep 18', Malware: 50, 'Suspicious Activity': 26, 'Policy Violation': 15, Others: 9 },
  { date: 'Sep 19', Malware: 42, 'Suspicious Activity': 22, 'Policy Violation': 12, Others: 8 },
  { date: 'Sep 20', Malware: 45, 'Suspicious Activity': 24, 'Policy Violation': 14, Others: 9 },
];

const lineColors = {
  Malware: '#ef4444',
  'Suspicious Activity': '#8b5cf6',
  'Policy Violation': '#f59e0b',
  Others: '#06b6d4',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sentinel-panel border border-sentinel-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-sentinel-text-dim mb-2">{label}, 2026</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
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

const ThreatsDetectionTrend = () => {
  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Threats Detection Trend</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            اتجاهات كشف التهديدات على مدار الأسبوع
          </p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>Last 7 days</option>
          <option>Last 24 hours</option>
          <option>Last 30 days</option>
        </select>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            {Object.entries(lineColors).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThreatsDetectionTrend;