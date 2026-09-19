import React, { useState } from 'react';
import { Post as PostType } from '../types';
import { Heart, Retweet, Reply as ReplyIcon, Views, Share, ThreeDots, Verified, Premium } from './Icons';
import { currentUser } from '../data';
import { useThemeClasses } from '../themeUtils';
import PollComponent from './PollComponent';

interface PostProps {
  post: PostType;
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
  onReply?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
  onViewThread?: (id: string) => void;
  onUserClick?: (userId: string) => void;
  incrementViews?: (id: string) => void;
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

export default function PostComponent({ post, onLike, onRetweet, onBookmark, onReply, onDelete, onPin, onViewThread, onUserClick, incrementViews }: PostProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const isOwnPost = post.user.id === currentUser.id || post.isOwn;
  const tc = useThemeClasses();

  const handleReply = () => {
    if (replyText.trim() && onReply) {
      onReply(post.id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://longa.app${post.user.handle}/status/${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareNative = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.user.name} on X`,
        text: post.content,
        url: `https://longa.app${post.user.handle}/status/${post.id}`,
      });
    }
  };

  const handleViewClick = () => {
    if (incrementViews) incrementViews(post.id);
    if (onViewThread) onViewThread(post.id);
  };

  return (
    <article
      className={`px-4 py-3 border-b ${tc.border} ${tc.bgHover} transition-colors cursor-pointer`}
      onClick={() => {
        if (incrementViews) incrementViews(post.id);
        if (onViewThread) onViewThread(post.id);
      }}
    >
      {post.pinned && (
        <div className="flex items-center gap-2 ml-8 mb-1 text-gray-500 text-[13px]">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26l3.29 3.29c.18.18.29.43.29.7V15c0 .55-.45 1-1 1H13v4.5c0 .83-.67 1.5-1.5 1.5h-1c-.83 0-1.5-.67-1.5-1.5V16H4.42c-.55 0-1-.45-1-1v-1.25c0-.27.11-.52.29-.7L7 9.76V4.5z"/>
          </svg>
          <span className="font-semibold">Pinned</span>
        </div>
      )}
      {post.retweeted && !post.pinned && (
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
          <div
            onClick={(e) => { e.stopPropagation(); onUserClick?.(post.user.id); }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg hover:opacity-80 transition-opacity cursor-pointer"
          >
            {post.user.avatar}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 min-w-0">
              <span
                onClick={(e) => { e.stopPropagation(); onUserClick?.(post.user.id); }}
                className={`font-bold text-[15px] truncate hover:underline cursor-pointer ${tc.text}`}
              >
                {post.user.name}
              </span>
              {post.user.verified && <Verified />}
              {post.user.premium && <Premium />}
              <span className="text-gray-500 text-[15px] truncate">{post.user.handle}</span>
              <span className="text-gray-500 text-[15px]">·</span>
              <span className="text-gray-500 text-[15px] hover:underline">{timeAgo(post.timestamp)}</span>
            </div>
            <button
              className={`p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-400 text-gray-500 transition-colors ${tc.bgHoverSecondary}`}
              onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
            >
              <ThreeDots />
            </button>
          </div>

          {/* Actions Dropdown */}
          {showActions && (
            <div
              className={`absolute right-4 mt-1 w-64 ${tc.bgModal} border ${tc.border} rounded-xl shadow-xl z-50 py-2`}
              onClick={(e) => e.stopPropagation()}
            >
              {isOwnPost ? (
                <>
                  <button
                    onClick={() => { onPin?.(post.id); setShowActions(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${tc.bgHover} text-left text-[15px] ${tc.text}`}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26l3.29 3.29c.18.18.29.43.29.7V15c0 .55-.45 1-1 1H13v4.5c0 .83-.67 1.5-1.5 1.5h-1c-.83 0-1.5-.67-1.5-1.5V16H4.42c-.55 0-1-.45-1-1v-1.25c0-.27.11-.52.29-.7L7 9.76V4.5z"/>
                    </svg>
                    {post.pinned ? 'Unpin from profile' : 'Pin to profile'}
                  </button>
                  <button
                    onClick={() => { onDelete?.(post.id); setShowActions(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${tc.bgHover} text-left text-[15px] text-red-500`}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.88 10.91c.04.55.5 1.09 1.06 1.09h12c.56 0 1.02-.54 1.06-1.09L19.94 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5z"/>
                    </svg>
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 ${tc.bgHover} text-left text-[15px] ${tc.text}`}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M18 7c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2s.9-2 2-2h8c1.1 0 2 .9 2 2zm-1.5 9.5c0 .83-.67 1.5-1.5 1.5H9c-.83 0-1.5-.67-1.5-1.5V11h9v5.5z"/>
                    </svg>
                    Not interested in this post
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 ${tc.bgHover} text-left text-[15px] ${tc.text}`}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M7.5 12c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H9c-.83 0-1.5-.67-1.5-1.5zM3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15z"/>
                    </svg>
                    Mute @{post.user.handle.slice(1)}
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 ${tc.bgHover} text-left text-[15px] ${tc.text}`}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"/>
                    </svg>
                    Block @{post.user.handle.slice(1)}
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 ${tc.bgHover} text-left text-[15px] text-red-500`}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M3 2h18v2H3V2zm0 20h18v-2H3v2zm2-4V6h14v12H5z"/>
                    </svg>
                    Report post
                  </button>
                </>
              )}
            </div>
          )}

          {/* Text */}
          <div className={`mt-0.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words ${tc.text}`}>
            {post.content.split(/(#\w+|@\w+|https?:\/\/\S+)/g).map((part, i) => {
              if (part.startsWith('#')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
              if (part.startsWith('@')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
              if (part.startsWith('http')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span>;
              return part;
            })}
          </div>

          {/* Image */}
          {post.image && (
            <div className={`mt-3 rounded-2xl overflow-hidden border ${tc.border}`}>
              <img src={post.image} alt="" className="w-full max-h-[500px] object-cover" />
            </div>
          )}

          {/* Poll */}
          {post.poll && (
            <PollComponent poll={post.poll} onVote={() => {}} />
          )}

          {/* Quote Post */}
          {post.quotePost && (
            <div className={`mt-3 rounded-2xl border p-3 ${tc.border} ${tc.bgHover} transition-colors cursor-pointer`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px]">
                  {post.quotePost.user.avatar}
                </div>
                <span className={`font-bold text-[13px] ${tc.text}`}>{post.quotePost.user.name}</span>
                {post.quotePost.user.verified && <Verified />}
                <span className="text-gray-500 text-[13px]">{post.quotePost.user.handle}</span>
              </div>
              <p className={`text-[14px] ${tc.textSecondary} line-clamp-3`}>{post.quotePost.content}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-[425px] -ml-2">
            {/* Reply */}
            <button
              className="flex items-center gap-1 group"
              onClick={(e) => { e.stopPropagation(); setShowReplyBox(!showReplyBox); }}
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <ReplyIcon />
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
                {post.retweets > 0 ? formatNumber(post.retweets) : ''}
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
                {post.likes > 0 ? formatNumber(post.likes) : ''}
              </span>
            </button>

            {/* Views */}
            <button className="flex items-center gap-1 group" onClick={(e) => { e.stopPropagation(); handleViewClick(); }}>
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
              <button
                className="p-2 rounded-full hover:bg-blue-500/10 transition-colors group"
                onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }}
              >
                <Share />
              </button>
            </div>
          </div>

          {/* Reply Box */}
          {showReplyBox && (
            <div className="mt-3 flex gap-3" onClick={(e) => e.stopPropagation()}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                {currentUser.avatar}
              </div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${post.user.name}`}
                  className={`w-full bg-transparent text-[15px] outline-none resize-none min-h-[40px] ${tc.text} placeholder-gray-500`}
                  autoFocus
                />
                <div className={`flex items-center justify-between mt-2 pt-2 border-t ${tc.borderSecondary}`}>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-full hover:bg-blue-500/10 text-blue-400">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13z"/>
                      </svg>
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-blue-500/10 text-blue-400">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5z"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-4 py-1.5 rounded-full text-sm transition-all"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={(e) => { e.stopPropagation(); setShowShareModal(false); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className={`relative w-full max-w-[400px] mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} shadow-2xl p-4 mb-4 sm:mb-0`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-xl font-bold ${tc.text} mb-4`}>Share post</h3>
            <div className="space-y-1">
              <button onClick={() => { handleCopyLink(); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg ${tc.bgHoverSecondary} transition-colors`}>
                <div className={`w-10 h-10 rounded-full ${tc.bgTertiary} flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${tc.text}`} fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </div>
                <span className={`${tc.text} text-[15px]`}>{copied ? 'Copied!' : 'Copy link'}</span>
              </button>
              <button onClick={handleShareNative} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg ${tc.bgHoverSecondary} transition-colors`}>
                <div className={`w-10 h-10 rounded-full ${tc.bgTertiary} flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${tc.text}`} fill="currentColor">
                    <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
                  </svg>
                </div>
                <span className={`${tc.text} text-[15px]`}>Share via...</span>
              </button>
              <button onClick={() => { setShowShareModal(false); setShowReplyBox(true); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg ${tc.bgHoverSecondary} transition-colors`}>
                <div className={`w-10 h-10 rounded-full ${tc.bgTertiary} flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${tc.text}`} fill="currentColor">
                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
                  </svg>
                </div>
                <span className={`${tc.text} text-[15px]`}>Quote post</span>
              </button>
              <button onClick={() => { onBookmark(post.id); setShowShareModal(false); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg ${tc.bgHoverSecondary} transition-colors`}>
                <div className={`w-10 h-10 rounded-full ${tc.bgTertiary} flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${tc.text}`} fill="currentColor">
                    <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"/>
                  </svg>
                </div>
                <span className={`${tc.text} text-[15px]`}>{post.bookmarked ? 'Remove bookmark' : 'Bookmark'}</span>
              </button>
              <button onClick={() => { onLike(post.id); setShowShareModal(false); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg ${tc.bgHoverSecondary} transition-colors`}>
                <div className={`w-10 h-10 rounded-full ${tc.bgTertiary} flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-500" fill="currentColor">
                    <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.292-.504-.292C7.125 18.31 4.475 15.67 3.124 13.19c-1.532-2.817-1.265-6.546 1.373-8.476C6.695 3.036 9.52 3.285 12 5.58c2.48-2.295 5.305-2.544 7.503-.866 2.638 1.93 2.905 5.659 1.381 8.476z"/>
                  </svg>
                </div>
                <span className={`${tc.text} text-[15px]`}>{post.liked ? 'Unlike' : 'Like'}</span>
              </button>
              <button onClick={() => { onRetweet(post.id); setShowShareModal(false); }} className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg ${tc.bgHoverSecondary} transition-colors`}>
                <div className={`w-10 h-10 rounded-full ${tc.bgTertiary} flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500" fill="currentColor">
                    <path d="M4.75 16.5h10.5v-3.25l4.5 4-4.5 4V18H4.75v-1.5zm14.5-9H8.75v3.25l-4.5-4 4.5-4V5.25h10.5v1.5z"/>
                  </svg>
                </div>
                <span className={`${tc.text} text-[15px]`}>{post.retweeted ? 'Undo repost' : 'Repost'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
