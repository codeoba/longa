import React, { useState } from 'react';
import { useThemeClasses } from '../themeUtils';

interface Reaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

interface PostReactionsProps {
  postId: string;
  reactions: Reaction[];
  onReact: (postId: string, emoji: string) => void;
}

export default function AdvancedReactions({ postId, reactions, onReact }: PostReactionsProps) {
  const tc = useThemeClasses();
  const [showPicker, setShowPicker] = useState(false);

  const commonReactions = [
    { emoji: '❤️', label: 'Love' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '😂', label: 'Laugh' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '👍', label: 'Like' },
    { emoji: '👏', label: 'Clap' },
    { emoji: '🎉', label: 'Celebrate' },
    { emoji: '💯', label: '100' },
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '💡', label: 'Idea' },
  ];

  return (
    <div className="relative">
      {/* Reactions display */}
      <div className="flex items-center gap-2">
        {reactions.slice(0, 3).map((reaction, index) => (
          <button
            key={index}
            onClick={() => onReact(postId, reaction.emoji)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all ${
              reaction.reacted
                ? 'border-blue-500 bg-blue-500/10'
                : `${tc.border} ${tc.bgCard} hover:bg-gray-500/10`
            }`}
          >
            <span className="text-sm">{reaction.emoji}</span>
            <span className={`text-xs font-bold ${tc.text}`}>{reaction.count}</span>
          </button>
        ))}

        {reactions.length > 3 && (
          <span className={`text-xs ${tc.textSecondary}`}>
            +{reactions.length - 3} more
          </span>
        )}

        {/* Add reaction button */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`p-1.5 rounded-full ${tc.bgHoverSecondary} ${tc.textSecondary} hover:text-blue-500 transition-colors`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Reaction picker */}
      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
          <div className={`absolute bottom-full mb-2 left-0 ${tc.bgModal} rounded-xl border ${tc.border} shadow-xl p-3 z-50`}>
            <div className="grid grid-cols-6 gap-2">
              {commonReactions.map((reaction, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onReact(postId, reaction.emoji);
                    setShowPicker(false);
                  }}
                  className={`p-2 rounded-lg ${tc.bgHoverSecondary} hover:scale-110 transition-transform`}
                  title={reaction.label}
                >
                  <span className="text-2xl">{reaction.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Reactions summary component
export function ReactionsSummary({ reactions }: { reactions: Reaction[] }) {
  const tc = useThemeClasses();
  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);

  if (totalReactions === 0) return null;

  return (
    <div className={`flex items-center gap-2 text-xs ${tc.textSecondary}`}>
      <div className="flex -space-x-1">
        {reactions.slice(0, 3).map((reaction, index) => (
          <span key={index} className="text-sm">{reaction.emoji}</span>
        ))}
      </div>
      <span>{totalReactions} reactions</span>
    </div>
  );
}
