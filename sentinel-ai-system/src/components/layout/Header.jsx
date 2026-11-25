// ============================================
// SentinelAI - Header Component
// الشريط العلوي مع البحث والتنبيهات
// ============================================

import { Search, Bell, Menu } from 'lucide-react';

const Header = ({ title, subtitle, onMenu }) => {
  // الحصول على التاريخ والوقت الحالي بصيغة مناسبة
  const getCurrentDateTime = () => {
    const now = new Date();
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    
    return {
      date: now.toLocaleDateString('en-US', dateOptions),
      time: now.toLocaleTimeString('en-US', timeOptions),
    };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <header className="h-20 bg-sentinel-bg/85 backdrop-blur-xl border-b border-sentinel-border/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-2xl">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenu}
          className="lg:hidden p-2 rounded-lg border border-sentinel-border bg-sentinel-panel-light text-sentinel-text-dim hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <div className="hidden lg:block">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {subtitle && (
              <p className="text-xs text-sentinel-text-dim">{subtitle}</p>
            )}
          </div>
        )}

        {/* صندوق البحث */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sentinel-text-dim" />
          <input
            type="text"
            placeholder="Search for users, devices, IPs, incidents..."
            className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg pl-10 pr-12 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-400 transition-colors outline-none"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] text-sentinel-text-dim border border-sentinel-border rounded bg-sentinel-bg">
            /
          </kbd>
        </div>
      </div>

      {/* ============================================
          التنبيهات + التاريخ والوقت
      ============================================ */}
      <div className="flex items-center gap-6">
        {/* أيقونة التنبيهات */}
        <button className="relative p-2 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* التاريخ والوقت */}
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-white">{date}</p>
          <p className="text-xs text-sentinel-text-dim">{time}</p>
        </div>

        {/* شعار جانبي */}
        <div className="hidden xl:flex items-center gap-2 pl-6 border-l border-sentinel-border">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-sentinel-text-dim">System Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;