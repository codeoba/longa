import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { XLogo } from '../Icons';
import { useThemeClasses } from '../../themeUtils';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const tc = useThemeClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!handle.match(/^[a-zA-Z0-9_]+$/)) {
      setError('Handle can only contain letters, numbers, and underscores');
      return;
    }

    setLoading(true);

    try {
      await register(name, handle, email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${tc.bg} p-4`}>
      <div className={`w-full max-w-md ${tc.bgCard} rounded-2xl border ${tc.border} p-8`}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <XLogo />
        </div>

        <h1 className={`text-3xl font-extrabold ${tc.text} mb-2`}>Create your account</h1>
        <p className={`text-sm ${tc.textMuted} mb-6`}>Join X and start connecting with the world.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
            />
          </div>

          {/* Handle */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Username
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${tc.textMuted}`}>@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="johndoe"
                required
                className={`w-full pl-8 pr-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Password
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

          {/* Confirm Password */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Confirm Password
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

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className={`text-sm ${tc.textSecondary}`}>
              I agree to the{' '}
              <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-full transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className={`absolute inset-0 flex items-center ${tc.borderSecondary}`}>
            <div className={`w-full border-t ${tc.border}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${tc.bgCard} ${tc.textMuted}`}>or</span>
          </div>
        </div>

        {/* Login link */}
        <p className={`text-center text-sm ${tc.textSecondary}`}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-500 hover:text-blue-600 font-bold"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
