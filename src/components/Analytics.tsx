import React, { useState } from 'react';
import { analyticsData } from '../data';
import { ArrowLeft } from './Icons';
import { useTheme } from '../ThemeContext';

export default function Analytics() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = analyticsData;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const stats = [
    { label: 'Impressions', value: formatNumber(data.impressions), change: '+12%', icon: '👁️' },
    { label: 'Engagements', value: formatNumber(data.engagements), change: '+8%', icon: '🤝' },
    { label: 'Engagement Rate', value: `${data.engagementRate}%`, change: '+2.1%', icon: '📈' },
    { label: 'New Followers', value: formatNumber(data.followersChange), change: '+15%', icon: '👥' },
    { label: 'Profile Visits', value: formatNumber(data.profileVisits), change: '+5%', icon: '👤' },
    { label: 'Mentions', value: formatNumber(data.mentions), change: '+22%', icon: '💬' },
  ];

  // Simple bar chart data
  const chartData = [35, 52, 48, 61, 55, 70, 65, 80, 72, 88, 76, 92, 85, 95];

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h1>
        </div>
        <div className="flex px-4 pb-2 gap-2">
          {(['7d', '30d', '90d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                period === p
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="px-4 py-4">
        <h2 className={`text-lg font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'border-gray-800/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-green-400 text-xs font-bold">{stat.change}</span>
              </div>
              <p className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="px-4 py-4 border-t border-gray-800/30">
        <h2 className={`text-lg font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Activity</h2>
        <div className={`p-4 rounded-2xl border ${isDark ? 'border-gray-800/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-end gap-1 h-[120px]">
            {chartData.map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all hover:from-blue-400 hover:to-blue-300"
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-gray-500">
            <span>2 weeks ago</span>
            <span>1 week ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="px-4 py-4 border-t border-gray-800/30">
        <h2 className={`text-lg font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Posts</h2>
        <div className="space-y-3">
          {data.topPosts.map((post, i) => (
            <div key={post.id} className={`p-4 rounded-2xl border ${isDark ? 'border-gray-800/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-start gap-3">
                <span className={`text-lg font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[15px] line-clamp-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{post.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-[13px] text-gray-500">
                    <span>❤️ {formatNumber(post.likes)}</span>
                    <span>🔄 {formatNumber(post.retweets)}</span>
                    <span>👁️ {formatNumber(post.views)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audience */}
      <div className="px-4 py-4 border-t border-gray-800/30">
        <h2 className={`text-lg font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Audience</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-2xl border ${isDark ? 'border-gray-800/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
            <p className="text-[13px] text-gray-500 mb-2">Top Locations</p>
            {[
              { country: '🇹🇿 Tanzania', pct: 35 },
              { country: '🇰🇪 Kenya', pct: 22 },
              { country: '🇺🇸 USA', pct: 18 },
              { country: '🇬🇧 UK', pct: 12 },
            ].map((loc, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{loc.country}</span>
                <span className="text-sm text-gray-500">{loc.pct}%</span>
              </div>
            ))}
          </div>
          <div className={`p-4 rounded-2xl border ${isDark ? 'border-gray-800/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
            <p className="text-[13px] text-gray-500 mb-2">Interests</p>
            {[
              { interest: 'Technology', pct: 45 },
              { interest: 'AI & ML', pct: 32 },
              { interest: 'Startups', pct: 28 },
              { interest: 'Design', pct: 21 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.interest}</span>
                <span className="text-sm text-gray-500">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
