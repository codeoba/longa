import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

interface ContentWarningProps {
  children: React.ReactNode;
  warning: string;
}

export default function ContentWarning({ children, warning }: ContentWarningProps) {
  const [showContent, setShowContent] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (showContent) {
    return <>{children}</>;
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${isDark ? 'border-gray-800/50' : 'border-gray-200'}`}>
      {/* Blurred content behind */}
      <div className="absolute inset-0 blur-xl opacity-30 pointer-events-none">
        {children}
      </div>
      {/* Overlay */}
      <div className={`relative flex flex-col items-center justify-center py-8 px-6 ${isDark ? 'bg-black/80' : 'bg-white/80'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <svg viewBox="0 0 24 24" className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V6h2v7z"/>
          </svg>
        </div>
        <p className={`text-center text-[15px] font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {warning}
        </p>
        <p className="text-center text-[13px] text-gray-500 mb-4">
          This content may be sensitive or disturbing.
        </p>
        <button
          onClick={() => setShowContent(true)}
          className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${
            isDark
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Show content
        </button>
      </div>
    </div>
  );
}
