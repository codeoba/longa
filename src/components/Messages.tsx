import React, { useState, useEffect } from 'react';
import { messages as initialMessages } from '../data';
import { Search, Settings, Close } from './Icons';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';
import { realtime } from '../api/realtime';
import { CallModal } from './CallModal';

export default function Messages() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);
  const [chatMessages, setChatMessages] = useState<{ text: string; sent: boolean; time: string; isWhisper?: boolean }[]>([
    { text: 'Hey! Did you see the new AI features?', sent: false, time: '10:30 AM' },
    { text: 'Yes! The code review tool is amazing 🚀', sent: true, time: '10:32 AM' },
    { text: 'We should integrate it into our workflow', sent: false, time: '10:33 AM' },
    { text: 'Absolutely! I\'ll set up a meeting this week', sent: true, time: '10:35 AM' },
  ]);
  const [isWhisperMode, setIsWhisperMode] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState<'1x' | '1.5x' | '2x'>('1x');
  const [isMediaRevealed, setIsMediaRevealed] = useState(false);
  const tc = useThemeClasses();

  useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = realtime.subscribe(user.id.toString(), {
      onMessage: (newMsg) => {
        setChatMessages(prev => [
          ...prev,
          {
            text: newMsg.content,
            sent: false,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          }
        ]);
      }
    });
    return () => unsubscribe();
  }, [user?.id]);

  const selectedMessage = initialMessages.find(m => m.id === selectedChat);

  const sendMessage = () => {
    if (messageText.trim()) {
      setChatMessages(prev => [...prev, {
        text: messageText,
        sent: true,
        isWhisper: isWhisperMode,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }]);
      setMessageText('');
      if (isWhisperMode) {
        // Auto remove whisper message after 30 seconds
        setTimeout(() => {
          setChatMessages(prev => prev.filter(m => !m.isWhisper));
        }, 30000);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text}`}>Messages</h1>
          <div className="flex items-center gap-1">
            <button className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
              <Search />
            </button>
            <button className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
              <Settings />
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="px-4 pb-3">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border border-transparent focus-within:border-blue-500 transition-colors ${tc.bgInput}`}>
            <Search />
            <input
              type="text"
              placeholder="Search Direct Messages"
              className={`bg-transparent text-[15px] outline-none flex-1 ${tc.text} placeholder-gray-500`}
            />
          </div>
        </div>
      </div>

      {selectedChat ? (
        /* Chat View */
        <div className="flex flex-col h-[calc(100vh-130px)]">
          {/* Chat Header */}
          <div className={`flex items-center gap-3 px-4 py-2 border-b ${tc.border}`}>
            <button onClick={() => setSelectedChat(null)} className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
              <Close />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
              {selectedMessage?.user.avatar}
            </div>
            <div>
              <p className={`font-bold text-[15px] ${tc.text}`}>{selectedMessage?.user.name}</p>
              <p className="text-[13px] text-gray-500">{selectedMessage?.user.handle}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={() => setActiveCall('audio')}
                className={`p-2 rounded-full text-blue-400 hover:bg-blue-500/10 transition`}
                title="Start Encrypted Audio Call"
              >
                📞
              </button>
              <button
                onClick={() => setActiveCall('video')}
                className={`p-2 rounded-full text-blue-400 hover:bg-blue-500/10 transition`}
                title="Start HD Video Call"
              >
                📹
              </button>
            </div>
          </div>

          {activeCall && selectedMessage && (
            <CallModal
              recipient={{
                name: selectedMessage.user.name,
                handle: selectedMessage.user.handle,
                avatar: selectedMessage.user.avatar
              }}
              callType={activeCall}
              onClose={() => setActiveCall(null)}
            />
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sent ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] ${
                  (msg as any).isWhisper
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                    : msg.sent
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : `${tc.bgTertiary} ${tc.text} rounded-bl-sm`
                }`}>
                  {(msg as any).isWhisper && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-orange-200 block mb-0.5">
                      🔥 Whisper Mode • Self-destruct in 30s
                    </span>
                  )}
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Voice Wave Note Sample */}
            <div className="flex flex-col items-start">
              <div className={`p-3.5 rounded-2xl ${tc.bgTertiary} border border-[#38444d]/30 max-w-[85%] w-72`}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <button
                    onClick={() => setIsVoicePlaying(!isVoicePlaying)}
                    className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-sm shadow-md transition transform active:scale-95"
                  >
                    {isVoicePlaying ? '⏸' : '▶'}
                  </button>

                  {/* Audio Waveform Bars */}
                  <div className="flex-1 flex items-center gap-1 h-7">
                    {[30, 60, 95, 40, 70, 100, 80, 50, 90, 65, 35, 85, 45, 75, 55, 30].map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isVoicePlaying ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setVoiceSpeed(prev => prev === '1x' ? '1.5x' : prev === '1.5x' ? '2x' : '1x');
                    }}
                    className="text-[11px] font-bold px-2 py-1 rounded-md bg-[#38444d]/40 text-blue-400 hover:bg-[#38444d]/70 transition"
                  >
                    {voiceSpeed}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                  <span>Voice Note (0:42)</span>
                  <span>10:36 AM</span>
                </div>
              </div>
            </div>

            {/* Frosted Secret Media Sample */}
            <div className="flex flex-col items-start">
              <div className="relative rounded-2xl overflow-hidden border border-[#38444d]/40 max-w-[280px]">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500"
                  alt="Secret media"
                  className={`w-full h-44 object-cover transition duration-300 ${isMediaRevealed ? 'filter-none' : 'blur-xl scale-110'}`}
                />
                {!isMediaRevealed && (
                  <div
                    onClick={() => setIsMediaRevealed(true)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer text-center"
                  >
                    <span className="text-2xl mb-1">🔒</span>
                    <span className="text-xs font-bold text-white">Confidential Media</span>
                    <span className="text-[11px] text-gray-300 mt-1">Tap to decrypt & reveal</span>
                  </div>
                )}
                {isMediaRevealed && (
                  <button
                    onClick={() => setIsMediaRevealed(false)}
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white"
                  >
                    Hide
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${tc.border} ${tc.bg}`}>
            {isWhisperMode && (
              <div className="mb-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-between text-xs text-orange-400">
                <span>🔥 Whisper Mode Active: Message will self-destruct upon reading</span>
                <button onClick={() => setIsWhisperMode(false)} className="hover:underline font-bold">
                  Disable
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsWhisperMode(!isWhisperMode)}
                title="Toggle Whisper Self-Destruct Mode"
                className={`p-2 rounded-full transition ${
                  isWhisperMode
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : `${tc.bgHoverSecondary} text-gray-400 hover:text-orange-400`
                }`}
              >
                🔥
              </button>

              <button className={`p-2 rounded-full transition-colors text-blue-400 ${tc.bgHoverSecondary}`}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.12 21 5.5v13c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-13z"/>
                </svg>
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isWhisperMode ? "Send self-destructing whisper..." : "Start a new message"}
                className={`flex-1 bg-transparent text-[15px] outline-none ${tc.text} placeholder-gray-500`}
              />

              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="text-blue-400 font-bold disabled:opacity-50 px-3 py-1 hover:bg-blue-500/10 rounded-full transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Message List */
        <div>
          {initialMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedChat(msg.id)}
              className={`flex items-center gap-3 px-4 py-3 ${tc.bgHover} transition-colors cursor-pointer border-b ${tc.borderSecondary}`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                  {msg.user.avatar}
                </div>
                {msg.unread && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-black" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className={`text-[15px] truncate ${msg.unread ? `font-bold ${tc.text}` : tc.textSecondary}`}>
                      {msg.user.name}
                    </span>
                    <span className="text-gray-500 text-[15px] truncate">{msg.user.handle}</span>
                  </div>
                  <span className="text-[13px] text-gray-500 flex-shrink-0">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-[13px] truncate mt-0.5 ${msg.unread ? `${tc.text} font-medium` : 'text-gray-500'}`}>
                  {msg.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
