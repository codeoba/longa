import React, { useState, useRef } from 'react';
import { currentUser, emojiList } from '../data';
import { Image, Gif, Emoji, Poll, Schedule, Location, Close, Verified, Premium } from './Icons';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';

interface ComposeTweetProps {
  onClose?: () => void;
  onSubmit: (content: string, image?: string) => void;
  isModal?: boolean;
}

export default function ComposeTweet({ onClose, onSubmit, isModal = false }: ComposeTweetProps) {
  const { user } = useAuth();
  const activeUser = user || currentUser;
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
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

  const handleSubmit = () => {
    if (content.trim() && content.length <= maxChars) {
      onSubmit(content, attachedImage || undefined);
      setContent('');
      setAttachedImage(null);
      if (onClose) onClose();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Instant local preview
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAttachedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // 2. Real server upload via API
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

  return (
    <div className={`${isModal ? '' : `px-4 py-3 border-b ${tc.border}`}`}>
      {isModal && (
        <div className={`flex items-center justify-between p-3 border-b ${tc.border}`}>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
            <Close />
          </button>
          <button className="text-blue-400 font-bold text-sm px-4 py-1.5 rounded-full border border-blue-400/30 hover:bg-blue-400/10 transition-colors">
            Drafts
          </button>
        </div>
      )}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
            {activeUser.avatar || '👤'}
          </div>
        </div>

        {/* Input area */}
        <div className="flex-1">
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
            placeholder="What is happening?!"
            className={`w-full bg-transparent text-xl resize-none outline-none min-h-[52px] max-h-[300px] py-2 ${tc.text} placeholder-gray-500`}
            rows={isModal ? 5 : 2}
          />

          {/* Attached Image */}
          {attachedImage && (
            <div className={`relative mt-2 rounded-2xl overflow-hidden border ${tc.border}`}>
              <img src={attachedImage} alt="Attached" className="w-full max-h-[300px] object-cover" />
              <button
                onClick={() => setAttachedImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black transition-colors"
              >
                <Close />
              </button>
            </div>
          )}

          {/* Longa AI Smart Composer Suite */}
          <div className="flex flex-wrap items-center gap-1.5 my-2.5 p-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-blue-500/20">
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

          {isFocused && (
            <div className={`border-b ${tc.borderSecondary} mb-3 pb-3`}>
              <button
                onClick={() => setReplyToAudience(replyToAudience === 'everyone' ? 'followers' : replyToAudience === 'followers' ? 'mentioned' : 'everyone')}
                className="text-blue-400 text-sm font-bold flex items-center gap-1 hover:bg-blue-400/10 px-3 py-1.5 rounded-full transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5z"/>
                </svg>
                {replyToAudience === 'everyone' && 'Everyone can reply'}
                {replyToAudience === 'followers' && 'Followers only'}
                {replyToAudience === 'mentioned' && 'Only people you mention'}
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className={`mb-3 p-3 ${tc.bgSecondary} rounded-xl border ${tc.border}`}>
              <div className="grid grid-cols-10 gap-1">
                {emojiList.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => handleEmojiSelect(emoji)}
                    className={`p-1.5 ${tc.bgHoverSecondary} rounded transition-colors text-xl`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 -ml-2">
              <button onClick={handleImageUpload} className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <Image />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <Gif />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <Poll />
              </button>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 rounded-full hover:bg-blue-500/10 transition-colors ${showEmojiPicker ? 'text-blue-400' : ''}`}>
                <Emoji />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <Schedule />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
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
                disabled={!content.trim() || content.length > maxChars}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-full transition-all duration-200 text-[15px]"
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
