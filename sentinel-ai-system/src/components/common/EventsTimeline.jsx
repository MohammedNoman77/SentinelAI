// ============================================
// SentinelAI - Events Timeline (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import {
  UserX,
  Bug,
  Globe,
  Lock,
  FileText,
  Zap,
  ShieldAlert,
  Activity,
} from 'lucide-react';
import { getEventsTimeline } from '../../services/investigationService';

const getIcon = (type) => {
  const icons = {
    IDENTITY: UserX,
    EDR: Bug,
    NETWORK: Globe,
    CLOUD: Zap,
    EMAIL: FileText,
    ENDPOINT: ShieldAlert,
    System: Activity,
  };
  return icons[type] || Activity;
};

const getColor = (severity) => {
  const colors = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-blue-500',
  };
  return colors[severity] || 'bg-gray-500';
};

const severityStyles = {
  CRITICAL: 'bg-red-500/20 text-red-400',
  HIGH: 'bg-orange-500/20 text-orange-400',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400',
  LOW: 'bg-blue-500/20 text-blue-400',
};

const EventsTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEventsTimeline();
        setEvents(result.data.timeline);
      } catch (err) {
        console.error('Failed to fetch timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEvents =
    filter === 'all'
      ? events
      : events.filter((e) => e.severity === filter);

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Event Timeline</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            التسلسل الزمني للأحداث
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
        >
          <option value="all">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading timeline...</div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sentinel-text-dim text-sm">لا توجد أحداث</p>
        </div>
      ) : (
        <div className="relative space-y-1 max-h-[600px] overflow-y-auto pr-2">
          {filteredEvents.map((event, i) => {
            const Icon = getIcon(event.type);
            const isLast = i === filteredEvents.length - 1;

            return (
              <div key={i} className="flex gap-3 group">
                <div className="flex flex-col items-center pt-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${getColor(
                      event.severity
                    )} ring-4 ring-sentinel-panel z-10`}
                  />
                  {!isLast && (
                    <div className="w-px flex-1 bg-sentinel-border my-1" />
                  )}
                </div>

                <div className="flex-1 pb-5">
                  <div className="bg-sentinel-panel-light/40 border border-sentinel-border rounded-lg p-3 hover:border-cyan-400/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-sentinel-text-dim flex-shrink-0" />
                        <span className="text-xs font-bold text-white">
                          {event.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-sentinel-text-dim font-mono whitespace-nowrap">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-sentinel-text-dim mb-2 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[9px] font-medium rounded ${
                          severityStyles[event.severity]
                        }`}
                      >
                        {event.severity}
                      </span>
                      <span className="text-[10px] text-sentinel-text-dim">
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsTimeline;