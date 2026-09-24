import React from 'react';
import { Post } from '../types';
import PostComponent from './Post';
import { ArrowLeft } from './Icons';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';

interface BookmarksProps {
  posts: Post[];
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
  onReply: (postId: string, content: string) => void;
  onViewThread: (id: string) => void;
  onUserClick: (userId: string) => void;
  incrementViews: (id: string) => void;
}

export default function Bookmarks({ posts, onLike, onRetweet, onBookmark, onReply, onViewThread, onUserClick, incrementViews }: BookmarksProps) {
  const { user } = useAuth();
  const bookmarkedPosts = posts.filter(p => p.bookmarked);
  const tc = useThemeClasses();

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
            <ArrowLeft />
          </button>
          <div>
            <h1 className={`text-xl font-bold ${tc.text}`}>Bookmarks</h1>
            <p className="text-[13px] text-gray-500">{user?.handle || '@longa_user'}</p>
          </div>
        </div>
      </div>

      {/* Bookmarked Posts */}
      {bookmarkedPosts.length > 0 ? (
        <div>
          {bookmarkedPosts.map((post) => (
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
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <h3 className={`text-3xl font-extrabold ${tc.text}`}>Save posts for later</h3>
          <p className="text-gray-500 text-[15px] mt-2 text-center max-w-[360px]">
            Bookmark posts to easily find them again in the future.
          </p>
        </div>
      )}
    </div>
  );
}
