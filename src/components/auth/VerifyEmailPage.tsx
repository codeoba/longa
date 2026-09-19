import React, { useState, useEffect } from 'react';
import { AuthAPI } from '../../api/phpAdapter';
import { XLogo } from '../Icons';
import { useThemeClasses } from '../../themeUtils';

interface VerifyEmailPageProps {
  token: string;
  onBackToLogin: () => void;
}

export default function VerifyEmailPage({ token, onBackToLogin }: VerifyEmailPageProps) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const tc = useThemeClasses();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await AuthAPI.verifyEmail(token);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Failed to verify email');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${tc.bg} p-4`}>
        <div className={`w-full max-w-md ${tc.bgCard} rounded-2xl border ${tc.border} p-8 text-center`}>
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className={`text-2xl font-bold ${tc.text} mb-2`}>Verifying your email...</h2>
          <p className={tc.textSecondary}>Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${tc.bg} p-4`}>
        <div className={`w-full max-w-md ${tc.bgCard} rounded-2xl border ${tc.border} p-8 text-center`}>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold ${tc.text} mb-2`}>Email verified!</h2>
          <p className={`${tc.textSecondary} mb-6`}>
            Your email has been successfully verified. You can now login to your account.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-full transition-colors"
          >
            Continue to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${tc.bg} p-4`}>
      <div className={`w-full max-w-md ${tc.bgCard} rounded-2xl border ${tc.border} p-8 text-center`}>
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className={`text-2xl font-bold ${tc.text} mb-2`}>Verification failed</h2>
        <p className={`${tc.textSecondary} mb-6`}>
          {error || 'The verification link is invalid or has expired.'}
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
