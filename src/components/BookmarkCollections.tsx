import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface BookmarkCollection {
  id: string;
  name: string;
  description: string;
  icon: string;
  isPrivate: boolean;
  createdAt: Date;
}

interface Bookmark {
  id: string;
  collectionId: string;
  postContent: string;
  postAuthor: string;
  postAuthorAvatar: string;
  savedAt: Date;
  tags: string[];
}

const COLLECTIONS_KEY = 'longa_collections_v2';
const BOOKMARKS_KEY = 'longa_bookmarks_items_v2';

export default function BookmarkCollections() {
  const { user } = useAuth();
  const tc = useThemeClasses();

  const initialCollections: BookmarkCollection[] = [
    {
      id: '1',
      name: 'Tech & AI Articles',
      description: 'Cutting-edge machine learning and infrastructure news',
      icon: '💻',
      isPrivate: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
      id: '2',
      name: 'Design & UI Inspiration',
      description: 'Modern aesthetic inspiration, layouts, and components',
      icon: '🎨',
      isPrivate: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    },
    {
      id: '3',
      name: 'Business & Ventures',
      description: 'Startup strategies, monetization, and growth',
      icon: '📈',
      isPrivate: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    },
  ];

  const initialBookmarks: Bookmark[] = [
    {
      id: 'b1',
      collectionId: '1',
      postContent: '🚀 Our new AI code review engine speeds up pull request turnaround by 3x.',
      postAuthor: 'Zawadi Innovation',
      postAuthorAvatar: '👩‍🔬',
      savedAt: new Date(Date.now() - 1000 * 60 * 30),
      tags: ['AI', 'Tech', 'Longa'],
    },
    {
      id: 'b2',
      collectionId: '2',
      postContent: '💡 Why thoughtful micro-interactions define premium software in 2026.',
      postAuthor: 'Baraka Digital',
      postAuthorAvatar: '🎨',
      savedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      tags: ['Design', 'UIUX'],
    },
  ];

  const [collections, setCollections] = useState<BookmarkCollection[]>(() => {
    try {
      const saved = localStorage.getItem(COLLECTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }));
      }
    } catch (e) {
      console.warn('Failed to load collections:', e);
    }
    return initialCollections;
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((b: any) => ({ ...b, savedAt: new Date(b.savedAt) }));
      }
    } catch (e) {
      console.warn('Failed to load bookmarks:', e);
    }
    return initialBookmarks;
  });

  const [selectedCollection, setSelectedCollection] = useState<BookmarkCollection | null>(null);
  
  // Create Collection Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [newCollectionIcon, setNewCollectionIcon] = useState('📁');
  const [newCollectionPrivate, setNewCollectionPrivate] = useState(false);

  // Add Bookmark Modal
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);
  const [bookmarkContent, setBookmarkContent] = useState('');
  const [bookmarkAuthor, setBookmarkAuthor] = useState('');
  const [bookmarkTags, setBookmarkTags] = useState('');

  useEffect(() => {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection: BookmarkCollection = {
      id: 'coll_' + Date.now(),
      name: newCollectionName.trim(),
      description: newCollectionDesc.trim(),
      icon: newCollectionIcon,
      isPrivate: newCollectionPrivate,
      createdAt: new Date(),
    };

    setCollections([newCollection, ...collections]);
    setNewCollectionName('');
    setNewCollectionDesc('');
    setNewCollectionIcon('📁');
    setNewCollectionPrivate(false);
    setShowCreateModal(false);
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      setCollections(collections.filter(c => c.id !== id));
      setBookmarks(bookmarks.filter(b => b.collectionId !== id));
      if (selectedCollection?.id === id) {
        setSelectedCollection(null);
      }
    }
  };

  const handleAddBookmarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmarkContent.trim() || !selectedCollection) return;

    const tagsArray = bookmarkTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newBookmark: Bookmark = {
      id: 'bm_' + Date.now(),
      collectionId: selectedCollection.id,
      postContent: bookmarkContent.trim(),
      postAuthor: bookmarkAuthor.trim() || user?.name || 'User',
      postAuthorAvatar: user?.avatar || '🔖',
      savedAt: new Date(),
      tags: tagsArray.length > 0 ? tagsArray : ['Bookmark'],
    };

    setBookmarks([newBookmark, ...bookmarks]);
    setBookmarkContent('');
    setBookmarkAuthor('');
    setBookmarkTags('');
    setShowAddBookmarkModal(false);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const collectionBookmarks = selectedCollection
    ? bookmarks.filter(b => b.collectionId === selectedCollection.id)
    : bookmarks;

  const icons = ['📁', '💻', '🎨', '📚', '🎵', '🎬', '📷', '💡', '🚀', '⭐', '❤️', '🔥', '📈', '🔬'];

  // Detail View of a Collection
  if (selectedCollection) {
    return (
      <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
        {/* Header */}
        <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCollection(null)}
                className={`p-2 rounded-full ${tc.bgHoverSecondary}`}
              >
                <svg className={`w-5 h-5 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <span>{selectedCollection.icon}</span>
                  <span>{selectedCollection.name}</span>
                </h1>
                <p className={`text-xs ${tc.textSecondary}`}>
                  {collectionBookmarks.length} bookmarks {selectedCollection.isPrivate ? '· 🔒 Private' : '· 🌐 Public'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddBookmarkModal(true)}
                className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full shadow-md"
              >
                + Add Bookmark
              </button>
              <button
                onClick={() => handleDeleteCollection(selectedCollection.id)}
                className={`p-2 rounded-full ${tc.bgHoverSecondary} text-red-400 hover:bg-red-500/10`}
                title="Delete Collection"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Collection Description */}
        {selectedCollection.description && (
          <div className="px-4 py-3 border-b border-gray-800/40 text-xs text-gray-400">
            {selectedCollection.description}
          </div>
        )}

        {/* Bookmarks List */}
        <div className="p-4 space-y-3">
          {collectionBookmarks.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${tc.border} ${tc.bgCard}`}>
              <div className="text-5xl mb-3">{selectedCollection.icon}</div>
              <h3 className="text-base font-bold mb-1">No bookmarks yet</h3>
              <p className={`text-xs ${tc.textSecondary} mb-4`}>
                Save posts, thoughts, or resources to this collection.
              </p>
              <button
                onClick={() => setShowAddBookmarkModal(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full"
              >
                + Add First Bookmark
              </button>
            </div>
          ) : (
            collectionBookmarks.map(bookmark => (
              <div key={bookmark.id} className={`${tc.bgCard} rounded-xl p-4 border ${tc.border} relative group`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                      {bookmark.postAuthorAvatar}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{bookmark.postAuthor}</p>
                      <p className={`text-[10px] ${tc.textSecondary}`}>
                        Saved {bookmark.savedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors text-xs"
                    title="Remove from Collection"
                  >
                    ✕ Remove
                  </button>
                </div>

                <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{bookmark.postContent}</p>

                <div className="flex flex-wrap gap-1.5">
                  {bookmark.tags.map(tag => (
                    <span key={tag} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${tc.bgTertiary} text-blue-400 border ${tc.border}`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Bookmark Modal */}
        {showAddBookmarkModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddBookmarkModal(false)} />
            <div className={`relative w-full max-w-md ${tc.bgModal} rounded-2xl border ${tc.border} p-6 shadow-2xl`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
                <h2 className="text-lg font-black">Add Bookmark to {selectedCollection.name}</h2>
                <button
                  onClick={() => setShowAddBookmarkModal(false)}
                  className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-gray-400 hover:text-white`}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddBookmarkSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Bookmark Content / Notes *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={bookmarkContent}
                    onChange={(e) => setBookmarkContent(e.target.value)}
                    placeholder="Enter text, quote, or post link..."
                    className={`w-full px-4 py-2.5 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none focus:border-blue-500 resize-none`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Author / Source
                  </label>
                  <input
                    type="text"
                    value={bookmarkAuthor}
                    onChange={(e) => setBookmarkAuthor(e.target.value)}
                    placeholder="e.g. Zawadi Innovation or @zawadi"
                    className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={bookmarkTags}
                    onChange={(e) => setBookmarkTags(e.target.value)}
                    placeholder="e.g. AI, Tech, Startup"
                    className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBookmarkModal(false)}
                    className={`flex-1 py-2.5 rounded-full border ${tc.border} text-xs font-bold hover:bg-gray-800`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!bookmarkContent.trim()}
                    className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/25"
                  >
                    Save Bookmark
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Directory View
  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold">Bookmark Collections</h1>
            <p className={`text-xs ${tc.textSecondary}`}>Organize your saved items and thoughts into folders</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>+</span> New Collection
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="p-4 space-y-3">
        {/* All Bookmarks Virtual Folder */}
        <div
          onClick={() => setSelectedCollection({
            id: 'all',
            name: 'All Bookmarks',
            description: 'All saved bookmarks across your account',
            icon: '📑',
            isPrivate: false,
            createdAt: new Date(),
          })}
          className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard} hover:border-blue-500/60 cursor-pointer transition-all flex items-center gap-4`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl flex-shrink-0">
            📑
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">All Bookmarks</h3>
            <p className={`text-xs ${tc.textSecondary}`}>
              {bookmarks.length} total items saved
            </p>
          </div>
          <span className="text-gray-500">→</span>
        </div>

        {/* User Collections */}
        {collections.map(collection => {
          const count = bookmarks.filter(b => b.collectionId === collection.id).length;
          return (
            <div
              key={collection.id}
              onClick={() => setSelectedCollection(collection)}
              className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard} hover:border-blue-500/60 cursor-pointer transition-all flex items-center gap-4`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                {collection.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm truncate">{collection.name}</h3>
                  {collection.isPrivate && <span className="text-xs">🔒</span>}
                </div>
                {collection.description && (
                  <p className={`text-xs ${tc.textSecondary} line-clamp-1 mt-0.5`}>
                    {collection.description}
                  </p>
                )}
                <p className="text-[11px] text-gray-500 mt-1">
                  {count} bookmarks · Created {collection.createdAt.toLocaleDateString()}
                </p>
              </div>
              <span className="text-gray-500">→</span>
            </div>
          );
        })}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-md ${tc.bgModal} rounded-2xl border ${tc.border} p-6 shadow-2xl`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <h2 className="text-lg font-black">Create New Collection</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-gray-400 hover:text-white`}
              >
                ✕
              </button>
            </div>

            {/* Icon selector */}
            <div className="mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Choose Icon
              </label>
              <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto pr-1">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewCollectionIcon(icon)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                      newCollectionIcon === icon
                        ? 'bg-blue-500 ring-2 ring-white scale-105'
                        : `${tc.bgTertiary} hover:scale-105`
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                required
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. Design Inspiration"
                className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none focus:border-blue-500`}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
                placeholder="What will be stored here?..."
                className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none focus:border-blue-500 resize-none`}
              />
            </div>

            {/* Privacy toggle */}
            <div className="flex items-center justify-between py-2 border-t border-gray-800 mb-4">
              <div>
                <p className="text-xs font-bold">Private Collection</p>
                <p className="text-[11px] text-gray-500">Visible only to you</p>
              </div>
              <input
                type="checkbox"
                checked={newCollectionPrivate}
                onChange={(e) => setNewCollectionPrivate(e.target.checked)}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 py-2.5 rounded-full border ${tc.border} text-xs font-bold hover:bg-gray-800`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/25"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
