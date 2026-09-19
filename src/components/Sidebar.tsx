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

const extraNavItems: { icon: React.ReactNode; label: string; page: Page }[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
      </svg>
    ),
    label: 'Grok',
    page: 'grok',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z"/>
      </svg>
    ),
    label: 'Spaces',
    page: 'spaces',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    label: 'Communities',
    page: 'communities',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
    label: 'Analytics',
    page: 'analytics',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    label: 'Drafts',
    page: 'drafts',
  },
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
        {/* Extra navigation items - visible on larger screens */}
        <div className="hidden xl:block border-t border-gray-800/30 mt-2 pt-2">
          {extraNavItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-4 px-3 py-3 rounded-full transition-all duration-200 group w-full ${
                  isActive
                    ? `font-bold ${isDark ? 'text-white' : 'text-gray-900'}`
                    : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/40' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-[17px]">{item.label}</span>
              </button>
            );
          })}
        </div>
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
