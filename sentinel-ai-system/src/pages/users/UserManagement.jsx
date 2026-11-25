// ============================================
// SentinelAI - User Management Page
// UC-05-02: Manage User Accounts and Roles
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  UserX,
  Search,
  Edit2,
  Trash2,
  Key,
  MoreHorizontal,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  getUsers,
  getUserStats,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
} from '../../services/usersService';
import { useAuth } from '../../context/AuthContext';

// ============================================
// Role Configurations
// ============================================
const ROLE_OPTIONS = [
  { value: 'PERSONAL_USER', label: 'Personal User (Owner)', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  { value: 'EMPLOYEE', label: 'Employee / Normal User', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { value: 'SOC_ANALYST', label: 'SOC Analyst', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { value: 'INCIDENT_RESPONDER', label: 'Incident Responder', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { value: 'SYSTEM_ADMIN', label: 'System Administrator', color: 'text-red-400', bg: 'bg-red-500/20' },
];

const getRoleConfig = (role) => ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[1];

// ============================================
// Main Component
// ============================================
const UserManagement = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: 'All', search: '', status: 'All' });

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ============================================
  // Fetch Data
  // ============================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.role !== 'All') params.role = filters.role;
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const [usersResult, statsResult] = await Promise.all([
        getUsers(params),
        getUserStats(),
      ]);

      setUsers(usersResult.data.users);
      setStats(statsResult.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  // ============================================
  // Handlers
  // ============================================
  const handleCreate = () => {
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setShowResetModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // ============================================
  // Stats Cards
  // ============================================
  const statsCards = [
    { title: 'Total Users', value: stats.total, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { title: 'Active', value: stats.active, icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10' },
    { title: 'Inactive', value: stats.inactive, icon: UserX, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Admins', value: stats.admins || 0, icon: Shield, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage user accounts, roles, and permissions across the platform."
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-sentinel-panel border border-sentinel-border rounded-xl p-5">
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

      {/* Main Card */}
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Users</h3>
            <p className="text-xs text-sentinel-text-dim mt-1">إدارة المستخدمين والأدوار</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
          >
            <option value="All">All Roles</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sentinel-text-dim" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-cyan-400 text-sm">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-12 h-12 text-sentinel-text-dim mx-auto mb-3" />
              <p className="text-sentinel-text-dim text-sm">لا يوجد مستخدمون</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-sentinel-text-dim border-b border-sentinel-border">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Last Login</th>
                  <th className="pb-3 font-medium">Created</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const roleConfig = getRoleConfig(u.role);
                  const isSelf = u.id === currentUser?.id;

                  return (
                    <tr
                      key={u.id}
                      className="border-b border-sentinel-border/50 hover:bg-sentinel-panel-light/50 transition-colors"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {u.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white truncate">{u.name}</p>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-400">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-sentinel-text-dim truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${roleConfig.bg} ${roleConfig.color}`}>
                          {roleConfig.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium rounded ${
                          u.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">{u.lastLogin}</td>
                      <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">{u.createdAt}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(u)}
                            className="p-1.5 rounded text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(u)}
                            className="p-1.5 rounded text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                            title="Reset Password"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          {!isSelf && (
                            <button
                              onClick={() => handleDelete(u)}
                              className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <UserFormModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <UserFormModal
          mode="edit"
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchData();
          }}
        />
      )}

      {showResetModal && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onClose={() => setShowResetModal(false)}
          onSuccess={() => setShowResetModal(false)}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            setShowDeleteModal(false);
            fetchData();
          }}
        />
      )}
    </DashboardLayout>
  );
};

// ============================================
// User Form Modal (Create/Edit)
// ============================================
const UserFormModal = ({ mode, user, onClose, onSuccess }) => {
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    nameAr: user?.nameAr || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'EMPLOYEE',
    isActive: user?.isActive ?? true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await updateUser(user.id, {
          name: formData.name,
          nameAr: formData.nameAr,
          role: formData.role,
          isActive: formData.isActive,
        });
      } else {
        if (!formData.email || !formData.password || !formData.name) {
          throw new Error('Please fill in all required fields');
        }
        await createUser({
          name: formData.name,
          nameAr: formData.nameAr,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? 'Edit User' : 'Add New User'}
          </h3>
          <button onClick={onClose} className="text-sentinel-text-dim hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-sentinel-text-dim mb-2">
                Full Name (EN) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-sentinel-text-dim mb-2">
                Full Name (AR)
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                placeholder="الاسم الكامل"
                dir="rtl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-sentinel-text-dim mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isEdit}
              className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none disabled:opacity-50"
              placeholder="user@sentinel.ai"
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-xs font-medium text-sentinel-text-dim mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 pr-10 text-sm text-white focus:border-cyan-400 outline-none"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sentinel-text-dim hover:text-cyan-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-sentinel-text-dim mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {isEdit && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border">
              <div>
                <p className="text-sm font-medium text-white">Active Account</p>
                <p className="text-[10px] text-sentinel-text-dim mt-0.5">
                  User can log in and access the system
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  formData.isActive ? 'bg-cyan-500' : 'bg-sentinel-border'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    formData.isActive ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {isEdit ? 'Save Changes' : 'Create User'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Reset Password Modal
// ============================================
const ResetPasswordModal = ({ user, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(user.id, newPassword);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Reset Password</h3>
          <button onClick={onClose} className="text-sentinel-text-dim hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-xs text-yellow-400">
            Resetting password for: <strong>{user.name}</strong> ({user.email})
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-sentinel-text-dim mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-2 pr-10 text-sm text-white focus:border-cyan-400 outline-none"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sentinel-text-dim hover:text-cyan-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                Reset Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Delete User Modal
// ============================================
const DeleteUserModal = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    setLoading(true);
    try {
      await deleteUser(user.id);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 w-full max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>

        <h3 className="text-lg font-bold text-white text-center mb-2">Delete User?</h3>
        <p className="text-sm text-sentinel-text-dim text-center mb-4">
          Are you sure you want to delete <strong className="text-white">{user.name}</strong>?
          <br />
          This action cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;