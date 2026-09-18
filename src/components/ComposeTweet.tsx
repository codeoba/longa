import React, { useState, useRef } from 'react';
import { currentUser } from '../data';
import { Image, Gif, Emoji, Poll, Schedule, Location, Close, Verified, Premium } from './Icons';

interface ComposeTweetProps {
  onClose?: () => void;
  onSubmit: (content: string) => void;
  isModal?: boolean;
}

export default function ComposeTweet({ onClose, onSubmit, isModal = false }: ComposeTweetProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 280;
  const remaining = maxChars - content.length;
  const progress = (content.length / maxChars) * 100;

  const handleSubmit = () => {
    if (content.trim() && content.length <= maxChars) {
      onSubmit(content);
      setContent('');
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

  return (
    <div className={`${isModal ? '' : 'border-b border-gray-800/50 px-4 py-3'}`}>
      {isModal && (
        <div className="flex items-center justify-between p-3 border-b border-gray-800/50">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
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
              <span className="font-bold text-[15px] text-white">{currentUser.name}</span>
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
            className="w-full bg-transparent text-xl text-white placeholder-gray-600 resize-none outline-none min-h-[52px] max-h-[300px] py-2"
            rows={isModal ? 5 : 2}
          />

          {isFocused && (
            <div className="border-b border-gray-800/50 mb-3 pb-3">
              <button className="text-blue-400 text-sm font-bold flex items-center gap-1 hover:bg-blue-400/10 px-3 py-1.5 rounded-full transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zM9.047 5.9c-.878.468-1.225 1.714-.774 2.774L10.6 14.5c.45 1.06 1.524 1.613 2.402 1.145.878-.468 1.225-1.714.774-2.774l-2.327-5.826c-.45-1.06-1.524-1.613-2.402-1.145z"/>
                </svg>
                Everyone can reply
              </button>
            </div>
          )}

          {/* Tools */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 -ml-2">
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <Image />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <Gif />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <Poll />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
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
                      <circle
                        cx="12" cy="12" r="10"
                        fill="none"
                        stroke="#333"
                        strokeWidth="2"
                      />
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
                  <div className="w-px h-6 bg-gray-700" />
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
