import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface ReadingListItem {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  source: string;
  savedAt: Date;
  readTime: number;
  isRead: boolean;
  tags: string[];
}

export default function ReadingList() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [items, setItems] = useState<ReadingListItem[]>([
    {
      id: '1',
      url: 'https://example.com/article1',
      title: 'The Future of AI in 2024: Trends and Predictions',
      description: 'Explore the latest trends in artificial intelligence and what to expect in the coming year.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      source: 'TechCrunch',
      savedAt: new Date(Date.now() - 1000 * 60 * 30),
      readTime: 8,
      isRead: false,
      tags: ['AI', 'Technology', 'Future'],
    },
    {
      id: '2',
      url: 'https://example.com/article2',
      title: '10 TypeScript Features You Should Be Using',
      description: 'Master these essential TypeScript features to write better, more maintainable code.',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
      source: 'Dev.to',
      savedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      readTime: 12,
      isRead: false,
      tags: ['TypeScript', 'Programming', 'Web Dev'],
    },
    {
      id: '3',
      url: 'https://example.com/article3',
      title: 'Building Scalable React Applications',
      description: 'Best practices for building large-scale React applications that are maintainable and performant.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      source: 'Medium',
      savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      readTime: 15,
      isRead: true,
      tags: ['React', 'JavaScript', 'Architecture'],
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  const filteredItems = items.filter(item => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'read') return item.isRead;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isRead: true } : item
    ));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    if (!newUrl.trim()) return;

    // Simulate fetching article metadata
    const newItem: ReadingListItem = {
      id: Date.now().toString(),
      url: newUrl,
      title: 'New Article from ' + new URL(newUrl).hostname,
      description: 'Article description will be fetched automatically...',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      source: new URL(newUrl).hostname,
      savedAt: new Date(),
      readTime: Math.floor(Math.random() * 15) + 5,
      isRead: false,
      tags: ['New'],
    };

    setItems([newItem, ...items]);
    setNewUrl('');
    setShowAddModal(false);
  };

  const totalReadTime = items.filter(i => !i.isRead).reduce((sum, item) => sum + item.readTime, 0);

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className={`text-xl font-bold ${tc.text}`}>Reading List</h1>
            <p className={`text-sm ${tc.textSecondary}`}>
              {items.filter(i => !i.isRead).length} unread · {totalReadTime} min read time
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm"
          >
            + Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex px-4 pb-2 gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : `${tc.bgTertiary} ${tc.textSecondary} hover:bg-gray-500/20`
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reading List */}
      <div className="p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>
              {filter === 'all' ? 'No articles yet' : filter === 'unread' ? 'No unread articles' : 'No read articles'}
            </h3>
            <p className={tc.textSecondary}>
              {filter === 'all' ? 'Add articles to your reading list to see them here' : 'All caught up!'}
            </p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`${tc.bgCard} rounded-xl overflow-hidden border ${tc.border} ${item.isRead ? 'opacity-60' : ''}`}
            >
              <div className="flex">
                {/* Thumbnail */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-32 h-32 object-cover flex-shrink-0"
                />

                {/* Content */}
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className={`text-xs ${tc.textSecondary} mb-1`}>{item.source}</p>
                      <h3 className={`font-bold ${tc.text} line-clamp-2 text-sm`}>{item.title}</h3>
                    </div>
                  </div>

                  <p className={`text-xs ${tc.textSecondary} line-clamp-2 mb-2`}>{item.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${tc.textSecondary}`}>
                        ⏱️ {item.readTime} min
                      </span>
                      <span className={`text-xs ${tc.textSecondary}`}>
                        · {item.savedAt.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {!item.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-green-500`}
                          title="Mark as read"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-red-500`}
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className={`relative w-full max-w-md mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>Add to Reading List</h2>

            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Article URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/article"
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
              />
            </div>

            <div className={`p-3 rounded-lg ${tc.bgCard} border ${tc.border} mb-4`}>
              <p className={`text-xs ${tc.textSecondary}`}>
                💡 Tip: We'll automatically fetch the article title, description, and thumbnail.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 py-2.5 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newUrl.trim()}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
