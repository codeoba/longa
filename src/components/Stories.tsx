import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';
import { uploadMedia } from '../api/phpAdapter';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'image' | 'video' | 'text';
  content: string;
  caption?: string;
  backgroundGradient?: string;
  timestamp: Date;
  views: number;
  reactions: string[];
  seen: boolean;
}

const STORIES_STORAGE_KEY = 'longa_stories_v2';

const sampleStories: Story[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Zawadi Innovation',
    userAvatar: '👩‍🔬',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=900&fit=crop',
    caption: '🚀 Maabara yetu mpya ya utafiti wa AI Dar es Salaam!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    views: 234,
    reactions: ['🔥', '❤️', '👏'],
    seen: false,
  },
  {
    id: '2',
    userId: '3',
    userName: 'Baraka Digital',
    userAvatar: '🎨',
    type: 'text',
    content: 'Tumezindua mfumo mpya wa UI & Design Tokens leo! Angalia Longa 2.0 ✨',
    backgroundGradient: 'from-purple-600 via-indigo-600 to-pink-600',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    views: 567,
    reactions: ['🎉', '👍'],
    seen: false,
  },
  {
    id: '3',
    userId: '4',
    userName: 'Neema AI',
    userAvatar: '🤖',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=900&fit=crop',
    caption: 'Next-Gen Generative Intelligence 🔥',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    views: 1200,
    reactions: ['🤯', '🔥', '❤️'],
    seen: true,
  },
];

const GRADIENTS = [
  'from-purple-600 via-pink-600 to-red-500',
  'from-blue-600 via-indigo-600 to-purple-700',
  'from-emerald-500 via-teal-600 to-cyan-700',
  'from-amber-500 via-orange-600 to-red-600',
  'from-gray-900 via-purple-950 to-black',
];

