import React from 'react';
import { Page } from '../types';
import { currentUser } from '../data';
import {
  Home, Search, Bell, Mail, Bookmark, Users, User, Settings,
  MoreHorizontal, Feather, Sparkles, List, XLogo
} from './Icons';
import { useThemeClasses } from '../themeUtils';

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
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    label: 'Stories',
    page: 'stories',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
      </svg>
    ),
    label: 'Videos',
    page: 'videos',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
      </svg>
    ),
    label: 'Live',
    page: 'live',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
      </svg>
    ),
    label: 'Monetize',
    page: 'monetization',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
    label: 'Bookmarks',
    page: 'bookmark-collections',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
      </svg>
    ),
    label: 'Reading List',
    page: 'reading-list',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    label: 'Nearby',
    page: 'location',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    label: 'Collab',
    page: 'collaborative',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </svg>
    ),
    label: 'AI Images',
    page: 'ai-images',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
    label: 'Themes',
    page: 'themes',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      </svg>
    ),
    label: 'Scheduled',
    page: 'scheduled',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
    label: 'Thread',
    page: 'thread-builder',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    label: 'Offline',
    page: 'offline',
  },
];

export default function Sidebar({ currentPage, onNavigate, onCompose, unreadNotifications, unreadMessages }: SidebarProps) {
  const tc = useThemeClasses();

  return (
    <aside className={`fixed left-0 top-0 h-full w-[68px] xl:w-[275px] flex flex-col items-center xl:items-start px-2 xl:px-3 py-3 border-r ${tc.border} z-50 ${tc.bgBackdrop} backdrop-blur-xl`}>
      {/* Logo */}
      <div className={`p-3 mb-1 rounded-full cursor-pointer transition-colors ${tc.bgHoverSecondary}`}>
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
                  ? `font-bold ${tc.text}`
                  : `text-gray-500 ${tc.bgHoverSecondary} ${tc.textSecondary}`
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
        <div className={`hidden xl:block border-t ${tc.borderSecondary} mt-2 pt-2`}>
          {extraNavItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-4 px-3 py-3 rounded-full transition-all duration-200 group w-full ${
                  isActive
                    ? `font-bold ${tc.text}`
                    : `text-gray-500 ${tc.bgHoverSecondary} ${tc.textSecondary}`
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
        <button className={`flex items-center gap-3 p-3 rounded-full transition-colors w-full ${tc.bgHoverSecondary}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="hidden xl:block flex-1 text-left min-w-0">
            <div className="flex items-center gap-1">
              <span className={`font-bold text-[15px] truncate ${tc.text}`}>{currentUser.name}</span>
              {currentUser.verified && (
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.04 4.3l-3.7-3.7 1.42-1.41 2.28 2.27 5.16-5.16 1.42 1.42-6.58 6.58z"/>
                </svg>
              )}
            </div>
            <span className="text-[13px] text-gray-500 truncate block">{currentUser.handle}</span>
          </div>
          <span className={`hidden xl:block ${tc.textMuted}`}><MoreHorizontal /></span>
        </button>
      </div>
    </aside>
  );
}
