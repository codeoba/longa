import React, { useState } from 'react';
import { trends } from '../data';
import { Search, ThreeDots } from './Icons';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  const tabs = ['trending', 'news', 'sports', 'entertainment'];

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center px-4 py-2 gap-4">
          <h1 className="text-xl font-bold text-white flex-1">Explore</h1>
          <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.36-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36z"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-gray-900 border border-transparent focus-within:border-blue-500 focus-within:bg-black transition-colors">
            <Search />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[15px] text-white placeholder-gray-500 outline-none flex-1"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          {tabs.map((tab) => (
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

      {/* Featured */}
      <div className="relative h-[250px] bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 overflow-hidden">
        <div className="absolute inset-0 flex items-end p-6">
          <div>
            <p className="text-[13px] text-gray-300 font-medium">TECHNOLOGY · TRENDING</p>
            <h2 className="text-2xl font-extrabold text-white mt-1">#AIRevolution</h2>
            <p className="text-[13px] text-gray-300 mt-1">125K posts</p>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <button className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
            <ThreeDots />
          </button>
        </div>
      </div>

      {/* Trends */}
      <div>
        {trends.map((trend, index) => (
          <div key={trend.id} className="px-4 py-3 hover:bg-gray-900/30 transition-colors cursor-pointer border-b border-gray-800/30">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[13px] text-gray-500">{index + 1} · {trend.category}</span>
                </div>
                <p className="font-bold text-[15px] text-white mt-0.5">{trend.name}</p>
                <p className="text-[13px] text-gray-500 mt-0.5">{trend.posts}</p>
              </div>
              <button className="p-1.5 rounded-full hover:bg-blue-500/10 hover:text-blue-400 text-gray-500 transition-colors">
                <ThreeDots />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
