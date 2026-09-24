import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';

export const Leaderboard: React.FC = () => {
  const tc = useThemeClasses();
  const { user } = useAuth();

  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const topUsers: LeaderboardUser[] = [
    {
      rank: 1,
      id: 'u_1',
      name: 'Amani Joseph',
      handle: 'amanitech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      xp: 14850,
      level: 42,
      tier: 'Grandmaster',
      streakDays: 28,
      weeklyTips: 420
    },
    {
      rank: 2,
      id: 'u_2',
      name: 'Elena Rostova',
      handle: 'elenadesigns',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      xp: 12400,
      level: 36,
      tier: 'Master',
      streakDays: 19,
      weeklyTips: 310
    },
    {
      rank: 3,
      id: 'u_3',
      name: 'Kibo Robotics',
      handle: 'kiborobotics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      xp: 9800,
      level: 29,
      tier: 'Elite',
      streakDays: 14,
      weeklyTips: 250
    },
    {
      rank: 4,
      id: 'u_4',
      name: 'Zainab Juma',
      handle: 'zainabj',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      xp: 7650,
      level: 22,
      tier: 'Pro',
      streakDays: 11,
      weeklyTips: 180
    },
    {
      rank: 5,
      id: 'u_5',
      name: 'Baraka Digital',
      handle: 'barakadev',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      xp: 6100,
      level: 18,
      tier: 'Rising',
      streakDays: 9,
      weeklyTips: 135
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Grandmaster': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Master': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Elite': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Pro': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Top Banner */}
      <div className="relative overflow-hidden border-b border-[#38444d]/40 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-indigo-950/40 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
              <span>🏆 Longa Creator Ranks & Streaks</span>
              <span className="text-gray-400">•</span>
              <span>Level Up Your Impact</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Creator Leaderboard & XP Gamification
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-400 max-w-xl">
              Earn XP for high-engagement posts, hosting Audio Spaces, winning community bounties, and maintaining your daily engagement streak.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Current User Progression Card */}
        <div className={`p-6 rounded-3xl border border-[#38444d]/40 ${tc.bgCard} shadow-xl mb-8 relative overflow-hidden`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user?.name || 'Creator'}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 ring-4 ring-amber-400/20"
                />
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black">
                  Lvl 18
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg">{user?.name || 'Amani Joseph'}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Pro Creator
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">@{user?.handle || 'amanitech'}</p>
              </div>
            </div>

            {/* Streak & Stats */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center">
                <span className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                  <span>🔥</span>
                  <span>14</span>
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Day Streak</span>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
                <span className="text-2xl font-black text-blue-400">
                  4,250
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total XP</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-gray-300">
              <span>Next Tier: <span className="text-amber-400 font-bold">Master (Lvl 25)</span></span>
              <span>4,250 / 5,000 XP (85%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gray-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {(['week', 'month', 'all'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  timeframe === t
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : `${tc.bgSecondary} ${tc.textSecondary} hover:bg-amber-400/10 hover:text-amber-300`
                }`}
              >
                {t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'All-Time'}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400">
            Resets every Monday 00:00 UTC
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className={`rounded-3xl border border-[#38444d]/40 overflow-hidden ${tc.bgCard} shadow-xl`}>
          <div className="divide-y divide-[#38444d]/30">
            {topUsers.map(creator => (
              <div
                key={creator.id}
                className={`p-4 flex items-center justify-between gap-4 transition ${tc.bgHover}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <span className="text-xl font-black w-8 text-center text-gray-300">
                    {getRankBadge(creator.rank)}
                  </span>

                  {/* Avatar */}
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#38444d]"
                  />

                  {/* Name and Handle */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{creator.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getTierColor(creator.tier)}`}>
                        {creator.tier}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">@{creator.handle}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400 block">
                      {creator.xp.toLocaleString()} XP
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Lvl {creator.level}
                    </span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-orange-400 flex items-center justify-end gap-1">
                      <span>🔥</span>
                      <span>{creator.streakDays}d</span>
                    </span>
                    <span className="text-[10px] text-gray-500">Streak</span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-emerald-400">
                      ${creator.weeklyTips}
                    </span>
                    <span className="text-[10px] text-gray-500">Tips</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
