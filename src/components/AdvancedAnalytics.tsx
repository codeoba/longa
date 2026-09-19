import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface PostAnalytics {
  id: string;
  content: string;
  impressions: number;
  engagements: number;
  likes: number;
  retweets: number;
  replies: number;
  profileClicks: number;
  timestamp: Date;
}

interface AudienceInsight {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export default function AdvancedAnalytics() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'audience' | 'growth'>('overview');

  // Sample data
  const stats = {
    totalImpressions: 1250000,
    totalEngagements: 89000,
    engagementRate: 7.12,
    newFollowers: 1240,
    profileVisits: 34500,
    mentions: 2340,
  };

  const topPosts: PostAnalytics[] = [
    {
      id: '1',
      content: '🚀 Excited to announce our new AI-powered code review tool! The future of software development is here.',
      impressions: 234000,
      engagements: 15600,
      likes: 8900,
      retweets: 3400,
      replies: 2300,
      profileClicks: 1200,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: '2',
      content: '💡 Hot take: TypeScript is not just "JavaScript with types." It\'s a completely different way of thinking about software architecture.',
      impressions: 145000,
      engagements: 9800,
      likes: 5600,
      retweets: 2100,
      replies: 1500,
      profileClicks: 600,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      id: '3',
      content: '🌍 Excited to announce that our open-source project just hit 10,000 stars on GitHub! Thank you to every contributor!',
      impressions: 890000,
      engagements: 45000,
      likes: 23000,
      retweets: 12000,
      replies: 8000,
      profileClicks: 2000,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
  ];

  const audienceInsights: AudienceInsight[] = [
    { label: 'Technology', value: 45, percentage: 45, color: '#3b82f6' },
    { label: 'AI & ML', value: 32, percentage: 32, color: '#8b5cf6' },
    { label: 'Startups', value: 28, percentage: 28, color: '#ec4899' },
    { label: 'Design', value: 21, percentage: 21, color: '#f59e0b' },
    { label: 'Other', value: 15, percentage: 15, color: '#6b7280' },
  ];

  const locationData: AudienceInsight[] = [
    { label: '🇹🇿 Tanzania', value: 35, percentage: 35, color: '#3b82f6' },
    { label: '🇰🇪 Kenya', value: 22, percentage: 22, color: '#8b5cf6' },
    { label: '🇺🇸 USA', value: 18, percentage: 18, color: '#ec4899' },
    { label: '🇬🇧 UK', value: 12, percentage: 12, color: '#f59e0b' },
    { label: '🇳🇬 Nigeria', value: 8, percentage: 8, color: '#10b981' },
    { label: 'Other', value: 5, percentage: 5, color: '#6b7280' },
  ];

  // Chart data
  const chartData = [
    { date: '2 weeks ago', impressions: 35000, engagements: 2500 },
    { date: 'Last week', impressions: 52000, engagements: 3800 },
    { date: 'This week', impressions: 68000, engagements: 5200 },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text} mb-1`}>Analytics</h1>
          <p className={`text-sm ${tc.textSecondary}`}>Track your performance and grow your audience</p>
        </div>

        {/* Time Range */}
        <div className="flex px-4 pb-2 gap-2 overflow-x-auto scrollbar-hide">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : `${tc.bgTertiary} ${tc.textSecondary} hover:bg-gray-500/20`
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : range === '90d' ? 'Last 90 days' : 'All time'}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex">
          {(['overview', 'posts', 'audience', 'growth'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
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

      {/* Content */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${tc.textSecondary}`}>Impressions</p>
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className={`text-2xl font-bold ${tc.text}`}>{formatNumber(stats.totalImpressions)}</p>
                <p className="text-xs text-green-500 mt-1">↑ 12% vs previous period</p>
              </div>

              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${tc.textSecondary}`}>Engagements</p>
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className={`text-2xl font-bold ${tc.text}`}>{formatNumber(stats.totalEngagements)}</p>
                <p className="text-xs text-green-500 mt-1">↑ 8% vs previous period</p>
              </div>

              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${tc.textSecondary}`}>Engagement Rate</p>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className={`text-2xl font-bold ${tc.text}`}>{stats.engagementRate}%</p>
                <p className="text-xs text-green-500 mt-1">↑ 2.1% vs previous period</p>
              </div>

              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${tc.textSecondary}`}>New Followers</p>
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className={`text-2xl font-bold ${tc.text}`}>{formatNumber(stats.newFollowers)}</p>
                <p className="text-xs text-green-500 mt-1">↑ 15% vs previous period</p>
              </div>

              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${tc.textSecondary}`}>Profile Visits</p>
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className={`text-2xl font-bold ${tc.text}`}>{formatNumber(stats.profileVisits)}</p>
                <p className="text-xs text-green-500 mt-1">↑ 5% vs previous period</p>
              </div>

              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${tc.textSecondary}`}>Mentions</p>
                  <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className={`text-2xl font-bold ${tc.text}`}>{formatNumber(stats.mentions)}</p>
                <p className="text-xs text-green-500 mt-1">↑ 22% vs previous period</p>
              </div>
            </div>

            {/* Activity Chart */}
            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Activity</h3>
              <div className="flex items-end gap-2 h-32">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-1 flex-1 justify-end">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                        style={{ height: `${(data.impressions / 100000) * 100}%` }}
                      />
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
                        style={{ height: `${(data.engagements / 10000) * 100}%` }}
                      />
                    </div>
                    <p className={`text-xs ${tc.textSecondary} text-center`}>{data.date}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                  <span className={`text-xs ${tc.textSecondary}`}>Impressions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-purple-500" />
                  <span className={`text-xs ${tc.textSecondary}`}>Engagements</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-3">
            <h3 className={`text-lg font-bold ${tc.text} mb-3`}>Top Performing Posts</h3>
            {topPosts.map((post, index) => (
              <div key={post.id} className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className={`text-2xl font-bold ${tc.textSecondary}`}>#{index + 1}</span>
                  <div className="flex-1">
                    <p className={`${tc.text} text-[15px] mb-2 line-clamp-2`}>{post.content}</p>
                    <p className={`text-xs ${tc.textSecondary}`}>
                      {post.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className={`text-xs ${tc.textSecondary}`}>Impressions</p>
                    <p className={`text-lg font-bold ${tc.text}`}>{formatNumber(post.impressions)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${tc.textSecondary}`}>Engagements</p>
                    <p className={`text-lg font-bold ${tc.text}`}>{formatNumber(post.engagements)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${tc.textSecondary}`}>Profile Clicks</p>
                    <p className={`text-lg font-bold ${tc.text}`}>{formatNumber(post.profileClicks)}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 mt-3 pt-3 border-t ${tc.border} text-xs ${tc.textSecondary}`}>
                  <span>❤️ {formatNumber(post.likes)}</span>
                  <span>🔄 {formatNumber(post.retweets)}</span>
                  <span>💬 {formatNumber(post.replies)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="space-y-4">
            {/* Interests */}
            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Audience Interests</h3>
              <div className="space-y-3">
                {audienceInsights.map((insight, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${tc.text}`}>{insight.label}</span>
                      <span className={`text-sm font-bold ${tc.text}`}>{insight.percentage}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${tc.bgTertiary} overflow-hidden`}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${insight.percentage}%`, backgroundColor: insight.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Top Locations</h3>
              <div className="space-y-3">
                {locationData.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`text-sm ${tc.text}`}>{location.label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-24 h-2 rounded-full ${tc.bgTertiary} overflow-hidden`}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${location.percentage}%`, backgroundColor: location.color }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${tc.text} w-10 text-right`}>{location.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographics */}
            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Demographics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${tc.textSecondary} mb-2`}>Age Range</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${tc.text}`}>18-24</span>
                      <span className={`text-xs font-bold ${tc.text}`}>35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${tc.text}`}>25-34</span>
                      <span className={`text-xs font-bold ${tc.text}`}>42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${tc.text}`}>35-44</span>
                      <span className={`text-xs font-bold ${tc.text}`}>18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${tc.text}`}>45+</span>
                      <span className={`text-xs font-bold ${tc.text}`}>5%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className={`text-sm ${tc.textSecondary} mb-2`}>Active Times</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${tc.text}`}>Morning</span>
                      <span className={`text-xs font-bold ${tc.text}`}>28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${tc.text}`}>Afternoon</span>
                      <span className={`text-xs font-bold ${tc.text}`}>35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${tc.text}`}>Evening</span>
                      <span className={`text-xs font-bold ${tc.text}`}>32%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${tc.text}`}>Night</span>
                      <span className={`text-xs font-bold ${tc.text}`}>5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-4">
            {/* Follower Growth */}
            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Follower Growth</h3>
              <div className="flex items-end gap-2 h-40">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-1 flex-1 justify-end">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                        style={{ height: `${(index + 1) * 30}%` }}
                      />
                    </div>
                    <p className={`text-xs ${tc.textSecondary} text-center`}>{data.date}</p>
                  </div>
                ))}
              </div>
              <div className={`mt-4 pt-4 border-t ${tc.border}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${tc.textSecondary}`}>Total Growth</span>
                  <span className="text-lg font-bold text-green-500">+{formatNumber(stats.newFollowers)}</span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-4`}>Milestones</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${tc.text}`}>10K Followers</p>
                    <p className={`text-xs ${tc.textSecondary}`}>Achieved on Jan 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${tc.text}`}>1M Impressions</p>
                    <p className={`text-xs ${tc.textSecondary}`}>Achieved on Jan 20, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-xl">💎</span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${tc.text}`}>Top 1% Creator</p>
                    <p className={`text-xs ${tc.textSecondary}`}>Achieved on Jan 25, 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Milestone */}
            <div className={`${tc.bgCard} rounded-xl p-4 border-2 border-blue-500`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-2`}>Next Milestone</h3>
              <p className={`text-sm ${tc.textSecondary} mb-3`}>15,000 Followers</p>
              <div className={`w-full h-3 rounded-full ${tc.bgTertiary} overflow-hidden mb-2`}>
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  style={{ width: `${(15420 / 15000) * 100}%` }}
                />
              </div>
              <p className={`text-xs ${tc.textSecondary}`}>
                {(15420).toLocaleString()} / 15,000 followers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
