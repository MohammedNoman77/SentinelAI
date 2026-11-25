// ============================================
// SentinelAI - Related Entities (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { User, Monitor, Globe, Zap } from 'lucide-react';
import { getRelatedEntities } from '../../services/investigationService';

const riskStyles = {
  Critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
  High: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  MEDIUM: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Low: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  LOW: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

const RelatedEntities = () => {
  const [entities, setEntities] = useState({
    users: [],
    devices: [],
    ips: [],
    processes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRelatedEntities();
        setEntities(result.data.entities);
      } catch (err) {
        console.error('Failed to fetch entities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sections = [
    { key: 'users', title: 'Users', icon: User, color: 'text-purple-400' },
    { key: 'devices', title: 'Devices', icon: Monitor, color: 'text-blue-400' },
    { key: 'ips', title: 'IP Addresses', icon: Globe, color: 'text-cyan-400' },
    { key: 'processes', title: 'Processes', icon: Zap, color: 'text-orange-400' },
  ];

  if (loading) {
    return (
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
        <div className="h-48 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading entities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Related Entities</h3>
        <p className="text-xs text-sentinel-text-dim mt-1">
          الكيانات المرتبطة بالتحقيق
        </p>
      </div>

      <div className="space-y-5">
        {sections.map((section) => {
          const Icon = section.icon;
          const items = entities[section.key] || [];

          return (
            <div key={section.key}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${section.color}`} />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {section.title}
                </h4>
                <span className="text-[10px] text-sentinel-text-dim">
                  ({items.length})
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item, i) => {
                  const displayName = item.name || item.address;
                  const displaySub =
                    item.role || item.os || item.type || `PID: ${item.pid}`;

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border hover:border-cyan-400/30 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate font-mono">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-sentinel-text-dim truncate">
                          {displaySub}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-[10px] text-sentinel-text-dim">
                          {item.events} events
                        </span>
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-medium rounded border ${
                            riskStyles[item.risk] ||
                            'text-gray-400 bg-gray-500/10 border-gray-500/30'
                          }`}
                        >
                          {item.risk}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedEntities;