// ============================================
// SentinelAI - Main App with Routing
// ============================================

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import SecurityMonitoring from './pages/monitoring/SecurityMonitoring';
import AlertsIncidents from './pages/alerts/AlertsIncidents';
import ThreatDetection from './pages/threats/ThreatDetection';
import Investigation from './pages/investigation/Investigation';
import BehaviorAnalysis from './pages/behavior/BehaviorAnalysis';
import EndpointSecurity from './pages/endpoints/EndpointSecurity';
import IncidentResponse from './pages/response/IncidentResponse';
import ReportsAnalytics from './pages/reports/ReportsAnalytics';
import Settings from './pages/settings/Settings';
import HelpSupport from './pages/help/HelpSupport';
import UserManagement from './pages/users/UserManagement';
// ============================================
// 🎯 حماية المسارات حسب الدور
// ============================================
function RoleProtectedRoute({ children, pageKey }) {
  const { user, loading, canAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-sentinel-bg flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!canAccess(pageKey)) {
    // إعادة توجيه للـ Dashboard بدلاً من خطأ 403
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-sentinel-bg flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading...</div>
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/dashboard" element={<RoleProtectedRoute pageKey="dashboard"><Dashboard /></RoleProtectedRoute>} />
      <Route path="/monitoring" element={<RoleProtectedRoute pageKey="monitoring"><SecurityMonitoring /></RoleProtectedRoute>} />
      <Route path="/alerts" element={<RoleProtectedRoute pageKey="alerts"><AlertsIncidents /></RoleProtectedRoute>} />
      <Route path="/threats" element={<RoleProtectedRoute pageKey="threats"><ThreatDetection /></RoleProtectedRoute>} />
      <Route path="/investigation" element={<RoleProtectedRoute pageKey="investigation"><Investigation /></RoleProtectedRoute>} />
      <Route path="/endpoints" element={<RoleProtectedRoute pageKey="endpoints"><EndpointSecurity /></RoleProtectedRoute>} />
      <Route path="/behavior" element={<RoleProtectedRoute pageKey="behavior"><BehaviorAnalysis /></RoleProtectedRoute>} />
      <Route path="/reports" element={<RoleProtectedRoute pageKey="reports"><ReportsAnalytics /></RoleProtectedRoute>} />
      <Route path="/response" element={<RoleProtectedRoute pageKey="response"><IncidentResponse /></RoleProtectedRoute>} />
      <Route path="/settings" element={<RoleProtectedRoute pageKey="settings"><Settings /></RoleProtectedRoute>} />
      <Route
  path="/users"
  element={
    <RoleProtectedRoute pageKey="users">
      <UserManagement />
    </RoleProtectedRoute>
  }
/>
      <Route path="/help" element={<RoleProtectedRoute pageKey="help"><HelpSupport /></RoleProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
