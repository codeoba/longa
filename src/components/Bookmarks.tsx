import React from 'react';
import { Post } from '../types';
import PostComponent from './Post';
import { ArrowLeft } from './Icons';

interface BookmarksProps {
  posts: Post[];
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
}

export default function Bookmarks({ posts, onLike, onRetweet, onBookmark }: BookmarksProps) {
  const bookmarkedPosts = posts.filter(p => p.bookmarked);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center gap-6 px-4 py-2">
          <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Bookmarks</h1>
            <p className="text-[13px] text-gray-500">@amanitech</p>
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
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <h3 className="text-3xl font-extrabold text-white">Save posts for later</h3>
          <p className="text-gray-500 text-[15px] mt-2 text-center max-w-[360px]">
            Bookmark posts to easily find them again in the future.
          </p>
        </div>
      )}
    </div>
  );
}
