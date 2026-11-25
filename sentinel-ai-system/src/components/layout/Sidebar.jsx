// ============================================
// SentinelAI - Sidebar (Role-Based Menu) - Complete
// ============================================

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, ROLE_NAMES } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Monitor,
  Bell,
  ShieldCheck,
  Search,
  TrendingUp,
  Laptop,
  Zap,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  Users,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { name: 'Security Monitoring', path: '/monitoring', icon: Monitor, key: 'monitoring' },
  { name: 'Alerts & Incidents', path: '/alerts', icon: Bell, badge: 12, key: 'alerts' },
  { name: 'Threat Detection', path: '/threats', icon: ShieldCheck, key: 'threats' },
  { name: 'Investigation', path: '/investigation', icon: Search, key: 'investigation' },
  { name: 'Behavior Analysis', path: '/behavior', icon: TrendingUp, key: 'behavior' },
  { name: 'Endpoint Security', path: '/endpoints', icon: Laptop, key: 'endpoints' },
  { name: 'Incident Response', path: '/response', icon: Zap, key: 'response' },
  { name: 'Reports & Analytics', path: '/reports', icon: BarChart3, key: 'reports' },
  { name: 'User Management', path: '/users', icon: Users, key: 'users' },
];

const Sidebar = ({ open, onClose }) => {
  const { user, logout, canAccess } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // تصفية العناصر حسب صلاحيات الدور
  const visibleItems = navigationItems.filter((item) => canAccess(item.key));

  return (
    <aside className={`w-64 h-screen bg-sentinel-panel/95 backdrop-blur-xl border-r border-sentinel-border flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-sentinel-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white">
              SENTINEL<span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-[10px] text-sentinel-text-dim tracking-[0.2em]">
              INTELLIGENCE IN EVERY BEHAVIOR
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - filtered by role */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                        : 'text-sentinel-text-dim hover:bg-sentinel-panel-light hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sentinel-border p-3 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-cyan-500/10 text-cyan-400'
                : 'text-sentinel-text-dim hover:bg-sentinel-panel-light hover:text-white'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-cyan-500/10 text-cyan-400'
                : 'text-sentinel-text-dim hover:bg-sentinel-panel-light hover:text-white'
            }`
          }
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Help & Support</span>
        </NavLink>
      </div>

      {/* User Info */}
      <div className="border-t border-sentinel-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-sentinel-text-dim truncate">
              {ROLE_NAMES[user?.role]?.en || 'User'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-sentinel-text-dim hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;