import React, { useState } from 'react';
import { AuthAPI } from '../../api/phpAdapter';
import { XLogo } from '../Icons';
import { useThemeClasses } from '../../themeUtils';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const tc = useThemeClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
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
          <h2 className={`text-2xl font-bold ${tc.text} mb-2`}>Check your email</h2>
          <p className={`${tc.textSecondary} mb-6`}>
            We've sent a password reset link to <strong>{email}</strong>
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

        <h1 className={`text-3xl font-extrabold ${tc.text} mb-2`}>Forgot password?</h1>
        <p className={`text-sm ${tc.textMuted} mb-6`}>
          No worries, we'll send you reset instructions.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-full transition-colors"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className={`text-sm ${tc.textSecondary} hover:text-blue-500 transition-colors`}
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
