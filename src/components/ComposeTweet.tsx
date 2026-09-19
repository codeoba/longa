import React, { useState, useRef } from 'react';
import { currentUser, emojiList } from '../data';
import { Image, Gif, Emoji, Poll, Schedule, Location, Close, Verified, Premium } from './Icons';
import { useThemeClasses } from '../themeUtils';

interface ComposeTweetProps {
  onClose?: () => void;
  onSubmit: (content: string) => void;
  isModal?: boolean;
}

export default function ComposeTweet({ onClose, onSubmit, isModal = false }: ComposeTweetProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [replyToAudience, setReplyToAudience] = useState<'everyone' | 'followers' | 'mentioned'>('everyone');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 280;
  const remaining = maxChars - content.length;
  const progress = (content.length / maxChars) * 100;
  const tc = useThemeClasses();

  const handleSubmit = () => {
    if (content.trim() && content.length <= maxChars) {
      onSubmit(content);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedImage('https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop');
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
            {currentUser.avatar}
          </div>
        </div>

        {/* Input area */}
        <div className="flex-1">
          {isModal && (
            <div className="flex items-center gap-1 mb-2">
              <span className={`font-bold text-[15px] ${tc.text}`}>{currentUser.name}</span>
              <Verified />
              <Premium />
              <span className="text-gray-500 text-[15px]">{currentUser.handle}</span>
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
