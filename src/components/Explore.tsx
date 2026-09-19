import React, { useState, useMemo } from 'react';
import { trends } from '../data';
import { Search, ThreeDots } from './Icons';
import { useThemeClasses } from '../themeUtils';

interface ExploreProps {
  onNavigate: (page: string) => void;
}

export default function Explore({ onNavigate }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const tc = useThemeClasses();

  const tabs = ['trending', 'news', 'sports', 'entertainment'];

  const filteredTrends = useMemo(() => {
    if (!searchQuery.trim()) return trends;
    return trends.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl`}>
        <div className="flex items-center px-4 py-2 gap-4">
          <h1 className={`text-xl font-bold ${tc.text} flex-1`}>Explore</h1>
          <button className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 ${tc.text}`} fill="currentColor">
              <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.36-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36z"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full border border-transparent focus-within:border-blue-500 focus-within:bg-black transition-colors ${tc.bgInput}`}>
            <Search />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>

        {/* Tabs */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[15px] font-medium capitalize transition-colors relative ${
                activeTab === tab ? `${tc.text} font-bold` : `text-gray-500 ${tc.bgHover}`
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
      {!searchQuery && (
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
      )}

      {/* Search Results / Trends */}
      {searchQuery ? (
        <div>
          {filteredTrends.length > 0 ? (
            filteredTrends.map((trend, index) => (
              <div key={trend.id} className={`px-4 py-3 ${tc.bgHover} transition-colors cursor-pointer border-b ${tc.borderSecondary}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[13px] text-gray-500">{index + 1} · {trend.category}</span>
                    <p className={`font-bold text-[15px] ${tc.text} mt-0.5`}>{trend.name}</p>
                    <p className="text-[13px] text-gray-500 mt-0.5">{trend.posts}</p>
                    {trend.description && <p className={`text-[13px] ${tc.textTertiary} mt-1`}>{trend.description}</p>}
                  </div>
                  <button className={`p-1.5 rounded-full ${tc.bgHoverSecondary} hover:text-blue-400 text-gray-500 transition-colors`}>
                    <ThreeDots />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <h3 className={`text-2xl font-extrabold ${tc.text}`}>No results for "{searchQuery}"</h3>
              <p className="text-gray-500 text-[15px] mt-2 text-center">Try searching for something else.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {trends.map((trend, index) => (
            <div key={trend.id} className={`px-4 py-3 ${tc.bgHover} transition-colors cursor-pointer border-b ${tc.borderSecondary}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] text-gray-500">{index + 1} · {trend.category}</span>
                  </div>
                  <p className={`font-bold text-[15px] ${tc.text} mt-0.5`}>{trend.name}</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">{trend.posts}</p>
                </div>
                <button className={`p-1.5 rounded-full ${tc.bgHoverSecondary} hover:text-blue-400 text-gray-500 transition-colors`}>
                  <ThreeDots />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
