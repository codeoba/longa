import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface ScheduledPost {
  id: string;
  content: string;
  scheduledFor: Date;
  createdAt: Date;
  status: 'scheduled' | 'published' | 'failed';
}

export default function ScheduledPosts() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Sample scheduled posts
  const samplePosts: ScheduledPost[] = [
    {
      id: '1',
      content: '🚀 Excited to announce our new product launch tomorrow! Stay tuned for something amazing.',
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'scheduled',
    },
    {
      id: '2',
      content: '💡 Tip: Always test your code before deploying. It saves hours of debugging!',
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 48),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      status: 'scheduled',
    },
  ];

  React.useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handleSchedule = () => {
    if (!content.trim() || !scheduledDate || !scheduledTime) return;

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
    
    if (scheduledFor <= new Date()) {
      alert('Please select a future date and time');
      return;
    }

    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content,
      scheduledFor,
      createdAt: new Date(),
      status: 'scheduled',
    };

    setPosts([newPost, ...posts]);
    setContent('');
    setScheduledDate('');
    setScheduledTime('');
    setShowCreateModal(false);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleEdit = (post: ScheduledPost) => {
    setContent(post.content);
    setScheduledDate(post.scheduledFor.toISOString().split('T')[0]);
    setScheduledTime(post.scheduledFor.toTimeString().slice(0, 5));
    handleDelete(post.id);
    setShowCreateModal(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text}`}>Scheduled Posts</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm"
          >
            + Schedule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={`px-4 py-3 border-b ${tc.border}`}>
        <div className="grid grid-cols-3 gap-3">
          <div className={`${tc.bgCard} rounded-xl p-3`}>
            <p className={`text-2xl font-bold ${tc.text}`}>{posts.length}</p>
            <p className={`text-xs ${tc.textSecondary}`}>Scheduled</p>
          </div>
          <div className={`${tc.bgCard} rounded-xl p-3`}>
            <p className="text-2xl font-bold text-green-500">0</p>
            <p className={`text-xs ${tc.textSecondary}`}>Published</p>
          </div>
          <div className={`${tc.bgCard} rounded-xl p-3`}>
            <p className="text-2xl font-bold text-red-500">0</p>
            <p className={`text-xs ${tc.textSecondary}`}>Failed</p>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="p-4 space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No scheduled posts</h3>
            <p className={tc.textSecondary}>Schedule your first post to publish it later</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-xs font-bold rounded-full">
                    Scheduled
                  </span>
                  <span className={`text-xs ${tc.textSecondary}`}>
                    in {getTimeUntil(post.scheduledFor)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(post)}
                    className={`p-2 rounded-full ${tc.bgHoverSecondary} ${tc.textSecondary}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className={`p-2 rounded-full ${tc.bgHoverSecondary} text-red-500`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className={`${tc.text} mb-3`}>{post.content}</p>

              <div className={`flex items-center gap-2 text-xs ${tc.textSecondary}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDate(post.scheduledFor)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-lg mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>Schedule Post</h2>

            {/* Content */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Post Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                className={`w-full px-4 py-3 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 resize-none`}
                rows={4}
              />
              <div className={`text-xs ${tc.textSecondary} mt-1`}>
                {content.length}/280
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
                />
              </div>
            </div>

            {/* Preview */}
            {scheduledDate && scheduledTime && (
              <div className={`mb-4 p-3 rounded-lg ${tc.bgCard} border ${tc.border}`}>
                <p className={`text-xs ${tc.textSecondary} mb-1`}>Will be published:</p>
                <p className={`text-sm font-bold ${tc.text}`}>
                  {formatDate(new Date(`${scheduledDate}T${scheduledTime}`))}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 py-2.5 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!content.trim() || !scheduledDate || !scheduledTime}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
