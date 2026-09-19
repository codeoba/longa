import React, { useState } from 'react';
import { messages as initialMessages } from '../data';
import { Search, Settings, Close } from './Icons';
import { useTheme } from '../ThemeContext';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [chatMessages, setChatMessages] = useState<{ text: string; sent: boolean; time: string }[]>([
    { text: 'Hey! Did you see the new AI features?', sent: false, time: '10:30 AM' },
    { text: 'Yes! The code review tool is amazing 🚀', sent: true, time: '10:32 AM' },
    { text: 'We should integrate it into our workflow', sent: false, time: '10:33 AM' },
    { text: 'Absolutely! I\'ll set up a meeting this week', sent: true, time: '10:35 AM' },
  ]);

  const selectedMessage = initialMessages.find(m => m.id === selectedChat);

  const sendMessage = () => {
    if (messageText.trim()) {
      setChatMessages([...chatMessages, {
        text: messageText,
        sent: true,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }]);
      setMessageText('');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Messages</h1>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
              <Search />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
              <Settings />
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="px-4 pb-3">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border border-transparent focus-within:border-blue-500 transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Search />
            <input
              type="text"
              placeholder="Search Direct Messages"
              className={`bg-transparent text-[15px] outline-none flex-1 ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
          </div>
        </div>
      </div>

      {selectedChat ? (
        /* Chat View */
        <div className="flex flex-col h-[calc(100vh-130px)]">
          {/* Chat Header */}
          <div className={`flex items-center gap-3 px-4 py-2 border-b ${isDark ? 'border-gray-800/50' : 'border-gray-200'}`}>
            <button onClick={() => setSelectedChat(null)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
              <Close />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
              {selectedMessage?.user.avatar}
            </div>
            <div>
              <p className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedMessage?.user.name}</p>
              <p className="text-[13px] text-gray-500">{selectedMessage?.user.handle}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] ${
                  msg.sent
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-800 text-white rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-800/50' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <button className={`p-2 rounded-full transition-colors text-blue-400 ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.12 21 5.5v13c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-13z"/>
                </svg>
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Start a new message"
                className={`flex-1 bg-transparent text-[15px] outline-none ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="text-blue-400 font-bold disabled:opacity-50"
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
              className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer border-b ${isDark ? 'hover:bg-gray-900/30 border-gray-800/30' : 'hover:bg-gray-50 border-gray-100'}`}
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
                    <span className={`text-[15px] truncate ${msg.unread ? `font-bold ${isDark ? 'text-white' : 'text-gray-900'}` : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {msg.user.name}
                    </span>
                    <span className="text-gray-500 text-[15px] truncate">{msg.user.handle}</span>
                  </div>
                  <span className="text-[13px] text-gray-500 flex-shrink-0">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-[13px] truncate mt-0.5 ${msg.unread ? `${isDark ? 'text-white' : 'text-gray-900'} font-medium` : 'text-gray-500'}`}>
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
