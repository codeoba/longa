import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthAPI } from '../../api/phpAdapter';
import { ArrowLeft } from '../Icons';
import { useThemeClasses } from '../../themeUtils';

interface AccountSettingsPageProps {
  onBack: () => void;
}

export default function AccountSettingsPage({ onBack }: AccountSettingsPageProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const tc = useThemeClasses();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);

    try {
      await AuthAPI.changePassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      alert('Account deletion is not yet implemented');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button onClick={onBack} className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${tc.text}`}>Account Settings</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${tc.border}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-[15px] font-medium transition-colors relative ${
              activeTab === tab.id ? `${tc.text} font-bold` : `text-gray-500 ${tc.bgHover}`
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* User Info */}
            <div className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={tc.textSecondary}>Name</span>
                  <span className={tc.text}>{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className={tc.textSecondary}>Username</span>
                  <span className={tc.text}>{user?.handle}</span>
                </div>
                <div className="flex justify-between">
                  <span className={tc.textSecondary}>Email</span>
                  <span className={tc.text}>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className={tc.textSecondary}>Member since</span>
                  <span className={tc.text}>January 2024</span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-full transition-colors"
            >
              Logout
            </button>

            {/* Delete Account */}
            <button
              onClick={handleDeleteAccount}
              className={`w-full border border-red-500 text-red-500 hover:bg-red-500/10 font-bold py-2.5 rounded-full transition-colors`}
            >
              Delete Account
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Change Password</h3>
              
              {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/30 text-green-500'
                    : 'bg-red-500/10 border border-red-500/30 text-red-500'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-full transition-colors"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-2`}>Two-Factor Authentication</h3>
              <p className={`${tc.textSecondary} text-sm mb-4`}>
                Add an extra layer of security to your account
              </p>
              <button className={`px-4 py-2 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10 transition-colors`}>
                Enable 2FA
              </button>
            </div>

            {/* Active Sessions */}
            <div className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${tc.text} font-medium`}>Current Session</p>
                    <p className={`${tc.textSecondary} text-sm`}>Web • Chrome • Tanzania</p>
                  </div>
                  <span className="text-green-500 text-sm font-bold">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Privacy Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${tc.text} font-medium`}>Private Account</p>
                    <p className={`${tc.textSecondary} text-sm`}>Only approved followers can see your posts</p>
                  </div>
                  <button className={`w-11 h-6 rounded-full ${tc.bgTertiary} relative`}>
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${tc.text} font-medium`}>Show Activity Status</p>
                    <p className={`${tc.textSecondary} text-sm`}>Let others see when you're active</p>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${tc.text} font-medium`}>Allow Direct Messages</p>
                    <p className={`${tc.textSecondary} text-sm`}>Allow anyone to send you messages</p>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${tc.text} font-medium`}>Push Notifications</p>
                    <p className={`${tc.textSecondary} text-sm`}>Receive push notifications</p>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${tc.text} font-medium`}>Email Notifications</p>
                    <p className={`${tc.textSecondary} text-sm`}>Receive email notifications</p>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${tc.text} font-medium`}>Sound Effects</p>
                    <p className={`${tc.textSecondary} text-sm`}>Play sounds for notifications</p>
                  </div>
                  <button className={`w-11 h-6 rounded-full ${tc.bgTertiary} relative`}>
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
