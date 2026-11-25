// ============================================
// SentinelAI - Response Workflow
// سير عمل الاستجابة للحوادث
// UC-04-05: Execute Response Actions
// ============================================

import { Search, Shield, Settings, RefreshCw, Check } from 'lucide-react';

const steps = [
  { id: 1, name: 'Identify', icon: Search, status: 'Completed', time: 'Sep 20, 10:14 AM' },
  { id: 2, name: 'Contain', icon: Shield, status: 'In Progress', time: 'Started 10:28 AM' },
  { id: 3, name: 'Eradicate', icon: Settings, status: 'Pending', time: null },
  { id: 4, name: 'Recover', icon: RefreshCw, status: 'Pending', time: null },
  { id: 5, name: 'Close', icon: Check, status: 'Pending', time: null },
];

const statusConfig = {
  Completed: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'bg-green-500' },
  'In Progress': { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'bg-cyan-500' },
  Pending: { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', icon: 'bg-gray-600' },
};

const ResponseWorkflow = () => {
  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Response Workflow</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">سير عمل الاستجابة للحادثة INC-2026-1041</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-medium border border-red-500/30">
          Critical Incident
        </span>
      </div>

      <div className="flex items-start justify-between gap-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const config = statusConfig[step.status];
          const isLast = i === steps.length - 1;

          return (
            <div key={step.id} className="flex-1 flex items-start">
              <div className="flex flex-col items-center flex-1">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 ${config.border} ${config.bg} transition-all`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  {step.status === 'Completed' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-sentinel-panel">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {step.status === 'In Progress' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-sentinel-panel animate-pulse" />
                  )}
                </div>
                <p className={`text-xs font-bold mt-3 ${config.color}`}>{step.id}. {step.name}</p>
                <p className="text-[10px] text-sentinel-text-dim mt-1">{step.status}</p>
                {step.time && (
                  <p className="text-[10px] text-sentinel-text-dim mt-0.5">{step.time}</p>
                )}
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 bg-sentinel-border mt-6 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponseWorkflow;