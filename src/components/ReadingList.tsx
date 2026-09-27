import React, { useState, useEffect } from 'react';
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

const READING_LIST_KEY = 'longa_reading_list_v2';

const initialItems: ReadingListItem[] = [
  {
    id: '1',
    url: 'https://techcrunch.com',
    title: 'The Future of AI in 2026: Trends and Predictions',
    description: 'Explore generative foundation models and their impact on autonomous software engineering.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
    source: 'TechCrunch',
    savedAt: new Date(Date.now() - 1000 * 60 * 30),
    readTime: 8,
    isRead: false,
    tags: ['AI', 'Tech', 'Trends'],
  },
  {
    id: '2',
    url: 'https://dev.to',
    title: '10 Advanced TypeScript Patterns Every Senior Engineer Needs',
    description: 'Master template literal types, conditional inference, and strict type gymnastics.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&h=300&fit=crop',
    source: 'Dev.to',
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    readTime: 12,
    isRead: false,
    tags: ['TypeScript', 'Code', 'Web'],
  },
  {
    id: '3',
    url: 'https://medium.com',
    title: 'Building Scalable React & Real-Time Applications',
    description: 'Micro-frontends, WebSockets, WebRTC signaling, and edge rendering best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
    source: 'Medium',
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    readTime: 15,
    isRead: true,
    tags: ['Architecture', 'Scalability'],
  },
];

export default function ReadingList() {
  const { user } = useAuth();
  const tc = useThemeClasses();

  const [items, setItems] = useState<ReadingListItem[]>(() => {
    try {
      const saved = localStorage.getItem(READING_LIST_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          savedAt: new Date(item.savedAt),
        }));
      }
    } catch (e) {
      console.warn('Failed to load reading list:', e);
    }
    return initialItems;
  });

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [tags, setTags] = useState('');

  useEffect(() => {
    localStorage.setItem(READING_LIST_KEY, JSON.stringify(items));
  }, [items]);

  const filteredItems = items.filter(item => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'read') return item.isRead;
    return true;
  });

  const handleToggleRead = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isRead: !item.isRead } : item
    ));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let source = 'Web';
    let cleanUrl = url.trim();
    if (cleanUrl) {
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = 'https://' + cleanUrl;
      }
      try {
        source = new URL(cleanUrl).hostname.replace('www.', '');
      } catch {
        source = 'Link';
      }
    }

    const tagsArray = tags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newItem: ReadingListItem = {
      id: 'read_' + Date.now(),
      url: cleanUrl || '#',
      title: title.trim(),
      description: description.trim() || 'Saved article on Longa.',
      thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=300&fit=crop',
      source,
      savedAt: new Date(),
      readTime: Number(readTime) || 5,
      isRead: false,
      tags: tagsArray.length > 0 ? tagsArray : ['Article'],
    };

    setItems([newItem, ...items]);
    setTitle('');
    setUrl('');
    setDescription('');
    setReadTime(5);
    setTags('');
    setShowAddModal(false);
  };

  const totalReadTime = items.filter(i => !i.isRead).reduce((sum, item) => sum + item.readTime, 0);

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold">Reading List</h1>
            <p className={`text-xs ${tc.textSecondary}`}>
              {items.filter(i => !i.isRead).length} unread · {totalReadTime} min estimated reading time
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>+</span> Add Article
          </button>
        </div>

        {/* Filters */}
        <div className="flex px-4 pb-3 gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white shadow-md'
                  : `${tc.bgTertiary} ${tc.textSecondary} hover:text-white`
              }`}
            >
              {f === 'all' && 'All'}
              {f === 'unread' && 'Unread'}
              {f === 'read' && 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Reading List */}
      <div className="p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${tc.border} ${tc.bgCard}`}>
            <div className="text-6xl mb-3">📖</div>
            <h3 className="text-base font-bold mb-1">
              {filter === 'all'
                ? 'Your reading list is empty'
                : filter === 'unread'
                ? 'You are all caught up!'
                : 'No completed articles yet'}
            </h3>
            <p className={`text-xs ${tc.textSecondary} mb-4`}>
              Bookmark essays, technical documentation, or threads to read later.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full"
            >
              + Add First Article
            </button>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`${tc.bgCard} rounded-2xl overflow-hidden border ${tc.border} ${
                item.isRead ? 'opacity-65' : ''
              } hover:border-blue-500/50 transition-all flex flex-col sm:flex-row`}
            >
              {/* Thumbnail */}
              <div className="w-full sm:w-44 h-36 bg-black flex-shrink-0 overflow-hidden relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-bold">
                  ⏱️ {item.readTime} min read
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-blue-400">
                      🌐 {item.source}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {item.savedAt.toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className={`text-xs ${tc.textSecondary} line-clamp-2 leading-relaxed`}>
                    {item.description}
                  </p>
                </div>

                {/* Tags & Action Buttons */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-800/40">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(t => (
                      <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tc.bgTertiary} text-gray-400`}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        item.isRead
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      }`}
                    >
                      {item.isRead ? '✓ Read' : 'Mark as Read'}
                    </button>

                    {item.url && item.url !== '#' && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors"
                      >
                        Read ↗
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors text-xs"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className={`relative w-full max-w-md ${tc.bgModal} rounded-2xl border ${tc.border} p-6 shadow-2xl`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <h2 className="text-lg font-black">Save Article to Reading List</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-gray-400 hover:text-white`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Autonomous Agents in 2026"
                  className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  URL / Web Link
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Brief Summary / Notes
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key takeaways or summary..."
                  className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Reading Time (Min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={readTime}
                    onChange={(e) => setReadTime(Number(e.target.value))}
                    className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tech, AI, Business"
                    className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 py-2.5 rounded-full border ${tc.border} text-xs font-bold hover:bg-gray-800`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/25"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
