import React, { useState, useEffect } from 'react';
import { Community, User } from '../types';
import { communities as initialCommunities, currentUser } from '../data';
import { ArrowLeft } from './Icons';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';
import { uploadMedia } from '../api/phpAdapter';

interface CommunityPost {
  id: string;
  communityId: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

const LOCAL_STORAGE_KEY = 'longa_communities_v2';
const LOCAL_STORAGE_POSTS_KEY = 'longa_community_posts_v2';

export default function Communities() {
  const tc = useThemeClasses();
  const { user } = useAuth();
  
  const [communities, setCommunities] = useState<Community[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load communities from cache:', e);
    }
    return initialCommunities;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load community posts:', e);
    }
    return [
      {
        id: 'cp-1',
        communityId: '1',
        author: {
          id: '2',
          name: 'Zawadi Innovation',
          handle: '@zawadi',
          avatar: '👩‍🔬',
        },
        content: 'Karibuni sana katika jumuiya yetu ya Tech & Startups! Je, ni mradi gani wa AI unaufanyia kazi wiki hii?',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        likes: 18,
        liked: false,
      },
    ];
  });

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'joined'>('discover');
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('🚀');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Technology']);
  const [topicInput, setTopicInput] = useState('');
  const [rules, setRules] = useState<string[]>([
    'Kuwa na heshima kwa wanajamii wote.',
    'Epuka spam au viungo vya utapeli.',
    'Zingatia mada kuu za jamii hii.',
  ]);
  const [newRule, setNewRule] = useState('');

  // Post Composer in Community
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(communityPosts));
  }, [communityPosts]);

  const toggleMembership = (communityId: string) => {
    setCommunities(prev =>
      prev.map(c => {
        if (c.id === communityId) {
          const newIsMember = !c.isMember;
          return {
            ...c,
            isMember: newIsMember,
            members: newIsMember ? c.members + 1 : Math.max(1, c.members - 1),
          };
        }
        return c;
      })
    );

    if (selectedCommunity && selectedCommunity.id === communityId) {
      setSelectedCommunity(prev =>
        prev
          ? {
              ...prev,
              isMember: !prev.isMember,
              members: !prev.isMember ? prev.members + 1 : Math.max(1, prev.members - 1),
            }
          : null
      );
    }
  };

  const handleAddTopic = () => {
    if (topicInput.trim() && !selectedTopics.includes(topicInput.trim())) {
      setSelectedTopics([...selectedTopics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (t: string) => {
    setSelectedTopics(selectedTopics.filter(item => item !== t));
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCommunity: Community = {
      id: 'comm_' + Date.now(),
      name: name.trim(),
      description: description.trim() || 'Jumuiya mpya kwenye Longa',
      avatar: avatar.trim() || '👥',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop',
      members: 1,
      isMember: true,
      isPrivate,
      admin: (user as User) || currentUser,
      rules: rules.length > 0 ? rules : ['Kuwa na heshima na nidhamu kwa kila mmoja.'],
      topics: selectedTopics.length > 0 ? selectedTopics : ['General'],
    };

    setCommunities([newCommunity, ...communities]);
    setSelectedCommunity(newCommunity);
    setShowCreateModal(false);
    
    // Reset form
    setName('');
    setDescription('');
    setAvatar('🚀');
    setIsPrivate(false);
    setSelectedTopics(['Technology']);
    setRules([
      'Kuwa na heshima kwa wanajamii wote.',
      'Epuka spam au viungo vya utapeli.',
    ]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadMedia(file);
      setPostImage(url);
    } catch (err) {
      console.error('Image upload failed:', err);
      // Fallback
      setPostImage(URL.createObjectURL(file));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreateCommunityPost = () => {
    if (!postContent.trim() && !postImage) return;
    if (!selectedCommunity) return;

    const newPost: CommunityPost = {
      id: 'cp_' + Date.now(),
      communityId: selectedCommunity.id,
      author: {
        id: user?.id ? user.id.toString() : 'me',
        name: user?.name || 'Mtumiaji',
        handle: user?.handle || '@user',
        avatar: user?.avatar || '👤',
      },
      content: postContent.trim(),
      image: postImage || undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setPostContent('');
    setPostImage(null);
  };

  const handleLikeCommunityPost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newLiked = !p.liked;
          return {
            ...p,
            liked: newLiked,
            likes: newLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const joinedCommunities = communities.filter(c => c.isMember);
  const discoverCommunities = communities.filter(c => !c.isMember);

  const availableEmojis = ['🚀', '💻', '🎨', '🎵', '⚽', '📈', '🌍', '🤖', '🎮', '💡', '📚', '🔥'];

  // Detail View of Community
  if (selectedCommunity) {
    const currentPosts = communityPosts.filter(p => p.communityId === selectedCommunity.id);

    return (
      <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
        {/* Header */}
        <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
          <div className="flex items-center gap-4 px-4 py-2.5">
            <button
              onClick={() => setSelectedCommunity(null)}
              className={`p-2 rounded-full ${tc.bgHoverSecondary} transition-colors`}
            >
              <ArrowLeft />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold truncate">{selectedCommunity.name}</h1>
              <p className={`text-xs ${tc.textSecondary}`}>
                {selectedCommunity.members.toLocaleString()} Wanachama {selectedCommunity.isPrivate ? '· 🔒 Private' : '· 🌐 Public'}
              </p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="h-40 relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
          {selectedCommunity.banner && (
            <img
              src={selectedCommunity.banner}
              alt={selectedCommunity.name}
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Community Info */}
        <div className={`px-4 pb-4 border-b ${tc.border}`}>
          <div className="flex items-start justify-between -mt-10 mb-3 relative z-10">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl border-4 ${tc.border} shadow-2xl`}>
              {selectedCommunity.avatar}
            </div>
            <button
              onClick={() => toggleMembership(selectedCommunity.id)}
              className={`mt-10 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-md ${
                selectedCommunity.isMember
                  ? 'bg-transparent border border-gray-500 hover:border-red-500 hover:text-red-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {selectedCommunity.isMember ? 'Umejiunga ✓' : '+ Jiunge'}
            </button>
          </div>

          <h2 className="text-2xl font-black">{selectedCommunity.name}</h2>
          <p className={`text-sm mt-1.5 leading-relaxed ${tc.textSecondary}`}>{selectedCommunity.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCommunity.topics.map(topic => (
              <span key={topic} className={`px-3 py-1 rounded-full text-xs font-semibold ${tc.bgTertiary} text-blue-400 border ${tc.border}`}>
                #{topic}
              </span>
            ))}
          </div>
        </div>

        {/* Community Rules Box */}
        <div className={`mx-4 my-4 p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-2.5 flex items-center gap-2">
            <span>📜</span> Kanuni za Jumuiya
          </h3>
          <div className="space-y-1.5">
            {selectedCommunity.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="font-bold text-blue-400">{i + 1}.</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Post Composer (Only for members) */}
        {selectedCommunity.isMember ? (
          <div className={`mx-4 mb-4 p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg flex-shrink-0">
                {user?.avatar || '👤'}
              </div>
              <div className="flex-1">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={`Andika chapisho jipya katika ${selectedCommunity.name}...`}
                  rows={3}
                  className={`w-full bg-transparent border-none outline-none resize-none text-sm ${tc.text} placeholder-gray-500`}
                />

                {postImage && (
                  <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-700 max-h-56">
                    <img src={postImage} alt="Post preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPostImage(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-2">
                  <div>
                    <label className={`cursor-pointer p-2 rounded-full ${tc.bgHoverSecondary} text-blue-400 inline-flex items-center gap-1.5 text-xs font-semibold`}>
                      <span>📷 Weka Picha</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {isUploadingImage && <span className="text-xs text-blue-400 ml-2 animate-pulse">Inapakia...</span>}
                  </div>

                  <button
                    onClick={handleCreateCommunityPost}
                    disabled={!postContent.trim() && !postImage}
                    className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-full transition-colors"
                  >
                    Chapisha
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`mx-4 mb-4 p-4 rounded-xl border border-dashed border-gray-700 text-center ${tc.bgCard}`}>
            <p className="text-sm text-gray-400 mb-2">Jiunge na jumuiya hii ili uweze kuchapisha na kujadili pamoja na wenzako.</p>
            <button
              onClick={() => toggleMembership(selectedCommunity.id)}
              className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full"
            >
              Jiunge Sasa
            </button>
          </div>
        )}

        {/* Community Feed */}
        <div className="px-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Mijadala ya Hivi Karibuni ({currentPosts.length})
          </h3>

          {currentPosts.length === 0 ? (
            <div className={`text-center py-12 rounded-xl border ${tc.border} ${tc.bgCard}`}>
              <div className="text-5xl mb-3">💬</div>
              <h4 className="font-bold text-base mb-1">Hakuna machapisho bado</h4>
              <p className={`text-xs ${tc.textSecondary}`}>Kuwa wa kwanza kuanzisha mjadala katika jamii hii!</p>
            </div>
          ) : (
            currentPosts.map(post => (
              <div key={post.id} className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg">
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{post.author.name}</span>
                      <span className={`text-xs ${tc.textSecondary}`}>{post.author.handle}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

                {post.image && (
                  <div className="rounded-xl overflow-hidden border border-gray-800 mb-3 max-h-80">
                    <img src={post.image} alt="Attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center gap-6 pt-2 border-t border-gray-800/50 text-xs text-gray-400">
                  <button
                    onClick={() => handleLikeCommunityPost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-red-500 font-bold' : 'hover:text-red-400'}`}
                  >
                    <span>{post.liked ? '❤️' : '🤍'}</span>
                    <span>{post.likes}</span>
                  </button>
                  <span className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                    <span>💬</span>
                    <span>Jibu</span>
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-green-400 cursor-pointer">
                    <span>🔗</span>
                    <span>Shiriki</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Main Directory List
  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Communities</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>+</span> Unda Jumuiya
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-t border-gray-800/40">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'discover' ? 'text-blue-400 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Gundua Jumuiya ({discoverCommunities.length})
            {activeTab === 'discover' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'joined' ? 'text-blue-400 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Uliojiunga ({joinedCommunities.length})
            {activeTab === 'joined' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Hero CTA Box */}
      <div className="p-4">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-blue-500/30 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Ungana na Watu Wenye Maono Kama Yako</h2>
            <p className="text-xs text-gray-300 mt-1 max-w-md">
              Gundua jumuiya za teknolojia, sanaa, biashara au uanzishe jamii yako ya kipekee leo.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-white text-black hover:bg-gray-100 font-bold text-xs rounded-xl flex-shrink-0 shadow-md ml-3"
          >
            + Unda Jamii Yako
          </button>
        </div>
      </div>

      {/* Communities List */}
      <div className="px-4 space-y-2.5">
        {(activeTab === 'joined' ? joinedCommunities : discoverCommunities).length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-5xl mb-3">👥</div>
            <h3 className="text-lg font-bold mb-1">
              {activeTab === 'joined' ? 'Hujajiunga na jamii yoyote bado' : 'Hakuna jamii mpya kwa sasa'}
            </h3>
            <p className={`text-xs ${tc.textSecondary} mb-4`}>
              {activeTab === 'joined'
                ? 'Gundua na ujiunge na jumuiya unazozipenda au uunde ya kwako.'
                : 'Umejiunga na jumuiya zote zilizopo! Unaweza kuunda nyingine mpya.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full"
            >
              Unda Jumuiya Mpya
            </button>
          </div>
        ) : (
          (activeTab === 'joined' ? joinedCommunities : discoverCommunities).map(community => (
            <div
              key={community.id}
              onClick={() => setSelectedCommunity(community)}
              className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard} hover:border-blue-500/50 cursor-pointer transition-all flex items-center gap-4`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
                {community.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base hover:text-blue-400 transition-colors truncate">
                    {community.name}
                  </h3>
                  {community.isPrivate && <span className="text-xs">🔒</span>}
                </div>
                <p className={`text-xs mt-0.5 line-clamp-1 ${tc.textSecondary}`}>
                  {community.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="font-semibold text-gray-300">
                    👥 {community.members.toLocaleString()} wanachama
                  </span>
                  <span>·</span>
                  <span className="text-blue-400">#{community.topics[0] || 'General'}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMembership(community.id);
                }}
                className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all flex-shrink-0 ${
                  community.isMember
                    ? 'border border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {community.isMember ? 'Umejiunga' : 'Jiunge'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-lg ${tc.bgModal} rounded-2xl border ${tc.border} p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <h2 className="text-xl font-black">Unda Jumuiya Mpya</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-gray-400 hover:text-white`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Aikoni ya Jumuiya
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableEmojis.map(emoji => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                        avatar === emoji
                          ? 'bg-blue-500 border-2 border-white scale-110 shadow-lg'
                          : `${tc.bgTertiary} hover:scale-105`
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Jina la Jumuiya *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="mf. Waandishi na Wabunifu Tanzania"
                  className={`w-full px-4 py-2.5 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-sm outline-none focus:border-blue-500`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Maelezo Mafupi
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Eleza dhumuni na mambo yatakayojadiliwa katika jumuiya hii..."
                  className={`w-full px-4 py-2.5 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-sm outline-none focus:border-blue-500 resize-none`}
                />
              </div>

              {/* Topics / Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Mada (Topics)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={e => setTopicInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    placeholder="Andika mada kisha bonyeza Weka"
                    className={`flex-1 px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl"
                  >
                    Weka
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTopics.map(t => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5 border border-blue-500/30"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(t)}
                        className="hover:text-red-400 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Kanuni za Jamii
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={e => setNewRule(e.target.value)}
                    placeholder="Ongeza kanuni mpya..."
                    className={`flex-1 px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                  />
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Kanuni
                  </button>
                </div>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-gray-800/40 text-gray-300">
                      <span>{idx + 1}. {rule}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-gray-500 hover:text-red-400 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between py-2 border-t border-gray-800">
                <div>
                  <p className="font-bold text-sm">Jumuiya ya Faragha (Private)</p>
                  <p className="text-xs text-gray-400">Ni wanachama pekee watakaoweza kuona machapisho</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={e => setIsPrivate(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 py-2.5 rounded-full border ${tc.border} text-sm font-bold hover:bg-gray-800`}
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-sm rounded-full shadow-lg shadow-blue-500/30 transition-all"
                >
                  Unda Jumuiya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
