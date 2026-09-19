import React, { useState } from 'react';
import { AuthAPI } from '../../api/phpAdapter';
import { XLogo } from '../Icons';
import { useThemeClasses } from '../../themeUtils';

interface ResetPasswordPageProps {
  token: string;
  onBackToLogin: () => void;
}

export default function ResetPasswordPage({ token, onBackToLogin }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const tc = useThemeClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await AuthAPI.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${tc.bg} p-4`}>
        <div className={`w-full max-w-md ${tc.bgCard} rounded-2xl border ${tc.border} p-8 text-center`}>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold ${tc.text} mb-2`}>Password reset successful</h2>
          <p className={`${tc.textSecondary} mb-6`}>
            Your password has been reset. You can now login with your new password.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-full transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${tc.bg} p-4`}>
      <div className={`w-full max-w-md ${tc.bgCard} rounded-2xl border ${tc.border} p-8`}>
        <div className="flex justify-center mb-8">
          <XLogo />
        </div>

        <h1 className={`text-3xl font-extrabold ${tc.text} mb-2`}>Reset password</h1>
        <p className={`text-sm ${tc.textMuted} mb-6`}>
          Enter your new password below.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-full transition-colors"
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
