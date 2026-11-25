// ============================================
// SentinelAI - Authentication Service
// ============================================

import api from './api';

// تسجيل الدخول
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'فشل تسجيل الدخول. تحقق من البيانات.';
    throw new Error(message);
  }
};

// تسجيل مستخدم جديد
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'فشل إنشاء الحساب.';
    throw new Error(message);
  }
};

// جلب بيانات المستخدم الحالي
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'فشل جلب بيانات المستخدم.';
    throw new Error(message);
  }
};

export default { loginUser, registerUser, getCurrentUser };