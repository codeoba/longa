import React, { useState } from 'react';
import { User, Post } from '../types';
import PostComponent from './Post';
import { Calendar, MapPin, LinkIcon, Verified, Premium } from './Icons';

interface ProfileProps {
  user: User;
  posts: Post[];
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
  onReply: (postId: string, content: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onViewThread: (id: string) => void;
  onUserClick: (userId: string) => void;
  incrementViews: (id: string) => void;
  isOwnProfile: boolean;
}

export default function Profile({ user, posts, onLike, onRetweet, onBookmark, onReply, onDelete, onPin, onViewThread, onUserClick, incrementViews, isOwnProfile }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location || '');
  const [editWebsite, setEditWebsite] = useState(user.website || '');
  const tabs = ['posts', 'replies', 'highlights', 'media', 'likes'];

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center gap-6 px-4 py-2">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-1">
              {user.name}
              <Verified />
              <Premium />
            </h1>
            <p className="text-[13px] text-gray-500">{user.posts.toLocaleString()} posts</p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="h-[200px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative" />

      {/* Profile Info */}
      <div className="px-4 pb-4 border-b border-gray-800/50">
        <div className="flex items-end justify-between -mt-16 mb-3">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl border-4 border-black">
            {user.avatar}
          </div>
          <div className="flex gap-2 mt-12">
            <button className="px-4 py-1.5 rounded-full border border-gray-600 text-white font-bold text-[15px] hover:bg-gray-800/50 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 inline" fill="currentColor">
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-5 py-1.5 rounded-full bg-white text-black font-bold text-[15px] hover:bg-gray-200 transition-colors"
            >
              Edit profile
            </button>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-white flex items-center gap-1">
          {user.name}
          <Verified />
          <Premium />
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
                onDelete={onDelete}
                onPin={onPin}
                onViewThread={onViewThread}
                onUserClick={onUserClick}
                incrementViews={incrementViews}
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-[600px] mx-4 bg-black rounded-2xl border border-gray-800/50 shadow-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
                </svg>
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-white text-black font-bold px-5 py-1.5 rounded-full text-[15px] hover:bg-gray-200 transition-colors"
              >
                Save
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-gray-500 block mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[13px] text-gray-500 block mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-[13px] text-gray-500 block mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[13px] text-gray-500 block mb-1">Website</label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
