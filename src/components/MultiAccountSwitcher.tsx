import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface Account {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  email: string;
  isActive: boolean;
}

export default function MultiAccountSwitcher() {
  const { user, logout } = useAuth();
  const tc = useThemeClasses();
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: user?.name || 'Current User',
      handle: user?.handle || '@currentuser',
      avatar: user?.avatar || '👤',
      email: user?.email || 'current@example.com',
      isActive: true,
    },
    {
      id: '2',
      name: 'Business Account',
      handle: '@business',
      avatar: '💼',
      email: 'business@example.com',
      isActive: false,
    },
    {
      id: '3',
      name: 'Personal Alt',
      handle: '@personal_alt',
      avatar: '🎭',
      email: 'personal@example.com',
      isActive: false,
    },
  ]);

  const handleSwitchAccount = (accountId: string) => {
    setAccounts(
      accounts.map((acc) => ({
        ...acc,
        isActive: acc.id === accountId,
      }))
    );
    setShowModal(false);
    // In real app, this would switch the auth context
    alert(`Switched to account: ${accounts.find((a) => a.id === accountId)?.name}`);
  };

  const handleAddAccount = () => {
    // In real app, this would open login/register flow
    alert('Add account feature - would open login flow');
  };

  const handleRemoveAccount = (accountId: string) => {
    if (accounts.length === 1) {
      alert('Cannot remove the only account');
      return;
    }
    
    if (window.confirm('Remove this account from the app?')) {
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
    }
  };

  const activeAccount = accounts.find((acc) => acc.isActive);

  return (
    <>
      {/* Quick Switcher Button */}
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full ${tc.bgCard} border ${tc.border} hover:bg-gray-500/10 transition-colors`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
          {activeAccount?.avatar}
        </div>
        <div className="hidden md:block text-left">
          <p className={`text-sm font-bold ${tc.text}`}>{activeAccount?.name}</p>
          <p className={`text-xs ${tc.textSecondary}`}>{accounts.length} accounts</p>
        </div>
        <svg className={`w-4 h-4 ${tc.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className={`relative w-full max-w-md mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${tc.text}`}>Switch Account</h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-full ${tc.bgHoverSecondary}`}
              >
                <svg className={`w-5 h-5 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Accounts List */}
            <div className="space-y-2 mb-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    account.isActive
                      ? 'border-blue-500 bg-blue-500/10'
                      : `${tc.border} ${tc.bgCard}`
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
                    {account.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${tc.text} truncate`}>{account.name}</p>
                      {account.isActive && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${tc.textSecondary} truncate`}>{account.handle}</p>
                    <p className={`text-xs ${tc.textSecondary} truncate`}>{account.email}</p>
                  </div>
                  <div className="flex gap-1">
                    {!account.isActive && (
                      <button
                        onClick={() => handleSwitchAccount(account.id)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-full"
                      >
                        Switch
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveAccount(account.id)}
                      className={`p-2 rounded-full ${tc.bgHoverSecondary} text-red-500 hover:bg-red-500/10`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Account Button */}
            <button
              onClick={handleAddAccount}
              className={`w-full py-3 rounded-xl border-2 border-dashed ${tc.border} ${tc.textSecondary} hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Account
            </button>

            {/* Info */}
            <div className={`mt-4 p-3 rounded-lg ${tc.bgCard} border ${tc.border}`}>
              <p className={`text-xs ${tc.textSecondary}`}>
                💡 <strong>Tip:</strong> You can have up to 5 accounts and switch between them instantly without logging out.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
