import React, { useState } from 'react';
import { ArrowLeft } from './Icons';
import { useTheme } from '../ThemeContext';

interface MutedWordsProps {
  mutedWords: string[];
  onAddWord: (word: string) => void;
  onRemoveWord: (word: string) => void;
  onBack: () => void;
}

export default function MutedWords({ mutedWords, onAddWord, onRemoveWord, onBack }: MutedWordsProps) {
  const [newWord, setNewWord] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleAdd = () => {
    if (newWord.trim()) {
      onAddWord(newWord.trim().toLowerCase());
      setNewWord('');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Muted Words</h1>
        </div>
      </div>

      {/* Add new word */}
      <div className={`px-4 py-4 border-b ${isDark ? 'border-gray-800/50' : 'border-gray-200'}`}>
        <p className={`text-[15px] mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          You can mute specific words or phrases. Posts containing these won't appear in your timeline.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a word or phrase"
            className={`flex-1 px-4 py-2.5 rounded-full outline-none ${
              isDark ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
            }`}
          />
          <button
            onClick={handleAdd}
            disabled={!newWord.trim()}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Muted words list */}
      <div className="px-4 py-4">
        <h3 className={`text-lg font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Muted words ({mutedWords.length})
        </h3>
        {mutedWords.length > 0 ? (
          <div className="space-y-2">
            {mutedWords.map((word) => (
              <div
                key={word}
                className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}
              >
                <span className={`text-[15px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{word}</span>
                <button
                  onClick={() => onRemoveWord(word)}
                  className="p-1.5 rounded-full hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-[15px]">No muted words yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
