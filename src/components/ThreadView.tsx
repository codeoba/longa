import React, { useState } from 'react';
import { Post } from '../types';
import PostComponent from './Post';
import ComposeTweet from './ComposeTweet';
import { ArrowLeft, Verified, Premium } from './Icons';
import { currentUser } from '../data';

interface ThreadViewProps {
  post: Post;
  allPosts: Post[];
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
  onReply: (postId: string, content: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onViewThread: (id: string) => void;
  onUserClick: (userId: string) => void;
  incrementViews: (id: string) => void;
  onBack: () => void;
}

export default function ThreadView({ post, allPosts, onLike, onRetweet, onBookmark, onReply, onDelete, onPin, onViewThread, onUserClick, incrementViews, onBack }: ThreadViewProps) {
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(post.id, replyText);
      setReplyText('');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center gap-6 px-4 py-2">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-white">Post</h1>
        </div>
      </div>

      {/* Original Post (expanded) */}
      <div className="px-4 py-3 border-b border-gray-800/50">
        <div className="flex items-center gap-3 mb-3">
          <div
            onClick={() => onUserClick(post.user.id)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg cursor-pointer hover:opacity-80"
          >
            {post.user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[15px] text-white">{post.user.name}</span>
              {post.user.verified && <Verified />}
              {post.user.premium && <Premium />}
            </div>
            <span className="text-gray-500 text-[15px]">{post.user.handle}</span>
          </div>
        </div>

        <div className="text-[17px] text-white leading-relaxed whitespace-pre-wrap break-words mb-3">
          {post.content.split(/(#\w+|@\w+|https?:\/\/\S+)/g).map((part, i) => {
            if (part.startsWith('#')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
            if (part.startsWith('@')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
            if (part.startsWith('http')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
            return part;
          })}
        </div>

        <div className="text-[13px] text-gray-500 pb-3 border-b border-gray-800/50">
          {post.timestamp.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
          {' · '}
          <span className="text-white font-bold">{post.views.toLocaleString()}</span> Views
        </div>

        {/* Engagement stats */}
        <div className="flex items-center gap-5 py-3 border-b border-gray-800/50 text-[13px]">
          {post.retweets > 0 && (
            <span><span className="font-bold text-white">{post.retweets.toLocaleString()}</span> <span className="text-gray-500">Reposts</span></span>
          )}
          {post.likes > 0 && (
            <span><span className="font-bold text-white">{post.likes.toLocaleString()}</span> <span className="text-gray-500">Likes</span></span>
          )}
          {post.bookmarks > 0 && (
            <span><span className="font-bold text-white">{post.bookmarks.toLocaleString()}</span> <span className="text-gray-500">Bookmarks</span></span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-around py-2 border-b border-gray-800/50">
          <button className="p-2 rounded-full hover:bg-blue-500/10 text-gray-500 hover:text-blue-400 transition-colors">
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
              <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
            </svg>
          </button>
          <button onClick={() => onRetweet(post.id)} className={`p-2 rounded-full hover:bg-green-500/10 transition-colors ${post.retweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-400'}`}>
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
              <path d="M4.75 16.5h10.5v-3.25l4.5 4-4.5 4V18H4.75v-1.5zm14.5-9H8.75v3.25l-4.5-4 4.5-4V5.25h10.5v1.5z"/>
            </svg>
          </button>
          <button onClick={() => onLike(post.id)} className={`p-2 rounded-full hover:bg-pink-500/10 transition-colors ${post.liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-400'}`}>
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
              <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.292-.504-.292C7.125 18.31 4.475 15.67 3.124 13.19c-1.532-2.817-1.265-6.546 1.373-8.476C6.695 3.036 9.52 3.285 12 5.58c2.48-2.295 5.305-2.544 7.503-.866 2.638 1.93 2.905 5.659 1.381 8.476z"/>
            </svg>
          </button>
          <button onClick={() => onBookmark(post.id)} className={`p-2 rounded-full hover:bg-blue-500/10 transition-colors ${post.bookmarked ? 'text-blue-400' : 'text-gray-500 hover:text-blue-400'}`}>
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
              <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"/>
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-blue-500/10 text-gray-500 hover:text-blue-400 transition-colors">
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
              <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Reply input */}
      <div className="px-4 py-3 border-b border-gray-800/50">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${post.user.name}`}
              className="w-full bg-transparent text-[17px] text-white placeholder-gray-500 outline-none resize-none min-h-[52px]"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800/50">
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-full hover:bg-blue-500/10 text-blue-400">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13z"/>
                  </svg>
                </button>
              </div>
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-full text-[15px] transition-all"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {post.replyList && post.replyList.length > 0 ? (
        post.replyList.map(reply => (
          <div key={reply.id} className="px-4 py-3 border-b border-gray-800/30 hover:bg-gray-900/30 transition-colors">
            <div className="flex gap-3">
              <div
                onClick={() => onUserClick(reply.user.id)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0 cursor-pointer hover:opacity-80"
              >
                {reply.user.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span onClick={() => onUserClick(reply.user.id)} className="font-bold text-[15px] text-white hover:underline cursor-pointer">{reply.user.name}</span>
                  {reply.user.verified && <Verified />}
                  <span className="text-gray-500 text-[15px]">{reply.user.handle}</span>
                  <span className="text-gray-500 text-[15px]">·</span>
                  <span className="text-gray-500 text-[15px]">{Math.floor((Date.now() - reply.timestamp.getTime()) / 60000)}m</span>
                </div>
                <p className="text-[15px] text-gray-100 mt-0.5">
                  <span className="text-blue-400">{post.user.handle} </span>
                  {reply.content}
                </p>
                <div className="flex items-center gap-6 mt-2">
                  <button className="flex items-center gap-1 group">
                    <div className="p-1.5 rounded-full group-hover:bg-blue-500/10">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500 group-hover:text-blue-400" fill="currentColor">
                        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
                      </svg>
                    </div>
                    <span className="text-[13px] text-gray-500 group-hover:text-blue-400">{reply.replies > 0 ? reply.replies : ''}</span>
                  </button>
                  <button className="flex items-center gap-1 group">
                    <div className="p-1.5 rounded-full group-hover:bg-green-500/10">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500 group-hover:text-green-400" fill="currentColor">
                        <path d="M4.75 16.5h10.5v-3.25l4.5 4-4.5 4V18H4.75v-1.5zm14.5-9H8.75v3.25l-4.5-4 4.5-4V5.25h10.5v1.5z"/>
                      </svg>
                    </div>
                  </button>
                  <button className="flex items-center gap-1 group">
                    <div className="p-1.5 rounded-full group-hover:bg-pink-500/10">
                      <svg viewBox="0 0 24 24" className={`w-4 h-4 ${reply.liked ? 'text-pink-500' : 'text-gray-500 group-hover:text-pink-400'}`} fill="currentColor">
                        <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.292-.504-.292C7.125 18.31 4.475 15.67 3.124 13.19c-1.532-2.817-1.265-6.546 1.373-8.476C6.695 3.036 9.52 3.285 12 5.58c2.48-2.295 5.305-2.544 7.503-.866 2.638 1.93 2.905 5.659 1.381 8.476z"/>
                      </svg>
                    </div>
                    <span className={`text-[13px] ${reply.liked ? 'text-pink-500' : 'text-gray-500 group-hover:text-pink-400'}`}>{reply.likes > 0 ? reply.likes : ''}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-8">
          <p className="text-gray-500 text-[15px]">No replies yet. Be the first to reply!</p>
        </div>
      )}
    </div>
  );
}
