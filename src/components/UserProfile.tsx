import React, { useState } from 'react';
import { User, Post } from '../types';
import PostComponent from './Post';
import { ArrowLeft, Verified, Premium, Calendar, MapPin, LinkIcon, ThreeDots } from './Icons';

interface UserProfileProps {
  user: User;
  posts: Post[];
  isFollowing: boolean;
  onFollow: () => void;
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
  onReply: (postId: string, content: string) => void;
  onViewThread: (id: string) => void;
  onUserClick: (userId: string) => void;
  incrementViews: (id: string) => void;
  onBack: () => void;
  isMuted: boolean;
  isBlocked: boolean;
  onMute: () => void;
  onBlock: () => void;
}

export default function UserProfile({ user, posts, isFollowing, onFollow, onLike, onRetweet, onBookmark, onReply, onViewThread, onUserClick, incrementViews, onBack, isMuted, isBlocked, onMute, onBlock }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('posts');
  const [showMenu, setShowMenu] = useState(false);
  const tabs = ['posts', 'replies', 'media', 'likes'];

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
              <ArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-1">
                {user.name}
                {user.verified && <Verified />}
                {user.premium && <Premium />}
              </h1>
              <p className="text-[13px] text-gray-500">{user.posts.toLocaleString()} posts</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
            >
              <ThreeDots />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 w-64 bg-black border border-gray-800 rounded-xl shadow-xl z-50 py-2">
                <button onClick={() => { onMute(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-900 text-left text-[15px] text-white">
                  {isMuted ? 'Unmute' : 'Mute'} @{user.handle.slice(1)}
                </button>
                <button onClick={() => { onBlock(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-900 text-left text-[15px] text-white">
                  {isBlocked ? 'Unblock' : 'Block'} @{user.handle.slice(1)}
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-900 text-left text-[15px] text-red-500">
                  Report @{user.handle.slice(1)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="h-[200px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

      {/* Profile Info */}
      <div className="px-4 pb-4 border-b border-gray-800/50">
        <div className="flex items-end justify-between -mt-16 mb-3">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl border-4 border-black">
            {user.avatar}
          </div>
          <div className="flex gap-2 mt-12">
            <button className="px-4 py-1.5 rounded-full border border-gray-600 text-white font-bold text-[15px] hover:bg-gray-800/50 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 inline" fill="currentColor">
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59z"/>
              </svg>
            </button>
            <button
              onClick={onFollow}
              className={`px-5 py-1.5 rounded-full font-bold text-[15px] transition-all ${
                isFollowing
                  ? 'bg-transparent border border-gray-600 text-white hover:border-red-500/50 hover:text-red-500'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-white flex items-center gap-1">
          {user.name}
          {user.verified && <Verified />}
          {user.premium && <Premium />}
        </h2>
        <p className="text-[15px] text-gray-500">{user.handle}</p>
        <p className="text-[15px] text-white mt-3 leading-relaxed">{user.bio}</p>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-[15px] text-gray-500">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin />
              {user.location}
            </span>
          )}
          {user.website && (
            <span className="flex items-center gap-1">
              <LinkIcon />
              <a href="#" className="text-blue-400 hover:underline">{user.website}</a>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar />
            Joined {user.joinedDate}
          </span>
        </div>

        <div className="flex items-center gap-5 mt-3">
          <span className="text-[15px]">
            <span className="font-bold text-white">{user.following.toLocaleString()}</span>
            <span className="text-gray-500 ml-1">Following</span>
          </span>
          <span className="text-[15px]">
            <span className="font-bold text-white">{(user.followers / 1000).toFixed(1)}K</span>
            <span className="text-gray-500 ml-1">Followers</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800/50">
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

      {/* Posts */}
      {activeTab === 'posts' && (
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                onLike={onLike}
                onRetweet={onRetweet}
                onBookmark={onBookmark}
                onReply={onReply}
                onViewThread={onViewThread}
                onUserClick={onUserClick}
                incrementViews={incrementViews}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <h3 className="text-3xl font-extrabold text-white">No posts yet</h3>
              <p className="text-gray-500 text-[15px] mt-2 text-center">When @{user.handle.slice(1)} posts, they'll show up here.</p>
            </div>
          )}
        </div>
      )}

      {activeTab !== 'posts' && (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <h3 className="text-3xl font-extrabold text-white">Nothing here yet</h3>
          <p className="text-gray-500 text-[15px] mt-2 text-center">
            {activeTab === 'replies' && `${user.name} hasn't replied to any posts yet.`}
            {activeTab === 'media' && `${user.name} hasn't posted any media yet.`}
            {activeTab === 'likes' && `Posts liked by ${user.name} will show up here.`}
          </p>
        </div>
      )}
    </div>
  );
}
