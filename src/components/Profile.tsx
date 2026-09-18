import React, { useState } from 'react';
import { currentUser, posts as allPosts } from '../data';
import { Post } from '../types';
import PostComponent from './Post';
import { ArrowLeft, Calendar, MapPin, LinkIcon, Verified, Premium } from './Icons';

interface ProfileProps {
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
}

export default function Profile({ onLike, onRetweet, onBookmark }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('posts');
  const userPosts = allPosts.filter(p => p.user.id === currentUser.id);
  const tabs = ['posts', 'replies', 'highlights', 'media', 'likes'];

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center gap-6 px-4 py-2">
          <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-1">
              {currentUser.name}
              <Verified />
              <Premium />
            </h1>
            <p className="text-[13px] text-gray-500">{currentUser.posts.toLocaleString()} posts</p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="h-[200px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 border-b border-gray-800/50">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-16 mb-3">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl border-4 border-black">
            {currentUser.avatar}
          </div>
          <div className="flex gap-2 mt-12">
            <button className="px-4 py-1.5 rounded-full border border-gray-600 text-white font-bold text-[15px] hover:bg-gray-800/50 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 inline" fill="currentColor">
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
            </button>
            <button className="px-5 py-1.5 rounded-full bg-white text-black font-bold text-[15px] hover:bg-gray-200 transition-colors">
              Edit profile
            </button>
          </div>
        </div>

        {/* Name & Handle */}
        <h2 className="text-xl font-extrabold text-white flex items-center gap-1">
          {currentUser.name}
          <Verified />
          <Premium />
        </h2>
        <p className="text-[15px] text-gray-500">{currentUser.handle}</p>

        {/* Bio */}
        <p className="text-[15px] text-white mt-3 leading-relaxed">{currentUser.bio}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-[15px] text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin />
            {currentUser.location}
          </span>
          <span className="flex items-center gap-1">
            <LinkIcon />
            <a href="#" className="text-blue-400 hover:underline">{currentUser.website}</a>
          </span>
          <span className="flex items-center gap-1">
            <Calendar />
            Joined {currentUser.joinedDate}
          </span>
        </div>

        {/* Following/Followers */}
        <div className="flex items-center gap-5 mt-3">
          <span className="text-[15px]">
            <span className="font-bold text-white">{currentUser.following.toLocaleString()}</span>
            <span className="text-gray-500 ml-1">Following</span>
          </span>
          <span className="text-[15px]">
            <span className="font-bold text-white">{(currentUser.followers / 1000).toFixed(1)}K</span>
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
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                onLike={onLike}
                onRetweet={onRetweet}
                onBookmark={onBookmark}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <h3 className="text-3xl font-extrabold text-white">No posts yet</h3>
              <p className="text-gray-500 text-[15px] mt-2 text-center">When you post, they'll show up here.</p>
            </div>
          )}
        </div>
      )}

      {activeTab !== 'posts' && (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <h3 className="text-3xl font-extrabold text-white">Nothing to see here</h3>
          <p className="text-gray-500 text-[15px] mt-2 text-center">
            {activeTab === 'replies' && "You haven't replied to any posts yet."}
            {activeTab === 'highlights' && "You haven't highlighted any posts yet."}
            {activeTab === 'media' && "You haven't posted any media yet."}
            {activeTab === 'likes' && "Posts you like will show up here."}
          </p>
        </div>
      )}
    </div>
  );
}
