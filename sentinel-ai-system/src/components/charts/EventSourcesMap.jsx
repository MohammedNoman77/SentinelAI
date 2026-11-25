// ============================================
// SentinelAI - Event Sources Map
// خريطة مصادر الأحداث (محاكاة)
// ============================================

import { Globe } from 'lucide-react';

const eventSources = [
  { country: 'United States', ip: '203.0.113.45', events: 24, level: 'high', x: 22, y: 38 },
  { country: 'Germany', ip: '185.199.110.3', events: 18, level: 'high', x: 52, y: 32 },
  { country: 'China', ip: '112.5.44.21', events: 15, level: 'medium', x: 78, y: 42 },
  { country: 'Brazil', ip: '177.54.10.8', events: 12, level: 'medium', x: 32, y: 68 },
  { country: 'India', ip: '49.36.22.11', events: 9, level: 'low', x: 68, y: 52 },
  { country: 'Russia', ip: '95.163.212.5', events: 7, level: 'low', x: 62, y: 22 },
];

const levelConfig = {
  high: { bg: 'bg-red-500', text: 'text-red-400' },
  medium: { bg: 'bg-yellow-500', text: 'text-yellow-400' },
  low: { bg: 'bg-blue-500', text: 'text-blue-400' },
};

const EventSourcesMap = () => {
  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Event Sources Map</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">مصادر الأحداث حسب الموقع الجغرافي</p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>All Sources</option>
          <option>Malicious Only</option>
        </select>
      </div>

      <div className="relative h-64 rounded-lg bg-sentinel-bg/50 border border-sentinel-border overflow-hidden">
        {/* شبكة الخلفية */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* أيقونة الكرة الأرضية */}
        <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-sentinel-border/40" />

        {/* نقاط الأحداث */}
        {eventSources.map((source, i) => {
          const colors = levelConfig[source.level];
          return (
            <div
              key={i}
              className="absolute group cursor-pointer z-10"
              style={{ left: `${source.x}%`, top: `${source.y}%` }}
            >
              <div className="relative">
                <div className={`absolute inset-0 rounded-full ${colors.bg} animate-ping opacity-60`} />
                <div className={`relative w-3 h-3 rounded-full ${colors.bg} ring-4 ring-white/10`} />
              </div>

              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-sentinel-panel border border-sentinel-border rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                <p className="text-xs font-medium text-white">{source.country}</p>
                <p className="text-[10px] text-sentinel-text-dim font-mono">{source.ip}</p>
                <p className={`text-[10px] font-medium ${colors.text}`}>{source.events} events</p>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sentinel-text-dim">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-sentinel-text-dim">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sentinel-text-dim">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSourcesMap;