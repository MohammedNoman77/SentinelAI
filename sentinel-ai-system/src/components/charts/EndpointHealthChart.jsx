// ============================================
// SentinelAI - Endpoint Health Chart (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getEndpointHealth } from '../../services/endpointsService';

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

const EndpointHealthChart = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEndpointHealth();
        setData(result.data.distribution);
        setTotal(result.data.total);
      } catch (err) {
        console.error('Failed to fetch endpoint health:', err);
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
          <h3 className="text-lg font-bold text-white">Endpoint Health</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            الحالة الأمنية للأجهزة
          </p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>All Endpoints</option>
          <option>Windows Only</option>
          <option>Mac Only</option>
          <option>Linux Only</option>
        </select>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading chart...</div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative w-44 h-44 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
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
              <p className="text-2xl font-bold text-white">{total}</p>
              <p className="text-[10px] text-sentinel-text-dim">Total Endpoints</p>
            </div>
          </div>

          <div className="flex-1 space-y-2.5">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sentinel-text-dim text-xs">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-xs">{item.value}%</span>
                  <span className="text-[10px] text-sentinel-text-dim">
                    ({item.count})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EndpointHealthChart;