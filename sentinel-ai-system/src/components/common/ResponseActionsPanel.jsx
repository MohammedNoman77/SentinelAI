// ============================================
// SentinelAI - Response Actions Panel (RBAC)
// الإجراءات الموصى بها - View Only لمحلل SOC
// ============================================

import { useState } from 'react';
import { Play, Shield, Lock, Trash2, Key, Search, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const actions = [
  { id: 1, icon: Lock, label: 'Isolate affected endpoint', detail: 'WS-1042', color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 2, icon: Shield, label: 'Block malicious IP', detail: '185.199.110.3', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 3, icon: Trash2, label: 'Terminate malicious process', detail: 'powershell.exe (PID: 4821)', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 4, icon: Key, label: 'Reset user credentials', detail: 'ahmed.s', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 5, icon: Search, label: 'Search for similar activity', detail: 'Across all endpoints', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

const ResponseActionsPanel = () => {
  const { canExecuteResponse } = useAuth();
  const [runningActions, setRunningActions] = useState({});

  const handleRun = (id) => {
    if (!canExecuteResponse) return;

    setRunningActions((prev) => ({ ...prev, [id]: 'running' }));
    setTimeout(() => {
      setRunningActions((prev) => ({ ...prev, [id]: 'done' }));
    }, 1500);
  };

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Recommended Actions</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            الإجراءات الموصى بها للاستجابة
          </p>
        </div>
        {!canExecuteResponse && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">
            <Eye className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-blue-400 font-medium">View Only</span>
          </div>
        )}
      </div>

      {/* View Only Alert for SOC Analyst */}
      {!canExecuteResponse && (
        <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-[11px] text-blue-400 leading-relaxed">
            ℹ️ أنت في وضع العرض فقط. لتنفيذ إجراءات الاستجابة، يلزم دور
            <strong className="text-blue-300"> Incident Responder</strong> أو
            <strong className="text-blue-300"> System Admin</strong>.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const status = runningActions[action.id];

          return (
            <div
              key={action.id}
              className="flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border hover:border-cyan-400/30 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${action.bg} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {action.label}
                  </p>
                  <p className="text-[10px] text-sentinel-text-dim truncate font-mono">
                    {action.detail}
                  </p>
                </div>
              </div>

              {canExecuteResponse ? (
                <button
                  onClick={() => handleRun(action.id)}
                  disabled={status === 'running' || status === 'done'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-medium transition-all whitespace-nowrap ml-2 ${
                    status === 'done'
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : status === 'running'
                      ? 'bg-cyan-500/20 text-cyan-400 cursor-wait'
                      : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                  }`}
                >
                  {status === 'running' ? (
                    <>
                      <span className="w-3 h-3 border border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                      Running
                    </>
                  ) : status === 'done' ? (
                    <>
                      <span>✓</span>
                      Done
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Run
                    </>
                  )}
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sentinel-panel-light text-sentinel-text-dim text-[10px] font-medium ml-2 whitespace-nowrap">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-sentinel-border">
        <p className="text-[10px] text-sentinel-text-dim leading-relaxed">
          🔒 تنفيذ الإجراءات الأمنية الحساسة متاح فقط لدور
          <strong className="text-sentinel-text-dim"> Incident Responder</strong>.
          هذا يطبق مبدأ الفصل بين المهام (Separation of Duties).
        </p>
      </div>
    </div>
  );
};

export default ResponseActionsPanel;