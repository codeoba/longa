import React from 'react';
import { User } from '../types';
import { users } from '../data';
import { ArrowLeft, Verified } from './Icons';
import { useTheme } from '../ThemeContext';

interface BlockedAccountsProps {
  blockedUsers: string[];
  onUnblock: (userId: string) => void;
  onBack: () => void;
}

export default function BlockedAccounts({ blockedUsers, onUnblock, onBack }: BlockedAccountsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const blockedUsersList = users.filter(u => blockedUsers.includes(u.id));

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Blocked Accounts</h1>
        </div>
      </div>

      {/* Info */}
      <div className={`px-4 py-4 border-b ${isDark ? 'border-gray-800/50' : 'border-gray-200'}`}>
        <p className={`text-[15px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          When you block someone, that person won't be able to follow or message you, and you won't see notifications from them.
        </p>
      </div>

      {/* Blocked accounts list */}
      <div>
        {blockedUsersList.length > 0 ? (
          blockedUsersList.map(user => (
            <div
              key={user.id}
              className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-gray-800/30' : 'border-gray-100'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className={`font-bold text-[15px] truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                  {user.verified && <Verified />}
                </div>
                <span className="text-[13px] text-gray-500">{user.handle}</span>
              </div>
              <button
                onClick={() => onUnblock(user.id)}
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                  isDark
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Unblock
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>No blocked accounts</h3>
            <p className="text-gray-500 text-[15px] mt-2 text-center max-w-[360px]">
              When you block someone, they'll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
