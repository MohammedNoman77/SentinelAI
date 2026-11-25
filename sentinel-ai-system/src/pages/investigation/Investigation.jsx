// ============================================
// SentinelAI - Investigation Page (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import InvestigationSearch from '../../components/common/InvestigationSearch';
import EventsTimeline from '../../components/common/EventsTimeline';
import RelatedEntities from '../../components/common/RelatedEntities';
import AIFindings from '../../components/common/AIFindings';
import { getInvestigationStats, searchInvestigation } from '../../services/investigationService';
import { Activity, Clock, AlertTriangle, Target } from 'lucide-react';

const Investigation = () => {
  const [stats, setStats] = useState({
    activeInvestigations: 0,
    eventsAnalyzed: 0,
    aiFindings: 0,
    relatedEntities: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getInvestigationStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch investigation stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = async (searchData) => {
    try {
      const result = await searchInvestigation(searchData.query, searchData.searchType);
      console.log('Search results:', result.data);
      // يمكن إضافة عرض النتائج لاحقاً
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const statsCards = [
    {
      title: 'Active Investigations',
      value: stats.activeInvestigations.toString(),
      icon: Activity,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Events Analyzed',
      value: stats.eventsAnalyzed.toLocaleString(),
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'AI Findings',
      value: stats.aiFindings.toString(),
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Related Entities',
      value: stats.relatedEntities.toString(),
      icon: Target,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <DashboardLayout
      title="Investigation"
      subtitle="Deep dive into security events. Uncover the full story."
    >
      <div className="mb-6">
        <InvestigationSearch onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-sentinel-panel border border-sentinel-border rounded-xl p-5 hover:border-cyan-400/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-sentinel-text-dim">{stat.title}</p>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <EventsTimeline />
        </div>
        <div className="space-y-6">
          <RelatedEntities />
          <AIFindings />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Investigation;
