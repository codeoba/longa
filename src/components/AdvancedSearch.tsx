import React, { useState } from 'react';
import { useThemeClasses } from '../themeUtils';

interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'hashtag';
  content: string;
  author?: string;
  authorAvatar?: string;
  timestamp?: Date;
  likes?: number;
  retweets?: number;
  followers?: number;
  posts?: number;
}

export default function AdvancedSearch() {
  const tc = useThemeClasses();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'posts' | 'users' | 'hashtags' | 'media'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'latest' | 'popular'>('relevance');
  const [filters, setFilters] = useState({
    dateRange: 'any',
    location: '',
    language: 'any',
    verified: false,
    hasMedia: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Sample search results
  const [results, setResults] = useState<SearchResult[]>([
    {
      id: '1',
      type: 'post',
      content: '🚀 Excited to announce our new AI-powered code review tool! The future of software development is here. #AI #DevTools',
      author: 'Zawadi Innovation',
      authorAvatar: '👩‍🔬',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 2341,
      retweets: 567,
    },
    {
      id: '2',
      type: 'post',
      content: '💡 Hot take: TypeScript is not just "JavaScript with types." It\'s a completely different way of thinking about software architecture. #TypeScript',
      author: 'Furaha Dev',
      authorAvatar: '👨‍🎓',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      likes: 3456,
      retweets: 789,
    },
    {
      id: '3',
      type: 'user',
      content: 'Neema AI',
      authorAvatar: '🤖',
      followers: 125000,
      posts: 5600,
    },
    {
      id: '4',
      type: 'hashtag',
      content: '#AIRevolution',
      posts: 125000,
    },
  ]);

  const handleSearch = () => {
    if (!query.trim()) return;
    // In real app, this would call API
    console.log('Searching for:', query, 'with filters:', filters);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="px-4 py-3">
          {/* Search input */}
          <div className="flex gap-2 mb-3">
            <div className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full border ${tc.border} ${tc.bgInput}`}>
              <svg className={`w-5 h-5 ${tc.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search X"
                className={`flex-1 bg-transparent outline-none ${tc.text}`}
              />
              {query && (
                <button onClick={() => setQuery('')} className={tc.textSecondary}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-full border ${showFilters ? 'border-blue-500 bg-blue-500/10' : tc.border} ${tc.text} font-bold`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Search type tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(['all', 'posts', 'users', 'hashtags', 'media'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${
                  searchType === type
                    ? 'bg-blue-500 text-white'
                    : `${tc.bgTertiary} ${tc.textSecondary} hover:bg-gray-500/20`
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className={`px-4 pb-4 border-t ${tc.border}`}>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {/* Date range */}
              <div>
                <label className={`block text-xs font-medium ${tc.textSecondary} mb-1`}>
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} text-sm outline-none focus:border-blue-500`}
                >
                  <option value="any">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="year">This year</option>
                </select>
              </div>

              {/* Sort by */}
              <div>
                <label className={`block text-xs font-medium ${tc.textSecondary} mb-1`}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} text-sm outline-none focus:border-blue-500`}
                >
                  <option value="relevance">Relevance</option>
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className={`block text-xs font-medium ${tc.textSecondary} mb-1`}>
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  placeholder="Any location"
                  className={`w-full px-3 py-2 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} text-sm outline-none focus:border-blue-500`}
                />
              </div>

              {/* Language */}
              <div>
                <label className={`block text-xs font-medium ${tc.textSecondary} mb-1`}>
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} text-sm outline-none focus:border-blue-500`}
                >
                  <option value="any">Any language</option>
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className={`text-sm ${tc.text}`}>Verified accounts only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasMedia}
                  onChange={(e) => setFilters({ ...filters, hasMedia: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className={`text-sm ${tc.text}`}>Has media</span>
              </label>
            </div>

            {/* Apply filters */}
            <button
              onClick={() => {
                handleSearch();
                setShowFilters(false);
              }}
              className="w-full mt-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-4 space-y-3">
        {query && results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No results found</h3>
            <p className={tc.textSecondary}>Try different keywords or adjust your filters</p>
          </div>
        ) : (
          results.map(result => (
            <div key={result.id} className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              {result.type === 'post' && (
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                      {result.authorAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-sm ${tc.text}`}>{result.author}</p>
                        {result.timestamp && (
                          <>
                            <span className={`text-xs ${tc.textSecondary}`}>·</span>
                            <span className={`text-xs ${tc.textSecondary}`}>{formatTime(result.timestamp)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className={`${tc.text} text-[15px] mb-2`}>{result.content}</p>
                  <div className={`flex items-center gap-4 text-xs ${tc.textSecondary}`}>
                    <span>❤️ {formatNumber(result.likes || 0)}</span>
                    <span>🔄 {formatNumber(result.retweets || 0)}</span>
                  </div>
                </div>
              )}

              {result.type === 'user' && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
                    {result.authorAvatar}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${tc.text}`}>{result.content}</p>
                    <p className={`text-sm ${tc.textSecondary}`}>
                      {formatNumber(result.followers || 0)} followers · {formatNumber(result.posts || 0)} posts
                    </p>
                  </div>
                  <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm">
                    Follow
                  </button>
                </div>
              )}

              {result.type === 'hashtag' && (
                <div>
                  <p className={`font-bold text-lg ${tc.text} mb-1`}>{result.content}</p>
                  <p className={`text-sm ${tc.textSecondary}`}>
                    {formatNumber(result.posts || 0)} posts
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
