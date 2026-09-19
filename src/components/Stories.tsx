import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'image' | 'video' | 'text';
  content: string;
  timestamp: Date;
  views: number;
  reactions: string[];
  seen: boolean;
}

export default function Stories() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [storyType, setStoryType] = useState<'image' | 'video' | 'text'>('image');
  const [storyContent, setStoryContent] = useState('');
  const [progress, setProgress] = useState(0);

  // Sample stories
  useEffect(() => {
    const sampleStories: Story[] = [
      {
        id: '1',
        userId: '2',
        userName: 'Zawadi Innovation',
        userAvatar: '👩‍🔬',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=700&fit=crop',
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
        content: 'Just launched our new design system! 🎨✨ Check it out at design.baraka.dev',
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
        content: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=700&fit=crop',
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        views: 1200,
        reactions: ['🤯', '🔥', '❤️'],
        seen: true,
      },
    ];
    setStories(sampleStories);
  }, []);

  // Auto-progress for active story
  useEffect(() => {
    if (activeStory) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            nextStory();
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeStory]);

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

  const handleCreateStory = () => {
    if (!storyContent.trim()) return;

    const newStory: Story = {
      id: Date.now().toString(),
      userId: user!.id.toString(),
      userName: user!.name,
      userAvatar: user!.avatar,
      type: storyType,
      content: storyContent,
      timestamp: new Date(),
      views: 0,
      reactions: [],
      seen: false,
    };

    setStories([newStory, ...stories]);
    setStoryContent('');
    setShowCreateModal(false);
  };

  const addReaction = (storyId: string, emoji: string) => {
    setStories(
      stories.map((s) =>
        s.id === storyId ? { ...s, reactions: [...s.reactions, emoji] } : s
      )
    );
  };

  if (activeStory) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {stories.map((story, index) => (
            <div key={story.id} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
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

        {/* Story header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
              {activeStory.userAvatar}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{activeStory.userName}</p>
              <p className="text-gray-300 text-xs">
                {Math.floor((Date.now() - activeStory.timestamp.getTime()) / 60000)}m ago
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveStory(null)}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Story content */}
        <div className="w-full h-full flex items-center justify-center" onClick={nextStory}>
          {activeStory.type === 'image' ? (
            <img src={activeStory.content} alt="" className="max-w-full max-h-full object-contain" />
          ) : activeStory.type === 'video' ? (
            <video src={activeStory.content} autoPlay className="max-w-full max-h-full" />
          ) : (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center p-8">
              <p className="text-white text-2xl font-bold text-center">{activeStory.content}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <button
          onClick={prevStory}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextStory}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Reactions */}
        <div className="absolute bottom-8 left-4 right-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Reply to story..."
            className="flex-1 px-4 py-2 rounded-full bg-white/20 text-white placeholder-gray-300 outline-none backdrop-blur-sm"
          />
          <div className="flex gap-2">
            {['❤️', '🔥', '👏', '😂', '😮'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => addReaction(activeStory.id, emoji)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl backdrop-blur-sm"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 py-3 border-b ${tc.border}`}>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {/* Your story */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex flex-col items-center gap-1 flex-shrink-0"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
              {user?.avatar}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <span className={`text-xs ${tc.textSecondary}`}>Your story</span>
        </button>

        {/* Other stories */}
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div
              className={`p-0.5 rounded-full ${
                story.seen ? 'bg-gray-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}
            >
              <div className={`w-16 h-16 rounded-full ${tc.bg} p-0.5`}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                  {story.userAvatar}
                </div>
              </div>
            </div>
            <span className={`text-xs ${tc.textSecondary} max-w-[64px] truncate`}>
              {story.userName.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-md mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>Create Story</h2>

            {/* Story type selector */}
            <div className="flex gap-2 mb-4">
              {(['image', 'video', 'text'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setStoryType(type)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                    storyType === type
                      ? 'bg-blue-500 text-white'
                      : `${tc.bgTertiary} ${tc.textSecondary}`
                  }`}
                >
                  {type === 'image' && '📷 Image'}
                  {type === 'video' && '🎥 Video'}
                  {type === 'text' && '✍️ Text'}
                </button>
              ))}
            </div>

            {/* Content input */}
            {storyType === 'text' ? (
              <textarea
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder="Write your story..."
                className={`w-full px-4 py-3 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 resize-none`}
                rows={5}
              />
            ) : (
              <div className={`border-2 border-dashed ${tc.border} rounded-lg p-8 text-center`}>
                <svg className={`w-12 h-12 mx-auto mb-2 ${tc.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className={tc.textSecondary}>
                  Click to upload {storyType === 'image' ? 'image' : 'video'}
                </p>
                <input
                  type="file"
                  accept={storyType === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setStoryContent(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  id="story-upload"
                />
                <label
                  htmlFor="story-upload"
                  className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600"
                >
                  Choose File
                </label>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 py-2.5 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStory}
                disabled={!storyContent.trim()}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full"
              >
                Share Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
