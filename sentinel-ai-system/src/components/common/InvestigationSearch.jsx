// ============================================
// SentinelAI - Investigation Search
// شريط البحث المتقدم للتحقيق
// UC-03-05: Investigate Security Activity
// ============================================

import { useState } from 'react';
import { Search } from 'lucide-react';

const InvestigationSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');

  const searchTypes = [
    { value: 'all', label: 'All Entities' },
    { value: 'user', label: 'Users' },
    { value: 'device', label: 'Devices' },
    { value: 'ip', label: 'IP Addresses' },
    { value: 'process', label: 'Processes' },
    { value: 'file', label: 'Files' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.({ query, searchType, timeRange });
  };

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Investigation Search</h3>
        <p className="text-xs text-sentinel-text-dim mt-1">
          ابحث عن أي كيان (مستخدم، جهاز، IP، عملية، ملف) للتحقيق فيه
        </p>
      </div>

      <form onSubmit={handleSearch}>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
          >
            {searchTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sentinel-text-dim" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by user, IP, device, or process..."
              className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 transition-colors outline-none"
            />
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
          >
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all"
          >
            <Search className="w-4 h-4" />
            Investigate
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestigationSearch;