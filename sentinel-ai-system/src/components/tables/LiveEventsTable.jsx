// ============================================
// SentinelAI - Live Events Table (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import { getLiveEvents } from '../../services/monitoringService';

const severityStyles = {
  CRITICAL: 'bg-red-500/20 text-red-400',
  HIGH: 'bg-orange-500/20 text-orange-400',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400',
  LOW: 'bg-blue-500/20 text-blue-400',
};

const LiveEventsTable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLiveEvents();
        setEvents(result.data.events);
      } catch (err) {
        console.error('Failed to fetch live events:', err);
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
          <h3 className="text-lg font-bold text-white">Live Security Events</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">الأحداث الأمنية المباشرة</p>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live Feed</span>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading events...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-sentinel-text-dim border-b border-sentinel-border">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Event Type</th>
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <tr key={i} className="border-b border-sentinel-border/50 hover:bg-sentinel-panel-light/50 transition-colors">
                  <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">{event.time}</td>
                  <td className="py-3 text-sm text-white whitespace-nowrap">{event.type}</td>
                  <td className="py-3 text-xs text-sentinel-text-dim font-mono">{event.source}</td>
                  <td className="py-3 text-xs text-sentinel-text-dim font-mono">{event.destination}</td>
                  <td className="py-3 text-xs text-sentinel-text-dim">{event.user}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${severityStyles[event.severity]}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-sentinel-text-dim">{event.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LiveEventsTable;