import React, { useState, useMemo } from 'react';
import { trends, users, currentUser } from '../data';
import { Search, Verified, Premium, ThreeDots, Sparkles } from './Icons';
import { useThemeClasses } from '../themeUtils';

interface RightPanelProps {
  onNavigate: (page: string) => void;
  followedUsers: string[];
  onFollowUser: (userId: string) => void;
}

export default function RightPanel({ onNavigate, followedUsers, onFollowUser }: RightPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const tc = useThemeClasses();

  const suggestedUsers = useMemo(() =>
    users.filter(u => u.id !== currentUser.id).slice(0, 3),
    []
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return users.filter(u =>
      u.id !== currentUser.id && (
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.handle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  return (
    <aside className="hidden lg:block w-[350px] flex-shrink-0 pl-7 py-2">
      <div className={`sticky top-0 pt-1 pb-3 ${tc.bgBackdrop} backdrop-blur-xl z-40`}>
        {/* Search */}
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full border transition-colors ${
          searchFocused
            ? 'border-blue-500'
            : tc.border
        } ${tc.bgInput}`}>
          <Search />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => { setSearchFocused(false); setTimeout(() => setSearchQuery(''), 200); }}
            className={`bg-transparent text-[15px] outline-none flex-1 ${tc.text} placeholder-gray-500`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-blue-400 bg-blue-500/20 rounded-full p-0.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
              </svg>
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <div className={`absolute left-0 right-0 top-14 ${tc.bgModal} border ${tc.border} rounded-2xl shadow-xl overflow-hidden z-50 mx-2`}>
            {searchResults.map(user => (
              <button
                key={user.id}
                onClick={() => { onNavigate('user-profile'); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 ${tc.bgHoverSecondary} transition-colors`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold text-[15px] ${tc.text}`}>{user.name}</span>
                    {user.verified && <Verified />}
                  </div>
                  <span className="text-[13px] text-gray-500">{user.handle}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Premium Card */}
      <div className={`mb-4 p-4 rounded-2xl border ${tc.border} ${tc.bgCard}`}>
        <h2 className={`text-xl font-extrabold ${tc.text} mb-1`}>Subscribe to Premium</h2>
        <p className={`text-[15px] ${tc.textSecondary} mb-3`}>
          Subscribe to unlock new features and if eligible, receive a share of revenue.
        </p>
        <button
          onClick={() => onNavigate('premium')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-full transition-all duration-200 text-[15px]"
        >
          Subscribe
        </button>
      </div>

      {/* Trends */}
      <div className={`mb-4 rounded-2xl border ${tc.border} ${tc.bgCard} overflow-hidden`}>
        <h2 className={`text-xl font-extrabold ${tc.text} px-4 pt-3 pb-2`}>What's happening</h2>
        {trends.slice(0, 5).map((trend) => (
          <div key={trend.id} className={`px-4 py-3 ${tc.bgHover} transition-colors cursor-pointer`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] text-gray-500">{trend.category}</p>
                <p className={`font-bold text-[15px] ${tc.text} mt-0.5`}>{trend.name}</p>
                <p className="text-[13px] text-gray-500 mt-0.5">{trend.posts}</p>
              </div>
              <button className={`p-1.5 rounded-full ${tc.bgHoverSecondary} hover:text-blue-400 text-gray-500 transition-colors`}>
                <ThreeDots />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => onNavigate('explore')}
          className={`px-4 py-3 text-blue-400 ${tc.bgHover} transition-colors text-[15px] w-full text-left`}
        >
          Show more
        </button>
      </div>

      {/* Who to follow */}
      <div className={`mb-4 rounded-2xl border ${tc.border} ${tc.bgCard} overflow-hidden`}>
        <h2 className={`text-xl font-extrabold ${tc.text} px-4 pt-3 pb-2`}>Who to follow</h2>
        {suggestedUsers.map((user) => (
          <div key={user.id} className={`px-4 py-3 ${tc.bgHover} transition-colors cursor-pointer`}>
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 min-w-0"
                onClick={() => onNavigate('user-profile')}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                  {user.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold text-[15px] ${tc.text} truncate hover:underline`}>{user.name}</span>
                    {user.verified && <Verified />}
                    {user.premium && <Premium />}
                  </div>
                  <span className="text-[13px] text-gray-500 truncate block">{user.handle}</span>
                </div>
              </div>
              <button
                onClick={() => onFollowUser(user.id)}
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-200 flex-shrink-0 ${
                  followedUsers.includes(user.id)
                    ? 'bg-transparent border border-gray-600 text-white hover:border-red-500/50 hover:text-red-500'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {followedUsers.includes(user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
        <button className={`px-4 py-3 text-blue-400 ${tc.bgHover} transition-colors text-[15px] w-full text-left`}>
          Show more
        </button>
      </div>

      {/* Footer links */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-gray-500">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Ads info</a>
          <a href="#" className="hover:underline">More</a>
          <span>© 2026 X Corp.</span>
        </div>
      </div>
    </aside>
  );
}
