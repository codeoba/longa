import React, { useState, useMemo, useEffect } from 'react';
import { trends } from '../data';
import { Search, ThreeDots } from './Icons';
import { useThemeClasses } from '../themeUtils';

interface ExploreProps {
  onNavigate: (page: string) => void;
}

export default function Explore({ onNavigate }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [dismissedTrendIds, setDismissedTrendIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const tc = useThemeClasses();

  const tabs = ['trending', 'news', 'sports', 'entertainment'];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDismiss = (id: string, name: string) => {
    setDismissedTrendIds(prev => [...prev, id]);
    setActiveMenuId(null);
    showToast(`"${name}" imeondolewa kwenye orodha yako.`);
  };

  const handleReport = (id: string, name: string) => {
    setDismissedTrendIds(prev => [...prev, id]);
    setActiveMenuId(null);
    showToast(`Asante kwa kuripoti. "${name}" imeondolewa.`);
  };

  const handleCopyLink = (name: string) => {
    const url = `${window.location.origin}/?search=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(url);
    setActiveMenuId(null);
    showToast(`Kiungo cha "${name}" kimenakiliwa!`);
  };

  const handleSearchTrend = (name: string) => {
    setSearchQuery(name);
    setActiveMenuId(null);
  };

  const filteredTrends = useMemo(() => {
    const source = searchQuery.trim()
      ? trends.filter(t =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : trends;

    return source.filter(t => !dismissedTrendIds.includes(t.id));
  }, [searchQuery, dismissedTrendIds]);

  return (
    <div className="relative min-h-screen pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center px-4 py-2 gap-4">
          <h1 className={`text-xl font-bold ${tc.text} flex-1`}>Explore</h1>
          <button className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`} title="Mipangilio ya Mada (Explore Settings)">
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
              placeholder="Search Longa"
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

      {/* Featured Hero Card */}
      {!searchQuery && !dismissedTrendIds.includes('featured') && (
        <div
          onClick={() => handleSearchTrend('#AIRevolution')}
          className="relative h-[250px] bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 overflow-hidden cursor-pointer group"
        >
          <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/60 to-transparent">
            <div>
              <p className="text-[13px] text-blue-200 font-medium tracking-wide">TECHNOLOGY · TRENDING</p>
              <h2 className="text-3xl font-extrabold text-white mt-1 group-hover:underline">#AIRevolution</h2>
              <p className="text-[13px] text-gray-300 mt-1">125K posts</p>
            </div>
          </div>

          <div
            className="absolute top-4 right-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveMenuId(activeMenuId === 'featured' ? null : 'featured')}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
              title="Chaguzi zaidi (More options)"
            >
              <ThreeDots />
            </button>

            {/* Dropdown Menu for Featured */}
            {activeMenuId === 'featured' && (
              <div
                className={`absolute right-0 mt-2 w-64 ${tc.bgModal} border ${tc.border} rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleDismiss('featured', '#AIRevolution')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 ${tc.bgHover} text-left text-sm ${tc.text}`}
                >
                  <span className="text-base">🙁</span>
                  <div>
                    <div className="font-semibold text-xs">Sivutiwi na mada hii</div>
                    <div className="text-[10px] text-gray-500">Not interested in this</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyLink('#AIRevolution')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 ${tc.bgHover} text-left text-sm ${tc.text}`}
                >
                  <span className="text-base">🔗</span>
                  <div>
                    <div className="font-semibold text-xs">Nakili kiungo cha mada</div>
                    <div className="text-[10px] text-gray-500">Copy link to trend</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSearchTrend('#AIRevolution')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 ${tc.bgHover} text-left text-sm ${tc.text}`}
                >
                  <span className="text-base">🔍</span>
                  <div>
                    <div className="font-semibold text-xs">Fungua machapisho yote</div>
                    <div className="text-[10px] text-gray-500">Explore related posts</div>
                  </div>
                </button>

                <div className={`h-px ${tc.borderSecondary} my-1`} />

                <button
                  type="button"
                  onClick={() => handleReport('featured', '#AIRevolution')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 ${tc.bgHover} text-left text-sm text-red-400 hover:text-red-300`}
                >
                  <span className="text-base">🚫</span>
                  <div>
                    <div className="font-semibold text-xs">Ripoti mada hii (Spam / Harmful)</div>
                    <div className="text-[10px] text-red-400/70">This trend is spam or harmful</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results / Trends List */}
      <div>
        {filteredTrends.length > 0 ? (
          filteredTrends.map((trend, index) => (
            <div
              key={trend.id}
              onClick={() => handleSearchTrend(trend.name)}
              className={`px-4 py-3 ${tc.bgHover} transition-colors cursor-pointer border-b ${tc.borderSecondary} relative`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[13px] text-gray-500">{index + 1} · {trend.category}</span>
                  <p className={`font-bold text-[15px] ${tc.text} mt-0.5 hover:underline`}>{trend.name}</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">{trend.posts}</p>
                  {trend.description && (
                    <p className={`text-[13px] ${tc.textTertiary} mt-1`}>{trend.description}</p>
                  )}
                </div>

                {/* ThreeDots Action Button */}
                <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(activeMenuId === trend.id ? null : trend.id)}
                    className={`p-2 rounded-full ${tc.bgHoverSecondary} hover:text-blue-400 text-gray-400 transition-colors hover:scale-105 active:scale-95`}
                    title="Chaguzi zaidi"
                  >
                    <ThreeDots />
                  </button>

                  {/* Dropdown Options Menu */}
                  {activeMenuId === trend.id && (
                    <div
                      className={`absolute right-0 top-9 w-64 ${tc.bgModal} border ${tc.border} rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleDismiss(trend.id, trend.name)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 ${tc.bgHover} text-left text-sm ${tc.text}`}
                      >
                        <span className="text-base">🙁</span>
                        <div>
                          <div className="font-semibold text-xs">Sivutiwi na mada hii</div>
                          <div className="text-[10px] text-gray-500">Not interested in this</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(trend.name)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 ${tc.bgHover} text-left text-sm ${tc.text}`}
                      >
                        <span className="text-base">🔗</span>
                        <div>
                          <div className="font-semibold text-xs">Nakili kiungo cha mada</div>
                          <div className="text-[10px] text-gray-500">Copy link to trend</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSearchTrend(trend.name)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 ${tc.bgHover} text-left text-sm ${tc.text}`}
                      >
                        <span className="text-base">🔍</span>
                        <div>
                          <div className="font-semibold text-xs">Fungua machapisho ya mada hii</div>
                          <div className="text-[10px] text-gray-500">Explore related posts</div>
                        </div>
                      </button>

                      <div className={`h-px ${tc.borderSecondary} my-1`} />

                      <button
                        type="button"
                        onClick={() => handleReport(trend.id, trend.name)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 ${tc.bgHover} text-left text-sm text-red-400 hover:text-red-300`}
                      >
                        <span className="text-base">🚫</span>
                        <div>
                          <div className="font-semibold text-xs">Ripoti: Mada inaleta usumbufu / spam</div>
                          <div className="text-[10px] text-red-400/70">This trend is spam or harmful</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <h3 className={`text-2xl font-extrabold ${tc.text}`}>
              {searchQuery ? `No results for "${searchQuery}"` : 'No more topics available'}
            </h3>
            <p className="text-gray-500 text-[15px] mt-2 text-center">
              {searchQuery ? 'Try searching for something else.' : 'All topics have been removed from your feed.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
