// ============================================
// SentinelAI - Behavior Insights (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getBehaviorInsights } from '../../services/behaviorService';

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

const BehaviorInsights = () => {
  const [data, setData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeTab, setActiveTab] = useState('Behavior Profile');
  const [loading, setLoading] = useState(true);

  const tabs = ['Behavior Profile', 'Recent Activity', 'Risk Factors'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBehaviorInsights();
        setData(result.data.distribution);
        setTotalUsers(result.data.totalUsers);
      } catch (err) {
        console.error('Failed to fetch behavior insights:', err);
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
          <h3 className="text-lg font-bold text-white">Behavior Insights</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            رؤى سلوك المستخدمين
          </p>
        </div>
        <button className="text-xs text-cyan-400 hover:text-cyan-300">
          View Full Profile →
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading...</div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
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
                <p className="text-xl font-bold text-white">{totalUsers}</p>
                <p className="text-[10px] text-sentinel-text-dim">Users Analyzed</p>
              </div>
            </div>

            <div className="flex-1 space-y-2.5">
              {data.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sentinel-text-dim text-xs">{item.name}</span>
                  </div>
                  <span className="text-white font-medium text-xs">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-sentinel-border mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-sentinel-text-dim border-transparent hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {activeTab === 'Behavior Profile' && (
              <>
                <ProfileRow label="Normal Login Time" value="08:00 AM – 05:00 PM" />
                <ProfileRow label="Frequent Locations" value="Riyadh, SA" />
                <ProfileRow label="Common Devices" value="WS-1042, LAPTOP-7" />
                <ProfileRow label="Typical Activities" value="System Administration" />
              </>
            )}
            {activeTab === 'Recent Activity' && (
              <>
                <ProfileRow label="Last Login" value="Sep 20, 10:14 AM" />
                <ProfileRow label="Files Accessed" value="42 files" />
                <ProfileRow label="Applications Used" value="15 apps" />
                <ProfileRow label="Network Connections" value="128 connections" />
              </>
            )}
            {activeTab === 'Risk Factors' && (
              <>
                <ProfileRow label="Privilege Level" value="Standard User" />
                <ProfileRow label="MFA Status" value="Enabled" />
                <ProfileRow label="Password Age" value="45 days" />
                <ProfileRow label="Last Security Training" value="Aug 15, 2026" />
              </>
            )}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-[10px] font-bold text-red-400 mb-1 flex items-center gap-1.5">
              ⚠️ Anomalous Behavior Detected
            </p>
            <p className="text-[10px] text-sentinel-text-dim leading-relaxed">
              Login from new location (Jeddah, SA) at 02:14 AM. Multiple failed login attempts (5).
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-sentinel-text-dim">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

export default BehaviorInsights;