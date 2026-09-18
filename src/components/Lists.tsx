import React from 'react';
import { ArrowLeft } from './Icons';
import { users } from '../data';

export default function Lists() {
  const myLists = [
    { id: '1', name: 'Tech Leaders', members: 45, description: 'Top tech influencers and innovators', isPrivate: false },
    { id: '2', name: 'AI Researchers', members: 23, description: 'Artificial intelligence experts', isPrivate: false },
    { id: '3', name: 'Design Inspiration', members: 67, description: 'Creative designers and artists', isPrivate: true },
    { id: '4', name: 'Startup Founders', members: 34, description: 'Entrepreneurs building the future', isPrivate: false },
  ];

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
              <ArrowLeft />
            </button>
            <h1 className="text-xl font-bold text-white">Lists</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.36-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Your Lists */}
      <div className="px-4 py-4 border-b border-gray-800/50">
        <h2 className="text-xl font-extrabold text-white mb-1">Your Lists</h2>
        <p className="text-[13px] text-gray-500">Create and manage your custom lists</p>
      </div>

      {/* Create List */}
      <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-900/30 transition-colors border-b border-gray-800/30">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400" fill="currentColor">
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
          </svg>
        </div>
        <div className="text-left">
          <p className="font-bold text-[15px] text-white">Create a new List</p>
          <p className="text-[13px] text-gray-500">Discover and organize content</p>
        </div>
      </button>

      {/* Lists */}
      {myLists.map((list) => (
        <div
          key={list.id}
          className="flex items-center gap-4 px-4 py-4 hover:bg-gray-900/30 transition-colors cursor-pointer border-b border-gray-800/30"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-300" fill="currentColor">
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[15px] text-white">{list.name}</span>
              {list.isPrivate && (
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
                  <path d="M12 1C8.98 1 6.5 3.48 6.5 6.5S8.98 12 12 12s5.5-2.48 5.5-5.5S15.02 1 12 1zm0 9c-1.93 0-3.5-1.57-3.5-3.5S10.07 3 12 3s3.5 1.57 3.5 3.5S13.93 10 12 10zm0 3c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
            <p className="text-[13px] text-gray-500 mt-0.5">{list.members} members · {list.description}</p>
          </div>
        </div>
      ))}

      {/* Suggested Lists */}
      <div className="px-4 py-4 border-b border-gray-800/50">
        <h2 className="text-xl font-extrabold text-white">Discover new Lists</h2>
      </div>
      {[
        { name: 'Top Tech Voices', creator: 'X', members: '12.5K' },
        { name: 'AI & Machine Learning', creator: 'TechCurator', members: '8.2K' },
        { name: 'Startup Ecosystem', creator: 'VentureHub', members: '5.7K' },
      ].map((list, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-900/30 transition-colors cursor-pointer border-b border-gray-800/30">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400" fill="currentColor">
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[15px] text-white">{list.name}</p>
            <p className="text-[13px] text-gray-500 mt-0.5">By @{list.creator} · {list.members} members</p>
          </div>
          <button className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}
