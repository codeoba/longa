import React, { useState } from 'react';
import { Post as PostType } from '../types';
import { Heart, Retweet, Reply, Views, Share, ThreeDots, Verified, Premium } from './Icons';

interface PostProps {
  post: PostType;
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PostComponent({ post, onLike, onRetweet, onBookmark }: PostProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <article className="px-4 py-3 border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors cursor-pointer">
      {post.retweeted && (
        <div className="flex items-center gap-2 ml-8 mb-1 text-gray-500 text-[13px]">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M4.75 16.5h10.5v-3.25l4.5 4-4.5 4V18H4.75v-1.5zm14.5-9H8.75v3.25l-4.5-4 4.5-4V5.25h10.5v1.5z"/>
          </svg>
          <span className="font-semibold">You reposted</span>
        </div>
      )}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
            {post.user.avatar}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-[15px] text-white truncate hover:underline">
                {post.user.name}
              </span>
              {post.user.verified && <Verified />}
              {post.user.premium && <Premium />}
              <span className="text-gray-500 text-[15px] truncate">{post.user.handle}</span>
              <span className="text-gray-500 text-[15px]">·</span>
              <span className="text-gray-500 text-[15px] hover:underline">{timeAgo(post.timestamp)}</span>
            </div>
            <button
              className="p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-400 text-gray-500 transition-colors"
              onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
            >
              <ThreeDots />
            </button>
          </div>

          {/* Text */}
          <div className="mt-0.5 text-[15px] text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
            {post.content.split(/(#\w+|@\w+|https?:\/\/\S+)/g).map((part, i) => {
              if (part.startsWith('#')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
              if (part.startsWith('@')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
              if (part.startsWith('http')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
              return part;
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-[425px] -ml-2">
            {/* Reply */}
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <Reply />
              </div>
              <span className="text-[13px] text-gray-500 group-hover:text-blue-400 transition-colors">
                {post.replies > 0 ? formatNumber(post.replies) : ''}
              </span>
            </button>

            {/* Retweet */}
            <button
              className="flex items-center gap-1 group"
              onClick={(e) => { e.stopPropagation(); onRetweet(post.id); }}
            >
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Retweet active={post.retweeted} />
              </div>
              <span className={`text-[13px] transition-colors ${post.retweeted ? 'text-green-500' : 'text-gray-500 group-hover:text-green-400'}`}>
                {post.retweets > 0 ? formatNumber(post.retweets + (post.retweeted ? 0 : 0)) : ''}
              </span>
            </button>

            {/* Like */}
            <button
              className="flex items-center gap-1 group"
              onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <Heart filled={post.liked} />
              </div>
              <span className={`text-[13px] transition-colors ${post.liked ? 'text-pink-500' : 'text-gray-500 group-hover:text-pink-400'}`}>
                {post.likes > 0 ? formatNumber(post.likes + (post.liked ? 0 : 0)) : ''}
              </span>
            </button>

            {/* Views */}
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <Views />
              </div>
              <span className="text-[13px] text-gray-500 group-hover:text-blue-400 transition-colors">
                {post.views > 0 ? formatNumber(post.views) : ''}
              </span>
            </button>

            {/* Bookmark & Share */}
            <div className="flex items-center">
              <button
                className="p-2 rounded-full hover:bg-blue-500/10 transition-colors group"
                onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }}
              >
                <svg viewBox="0 0 24 24" className={`w-5 h-5 ${post.bookmarked ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}`} fill={post.bookmarked ? 'currentColor' : 'none'} stroke={post.bookmarked ? 'none' : 'currentColor'} strokeWidth="1.5">
                  <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"/>
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors group">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500 group-hover:text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
