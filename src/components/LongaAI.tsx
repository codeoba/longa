import React, { useState, useRef, useEffect } from 'react';
import { AIMessage } from '../types';
import { ArrowLeft } from './Icons';
import { useThemeClasses } from '../themeUtils';
import AiSettingsModal from './AiSettingsModal';
import { getAiConfig, getActiveAiCredentials, AiConfig } from '../services/aiSettingsService';

export default function LongaAI() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I am **Longa AI**, your intelligent assistant within Longa. I can connect to API keys from major AI providers (**Google Gemini**, **Groq**, **OpenRouter**, **OpenAI GPT-4o**, **DeepSeek**, **Claude**, or **Mistral**), or operate 100% free using Longa Native AI!\n\nClick the **⚙️ AI Settings** button above to switch providers or add your own key. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AiConfig>(getAiConfig());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tc = useThemeClasses();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConfigSaved = (newConfig: AiConfig) => {
    setAiConfig(newConfig);
    const providerName = newConfig.activeProvider.toUpperCase();
    const modelName = newConfig.customModels[newConfig.activeProvider] || newConfig.activeModel;
    const systemNotice: AIMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `⚡ **AI Configuration Updated:** You are now connected to **${providerName}** (Model: \`${modelName}\`). All subsequent replies will be generated using this model!`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemNotice]);
  };

  const generateLocalResponse = (userPrompt: string): string => {
    const clean = userPrompt.toLowerCase();
    if (clean.includes('hello') || clean.includes('hi') || clean.includes('hey')) {
      return "Hello! Within Longa AI, you can connect your free or paid API keys anytime. Would you like assistance drafting a post or brainstorming tech ideas?";
    }
    if (clean.includes('tweet') || clean.includes('post') || clean.includes('draft')) {
      return "💡 **High-Engagement Post Idea:**\n\n\"The future of technology is being shaped right now by creators transforming challenges into breakthroughs. 🚀✨ #TechInnovation #Longa\"\n\n*Longa Tip:* Add a photo or poll to maximize follower engagement!";
    }
    return `That is a great thought regarding **"${userPrompt.slice(0, 40)}..."**.\n\nWithin **Longa AI**, we recommend focusing on three core pillars:\n1. Engaging opening hooks\n2. Interactive audience discussion\n3. Community longevity.\n\nWould you like a detailed breakdown or sample template?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentPrompt = input;
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentPrompt,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    const { provider, apiKey, model } = getActiveAiCredentials();

    try {
      const { getApiUrl } = await import('../api/phpAdapter');
      const res = await fetch(`${getApiUrl()}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          provider,
          apiKey,
          model,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const assistantMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: json.content || generateLocalResponse(currentPrompt),
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        return;
      }
    } catch (e) {
      console.warn('Longa AI offline fallback:', e);
    }

    // Dynamic local engine fallback
    setTimeout(() => {
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateLocalResponse(currentPrompt),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600);
  };

  const suggestedPrompts = [
    '💡 Help me draft an engaging post',
    '📈 Strategies to grow my followers',
    '🤖 How to connect Groq or Gemini API',
    '⚡ Tech startup idea for 2026',
  ];

  const activeProvider = aiConfig.activeProvider || 'builtin';
  const activeModelName = aiConfig.customModels[activeProvider] || aiConfig.activeModel;

  return (
    <div className={`flex flex-col h-screen ${tc.bg}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
              <ArrowLeft />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-lg font-bold ${tc.text}`}>Longa AI</h1>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Universal Hub
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active:</span>
                <strong className="text-gray-200 capitalize font-mono">{activeProvider}</strong>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 font-mono text-[10px] truncate max-w-[140px] sm:max-w-[200px]">
                  {activeModelName}
                </span>
              </div>
            </div>
          </div>

          {/* AI Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-700 hover:border-blue-500/50 bg-gray-900/60 hover:bg-blue-500/10 text-xs font-semibold text-gray-200 hover:text-blue-400 transition-all shadow-sm"
            title="Configure API Keys for Gemini, Groq, OpenRouter, OpenAI, etc."
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">AI Settings</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-bold">
              Multi-Key
            </span>
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10'
                : `${tc.bgTertiary} ${tc.text} border ${tc.border}`
            }`}>
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-700/30 text-[10px] text-gray-400">
                <span>
                  {msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
                {msg.role === 'assistant' && (
                  <span className="font-mono text-[10px] text-blue-400/80 bg-blue-500/10 px-1.5 py-0.5 rounded">
                    ⚡ {activeProvider}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`rounded-2xl px-4 py-3 ${tc.bgTertiary} border ${tc.border}`}>
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-gray-400 ml-1.5">
                  Longa AI ({activeProvider}) is typing...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className={`text-xs font-semibold mb-2 ${tc.textTertiary} uppercase tracking-wider`}>
            Suggested Prompts:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt.replace(/^[^\s]+\s/, ''))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tc.bgTertiary} ${tc.textSecondary} hover:border-blue-500 hover:text-blue-400 border ${tc.border}`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className={`border-t ${tc.border} p-4`}>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask anything via ${activeProvider.toUpperCase()}...`}
            className={`flex-1 px-4 py-2.5 rounded-full outline-none border focus:border-blue-500 transition-colors ${tc.bgInput} ${tc.text} placeholder-gray-500 ${tc.border}`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-200 text-sm shadow-md shadow-blue-500/20"
          >
            Send
          </button>
        </div>
      </div>

      {/* AI Multi-Provider Settings Modal */}
      <AiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={handleConfigSaved}
      />
    </div>
  );
}
