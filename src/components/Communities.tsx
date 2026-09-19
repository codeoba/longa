import React, { useState } from 'react';
import { Community } from '../types';
import { communities as initialCommunities } from '../data';
import { ArrowLeft, Verified } from './Icons';
import { useTheme } from '../ThemeContext';

export default function Communities() {
  const [communities, setCommunities] = useState(initialCommunities);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [activeTab, setActiveTab] = useState<'for-you' | 'joined'>('for-you');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleMembership = (communityId: string) => {
    setCommunities(prev => prev.map(c =>
      c.id === communityId
        ? { ...c, isMember: !c.isMember, members: c.isMember ? c.members - 1 : c.members + 1 }
        : c
    ));
  };

  const joinedCommunities = communities.filter(c => c.isMember);
  const suggestedCommunities = communities.filter(c => !c.isMember);

  if (selectedCommunity) {
    return (
      <div>
        {/* Header */}
        <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
          <div className="flex items-center gap-4 px-4 py-2">
            <button onClick={() => setSelectedCommunity(null)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
              <ArrowLeft />
            </button>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedCommunity.name}</h1>
          </div>
        </div>

        {/* Banner */}
        <div className="h-[150px] bg-gradient-to-r from-purple-600 to-pink-600" />

        {/* Community Info */}
        <div className="px-4 pb-4 border-b border-gray-800/30">
          <div className="flex items-start justify-between -mt-8 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl border-4 border-black">
              {selectedCommunity.avatar}
            </div>
            <button
              onClick={() => toggleMembership(selectedCommunity.id)}
              className={`mt-8 px-5 py-1.5 rounded-full font-bold text-[15px] transition-all ${
                selectedCommunity.isMember
                  ? isDark ? 'bg-transparent border border-gray-600 text-white hover:border-red-500/50 hover:text-red-500' : 'border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {selectedCommunity.isMember ? 'Joined' : 'Join'}
            </button>
          </div>
          <h2 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedCommunity.name}</h2>
          <p className={`text-[15px] mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedCommunity.description}</p>
          <div className="flex items-center gap-4 mt-3 text-[13px] text-gray-500">
            <span>{selectedCommunity.members.toLocaleString()} Members</span>
            {selectedCommunity.isPrivate && <span>🔒 Private</span>}
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedCommunity.topics.map(topic => (
              <span key={topic} className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="px-4 py-4 border-b border-gray-800/30">
          <h3 className={`text-lg font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Community Rules</h3>
          <div className="space-y-2">
            {selectedCommunity.rules.map((rule, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                  {i + 1}
                </span>
                <p className={`text-[15px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="px-4 py-4">
          <h3 className={`text-lg font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <p className="text-[15px]">Community posts will appear here</p>
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
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Communities</h1>
        </div>
        <div className="flex">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`flex-1 py-3 text-[15px] font-medium transition-colors relative ${
              activeTab === 'for-you'
                ? `${isDark ? 'text-white' : 'text-gray-900'} font-bold`
                : `text-gray-500 ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`
            }`}
          >
            Discover
            {activeTab === 'for-you' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-3 text-[15px] font-medium transition-colors relative ${
              activeTab === 'joined'
                ? `${isDark ? 'text-white' : 'text-gray-900'} font-bold`
                : `text-gray-500 ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`
            }`}
          >
            Joined ({joinedCommunities.length})
            {activeTab === 'joined' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Create Community Button */}
      <div className="px-4 py-4">
        <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-colors">
          + Create Community
        </button>
      </div>

      {/* Communities List */}
      {activeTab === 'joined' ? (
        joinedCommunities.length > 0 ? (
          joinedCommunities.map(community => (
            <div
              key={community.id}
              onClick={() => setSelectedCommunity(community)}
              className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-colors ${
                isDark ? 'border-gray-800/30 hover:bg-gray-900/30' : 'border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                {community.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{community.name}</h3>
                <p className="text-[13px] text-gray-500">{community.members.toLocaleString()} members</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <h3 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>No communities yet</h3>
            <p className="text-gray-500 text-[15px] mt-2 text-center">Join communities to connect with people who share your interests.</p>
          </div>
        )
      ) : (
        suggestedCommunities.map(community => (
          <div
            key={community.id}
            className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-gray-800/30' : 'border-gray-100'}`}
          >
            <div
              onClick={() => setSelectedCommunity(community)}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl cursor-pointer"
            >
              {community.avatar}
            </div>
            <div className="flex-1 min-w-0" onClick={() => setSelectedCommunity(community)}>
              <h3 className={`font-bold text-[15px] cursor-pointer hover:underline ${isDark ? 'text-white' : 'text-gray-900'}`}>{community.name}</h3>
              <p className="text-[13px] text-gray-500">{community.members.toLocaleString()} members</p>
              <p className={`text-[13px] mt-0.5 line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{community.description}</p>
            </div>
            <button
              onClick={() => toggleMembership(community.id)}
              className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all flex-shrink-0 ${
                community.isMember
                  ? 'bg-transparent border border-gray-600 text-white hover:border-red-500/50 hover:text-red-500'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {community.isMember ? 'Joined' : 'Join'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
