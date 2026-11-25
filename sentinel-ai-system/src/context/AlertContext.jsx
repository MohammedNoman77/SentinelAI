// ============================================
// SentinelAI - Alerts Context
// يدير عداد التنبيهات غير المقروءة
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/alerts/unread-count');
      setUnreadCount(res.data.data.count);
    } catch (err) {
      // تجاهل الأخطاء
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/alerts?limit=10');
      setAlerts(res.data.data.alerts);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/alerts/mark-all-read');
      setUnreadCount(0);
      setAlerts([]);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // جلب العدد كل 30 ثانية
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    unreadCount,
    alerts,
    loading,
    fetchAlerts,
    markAllAsRead,
    refresh: fetchUnreadCount,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}

export default AlertContext;