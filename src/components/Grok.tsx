import React, { useState, useRef, useEffect } from 'react';
import { GrokMessage } from '../types';
import { ArrowLeft } from './Icons';
import { useThemeClasses } from '../themeUtils';

export default function Grok() {
  const [messages, setMessages] = useState<GrokMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Grok, your AI assistant. I can help you with questions, generate ideas, analyze data, and much more. What would you like to explore today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tc = useThemeClasses();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const responses = [
      "That's an interesting question! Based on current trends, I'd say the future looks promising in that area. Would you like me to dive deeper into any specific aspect?",
      "Great point! Here's what I think: The key factors to consider are innovation, community engagement, and sustainable growth. Each plays a crucial role in long-term success.",
      "I've analyzed the data and here are my insights: There's a 73% correlation between those variables. The implications are significant for the tech industry.",
      "That's a fascinating topic! Let me break it down: First, we need to understand the fundamentals. Then, we can explore advanced applications and real-world use cases.",
      "Based on my knowledge, here's a comprehensive answer: The technology you're asking about has evolved significantly over the past decade. Key milestones include...",
      "I can help with that! Here's a step-by-step approach: 1) Start with research, 2) Define your goals, 3) Build a prototype, 4) Test and iterate, 5) Scale gradually.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: GrokMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: GrokMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestedPrompts = [
    'Explain quantum computing',
    'Help me write a tweet',
    'Analyze tech trends',
    'Generate code ideas',
  ];

  return (
    <div className={`flex flex-col h-screen ${tc.bg}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center gap-4 px-4 py-3">
          <button className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
            <ArrowLeft />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${tc.text}`}>Grok</h1>
              <p className="text-[13px] text-gray-500">AI Assistant by xAI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white'
                : `${tc.bgTertiary} ${tc.text}`
            }`}>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[11px] mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`rounded-2xl px-4 py-3 ${tc.bgTertiary}`}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className={`text-sm mb-2 ${tc.textTertiary}`}>Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${tc.bgTertiary} ${tc.textSecondary} ${tc.bgHoverSecondary}`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className={`border-t ${tc.border} p-4`}>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Grok anything..."
            className={`flex-1 px-4 py-2.5 rounded-full outline-none ${tc.bgInput} ${tc.text} placeholder-gray-500`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
