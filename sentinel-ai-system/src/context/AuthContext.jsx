// ============================================
// SentinelAI - Authentication Context (with RBAC)
// يدير تسجيل الدخول والصلاحيات حسب الأدوار
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/authService';

// ============================================
// الأدوار المتاحة في النظام
// ============================================
export const ROLES = {
  PERSONAL_USER: 'PERSONAL_USER',
  EMPLOYEE: 'EMPLOYEE',
  SOC_ANALYST: 'SOC_ANALYST',
  INCIDENT_RESPONDER: 'INCIDENT_RESPONDER',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
};

// ============================================
// أسماء الأدوار بالعربية والإنجليزية
// ============================================
export const ROLE_NAMES = {
  [ROLES.PERSONAL_USER]: { en: 'Personal User (Owner)', ar: 'المستخدم الشخصي' },
  [ROLES.EMPLOYEE]: { en: 'Employee / Normal User', ar: 'الموظف' },
  [ROLES.SOC_ANALYST]: { en: 'SOC Analyst', ar: 'محلل مركز العمليات' },
  [ROLES.INCIDENT_RESPONDER]: { en: 'Incident Responder', ar: 'مستجيب الحوادث' },
  [ROLES.SYSTEM_ADMIN]: { en: 'System Administrator', ar: 'مسؤول النظام' },
};

// ============================================
// 🎯 مصفوفة الصلاحيات (RBAC Matrix)
// كل صفحة: من يستطيع الوصول إليها
// ============================================
export const PAGE_PERMISSIONS = {
  // Dashboard - جميع الأدوار
  dashboard: [
    ROLES.PERSONAL_USER,
    ROLES.EMPLOYEE,
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // المراقبة الأمنية - الفريق الأمني فقط
  monitoring: [
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // التنبيهات والحوادث - المالك يرى الخاصة به
  alerts: [
    ROLES.PERSONAL_USER,
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // كشف التهديدات - الفريق الأمني
  threats: [
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // التحقيق - الفريق الأمني
  investigation: [
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // تحليل السلوك - الفريق الأمني
  behavior: [
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // أمن نقاط النهاية - الفريق الأمني
  endpoints: [
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // 🎯 الاستجابة للحوادث - مع إضافة محلل SOC (View Only Mode)
  response: [
    ROLES.SOC_ANALYST,        // ← محلل SOC (وضع العرض فقط)
    ROLES.INCIDENT_RESPONDER,  // ← مستجيب الحوادث (صلاحيات كاملة)
    ROLES.SYSTEM_ADMIN,        // ← مسؤول النظام (صلاحيات كاملة)
  ],

  // التقارير - الفريق الأمني
  reports: [
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // الإعدادات - جميع الأدوار (لكن كل دور يرى إعداداته)
  settings: [
    ROLES.PERSONAL_USER,
    ROLES.EMPLOYEE,
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // المساعدة - جميع الأدوار
  help: [
    ROLES.PERSONAL_USER,
    ROLES.EMPLOYEE,
    ROLES.SOC_ANALYST,
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // إدارة المستخدمين - المسؤول فقط
  users: [ROLES.SYSTEM_ADMIN],
};

// ============================================
// صلاحيات خاصة داخل الصفحات
// ============================================
export const ACTION_PERMISSIONS = {
  // تنفيذ إجراءات الاستجابة (عزل، إغلاق حادثة)
  executeResponseActions: [
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // إغلاق حادثة
  closeIncident: [
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // عزل جهاز
  isolateEndpoint: [
    ROLES.INCIDENT_RESPONDER,
    ROLES.SYSTEM_ADMIN,
  ],

  // إدارة المستخدمين والأدوار
  manageUsers: [ROLES.SYSTEM_ADMIN],

  // تعديل إعدادات النظام
  manageSystemSettings: [ROLES.SYSTEM_ADMIN],

  // حذف/تعديل البيانات الحساسة
  deleteData: [ROLES.SYSTEM_ADMIN],
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // استرجاع المستخدم من localStorage عند إعادة تحميل الصفحة
  useEffect(() => {
    const storedUser = localStorage.getItem('sentinel_user') || sessionStorage.getItem('sentinel_user');
    const storedToken = localStorage.getItem('sentinel_token') || sessionStorage.getItem('sentinel_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('sentinel_user');
        localStorage.removeItem('sentinel_token');
        sessionStorage.removeItem('sentinel_user');
        sessionStorage.removeItem('sentinel_token');
      }
    }
    setLoading(false);
  }, []);

  // ============================================
  // تسجيل الدخول عبر API
  // ============================================
  const login = async (email, password, remember = true) => {
    const result = await loginUser(email, password);

    if (result.status === 'success') {
      const { user: userData, token } = result.data;
      const storage = remember ? localStorage : sessionStorage;
      const otherStorage = remember ? sessionStorage : localStorage;
      otherStorage.removeItem('sentinel_token');
      otherStorage.removeItem('sentinel_user');
      storage.setItem('sentinel_token', token);
      storage.setItem('sentinel_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }

    throw new Error(result.message || 'فشل تسجيل الدخول');
  };

  // ============================================
  // تسجيل الخروج
  // ============================================
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sentinel_user');
    localStorage.removeItem('sentinel_token');
    sessionStorage.removeItem('sentinel_user');
    sessionStorage.removeItem('sentinel_token');
  };

  // ============================================
  // التحقق من الدور (أي من الأدوار المحددة)
  // ============================================
  const hasRole = (...roles) => {
    return user && roles.includes(user.role);
  };

  // ============================================
  // 🎯 التحقق من صلاحية الوصول لصفحة
  // ============================================
  const canAccess = (pageKey) => {
    if (!user) return false;
    const allowedRoles = PAGE_PERMISSIONS[pageKey];
    if (!allowedRoles) return false;
    return allowedRoles.includes(user.role);
  };

  // ============================================
  // 🎯 التحقق من صلاحية تنفيذ إجراء معين
  // ============================================
  const canPerform = (actionKey) => {
    if (!user) return false;
    const allowedRoles = ACTION_PERMISSIONS[actionKey];
    if (!allowedRoles) return false;
    return allowedRoles.includes(user.role);
  };

  // ============================================
  // 🎯 معلومات سريعة عن الدور الحالي
  // ============================================
  const isAdmin = user?.role === ROLES.SYSTEM_ADMIN;
  const isAnalyst = user?.role === ROLES.SOC_ANALYST;
  const isResponder = user?.role === ROLES.INCIDENT_RESPONDER;
  const isEmployee = user?.role === ROLES.EMPLOYEE;
  const isPersonalUser = user?.role === ROLES.PERSONAL_USER;

  // ============================================
  // 🎯 هل يمكن للمستخدم تنفيذ إجراءات الاستجابة؟
  // (يُستخدم في ResponseActionsPanel و IncidentDetailsPanel)
  // ============================================
  const canExecuteResponse = canPerform('executeResponseActions');

  const value = {
    // الحالة
    user,
    loading,

    // الدوال الأساسية
    login,
    logout,
    hasRole,
    canAccess,
    canPerform,

    // فحوصات سريعة
    isAdmin,
    isAnalyst,
    isResponder,
    isEmployee,
    isPersonalUser,
    canExecuteResponse,

    // الثوابت للتصدير
    ROLES,
    ROLE_NAMES,
    PAGE_PERMISSIONS,
    ACTION_PERMISSIONS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// Hook مخصص للوصول السريع
// ============================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
