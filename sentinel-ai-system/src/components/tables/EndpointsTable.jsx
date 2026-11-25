// ============================================
// SentinelAI - Endpoints Table (Real Data)
// جدول الأجهزة (نقاط النهاية)
// ============================================

import { useState, useEffect } from 'react';
import { Monitor, Shield, ShieldAlert, ShieldCheck, WifiOff } from 'lucide-react';
import { getEndpoints } from '../../services/endpointsService';

const statusConfig = {
  Protected: { color: 'text-green-400', bg: 'bg-green-500/20', icon: ShieldCheck },
  'At Risk': { color: 'text-orange-400', bg: 'bg-orange-500/20', icon: ShieldAlert },
  Isolated: { color: 'text-red-400', bg: 'bg-red-500/20', icon: Shield },
  Offline: { color: 'text-gray-400', bg: 'bg-gray-500/20', icon: WifiOff },
};

const EndpointsTable = ({ onSelectEndpoint, selectedId }) => {
  const [endpoints, setEndpoints] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Endpoints');

  const tabs = ['All Endpoints', 'At Risk', 'Isolated', 'Offline'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeTab !== 'All Endpoints') {
          params.status = activeTab;
        }

        const result = await getEndpoints(params);
        setEndpoints(result.data.endpoints);
        setPagination(result.data.pagination);
      } catch (err) {
        console.error('Failed to fetch endpoints:', err);
        setEndpoints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Endpoints</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            جميع الأجهزة في المؤسسة
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all">
          + Add Endpoint
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-sentinel-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-cyan-400 border-cyan-400'
                : 'text-sentinel-text-dim border-transparent hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading endpoints...</div>
        </div>
      ) : endpoints.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sentinel-text-dim text-sm">لا توجد أجهزة مطابقة</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-sentinel-text-dim border-b border-sentinel-border">
                  <th className="pb-3 font-medium w-8">
                    <input
                      type="checkbox"
                      className="rounded bg-sentinel-panel-light border-sentinel-border"
                    />
                  </th>
                  <th className="pb-3 font-medium">Endpoint</th>
                  <th className="pb-3 font-medium">OS</th>
                  <th className="pb-3 font-medium">IP Address</th>
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-center">Threats</th>
                  <th className="pb-3 font-medium">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((endpoint) => {
                  const config =
                    statusConfig[endpoint.status] || statusConfig.Protected;
                  const StatusIcon = config.icon;
                  const isSelected = selectedId === endpoint.id;

                  return (
                    <tr
                      key={endpoint.id}
                      onClick={() => onSelectEndpoint(endpoint)}
                      className={`border-b border-sentinel-border/50 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400'
                          : 'hover:bg-sentinel-panel-light/50'
                      }`}
                    >
                      <td className="py-3">
                        <input
                          type="checkbox"
                          className="rounded bg-sentinel-panel-light border-sentinel-border"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-sentinel-panel-light flex items-center justify-center flex-shrink-0">
                            <Monitor className="w-3.5 h-3.5 text-sentinel-text-dim" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-white whitespace-nowrap">
                              {endpoint.hostname}
                            </p>
                            <p className="text-[10px] text-sentinel-text-dim font-mono">
                              {endpoint.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">
                        {endpoint.os}
                      </td>
                      <td className="py-3 text-xs text-sentinel-text-dim font-mono whitespace-nowrap">
                        {endpoint.ip}
                      </td>
                      <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">
                        {endpoint.user}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium rounded ${config.bg} ${config.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {endpoint.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                            endpoint.threats === 0
                              ? 'bg-green-500/20 text-green-400'
                              : endpoint.threats < 3
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {endpoint.threats}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">
                        {endpoint.lastSeen}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-sentinel-border">
            <p className="text-xs text-sentinel-text-dim">
              Showing{' '}
              <span className="text-white font-medium">
                1-{endpoints.length}
              </span>{' '}
              of{' '}
              <span className="text-white font-medium">
                {pagination?.total || endpoints.length}
              </span>{' '}
              endpoints
            </p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded text-sentinel-text-dim hover:bg-sentinel-panel-light text-xs">
                ‹
              </button>
              <button className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 text-xs font-medium">
                1
              </button>
              <button className="w-8 h-8 rounded text-sentinel-text-dim hover:bg-sentinel-panel-light text-xs">
                ›
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EndpointsTable;