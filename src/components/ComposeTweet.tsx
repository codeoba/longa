import React, { useState, useRef } from 'react';
import { currentUser, emojiList } from '../data';
import { Image, Gif, Emoji, Poll as PollIcon, Schedule, Location, Close, Verified, Premium } from './Icons';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';
import { Poll } from '../types';

interface ComposeTweetProps {
  onClose?: () => void;
  onSubmit: (content: string, image?: string, poll?: Poll, location?: string) => void;
  isModal?: boolean;
}

const GIF_COLLECTIONS: { id: string; category: string; title: string; url: string }[] = [
  { id: 'g1', category: 'Trending', title: 'Happy Dance', url: 'https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif' },
  { id: 'g2', category: 'Trending', title: 'Excited Celebration', url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif' },
  { id: 'g3', category: 'Trending', title: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
  { id: 'g4', category: 'Reactions', title: 'Thumbs Up', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
  { id: 'g5', category: 'Reactions', title: 'Laughing Out Loud', url: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif' },
  { id: 'g6', category: 'Reactions', title: 'Thinking Hmm', url: 'https://media.giphy.com/media/a5viI92PAF89q/giphy.gif' },
  { id: 'g7', category: 'Applause', title: 'Standing Ovation', url: 'https://media.giphy.com/media/nbvFVPiEiJH6JOGIok/giphy.gif' },
  { id: 'g8', category: 'Applause', title: 'Great Job Clapping', url: 'https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif' },
  { id: 'g9', category: 'Tech', title: 'Coding Hacker', url: 'https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif' },
  { id: 'g10', category: 'Tech', title: 'Rocket To The Moon', url: 'https://media.giphy.com/media/9PyWI9orOdz9jxzZee/giphy.gif' },
  { id: 'g11', category: 'Celebration', title: 'Confetti Party', url: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif' },
  { id: 'g12', category: 'Celebration', title: 'Victory Yes', url: 'https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif' },
];

const EMOJI_CATEGORIES = [
  { name: 'Popular', emojis: emojiList },
  { name: 'Faces', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥹', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😎', '🤓', '🧐', '🤔', '🫣', '🤫', '🫡', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕'] },
  { name: 'Gestures', emojis: ['👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🙏'] },
  { name: 'Africa & Flags', emojis: ['🇹🇿', '🇰🇪', '🇺🇬', '🇷🇼', '🇧🇮', '🇳🇬', '🇿🇦', '🇬🇭', '🇪🇹', '🇸🇴', '🇸🇩', '🇪🇬', '🇿🇲', '🇿🇼', '🌍', '🌎', '🌏'] },
  { name: 'Vibe & Tech', emojis: ['🔥', '💯', '✨', '🌟', '⚡', '💥', '🚀', '💻', '🤖', '📱', '🖥️', '📡', '💡', '🎉', '🏆', '🥇', '👑', '💎', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍'] },
];

const QUICK_LOCATIONS = [
  'Dar es Salaam, Tanzania 🇹🇿',
  'Nairobi, Kenya 🇰🇪',
  'Arusha, Tanzania 🇹🇿',
  'Zanzibar, Tanzania 🇹🇿',
  'Kigali, Rwanda 🇷🇼',
  'Kampala, Uganda 🇺🇬',
  'London, United Kingdom 🇬🇧',
  'New York, USA 🇺🇸',
];

export default function ComposeTweet({ onClose, onSubmit, isModal = false }: ComposeTweetProps) {
  const { user } = useAuth();
  const activeUser = user || currentUser;
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Media & Tools State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState('');
  const [activeGifCategory, setActiveGifCategory] = useState('All');
  
  // Poll State
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollDurationDays, setPollDurationDays] = useState(1);

  // Schedule State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Location State
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');

  const [replyToAudience, setReplyToAudience] = useState<'everyone' | 'followers' | 'mentioned'>('everyone');
  const [aiTransforming, setAiTransforming] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 280;
  const remaining = maxChars - content.length;
  const progress = (content.length / maxChars) * 100;
  const tc = useThemeClasses();

  const handleAiTransform = async (action: 'hook' | 'thread' | 'translate' | 'tone', target?: string) => {
    if (!content.trim()) return;
    setAiTransforming(true);
    try {
      const { getActiveAiCredentials } = await import('../services/aiSettingsService');
      const { getApiUrl } = await import('../api/phpAdapter');
      const { provider, apiKey, model } = getActiveAiCredentials();
      const res = await fetch(`${getApiUrl()}/ai/transform-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          action,
          target,
          provider,
          apiKey,
          model
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          setContent(data.result);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = (textareaRef.current.scrollHeight + 40) + 'px';
          }
        }
      }
    } catch {
      // Local fallback if offline
      if (action === 'hook') {
        setContent(`🔥 Unpopular opinion: Most people get this backwards:\n\n"${content}"\n\nHere is what top builders do 👇`);
      } else if (action === 'thread') {
        setContent(`🧵 [1/2]\n${content}\n\n---\n\n🧵 [2/2]\nFollow for more daily breakthroughs.`);
      }
    } finally {
      setAiTransforming(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      setIsVideo(isVid);

      // Instant local preview
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAttachedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Real server upload via API
      try {
        const { uploadMedia } = await import('../api/phpAdapter');
        const res = await uploadMedia(file);
        if (res && res.url) {
          setAttachedImage(res.url);
        }
      } catch (err) {
        console.warn('Server upload fallback to local preview:', err);
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleSelectGif = (gifUrl: string) => {
    setAttachedImage(gifUrl);
    setIsVideo(false);
    setShowGifPicker(false);
  };

  // Poll handlers
  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    setPollOptions(prev => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Location handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setSelectedLocation('Dar es Salaam, Tanzania');
      setShowLocationPicker(false);
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.state || 'Local Region';
          const country = data.address?.country || 'Tanzania';
          setSelectedLocation(`${city}, ${country}`);
        } catch {
          setSelectedLocation('Dar es Salaam, Tanzania');
        } finally {
          setDetectingLocation(false);
          setShowLocationPicker(false);
        }
      },
      () => {
        setSelectedLocation('Dar es Salaam, Tanzania');
        setDetectingLocation(false);
        setShowLocationPicker(false);
      },
      { timeout: 5000 }
    );
  };

  // Schedule handler
  const handleSaveSchedule = () => {
    if (!scheduleDate || !scheduleTime) return;
    const scheduledDateObj = new Date(`${scheduleDate}T${scheduleTime}`);
    if (scheduledDateObj <= new Date()) {
      alert('Please select a date and time in the future.');
      return;
    }

    try {
      const saved = localStorage.getItem('longa_scheduled_posts');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift({
        id: Date.now().toString(),
        content: content.trim() || 'Scheduled post',
        image: attachedImage || undefined,
        location: selectedLocation || undefined,
        scheduledFor: scheduledDateObj.toISOString(),
        createdAt: new Date().toISOString(),
        status: 'scheduled',
      });
      localStorage.setItem('longa_scheduled_posts', JSON.stringify(list));
      alert(`📅 Post scheduled for ${scheduledDateObj.toLocaleDateString()} at ${scheduledDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}!`);
      setContent('');
      setAttachedImage(null);
      setSelectedLocation(null);
      setShowScheduleModal(false);
      if (onClose) onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = () => {
    if (!content.trim() && !attachedImage && !showPollBuilder) return;
    if (content.length > maxChars) return;

    let pollObj: Poll | undefined = undefined;
    if (showPollBuilder) {
      const validOptions = pollOptions.map(o => o.trim()).filter(Boolean);
      if (validOptions.length >= 2) {
        pollObj = {
          id: 'poll_' + Date.now(),
          question: content.trim() || 'Poll',
          options: validOptions.map((text, i) => ({
            id: 'opt_' + i,
            text,
            votes: 0,
            percentage: 0,
            voted: false,
          })),
          totalVotes: 0,
          endsAt: new Date(Date.now() + pollDurationDays * 24 * 60 * 60 * 1000),
          hasVoted: false,
        };
      }
    }

    onSubmit(content, attachedImage || undefined, pollObj, selectedLocation || undefined);
    setContent('');
    setAttachedImage(null);
    setIsVideo(false);
    setShowPollBuilder(false);
    setPollOptions(['', '']);
    setSelectedLocation(null);
    setShowEmojiPicker(false);
    setShowGifPicker(false);
    setShowScheduleModal(false);
    setShowLocationPicker(false);
    if (onClose) onClose();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  // Filter GIFs
  const filteredGifs = GIF_COLLECTIONS.filter(g => {
    const matchesCategory = activeGifCategory === 'All' || g.category === activeGifCategory;
    const matchesSearch = !gifSearch.trim() || g.title.toLowerCase().includes(gifSearch.toLowerCase()) || g.category.toLowerCase().includes(gifSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`${isModal ? '' : `px-4 py-3 border-b ${tc.border}`}`}>
      {isModal && (
        <div className={`flex items-center justify-between p-3 border-b ${tc.border}`}>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
            <Close />
          </button>
          <span className="text-sm font-bold text-gray-400">Compose New Post</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg shadow-md">
            {activeUser.avatar || '👤'}
          </div>
        </div>

        {/* Input area */}
        <div className="flex-1 min-w-0">
          {isModal && (
            <div className="flex items-center gap-1 mb-2">
              <span className={`font-bold text-[15px] ${tc.text}`}>{activeUser.name}</span>
              <Verified />
              <Premium />
              <span className="text-gray-500 text-[15px]">{activeUser.handle}</span>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onFocus={() => setIsFocused(true)}
            placeholder={showPollBuilder ? "Ask a question..." : "What is happening?!"}
            className={`w-full bg-transparent text-xl resize-none outline-none min-h-[52px] max-h-[300px] py-2 ${tc.text} placeholder-gray-500`}
            rows={isModal ? 4 : 2}
          />

          {/* Attached Location Badge */}
          {selectedLocation && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <span>📍 {selectedLocation}</span>
              <button
                type="button"
                onClick={() => setSelectedLocation(null)}
                className="hover:text-red-400 transition"
              >
                ✕
              </button>
            </div>
          )}

          {/* Attached Media (Image / Video / GIF) */}
          {attachedImage && (
            <div className={`relative my-2 rounded-2xl overflow-hidden border ${tc.border} shadow-lg bg-black/40`}>
              {isVideo ? (
                <video src={attachedImage} controls className="w-full max-h-[280px] object-cover" />
              ) : (
                <img src={attachedImage} alt="Attached" className="w-full max-h-[280px] object-cover" />
              )}
              <button
                type="button"
                onClick={() => { setAttachedImage(null); setIsVideo(false); }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-black text-white transition-colors"
                title="Remove Media"
              >
                <Close />
              </button>
            </div>
          )}

          {/* Poll Builder Inline */}
          {showPollBuilder && (
            <div className={`my-3 p-3.5 rounded-2xl border ${tc.border} ${tc.bgCard} space-y-2.5`}>
              <div className="flex items-center justify-between pb-1 border-b border-gray-700/40">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <PollIcon /> Create Poll
                </span>
                <button
                  type="button"
                  onClick={() => setShowPollBuilder(false)}
                  className="text-xs text-red-400 hover:underline"
                >
                  Remove poll
                </button>
              </div>

              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    maxLength={25}
                    onChange={(e) => handlePollOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}${i < 2 ? ' (required)' : ''}`}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none border ${tc.border} ${tc.bgSecondary} ${tc.text} focus:border-blue-500`}
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(i)}
                      className="p-1.5 text-gray-400 hover:text-red-400 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 py-1 flex items-center gap-1"
                >
                  <span>+</span> Add option
                </button>
              )}

              <div className="pt-2 border-t border-gray-700/40 flex items-center justify-between text-xs text-gray-400">
                <span>Poll length:</span>
                <select
                  value={pollDurationDays}
                  onChange={(e) => setPollDurationDays(Number(e.target.value))}
                  className={`px-2.5 py-1 rounded-lg border ${tc.border} ${tc.bgSecondary} ${tc.text} outline-none cursor-pointer`}
                >
                  <option value={1}>1 Day</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days</option>
                </select>
              </div>
            </div>
          )}

          {/* Longa AI Smart Composer Suite */}
          <div className="flex flex-wrap items-center gap-1.5 my-2 p-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-blue-500/20">
            <span className="text-[11px] font-bold text-blue-400 px-2 flex items-center gap-1">
              <span>✨ Longa AI:</span>
            </span>

            <button
              type="button"
              disabled={aiTransforming || !content.trim()}
              onClick={() => handleAiTransform('hook')}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-white disabled:opacity-40 transition flex items-center gap-1"
            >
              <span>🪄</span> Viral Hook
            </button>

            <button
              type="button"
              disabled={aiTransforming || !content.trim()}
              onClick={() => handleAiTransform('thread')}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-white disabled:opacity-40 transition flex items-center gap-1"
            >
              <span>🧵</span> Threadify
            </button>

            <div className="relative group">
              <button
                type="button"
                disabled={aiTransforming || !content.trim()}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 hover:text-white disabled:opacity-40 transition flex items-center gap-1"
              >
                <span>🌍</span> Translate ▾
              </button>
              <div className="hidden group-hover:flex flex-col absolute left-0 bottom-full mb-1 z-30 py-1 rounded-xl bg-gray-900 border border-gray-700 shadow-xl min-w-[130px]">
                <button
                  type="button"
                  onClick={() => handleAiTransform('translate', 'sw')}
                  className="px-3 py-1.5 text-xs text-left text-gray-200 hover:bg-blue-600 hover:text-white"
                >
                  ✨ Kiswahili
                </button>
                <button
                  type="button"
                  onClick={() => handleAiTransform('translate', 'fr')}
                  className="px-3 py-1.5 text-xs text-left text-gray-200 hover:bg-blue-600 hover:text-white"
                >
                  🇫🇷 Français
                </button>
                <button
                  type="button"
                  onClick={() => handleAiTransform('translate', 'ar')}
                  className="px-3 py-1.5 text-xs text-left text-gray-200 hover:bg-blue-600 hover:text-white"
                >
                  🌍 العربية
                </button>
                <button
                  type="button"
                  onClick={() => handleAiTransform('translate', 'en')}
                  className="px-3 py-1.5 text-xs text-left text-gray-200 hover:bg-blue-600 hover:text-white"
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                disabled={aiTransforming || !content.trim()}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 hover:text-white disabled:opacity-40 transition flex items-center gap-1"
              >
                <span>🎭</span> Tone ▾
              </button>
              <div className="hidden group-hover:flex flex-col absolute left-0 bottom-full mb-1 z-30 py-1 rounded-xl bg-gray-900 border border-gray-700 shadow-xl min-w-[140px]">
                <button
                  type="button"
                  onClick={() => handleAiTransform('tone', 'spicy')}
                  className="px-3 py-1.5 text-xs text-left text-gray-200 hover:bg-amber-600 hover:text-white"
                >
                  🚨 Hot Take / Viral
                </button>
                <button
                  type="button"
                  onClick={() => handleAiTransform('tone', 'professional')}
                  className="px-3 py-1.5 text-xs text-left text-gray-200 hover:bg-amber-600 hover:text-white"
                >
                  💼 Executive / Pro
                </button>
                <button
                  type="button"
                  onClick={() => handleAiTransform('tone', 'poetic')}
                  className="px-3 py-1.5 text-xs text-left text-gray-200 hover:bg-amber-600 hover:text-white"
                >
                  ✨ Poetic / Inspiring
                </button>
              </div>
            </div>

            {aiTransforming && (
              <span className="text-[11px] text-blue-400 animate-pulse ml-auto pr-1">
                Refining with AI...
              </span>
            )}
          </div>

          {/* Reply Audience Toggle */}
          {isFocused && (
            <div className={`border-b ${tc.borderSecondary} mb-3 pb-2`}>
              <button
                type="button"
                onClick={() => setReplyToAudience(replyToAudience === 'everyone' ? 'followers' : replyToAudience === 'followers' ? 'mentioned' : 'everyone')}
                className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:bg-blue-400/10 px-2.5 py-1 rounded-full transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                  <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5z"/>
                </svg>
                {replyToAudience === 'everyone' && 'Everyone can reply'}
                {replyToAudience === 'followers' && 'Followers only'}
                {replyToAudience === 'mentioned' && 'Only people you mention'}
              </button>
            </div>
          )}

          {/* 🎞️ GIF Picker Drawer */}
          {showGifPicker && (
            <div className={`mb-3 p-3 ${tc.bgCard} rounded-2xl border ${tc.border} shadow-xl animate-fadeIn`}>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700/40">
                <span className="text-xs font-bold text-blue-400">Select Animated GIF</span>
                <button type="button" onClick={() => setShowGifPicker(false)} className="text-xs text-gray-400 hover:text-white">✕</button>
              </div>
              <input
                type="text"
                value={gifSearch}
                onChange={(e) => setGifSearch(e.target.value)}
                placeholder="Search GIFs (e.g. applause, dance, celebration)..."
                className={`w-full px-3 py-1.5 mb-2 rounded-xl text-xs outline-none border ${tc.border} ${tc.bgSecondary} ${tc.text}`}
              />
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 mb-2 no-scrollbar">
                {['All', 'Trending', 'Reactions', 'Applause', 'Tech', 'Celebration'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveGifCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition ${activeGifCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredGifs.map(g => (
                  <div
                    key={g.id}
                    onClick={() => handleSelectGif(g.url)}
                    className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500 transition aspect-video bg-black/40"
                  >
                    <img src={g.url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[10px] text-white px-1.5 py-0.5 truncate text-center">
                      {g.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 😀 Emoji Picker */}
          {showEmojiPicker && (
            <div className={`mb-3 p-3 ${tc.bgCard} rounded-2xl border ${tc.border} shadow-xl animate-fadeIn`}>
              <div className="flex gap-1 mb-2 pb-1 border-b border-gray-700/40 overflow-x-auto no-scrollbar">
                {EMOJI_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveEmojiCategory(idx)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${activeEmojiCategory === idx ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-10 gap-1 max-h-[180px] overflow-y-auto pr-1">
                {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className={`p-1.5 ${tc.bgHoverSecondary} rounded-lg transition-colors text-xl flex items-center justify-center hover:scale-125 duration-100`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 📅 Schedule Post Box */}
          {showScheduleModal && (
            <div className={`mb-3 p-3.5 ${tc.bgCard} rounded-2xl border ${tc.border} shadow-xl animate-fadeIn`}>
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-700/40">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Schedule /> Schedule Post
                </span>
                <button type="button" onClick={() => setShowScheduleModal(false)} className="text-xs text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-xl text-xs outline-none border ${tc.border} ${tc.bgSecondary} ${tc.text}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-xl text-xs outline-none border ${tc.border} ${tc.bgSecondary} ${tc.text}`}
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={!scheduleDate || !scheduleTime}
                onClick={handleSaveSchedule}
                className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs transition"
              >
                Confirm Schedule
              </button>
            </div>
          )}

          {/* 📍 Location Picker Box */}
          {showLocationPicker && (
            <div className={`mb-3 p-3.5 ${tc.bgCard} rounded-2xl border ${tc.border} shadow-xl animate-fadeIn`}>
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-700/40">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Location /> Tag Location
                </span>
                <button type="button" onClick={() => setShowLocationPicker(false)} className="text-xs text-gray-400 hover:text-white">✕</button>
              </div>

              {/* Automatic Location Detection */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="w-full mb-2.5 py-1.5 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center gap-2 border border-blue-500/30 transition"
              >
                <span>{detectingLocation ? '⏳ Detecting...' : '🎯 Detect My Current Location'}</span>
              </button>

              <div className="text-[11px] text-gray-400 mb-1 font-semibold">Popular Cities:</div>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {QUICK_LOCATIONS.map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => { setSelectedLocation(loc); setShowLocationPicker(false); }}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white transition"
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Or enter custom place/city..."
                  className={`flex-1 px-3 py-1.5 rounded-xl text-xs outline-none border ${tc.border} ${tc.bgSecondary} ${tc.text}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customLocation.trim()) {
                      setSelectedLocation(customLocation.trim());
                      setCustomLocation('');
                      setShowLocationPicker(false);
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={!customLocation.trim()}
                  onClick={() => {
                    setSelectedLocation(customLocation.trim());
                    setCustomLocation('');
                    setShowLocationPicker(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Tools Toolbar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 -ml-1.5">
              {/* 1. Image / Video */}
              <button
                type="button"
                onClick={handleImageUpload}
                title="Add photo or video"
                className={`p-2 rounded-full hover:bg-blue-500/10 transition-colors ${attachedImage ? 'text-blue-400' : 'text-blue-400'}`}
              >
                <Image />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* 2. GIF */}
              <button
                type="button"
                onClick={() => {
                  setShowGifPicker(!showGifPicker);
                  setShowEmojiPicker(false);
                  setShowPollBuilder(false);
                  setShowScheduleModal(false);
                  setShowLocationPicker(false);
                }}
                title="Add a GIF"
                className={`p-2 rounded-full hover:bg-blue-500/10 transition-colors ${showGifPicker ? 'text-blue-500 bg-blue-500/20' : 'text-blue-400'}`}
              >
                <Gif />
              </button>

              {/* 3. Poll */}
              <button
                type="button"
                onClick={() => {
                  setShowPollBuilder(!showPollBuilder);
                  setShowGifPicker(false);
                  setShowEmojiPicker(false);
                  setShowScheduleModal(false);
                  setShowLocationPicker(false);
                }}
                title="Create a poll"
                className={`p-2 rounded-full hover:bg-blue-500/10 transition-colors ${showPollBuilder ? 'text-blue-500 bg-blue-500/20' : 'text-blue-400'}`}
              >
                <PollIcon />
              </button>

              {/* 4. Emoji */}
              <button
                type="button"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowGifPicker(false);
                  setShowPollBuilder(false);
                  setShowScheduleModal(false);
                  setShowLocationPicker(false);
                }}
                title="Add emoji"
                className={`p-2 rounded-full hover:bg-blue-500/10 transition-colors ${showEmojiPicker ? 'text-blue-500 bg-blue-500/20' : 'text-blue-400'}`}
              >
                <Emoji />
              </button>

              {/* 5. Schedule */}
              <button
                type="button"
                onClick={() => {
                  setShowScheduleModal(!showScheduleModal);
                  setShowGifPicker(false);
                  setShowEmojiPicker(false);
                  setShowPollBuilder(false);
                  setShowLocationPicker(false);
                }}
                title="Schedule post"
                className={`p-2 rounded-full hover:bg-blue-500/10 transition-colors ${showScheduleModal ? 'text-blue-500 bg-blue-500/20' : 'text-blue-400'}`}
              >
                <Schedule />
              </button>

              {/* 6. Location */}
              <button
                type="button"
                onClick={() => {
                  setShowLocationPicker(!showLocationPicker);
                  setShowGifPicker(false);
                  setShowEmojiPicker(false);
                  setShowPollBuilder(false);
                  setShowScheduleModal(false);
                }}
                title="Tag location"
                className={`p-2 rounded-full hover:bg-blue-500/10 transition-colors ${selectedLocation || showLocationPicker ? 'text-blue-500 bg-blue-500/20' : 'text-blue-400'}`}
              >
                <Location />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                  {/* Character counter */}
                  <div className="relative w-6 h-6">
                    <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#333" strokeWidth="2" />
                      <circle
                        cx="12" cy="12" r="10"
                        fill="none"
                        stroke={remaining < 0 ? '#f4212e' : remaining < 20 ? '#ffd400' : '#1d9bf0'}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(progress, 100) * 0.628} 62.8`}
                        className="transition-all duration-200"
                      />
                    </svg>
                  </div>
                  {remaining <= 20 && (
                    <span className={`text-sm ${remaining < 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                      {remaining}
                    </span>
                  )}
                  <div className={`w-px h-6 ${tc.borderLight}`} />
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={(!content.trim() && !attachedImage && !showPollBuilder) || content.length > maxChars}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-full transition-all duration-200 text-[15px] shadow-sm hover:shadow"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