export default function Stories() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(STORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp),
        }));
      }
    } catch (e) {
      console.warn('Failed to load stories:', e);
    }
    return sampleStories;
  });

  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [storyType, setStoryType] = useState<'image' | 'video' | 'text'>('image');
  const [storyContent, setStoryContent] = useState('');
  const [storyCaption, setStoryCaption] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
  }, [stories]);

  // Auto-progress for active story
  useEffect(() => {
    if (activeStory && !isPaused) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            nextStory();
            return 100;
          }
          return prev + 1.5;
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [activeStory, isPaused]);

  const nextStory = () => {
    if (!activeStory) return;
    const currentIndex = stories.findIndex((s) => s.id === activeStory.id);
    if (currentIndex < stories.length - 1) {
      setActiveStory(stories[currentIndex + 1]);
    } else {
      setActiveStory(null);
    }
  };

  const prevStory = () => {
    if (!activeStory) return;
    const currentIndex = stories.findIndex((s) => s.id === activeStory.id);
    if (currentIndex > 0) {
      setActiveStory(stories[currentIndex - 1]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadMedia(file);
      setStoryContent(url);
    } catch (err) {
      console.warn('Upload error, fallback to local object url:', err);
      setStoryContent(URL.createObjectURL(file));
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateStory = () => {
    if (!storyContent.trim()) return;

    const newStory: Story = {
      id: 'story_' + Date.now(),
      userId: user?.id ? user.id.toString() : 'me',
      userName: user?.name || 'Mtumiaji',
      userAvatar: user?.avatar || '👤',
      type: storyType,
      content: storyContent.trim(),
      caption: storyCaption.trim() || undefined,
      backgroundGradient: storyType === 'text' ? selectedGradient : undefined,
      timestamp: new Date(),
      views: 0,
      reactions: [],
      seen: false,
    };

    setStories([newStory, ...stories]);
    setStoryContent('');
    setStoryCaption('');
    setShowCreateModal(false);
  };

  const addReaction = (storyId: string, emoji: string) => {
    setStories(
      stories.map((s) =>
        s.id === storyId ? { ...s, reactions: [...s.reactions, emoji] } : s
      )
    );
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h`;
  };

  // Full Screen Story Viewer
  if (activeStory) {
    return (
      <div
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center select-none"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
          {stories.map((story) => (
            <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    story.id === activeStory.id
                      ? `${progress}%`
                      : stories.indexOf(story) < stories.indexOf(activeStory)
                      ? '100%'
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg border-2 border-white shadow-lg">
              {activeStory.userAvatar}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight drop-shadow">{activeStory.userName}</p>
              <p className="text-white/70 text-xs drop-shadow">{formatTimeAgo(activeStory.timestamp)} ago</p>
            </div>
          </div>
          <button
            onClick={() => setActiveStory(null)}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-lg transition-colors border border-white/20"
          >
            ✕
          </button>
        </div>

        {/* Navigation tap zones */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" onClick={prevStory} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer" onClick={nextStory} />

        {/* Story Content Area */}
        <div className="relative w-full max-w-md h-full max-h-[85vh] rounded-2xl overflow-hidden flex items-center justify-center bg-[#0a0a0c] shadow-2xl">
          {activeStory.type === 'image' && (
            <img
              src={activeStory.content}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}

          {activeStory.type === 'video' && (
            <video
              src={activeStory.content}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}

          {activeStory.type === 'text' && (
            <div className={`w-full h-full bg-gradient-to-br ${activeStory.backgroundGradient || GRADIENTS[0]} flex items-center justify-center p-8 text-center`}>
              <p className="text-white text-2xl font-black leading-relaxed drop-shadow-lg">
                {activeStory.content}
              </p>
            </div>
          )}

          {/* Caption Overlay */}
          {activeStory.caption && activeStory.type !== 'text' && (
            <div className="absolute bottom-16 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-center">
              <p className="text-sm font-semibold drop-shadow">{activeStory.caption}</p>
            </div>
          )}
        </div>

        {/* Reaction Bar */}
        <div className="absolute bottom-4 inset-x-4 max-w-md mx-auto flex items-center justify-between gap-2 z-20">
          <input
            type="text"
            placeholder="Jibu kwa ujumbe..."
            className="flex-1 px-4 py-2.5 rounded-full bg-black/40 border border-white/20 text-white text-xs placeholder-white/60 outline-none backdrop-blur-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                alert('Ujumbe umetumwa kwa ' + activeStory.userName);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <div className="flex gap-1.5">
            {['🔥', '❤️', '👏', '😂', '🎉'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => addReaction(activeStory.id, emoji)}
                className="w-9 h-9 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-base hover:scale-125 transition-transform backdrop-blur-md"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Stories Carousel / Bar View
  return (
    <div className={`p-4 border-b ${tc.border}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-extrabold flex items-center gap-2">
          <span>⚡</span> Hadithi (Stories)
        </h2>
        <span className={`text-xs ${tc.textSecondary}`}>{stories.length} stories</span>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Add Story Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className={`w-full h-full rounded-full ${tc.bg} flex items-center justify-center text-2xl`}>
                {user?.avatar || '👤'}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-black">
              +
            </div>
          </div>
          <span className={`text-xs font-semibold ${tc.textSecondary}`}>Hadithi Yako</span>
        </button>

        {/* Stories list */}
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div
              className={`p-0.5 rounded-full transition-transform group-hover:scale-105 shadow-md ${
                story.seen ? 'bg-gray-600' : 'bg-gradient-to-br from-pink-500 via-red-500 to-amber-500 ring-2 ring-pink-500/30'
              }`}
            >
              <div className={`w-16 h-16 rounded-full ${tc.bg} p-0.5`}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl overflow-hidden">
                  {story.type === 'image' ? (
                    <img src={story.content} alt={story.userName} className="w-full h-full object-cover" />
                  ) : (
                    story.userAvatar
                  )}
                </div>
              </div>
            </div>
            <span className={`text-xs font-semibold ${tc.textSecondary} max-w-[68px] truncate`}>
              {story.userName.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-md ${tc.bgModal} rounded-2xl border ${tc.border} p-6 shadow-2xl`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <h2 className="text-xl font-black">Unda Hadithi Mpya</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-gray-400 hover:text-white`}
              >
                ✕
              </button>
            </div>

            {/* Story type selector */}
            <div className="flex gap-2 mb-4">
              {(['image', 'video', 'text'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setStoryType(type);
                    setStoryContent('');
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition-colors ${
                    storyType === type
                      ? 'bg-blue-500 text-white shadow-md'
                      : `${tc.bgTertiary} text-gray-400 hover:text-white`
                  }`}
                >
                  {type === 'image' && '📷 Picha'}
                  {type === 'video' && '🎥 Video'}
                  {type === 'text' && '✍️ Maandishi'}
                </button>
              ))}
            </div>

            {/* Content Input by Type */}
            {storyType === 'text' ? (
              <div className="space-y-3">
                <div className={`w-full h-44 rounded-xl bg-gradient-to-br ${selectedGradient} flex items-center justify-center p-4 shadow-inner`}>
                  <textarea
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    placeholder="Andika hadithi yako hapa..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-white text-center font-bold text-lg placeholder-white/60"
                    maxLength={160}
                  />
                </div>

                {/* Gradient Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Chagua Rangi ya Nyuma
                  </label>
                  <div className="flex gap-2">
                    {GRADIENTS.map((grad) => (
                      <button
                        key={grad}
                        type="button"
                        onClick={() => setSelectedGradient(grad)}
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} transition-transform ${
                          selectedGradient === grad ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className={`border-2 border-dashed ${tc.border} rounded-2xl p-6 text-center bg-blue-500/5`}>
                  {storyContent ? (
                    <div className="relative h-44 rounded-xl overflow-hidden bg-black mb-2">
                      {storyType === 'image' ? (
                        <img src={storyContent} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <video src={storyContent} controls className="w-full h-full object-contain" />
                      )}
                      <button
                        type="button"
                        onClick={() => setStoryContent('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white text-xs hover:bg-black"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">{storyType === 'image' ? '📸' : '🎬'}</div>
                      <p className="font-bold text-sm mb-1">
                        Pakia {storyType === 'image' ? 'picha ya hadithi' : 'video fupi'}
                      </p>
                      <label className="mt-2 inline-block px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full cursor-pointer shadow-md">
                        {isUploading ? 'Inapakia...' : 'Chagua Faili'}
                        <input
                          type="file"
                          accept={storyType === 'image' ? 'image/*' : 'video/*'}
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Maelezo ya Ziada (Caption)
                  </label>
                  <input
                    type="text"
                    value={storyCaption}
                    onChange={(e) => setStoryCaption(e.target.value)}
                    placeholder="Weka maelezo mafupi..."
                    className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none focus:border-blue-500`}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 py-2.5 rounded-full border ${tc.border} text-xs font-bold hover:bg-gray-800`}
              >
                Ghairi
              </button>
              <button
                onClick={handleCreateStory}
                disabled={!storyContent.trim() || isUploading}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/25"
              >
                Shiriki Hadithi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
