import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface BookmarkCollection {
  id: string;
  name: string;
  description: string;
  icon: string;
  bookmarkCount: number;
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

export default function BookmarkCollections() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [collections, setCollections] = useState<BookmarkCollection[]>([
    {
      id: '1',
      name: 'Tech Articles',
      description: 'Interesting tech articles and tutorials',
      icon: '💻',
      bookmarkCount: 23,
      isPrivate: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
      id: '2',
      name: 'Design Inspiration',
      description: 'UI/UX design inspiration and resources',
      icon: '🎨',
      bookmarkCount: 45,
      isPrivate: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    },
    {
      id: '3',
      name: 'Research Papers',
      description: 'Academic papers and research',
      icon: '📚',
      bookmarkCount: 12,
      isPrivate: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    },
  ]);

  const [bookmarks] = useState<Bookmark[]>([
    {
      id: '1',
      collectionId: '1',
      postContent: '🚀 Excited to announce our new AI-powered code review tool! The future of software development is here.',
      postAuthor: 'Zawadi Innovation',
      postAuthorAvatar: '👩‍🔬',
      savedAt: new Date(Date.now() - 1000 * 60 * 30),
      tags: ['AI', 'Tech', 'Tools'],
    },
    {
      id: '2',
      collectionId: '1',
      postContent: '💡 Hot take: TypeScript is not just "JavaScript with types." It\'s a completely different way of thinking about software architecture.',
      postAuthor: 'Furaha Dev',
      postAuthorAvatar: '👨‍🎓',
      savedAt: new Date(Date.now() - 1000 * 60 * 60),
      tags: ['TypeScript', 'Programming'],
    },
  ]);

  const [selectedCollection, setSelectedCollection] = useState<BookmarkCollection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [newCollectionIcon, setNewCollectionIcon] = useState('📁');

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection: BookmarkCollection = {
      id: Date.now().toString(),
      name: newCollectionName,
      description: newCollectionDesc,
      icon: newCollectionIcon,
      bookmarkCount: 0,
      isPrivate: false,
      createdAt: new Date(),
    };

    setCollections([newCollection, ...collections]);
    setNewCollectionName('');
    setNewCollectionDesc('');
    setNewCollectionIcon('📁');
    setShowCreateModal(false);
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm('Delete this collection? Bookmarks will be moved to "All Bookmarks".')) {
      setCollections(collections.filter(c => c.id !== id));
      if (selectedCollection?.id === id) {
        setSelectedCollection(null);
      }
    }
  };

  const collectionBookmarks = selectedCollection
    ? bookmarks.filter(b => b.collectionId === selectedCollection.id)
    : bookmarks;

  const icons = ['📁', '💻', '🎨', '📚', '🎵', '🎬', '📷', '💡', '🚀', '⭐', '❤️', '🔥'];

  if (selectedCollection) {
    return (
      <div>
        {/* Header */}
        <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
          <div className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => setSelectedCollection(null)}
              className={`p-2 rounded-full ${tc.bgHoverSecondary}`}
            >
              <svg className={`w-5 h-5 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className={`text-xl font-bold ${tc.text}`}>
                {selectedCollection.icon} {selectedCollection.name}
              </h1>
              <p className={`text-sm ${tc.textSecondary}`}>
                {selectedCollection.bookmarkCount} bookmarks
                {selectedCollection.isPrivate && ' · 🔒 Private'}
              </p>
            </div>
            <button
              onClick={() => handleDeleteCollection(selectedCollection.id)}
              className={`p-2 rounded-full ${tc.bgHoverSecondary} text-red-500`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bookmarks */}
        <div className="p-4 space-y-3">
          {collectionBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{selectedCollection.icon}</div>
              <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No bookmarks yet</h3>
              <p className={tc.textSecondary}>Save posts to this collection to see them here</p>
            </div>
          ) : (
            collectionBookmarks.map(bookmark => (
              <div key={bookmark.id} className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                    {bookmark.postAuthorAvatar}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${tc.text}`}>{bookmark.postAuthor}</p>
                    <p className={`text-xs ${tc.textSecondary}`}>
                      Saved {bookmark.savedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`${tc.text} text-[15px] mb-3`}>{bookmark.postContent}</p>
                <div className="flex flex-wrap gap-2">
                  {bookmark.tags.map(tag => (
                    <span key={tag} className={`px-2 py-1 rounded-full text-xs ${tc.bgTertiary} ${tc.textSecondary}`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text}`}>Bookmark Collections</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm"
          >
            + New Collection
          </button>
        </div>
      </div>

      {/* Collections */}
      <div className="p-4 space-y-3">
        {/* All Bookmarks */}
        <button
          onClick={() => setSelectedCollection(null)}
          className={`w-full ${tc.bgCard} rounded-xl p-4 border ${tc.border} hover:border-blue-500 transition-colors text-left`}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">📑</div>
            <div className="flex-1">
              <h3 className={`font-bold ${tc.text}`}>All Bookmarks</h3>
              <p className={`text-sm ${tc.textSecondary}`}>{bookmarks.length} bookmarks</p>
            </div>
          </div>
        </button>

        {/* Collections */}
        {collections.map(collection => (
          <button
            key={collection.id}
            onClick={() => setSelectedCollection(collection)}
            className={`w-full ${tc.bgCard} rounded-xl p-4 border ${tc.border} hover:border-blue-500 transition-colors text-left`}
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">{collection.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold ${tc.text}`}>{collection.name}</h3>
                  {collection.isPrivate && (
                    <span className="text-xs">🔒</span>
                  )}
                </div>
                <p className={`text-sm ${tc.textSecondary} line-clamp-1`}>{collection.description}</p>
                <p className={`text-xs ${tc.textSecondary} mt-1`}>
                  {collection.bookmarkCount} bookmarks · Created {collection.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-md mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>Create Collection</h2>

            {/* Icon selector */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Icon
              </label>
              <div className="flex gap-2 flex-wrap">
                {icons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewCollectionIcon(icon)}
                    className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all ${
                      newCollectionIcon === icon
                        ? 'bg-blue-500 scale-110'
                        : `${tc.bgTertiary} hover:scale-105`
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Name
              </label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="My Collection"
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Description (optional)
              </label>
              <textarea
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
                placeholder="What's this collection about?"
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 resize-none`}
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 py-2.5 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
