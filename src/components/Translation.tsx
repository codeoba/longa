import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

interface TranslationProps {
  text: string;
  sourceLang?: string;
}

export default function Translation({ text, sourceLang = 'Auto-detected' }: TranslationProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleTranslate = () => {
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }
    setIsTranslating(true);
    // Simulate translation
    setTimeout(() => {
      setTranslatedText(`[Translated] ${text.split('').reverse().join('').slice(0, 50)}...`);
      setIsTranslating(false);
      setShowTranslation(true);
    }, 1000);
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleTranslate}
        disabled={isTranslating}
        className={`flex items-center gap-1 text-[13px] text-blue-400 hover:underline disabled:opacity-50`}
      >
        {isTranslating ? (
          <>
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Translating...
          </>
        ) : showTranslation ? (
          'See original'
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>
            Translate from {sourceLang}
          </>
        )}
      </button>
      {showTranslation && (
        <div className={`mt-2 p-3 rounded-lg text-[14px] ${isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          {translatedText}
        </div>
      )}
    </div>
  );
}
