import React, { useState, useMemo } from 'react';
import { Post } from '../types';
import PostComponent from './Post';
import ComposeTweet from './ComposeTweet';
import { useTheme } from '../ThemeContext';

interface FeedProps {
  posts: Post[];
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
  onNewPost: (content: string) => void;
  onReply: (postId: string, content: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onViewThread: (id: string) => void;
  onUserClick: (userId: string) => void;
  incrementViews: (id: string) => void;
}

export default function Feed({ posts, onLike, onRetweet, onBookmark, onNewPost, onReply, onDelete, onPin, onViewThread, onUserClick, incrementViews }: FeedProps) {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const filteredPosts = useMemo(() => {
    if (activeTab === 'following') {
      return posts.filter(p => p.user.isFollowing);
    }
    return [...posts].sort((a, b) => {
      const engagementA = a.likes + a.retweets + a.replies;
      const engagementB = b.likes + b.retweets + b.replies;
      return engagementB - engagementA;
    });
  }, [posts, activeTab]);

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Home</h1>
          <button className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="currentColor">
              <path d="M22.772 10.506l-5.618-2.192-2.16-6.5c-.102-.307-.39-.514-.712-.514s-.61.207-.712.514l-2.16 6.5-5.62 2.192c-.282.11-.466.383-.466.692s.184.583.466.692l5.62 2.192 2.16 6.5c.102.306.39.514.712.514s.61-.208.712-.514l2.16-6.5 5.618-2.192c.282-.11.466-.383.466-.692s-.184-.583-.466-.692zm-6.49 3.042c-.102.307-.39.514-.712.514H8.43c-.322 0-.61-.207-.712-.514l-3.54-1.383 3.54-1.383c.102-.307.39-.514.712-.514h7.14c.322 0 .61.207.712.514l3.54 1.383-3.54 1.383z"/>
            </svg>
          </button>
        </div>
        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`flex-1 py-3 text-[15px] font-medium transition-colors relative ${
              activeTab === 'for-you'
                ? `${isDark ? 'text-white' : 'text-gray-900'} font-bold`
                : `${isDark ? 'text-gray-500' : 'text-gray-500'} ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`
            }`}
          >
            For you
            {activeTab === 'for-you' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-[15px] font-medium transition-colors relative ${
              activeTab === 'following'
                ? `${isDark ? 'text-white' : 'text-gray-900'} font-bold`
                : `${isDark ? 'text-gray-500' : 'text-gray-500'} ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`
            }`}
          >
            Following
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Compose */}
      <ComposeTweet onSubmit={onNewPost} />

      {/* Posts */}
      <div>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostComponent
              key={post.id}
              post={post}
              onLike={onLike}
              onRetweet={onRetweet}
              onBookmark={onBookmark}
              onReply={onReply}
              onDelete={onDelete}
              onPin={onPin}
              onViewThread={onViewThread}
              onUserClick={onUserClick}
              incrementViews={incrementViews}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <h3 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>No posts to show</h3>
            <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-[15px] mt-2 text-center`}>
              {activeTab === 'following' ? 'Follow more accounts to see their posts here.' : 'Check back later for new posts.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
