// ============================================
// SentinelAI - Top Event Types
// مخطط شريطي بأنواع الأحداث الأكثر تكراراً
// ============================================

const data = [
  { name: 'Failed Login', value: 32, color: '#3b82f6' },
  { name: 'Malware Detection', value: 18, color: '#ef4444' },
  { name: 'Suspicious Activity', value: 16, color: '#f59e0b' },
  { name: 'Policy Violation', value: 12, color: '#a855f7' },
  { name: 'Data Access', value: 11, color: '#8b5cf6' },
  { name: 'Others', value: 11, color: '#6b7280' },
];

const TopEventTypes = () => {
  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Top Event Types</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">أنواع الأحداث الأكثر تكراراً</p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
        </select>
      </div>

      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-sentinel-text-dim">{item.name}</span>
              <span className="text-xs font-medium text-white">{item.value}%</span>
            </div>
            <div className="h-2 bg-sentinel-panel-light rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${item.value * 3}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopEventTypes;