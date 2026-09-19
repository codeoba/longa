import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface CollaborativePost {
  id: string;
  title: string;
  content: string;
  authors: {
    id: string;
    name: string;
    avatar: string;
    contribution: number; // percentage
  }[];
  createdAt: Date;
  likes: number;
  comments: number;
  status: 'draft' | 'published';
}

export default function CollaborativePosts() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [posts, setPosts] = useState<CollaborativePost[]>([
    {
      id: '1',
      title: 'The Future of AI in Africa: A Collaborative Perspective',
      content: 'Artificial Intelligence is transforming the African continent in unprecedented ways. From healthcare to agriculture, AI solutions are being developed to address unique challenges faced by African communities.\n\nKey areas of impact:\n\n1. Healthcare: AI-powered diagnostics are helping doctors in remote areas provide better care.\n\n2. Agriculture: Smart farming techniques using AI are increasing crop yields and reducing waste.\n\n3. Education: Personalized learning platforms are making quality education accessible to more students.\n\n4. Finance: AI-driven financial services are bringing banking to unbanked populations.',
      authors: [
        { id: '1', name: 'Amani Tech', avatar: '👨‍💻', contribution: 40 },
        { id: '2', name: 'Zawadi Innovation', avatar: '👩‍🔬', contribution: 35 },
        { id: '3', name: 'Baraka Digital', avatar: '🎨', contribution: 25 },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      likes: 1234,
      comments: 89,
      status: 'published',
    },
    {
      id: '2',
      title: 'Building Open Source Communities in East Africa',
      content: 'Open source software is changing the way we build technology in East Africa. This collaborative post explores how communities are coming together to create impactful solutions.\n\nWe discuss:\n- Best practices for community building\n- Tools and platforms we use\n- Challenges we face\n- Success stories from the region',
      authors: [
        { id: '1', name: 'Amani Tech', avatar: '👨‍💻', contribution: 60 },
        { id: '4', name: 'Neema AI', avatar: '🤖', contribution: 40 },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      likes: 892,
      comments: 45,
      status: 'published',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CollaborativePost | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);

  const handleCreatePost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: CollaborativePost = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      authors: [
        {
          id: user!.id.toString(),
          name: user!.name,
          avatar: user!.avatar,
          contribution: 100,
        },
      ],
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      status: 'draft',
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  const handlePublish = (postId: string) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, status: 'published' } : p
    ));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (selectedPost) {
    return (
      <div>
        {/* Header */}
        <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
          <div className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => setSelectedPost(null)}
              className={`p-2 rounded-full ${tc.bgHoverSecondary}`}
            >
              <svg className={`w-5 h-5 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className={`text-lg font-bold ${tc.text} line-clamp-1`}>{selectedPost.title}</h1>
              <p className={`text-xs ${tc.textSecondary}`}>
                {selectedPost.authors.length} authors · {selectedPost.status}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Authors */}
          <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border} mb-4`}>
            <h3 className={`text-sm font-bold ${tc.text} mb-3`}>Authors</h3>
            <div className="space-y-2">
              {selectedPost.authors.map(author => (
                <div key={author.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                    {author.avatar}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${tc.text}`}>{author.name}</p>
                    <div className={`w-full h-2 rounded-full ${tc.bgTertiary} overflow-hidden`}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: `${author.contribution}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tc.text}`}>{author.contribution}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Post content */}
          <article className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>{selectedPost.title}</h2>
            <div className={`${tc.text} text-[15px] leading-relaxed whitespace-pre-wrap`}>
              {selectedPost.content}
            </div>

            <div className={`flex items-center gap-4 mt-6 pt-4 border-t ${tc.border} text-sm ${tc.textSecondary}`}>
              <span>❤️ {formatNumber(selectedPost.likes)}</span>
              <span>💬 {formatNumber(selectedPost.comments)}</span>
              <span className="ml-auto">
                {selectedPost.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className={`text-xl font-bold ${tc.text}`}>Collaborative Posts</h1>
            <p className={`text-sm ${tc.textSecondary}`}>Write together, share knowledge</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm"
          >
            + New Post
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="p-4 space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No collaborative posts yet</h3>
            <p className={tc.textSecondary}>Create your first collaborative post!</p>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className={`${tc.bgCard} rounded-xl p-4 border ${tc.border} cursor-pointer hover:border-blue-500 transition-colors`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className={`font-bold ${tc.text} flex-1 line-clamp-2`}>{post.title}</h3>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                  post.status === 'published'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {post.status}
                </span>
              </div>

              {/* Authors */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {post.authors.slice(0, 3).map(author => (
                    <div
                      key={author.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm border-2 border-black"
                      title={author.name}
                    >
                      {author.avatar}
                    </div>
                  ))}
                </div>
                <span className={`text-sm ${tc.textSecondary}`}>
                  {post.authors.length} {post.authors.length === 1 ? 'author' : 'authors'}
                </span>
              </div>

              {/* Preview */}
              <p className={`text-sm ${tc.textSecondary} line-clamp-2 mb-3`}>
                {post.content}
              </p>

              {/* Stats */}
              <div className={`flex items-center gap-4 text-xs ${tc.textSecondary}`}>
                <span>❤️ {formatNumber(post.likes)}</span>
                <span>💬 {formatNumber(post.comments)}</span>
                <span className="ml-auto">
                  {post.createdAt.toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              {post.status === 'draft' && post.authors[0].id === user?.id.toString() && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePublish(post.id);
                    }}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-full"
                  >
                    Publish
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={`px-4 py-2 rounded-full border ${tc.border} ${tc.text} text-sm font-bold hover:bg-gray-500/10`}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-2xl mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6 max-h-[90vh] overflow-y-auto`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>Create Collaborative Post</h2>

            {/* Title */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter a compelling title..."
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
              />
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Content
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your collaborative post..."
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 resize-none`}
                rows={10}
              />
            </div>

            {/* Collaborators */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Add Collaborators (optional)
              </label>
              <input
                type="text"
                placeholder="@username"
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
              />
              <p className={`text-xs ${tc.textSecondary} mt-1`}>
                Invite others to collaborate on this post
              </p>
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
                onClick={handleCreatePost}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full"
              >
                Create Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
