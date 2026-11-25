// ============================================
// SentinelAI - Settings Page
// صفحة إعدادات النظام
// UC-05-08: Manage System Settings
// ============================================

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Save,
  Lock,
  Mail,
  Smartphone,
  Activity,
  Eye,
  EyeOff,
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { id: 'Profile', icon: User, label: 'Profile' },
    { id: 'Notifications', icon: Bell, label: 'Notifications' },
    { id: 'Security', icon: Shield, label: 'Security' },
    { id: 'Data Sources', icon: Database, label: 'Data Sources' },
    { id: 'Appearance', icon: Palette, label: 'Appearance' },
    { id: 'Language', icon: Globe, label: 'Language' },
  ];

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account preferences and system configuration."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-3 sticky top-24">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-sentinel-text-dim hover:bg-sentinel-panel-light hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
            {activeTab === 'Profile' && <ProfileSettings />}
            {activeTab === 'Notifications' && <NotificationSettings />}
            {activeTab === 'Security' && <SecuritySettings />}
            {activeTab === 'Data Sources' && <DataSourcesSettings />}
            {activeTab === 'Appearance' && <AppearanceSettings />}
            {activeTab === 'Language' && <LanguageSettings />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ============================================
// Profile Settings
// ============================================
const ProfileSettings = () => (
  <div>
    <h2 className="text-lg font-bold text-white mb-1">Profile Information</h2>
    <p className="text-xs text-sentinel-text-dim mb-6">معلومات الحساب الشخصي</p>

    {/* Avatar */}
    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-sentinel-border">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
        AA
      </div>
      <div>
        <button className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors">
          Change Avatar
        </button>
        <p className="text-[10px] text-sentinel-text-dim mt-2">
          JPG, PNG أو GIF. الحد الأقصى 2MB.
        </p>
      </div>
    </div>

    {/* Form */}
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Full Name" defaultValue="Abdulrahman Khawaja" />
        <InputField label="Email" defaultValue="analyst@sentinel.ai" type="email" />
        <InputField label="Username" defaultValue="abdulrahman" />
        <InputField label="Phone" defaultValue="+967 777 123 456" />
      </div>

      <div>
        <label className="block text-xs font-medium text-sentinel-text-dim mb-2">Bio</label>
        <textarea
          rows={3}
          defaultValue="SOC Analyst specialized in threat detection and incident response."
          className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-400 transition-colors outline-none resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-sentinel-border">
        <button className="px-4 py-2 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light text-sm font-medium transition-colors">
          Cancel
        </button>
        <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// Notification Settings
// ============================================
const NotificationSettings = () => (
  <div>
    <h2 className="text-lg font-bold text-white mb-1">Notification Preferences</h2>
    <p className="text-xs text-sentinel-text-dim mb-6">تفضيلات التنبيهات</p>

    <div className="space-y-4">
      <ToggleRow
        icon={Mail}
        title="Email Notifications"
        description="Receive notifications via email"
        enabled={true}
      />
      <ToggleRow
        icon={Smartphone}
        title="Push Notifications"
        description="Receive notifications on mobile"
        enabled={true}
      />
      <ToggleRow
        icon={Activity}
        title="Critical Alerts Only"
        description="Only notify for critical severity incidents"
        enabled={false}
      />
      <ToggleRow
        icon={Bell}
        title="Daily Summary"
        description="Receive a daily summary report via email"
        enabled={true}
      />
      <ToggleRow
        icon={Shield}
        title="Weekly Security Report"
        description="Receive weekly security reports"
        enabled={true}
      />
    </div>
  </div>
);

// ============================================
// Security Settings
// ============================================
const SecuritySettings = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Security Settings</h2>
      <p className="text-xs text-sentinel-text-dim mb-6">إعدادات الأمان</p>

      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-bold text-white mb-3">Change Password</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-sentinel-text-dim mb-2">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sentinel-text-dim" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 outline-none"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sentinel-text-dim hover:text-cyan-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <InputField label="New Password" type="password" placeholder="Enter new password" />
            <InputField label="Confirm New Password" type="password" placeholder="Confirm new password" />
          </div>
        </div>

        <div className="pt-5 border-t border-sentinel-border">
          <h3 className="text-sm font-bold text-white mb-3">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Shield className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">2FA is enabled</p>
                <p className="text-[10px] text-sentinel-text-dim mt-0.5">
                  Your account is protected with two-factor authentication
                </p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
              Disable
            </button>
          </div>
        </div>

        <div className="pt-5 border-t border-sentinel-border">
          <h3 className="text-sm font-bold text-white mb-3">Active Sessions</h3>
          <div className="space-y-2">
            {[
              { device: 'Chrome on Windows', location: 'Sanaa, Yemen', current: true, time: 'Active now' },
              { device: 'Safari on iPhone', location: 'Sanaa, Yemen', current: false, time: '2 hours ago' },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border">
                <div>
                  <p className="text-xs font-medium text-white">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-green-500/20 text-green-400">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-sentinel-text-dim mt-0.5">
                    {session.location} · {session.time}
                  </p>
                </div>
                {!session.current && (
                  <button className="text-xs text-red-400 hover:text-red-300">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-sentinel-border">
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all">
            <Save className="w-4 h-4" />
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Data Sources Settings
// ============================================
const DataSourcesSettings = () => (
  <div>
    <h2 className="text-lg font-bold text-white mb-1">Data Sources</h2>
    <p className="text-xs text-sentinel-text-dim mb-6">مصادر البيانات المتصلة</p>

    <div className="space-y-3">
      {[
        { name: 'Microsoft Defender', type: 'EDR', status: 'Connected', events: '12,847' },
        { name: 'Azure AD', type: 'Identity', status: 'Connected', events: '3,421' },
        { name: 'CrowdStrike Falcon', type: 'EDR', status: 'Connected', events: '8,234' },
        { name: 'Palo Alto Firewall', type: 'Network', status: 'Connected', events: '5,678' },
        { name: 'AWS CloudTrail', type: 'Cloud', status: 'Disconnected', events: '—' },
      ].map((source, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border"
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${source.status === 'Connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <div>
              <p className="text-sm font-medium text-white">{source.name}</p>
              <p className="text-[10px] text-sentinel-text-dim mt-0.5">
                {source.type} · {source.events} events
              </p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
            source.status === 'Connected'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {source.status}
          </span>
        </div>
      ))}
    </div>

    <button className="mt-4 w-full py-3 rounded-lg border-2 border-dashed border-sentinel-border text-sentinel-text-dim hover:border-cyan-400/50 hover:text-cyan-400 transition-colors text-sm font-medium">
      + Add Data Source
    </button>
  </div>
);

// ============================================
// Appearance Settings
// ============================================
const AppearanceSettings = () => (
  <div>
    <h2 className="text-lg font-bold text-white mb-1">Appearance</h2>
    <p className="text-xs text-sentinel-text-dim mb-6">مظهر النظام</p>

    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-white mb-3">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {['Dark', 'Light', 'System'].map((theme) => (
            <button
              key={theme}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'Dark'
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-sentinel-border hover:border-cyan-400/50'
              }`}
            >
              <div className={`w-full h-12 rounded mb-2 ${theme === 'Dark' ? 'bg-sentinel-bg' : theme === 'Light' ? 'bg-gray-100' : 'bg-gradient-to-r from-sentinel-bg to-gray-100'}`} />
              <p className="text-xs font-medium text-white">{theme}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-5 border-t border-sentinel-border">
        <h3 className="text-sm font-bold text-white mb-3">Accent Color</h3>
        <div className="flex items-center gap-3">
          {['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map((color) => (
            <button
              key={color}
              className={`w-10 h-10 rounded-full transition-all ${
                color === '#06b6d4' ? 'ring-2 ring-offset-2 ring-offset-sentinel-panel ring-white' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// Language Settings
// ============================================
const LanguageSettings = () => (
  <div>
    <h2 className="text-lg font-bold text-white mb-1">Language & Region</h2>
    <p className="text-xs text-sentinel-text-dim mb-6">اللغة والمنطقة</p>

    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-sentinel-text-dim mb-2">Display Language</label>
        <select className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-400 outline-none">
          <option>English</option>
          <option>العربية (Arabic)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-sentinel-text-dim mb-2">Time Zone</label>
        <select className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-400 outline-none">
          <option>(GMT+3) Sanaa, Yemen</option>
          <option>(GMT+0) London, UK</option>
          <option>(GMT-5) New York, USA</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-sentinel-text-dim mb-2">Date Format</label>
        <select className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-400 outline-none">
          <option>MM/DD/YYYY (Sep 20, 2026)</option>
          <option>DD/MM/YYYY (20/09/2026)</option>
          <option>YYYY-MM-DD (2026-09-20)</option>
        </select>
      </div>
    </div>
  </div>
);

// ============================================
// Helper Components
// ============================================
const InputField = ({ label, defaultValue, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs font-medium text-sentinel-text-dim mb-2">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full bg-sentinel-panel-light border border-sentinel-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 transition-colors outline-none"
    />
  </div>
);

const ToggleRow = ({ icon: Icon, title, description, enabled }) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border">
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <Icon className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-[10px] text-sentinel-text-dim mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          isEnabled ? 'bg-cyan-500' : 'bg-sentinel-border'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            isEnabled ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
};

export default Settings;