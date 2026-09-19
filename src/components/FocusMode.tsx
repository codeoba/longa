import React, { useState, useEffect } from 'react';
import { useThemeClasses } from '../themeUtils';

interface FocusModeProps {
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: Date;
  onClose: () => void;
}

export default function FocusMode({ content, author, authorAvatar, timestamp, onClose }: FocusModeProps) {
  const tc = useThemeClasses();
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  // Calculate reading time (average 200 words per minute)
  useEffect(() => {
    const words = content.split(/\s+/).length;
    const time = Math.ceil(words / 200);
    setEstimatedTime(time);
  }, [content]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed inset-0 z-[200] ${tc.bg} overflow-y-auto`}>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className={`sticky top-0 z-40 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${tc.bgHoverSecondary}`}
            >
              <svg className={`w-5 h-5 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <p className={`text-sm font-bold ${tc.text}`}>Focus Mode</p>
              <p className={`text-xs ${tc.textSecondary}`}>{estimatedTime} min read</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Font size */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className={`p-1.5 rounded ${tc.bgHoverSecondary}`}
                title="Decrease font size"
              >
                <svg className={`w-4 h-4 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className={`text-xs ${tc.textSecondary} w-8 text-center`}>{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                className={`p-1.5 rounded ${tc.bgHoverSecondary}`}
                title="Increase font size"
              >
                <svg className={`w-4 h-4 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Line height */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.2))}
                className={`p-1.5 rounded ${tc.bgHoverSecondary}`}
                title="Decrease line height"
              >
                <svg className={`w-4 h-4 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </button>
              <button
                onClick={() => setLineHeight(Math.min(2.4, lineHeight + 0.2))}
                className={`p-1.5 rounded ${tc.bgHoverSecondary}`}
                title="Increase line height"
              >
                <svg className={`w-4 h-4 ${tc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
            {authorAvatar}
          </div>
          <div>
            <p className={`font-bold ${tc.text}`}>{author}</p>
            <p className={`text-sm ${tc.textSecondary}`}>
              {timestamp.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Article content */}
        <article
          className={`${tc.text} leading-relaxed`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))}
        </article>

        {/* End of article */}
        <div className={`mt-12 pt-8 border-t ${tc.border} text-center`}>
          <p className={`text-sm ${tc.textSecondary} mb-4`}>
            You've reached the end of this article
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
          >
            Back to Feed
          </button>
        </div>
      </div>

      {/* Reading progress indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`${tc.bgCard} rounded-full px-4 py-2 border ${tc.border} shadow-lg`}>
          <p className={`text-xs font-bold ${tc.text}`}>
            {Math.round(readingProgress)}%
          </p>
        </div>
      </div>
    </div>
  );
}

// Focus Mode Button Component
export function FocusModeButton({ onClick }: { onClick: () => void }) {
  const tc = useThemeClasses();
  
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full ${tc.bgHoverSecondary} ${tc.textSecondary} hover:text-blue-500 transition-colors`}
      title="Focus Mode"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
  );
}
