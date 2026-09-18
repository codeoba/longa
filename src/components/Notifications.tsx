import React, { useState, useMemo } from 'react';
import { Notification } from '../types';
import { Verified, Premium } from './Icons';

interface NotificationsProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onFollowUser: (userId: string) => void;
  followedUsers: string[];
}

export default function Notifications({ notifications, onMarkAllRead, onFollowUser, followedUsers }: NotificationsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'mentions'>('all');

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'verified':
        return notifications.filter(n => n.user.verified);
      case 'mentions':
        return notifications.filter(n => n.type === 'mention' || n.type === 'reply');
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return (
          <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-pink-500" fill="currentColor">
              <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.292-.504-.292C7.125 18.31 4.475 15.67 3.124 13.19c-1.532-2.817-1.265-6.546 1.373-8.476C6.695 3.036 9.52 3.285 12 5.58c2.48-2.295 5.305-2.544 7.503-.866 2.638 1.93 2.905 5.659 1.381 8.476z"/>
            </svg>
          </div>
        );
      case 'retweet':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-500" fill="currentColor">
              <path d="M4.75 16.5h10.5v-3.25l4.5 4-4.5 4V18H4.75v-1.5zm14.5-9H8.75v3.25l-4.5-4 4.5-4V5.25h10.5v1.5z"/>
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400" fill="currentColor">
              <path d="M12 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 font-bold text-sm">@</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400" fill="currentColor">
              <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-white">Notifications</h1>
          <button onClick={onMarkAllRead} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.36-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36z"/>
            </svg>
          </button>
        </div>
        <div className="flex">
          {(['all', 'verified', 'mentions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[15px] font-medium capitalize hover:bg-gray-800/30 transition-colors relative ${
                activeTab === tab ? 'text-white font-bold' : 'text-gray-500'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex gap-3 px-4 py-3 border-b border-gray-800/30 hover:bg-gray-900/30 transition-colors cursor-pointer ${
                !notif.read ? 'bg-blue-500/5' : ''
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                    {notif.user.avatar}
                  </div>
                </div>
                <p className="text-[15px] text-gray-300">
                  <span className="font-bold text-white">{notif.user.name}</span>
                  {notif.user.verified && <span className="inline-block ml-1 align-middle"><Verified /></span>}
                  {' '}{notif.content}
                </p>
                {notif.postContent && (
                  <p className="text-[13px] text-gray-500 mt-1 truncate">{notif.postContent}</p>
                )}
                {notif.type === 'follow' && (
                  <button
                    onClick={() => onFollowUser(notif.user.id)}
                    className={`mt-2 px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                      followedUsers.includes(notif.user.id)
                        ? 'bg-transparent border border-gray-600 text-white hover:border-red-500/50 hover:text-red-500'
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {followedUsers.includes(notif.user.id) ? 'Following' : 'Follow back'}
                  </button>
                )}
                <p className="text-[13px] text-gray-500 mt-1">
                  {new Date(notif.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <h3 className="text-2xl font-extrabold text-white">Nothing to see here</h3>
            <p className="text-gray-500 text-[15px] mt-2 text-center">
              {activeTab === 'verified' ? 'No notifications from verified accounts.' :
               activeTab === 'mentions' ? 'No mentions or replies yet.' :
               'No notifications yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
