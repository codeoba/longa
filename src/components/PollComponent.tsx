import React, { useState } from 'react';
import { Poll as PollType } from '../types';
import { useTheme } from '../ThemeContext';

interface PollProps {
  poll: PollType;
  onVote: (pollId: string, optionId: string) => void;
}

export default function PollComponent({ poll, onVote }: PollProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const timeLeft = () => {
    const diff = poll.endsAt.getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h left`;
    return `${minutes}m left`;
  };

  const handleVote = (optionId: string) => {
    if (poll.hasVoted) return;
    setSelectedOption(optionId);
    onVote(poll.id, optionId);
  };

  return (
    <div className={`mt-3 rounded-2xl border overflow-hidden ${isDark ? 'border-gray-800/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
      <p className={`px-4 pt-3 pb-2 font-bold text-[15px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{poll.question}</p>
      <div className="px-4 pb-3 space-y-2">
        {poll.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={poll.hasVoted}
            className={`w-full relative rounded-lg overflow-hidden transition-all ${
              poll.hasVoted
                ? 'cursor-default'
                : `${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'} cursor-pointer`
            } ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}
          >
            {/* Progress bar background */}
            {poll.hasVoted && (
              <div
                className={`absolute inset-0 ${option.voted ? 'bg-blue-500/20' : isDark ? 'bg-gray-700/50' : 'bg-gray-200'} transition-all duration-500`}
                style={{ width: `${option.percentage}%` }}
              />
            )}
            <div className="relative flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                {!poll.hasVoted && (
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : isDark ? 'border-gray-500' : 'border-gray-400'
                  }`} />
                )}
                <span className={`text-[15px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{option.text}</span>
                {option.voted && poll.hasVoted && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400" fill="currentColor">
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/>
                  </svg>
                )}
              </div>
              {poll.hasVoted && (
                <span className={`text-sm font-bold ${option.voted ? 'text-blue-400' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {option.percentage}%
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className={`px-4 pb-3 text-[13px] text-gray-500 flex items-center gap-2`}>
        <span>{poll.totalVotes.toLocaleString()} votes</span>
        <span>·</span>
        <span>{timeLeft()}</span>
      </div>
    </div>
  );
}
