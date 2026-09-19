import React from 'react';
import { Page } from '../types';
import { currentUser } from '../data';
import {
  Home, Search, Bell, Mail, Bookmark, Users, User, Settings,
  MoreHorizontal, Feather, Sparkles, List, XLogo
} from './Icons';
import { useTheme } from '../ThemeContext';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onCompose: () => void;
  unreadNotifications: number;
  unreadMessages: number;
}

const navItems: { icon: React.ReactNode; label: string; page: Page; badge?: string }[] = [
  { icon: <Home />, label: 'Home', page: 'home' },
  { icon: <Search />, label: 'Explore', page: 'explore' },
  { icon: <Bell />, label: 'Notifications', page: 'notifications' },
  { icon: <Mail />, label: 'Messages', page: 'messages' },
  { icon: <List />, label: 'Lists', page: 'lists' },
  { icon: <Bookmark />, label: 'Bookmarks', page: 'bookmarks' },
  { icon: <Sparkles />, label: 'Premium', page: 'premium' },
  { icon: <User />, label: 'Profile', page: 'profile' },
  { icon: <Settings />, label: 'Settings', page: 'settings' },
];

export default function Sidebar({ currentPage, onNavigate, onCompose, unreadNotifications, unreadMessages }: SidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <aside className={`fixed left-0 top-0 h-full w-[68px] xl:w-[275px] flex flex-col items-center xl:items-start px-2 xl:px-3 py-3 border-r z-50 ${
      isDark ? 'border-gray-800/50 bg-black/80' : 'border-gray-200 bg-white/80'
    } backdrop-blur-xl`}>
      {/* Logo */}
      <div className={`p-3 mb-1 rounded-full cursor-pointer transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
        <XLogo />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 w-full">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          let badge = 0;
          if (item.page === 'notifications') badge = unreadNotifications;
          if (item.page === 'messages') badge = unreadMessages;

          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-4 px-3 py-3 rounded-full transition-all duration-200 group w-full relative ${
                isActive
                  ? `font-bold ${isDark ? 'text-white' : 'text-gray-900'}`
                  : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/40' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
              }`}
            >
              <span className="relative">
                {item.icon}
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              <span className="hidden xl:block text-[17px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Post Button */}
      <button
        onClick={onCompose}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
      >
        <span className="hidden xl:block py-3 px-4 text-[17px]">Post</span>
        <span className="xl:hidden p-3 flex items-center justify-center">
          <Feather />
        </span>
      </button>

      {/* User Profile at bottom */}
      <div className="mt-auto w-full">
        <button className={`flex items-center gap-3 p-3 rounded-full transition-colors w-full ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="hidden xl:block flex-1 text-left min-w-0">
            <div className="flex items-center gap-1">
              <span className={`font-bold text-[15px] truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser.name}</span>
              {currentUser.verified && (
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.04 4.3l-3.7-3.7 1.42-1.41 2.28 2.27 5.16-5.16 1.42 1.42-6.58 6.58z"/>
                </svg>
              )}
            </div>
            <span className="text-[13px] text-gray-500 truncate block">{currentUser.handle}</span>
          </div>
          <span className={`hidden xl:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}><MoreHorizontal /></span>
        </button>
      </div>
    </aside>
  );
}
