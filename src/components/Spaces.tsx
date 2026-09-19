import React, { useState } from 'react';
import { Space } from '../types';
import { spaces as initialSpaces } from '../data';
import { ArrowLeft, Verified } from './Icons';
import { useTheme } from '../ThemeContext';

export default function Spaces() {
  const [spaces, setSpaces] = useState(initialSpaces);
  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const liveSpaces = spaces.filter(s => s.isLive);
  const upcomingSpaces = spaces.filter(s => !s.isLive);

  const joinSpace = (space: Space) => {
    setActiveSpace(space);
  };

  const leaveSpace = () => {
    setActiveSpace(null);
    setHandRaised(false);
  };

  if (activeSpace) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
        {/* Space Header */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={leaveSpace}
              className="px-4 py-1.5 rounded-full bg-black/30 text-white text-sm font-bold hover:bg-black/50 transition-colors"
            >
              ✕ Leave
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-2 rounded-full transition-colors ${handRaised ? 'bg-yellow-500 text-black' : 'bg-black/30 text-white hover:bg-black/50'}`}
              >
                ✋
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'}`}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white mb-1">{activeSpace.title}</h2>
          <div className="flex items-center gap-2 text-sm text-purple-200">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
            <span>·</span>
            <span>{activeSpace.listeners.toLocaleString()} listening</span>
          </div>
        </div>

        {/* Speakers */}
        <div className="px-4 py-4 border-b border-gray-800/30">
          <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Speakers</h3>
          <div className="flex flex-wrap gap-4">
            {activeSpace.speakers.map(speaker => (
              <div key={speaker.id} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl border-2 border-purple-400">
                    {speaker.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-xs">🎤</span>
                  </div>
                </div>
                <span className={`text-xs font-medium text-center max-w-[80px] truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {speaker.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Listeners */}
        <div className="px-4 py-4">
          <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Listeners ({activeSpace.listeners.toLocaleString()})
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm">
                {['👤', '👩', '👨', '🧑', '👱'][i % 5]}
              </div>
            ))}
            {activeSpace.listeners > 20 && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                +{activeSpace.listeners - 20}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {activeSpace.description && (
          <div className="px-4 py-4 border-t border-gray-800/30">
            <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>About</h3>
            <p className={`text-[15px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{activeSpace.description}</p>
          </div>
        )}

        {/* Tags */}
        <div className="px-4 py-4 border-t border-gray-800/30">
          <div className="flex flex-wrap gap-2">
            {activeSpace.tags.map(tag => (
              <span key={tag} className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Spaces</h1>
        </div>
      </div>

      {/* Start Space Button */}
      <div className="px-4 py-4">
        <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full transition-colors flex items-center justify-center gap-2">
          <span>🎙️</span>
          Start a Space
        </button>
      </div>

      {/* Live Spaces */}
      {liveSpaces.length > 0 && (
        <div className="mb-4">
          <h2 className={`px-4 text-lg font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🔴 Live now
          </h2>
          {liveSpaces.map(space => (
            <div
              key={space.id}
              onClick={() => joinSpace(space)}
              className={`mx-4 mb-2 p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                isDark
                  ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 hover:border-purple-500/50'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      LIVE
                    </span>
                    <span className="text-xs text-gray-500">{space.listeners.toLocaleString()} listening</span>
                  </div>
                  <h3 className={`font-bold text-[17px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{space.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {space.speakers.slice(0, 3).map(speaker => (
                  <div key={speaker.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm border-2 border-black">
                    {speaker.avatar}
                  </div>
                ))}
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {space.speakers.map(s => s.name.split(' ')[0]).join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Spaces */}
      {upcomingSpaces.length > 0 && (
        <div>
          <h2 className={`px-4 text-lg font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ⏰ Upcoming
          </h2>
          {upcomingSpaces.map(space => (
            <div
              key={space.id}
              className={`mx-4 mb-2 p-4 rounded-2xl border ${isDark ? 'border-gray-800/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500">
                  Started {Math.floor((Date.now() - space.startedAt.getTime()) / 3600000)}h ago
                </span>
              </div>
              <h3 className={`font-bold text-[17px] mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{space.title}</h3>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                  {space.host.avatar}
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Hosted by {space.host.name}
                </span>
              </div>
              <button className="mt-3 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm hover:bg-purple-500/30 transition-colors">
                Set Reminder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
