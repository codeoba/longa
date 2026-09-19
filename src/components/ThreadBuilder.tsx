import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface ThreadPost {
  id: string;
  content: string;
  order: number;
}

export default function ThreadBuilder() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [posts, setPosts] = useState<ThreadPost[]>([
    { id: '1', content: '', order: 1 },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const addPost = () => {
    const newPost: ThreadPost = {
      id: Date.now().toString(),
      content: '',
      order: posts.length + 1,
    };
    setPosts([...posts, newPost]);
  };

  const removePost = (id: string) => {
    if (posts.length === 1) return;
    const filtered = posts.filter((p) => p.id !== id);
    setPosts(filtered.map((p, index) => ({ ...p, order: index + 1 })));
  };

  const updatePost = (id: string, content: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, content } : p)));
  };

  const movePost = (id: string, direction: 'up' | 'down') => {
    const index = posts.findIndex((p) => p.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === posts.length - 1)
    ) {
      return;
    }

    const newPosts = [...posts];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newPosts[index], newPosts[swapIndex]] = [newPosts[swapIndex], newPosts[index]];
    setPosts(newPosts.map((p, i) => ({ ...p, order: i + 1 })));
  };

  const handlePostThread = () => {
    const validPosts = posts.filter((p) => p.content.trim());
    if (validPosts.length === 0) {
      alert('Please add at least one post with content');
      return;
    }

    // In real app, this would post to backend
    console.log('Posting thread:', validPosts);
    alert(`Thread posted successfully! (${validPosts.length} posts)`);
    setPosts([{ id: '1', content: '', order: 1 }]);
  };

  const totalChars = posts.reduce((sum, p) => sum + p.content.length, 0);

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className={`text-xl font-bold ${tc.text}`}>Thread Builder</h1>
            <p className={`text-xs ${tc.textSecondary}`}>
              {posts.length} posts · {totalChars} characters
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 rounded-full border ${tc.border} ${tc.text} font-bold text-sm hover:bg-gray-500/10`}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handlePostThread}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm"
            >
              Post Thread
            </button>
          </div>
        </div>
      </div>

      {!showPreview ? (
        /* Editor */
        <div className="p-4">
          <div className="space-y-3">
            {posts.map((post, index) => (
              <div key={post.id} className="relative">
                {/* Thread line */}
                {index < posts.length - 1 && (
                  <div className={`absolute left-6 top-16 w-0.5 h-8 ${tc.bgTertiary}`} />
                )}

                <div className={`${tc.bgCard} rounded-xl border ${tc.border} p-4`}>
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                      {user?.avatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-bold text-sm ${tc.text}`}>{user?.name}</span>
                        <span className={`text-xs ${tc.textSecondary}`}>{user?.handle}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tc.bgTertiary} ${tc.textSecondary}`}>
                          {index + 1}/{posts.length}
                        </span>
                      </div>

                      <textarea
                        value={post.content}
                        onChange={(e) => updatePost(post.id, e.target.value)}
                        placeholder={`Post ${index + 1}...`}
                        className={`w-full px-0 py-2 ${tc.text} ${tc.bgCard} outline-none resize-none text-[15px]`}
                        rows={3}
                        maxLength={280}
                      />

                      <div className="flex items-center justify-between mt-2">
                        <div className={`text-xs ${tc.textSecondary}`}>
                          {post.content.length}/280
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => movePost(post.id, 'up')}
                            disabled={index === 0}
                            className={`p-1.5 rounded-full ${tc.bgHoverSecondary} ${
                              index === 0 ? 'opacity-30' : ''
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => movePost(post.id, 'down')}
                            disabled={index === posts.length - 1}
                            className={`p-1.5 rounded-full ${tc.bgHoverSecondary} ${
                              index === posts.length - 1 ? 'opacity-30' : ''
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removePost(post.id)}
                            disabled={posts.length === 1}
                            className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-red-500 ${
                              posts.length === 1 ? 'opacity-30' : ''
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Post Button */}
          <button
            onClick={addPost}
            className={`w-full mt-4 py-4 rounded-xl border-2 border-dashed ${tc.border} ${tc.textSecondary} hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add another post
          </button>

          {/* Tips */}
          <div className={`mt-6 p-4 rounded-xl ${tc.bgCard} border ${tc.border}`}>
            <h3 className={`font-bold ${tc.text} mb-2`}>💡 Thread Tips</h3>
            <ul className={`text-sm ${tc.textSecondary} space-y-1`}>
              <li>• Start with a hook to grab attention</li>
              <li>• Keep each post focused on one idea</li>
              <li>• Use numbering for clarity (1/5, 2/5, etc.)</li>
              <li>• End with a call-to-action or summary</li>
              <li>• Drag to reorder posts</li>
            </ul>
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="p-4">
          <div className="space-y-0">
            {posts.map((post, index) => (
              <div key={post.id} className={`border-l-2 ${tc.border} pl-4 pb-4 relative`}>
                {/* Thread line */}
                {index < posts.length - 1 && (
                  <div className={`absolute left-[-1px] top-12 w-0.5 h-full ${tc.bgTertiary}`} />
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                    {user?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold text-sm ${tc.text}`}>{user?.name}</span>
                      <span className={`text-xs ${tc.textSecondary}`}>{user?.handle}</span>
                      <span className={`text-xs ${tc.textSecondary}`}>·</span>
                      <span className={`text-xs ${tc.textSecondary}`}>Just now</span>
                    </div>
                    <p className={`${tc.text} text-[15px] whitespace-pre-wrap`}>
                      {post.content || <span className={tc.textSecondary}>Empty post</span>}
                    </p>
                    <div className={`flex items-center gap-6 mt-3 text-xs ${tc.textSecondary}`}>
                      <span>💬 Reply</span>
                      <span>🔄 Repost</span>
                      <span>❤️ Like</span>
                      <span>📊 View</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-6 p-4 rounded-xl ${tc.bgCard} border ${tc.border} text-center`}>
            <p className={`text-sm ${tc.textSecondary}`}>
              This is how your thread will appear when posted
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
