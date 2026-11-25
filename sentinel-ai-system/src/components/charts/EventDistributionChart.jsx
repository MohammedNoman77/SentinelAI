// ============================================
// SentinelAI - Event Distribution Chart
// ============================================

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getEventDistribution } from '../../services/dashboardService';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sentinel-panel border border-sentinel-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-sentinel-text-dim mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold text-white">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const EventDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEventDistribution();
        setData(result.data.distribution);
      } catch (err) {
        console.error('Failed to fetch distribution:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // حساب الإجمالي للعرض في المنتصف
  const total = 560; // أو يمكن حسابه من API

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Event Distribution</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            توزيع الأحداث حسب النوع
          </p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
        </select>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading...</div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-lg font-bold text-white">{total.toLocaleString()}</p>
              <p className="text-[10px] text-sentinel-text-dim">Total Events</p>
            </div>
          </div>

          <div className="w-full space-y-2">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sentinel-text-dim">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDistributionChart;