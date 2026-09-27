import React, { useState, useEffect } from 'react';
import { Space, User } from '../types';
import { spaces as initialSpaces, currentUser } from '../data';
import { ArrowLeft } from './Icons';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const SPACES_STORAGE_KEY = 'longa_spaces_v2';
const REMINDERS_STORAGE_KEY = 'longa_space_reminders_v2';

export default function Spaces() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [spaces, setSpaces] = useState<Space[]>(() => {
    try {
      const saved = localStorage.getItem(SPACES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((s: any) => ({
          ...s,
          startedAt: new Date(s.startedAt),
        }));
      }
    } catch (e) {
      console.warn('Failed to load spaces from cache:', e);
    }
    return initialSpaces;
  });

  const [remindedSpaces, setRemindedSpaces] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  // Host Space Modal State
  const [showStartModal, setShowStartModal] = useState(false);
  const [spaceTitle, setSpaceTitle] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [spaceTopic, setSpaceTopic] = useState('Technology & AI');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  // Live Note inside Space
  const [liveNote, setLiveNote] = useState('🔥 Space Highlights:\n- Welcome everyone to today\'s live audio room.\n- Tap the raise hand button if you would like to speak.');
  const [copiedNote, setCopiedNote] = useState(false);

  useEffect(() => {
    localStorage.setItem(SPACES_STORAGE_KEY, JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(remindedSpaces));
  }, [remindedSpaces]);

  const liveSpaces = spaces.filter(s => s.isLive);
  const upcomingSpaces = spaces.filter(s => !s.isLive);

  const joinSpace = (space: Space) => {
    setActiveSpace(space);
  };

  const leaveSpace = () => {
    setActiveSpace(null);
    setHandRaised(false);
  };

  const toggleReminder = (spaceId: string) => {
    setRemindedSpaces(prev =>
      prev.includes(spaceId) ? prev.filter(id => id !== spaceId) : [...prev, spaceId]
    );
  };

  // Web Audio Soundboard Synthesizer
  const playSoundEffect = (type: 'applause' | 'drumroll' | 'chime' | 'celebration') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'chime') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.8);
        });
      } else if (type === 'applause') {
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.8));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === 'drumroll') {
        for (let i = 0; i < 15; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = 90 + Math.random() * 20;
          gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.06);
          osc.stop(ctx.currentTime + i * 0.06 + 0.05);
        }
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.value = 350;
          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        }, 950);
      } else if (type === 'celebration') {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.6);
        });
      }
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  };

  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceTitle.trim()) return;

    const hostUser: User = (user as User) || currentUser;

    const newSpace: Space = {
      id: 'space_' + Date.now(),
      title: spaceTitle.trim(),
      description: spaceDescription.trim() || undefined,
      host: hostUser,
      speakers: [hostUser],
      listeners: isScheduled ? 0 : 1,
      isLive: !isScheduled,
      startedAt: isScheduled && scheduledDateTime ? new Date(scheduledDateTime) : new Date(),
      tags: [spaceTopic],
    };

    setSpaces([newSpace, ...spaces]);
    setShowStartModal(false);

    if (!isScheduled) {
      setActiveSpace(newSpace);
    }

    setSpaceTitle('');
    setSpaceDescription('');
    setIsScheduled(false);
    setScheduledDateTime('');
  };

  const topicOptions = [
    'Technology & AI',
    'Business & Startups',
    'Music & Creative',
    'Sports & Gaming',
    'Education & Science',
    'Crypto & Web3',
  ];

  // Active Live Space View
  if (activeSpace) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pb-16`}>
        {/* Space Header */}
        <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 px-5 py-7 border-b border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={leaveSpace}
              className="px-4 py-1.5 rounded-full bg-black/40 text-white text-xs font-bold hover:bg-black/60 transition-colors border border-white/10"
            >
              ✕ Leave Space
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-2.5 rounded-full transition-transform active:scale-90 text-sm ${
                  handRaised ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'
                }`}
                title="Raise Hand"
              >
                ✋
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-full transition-transform active:scale-90 text-sm ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-green-600 text-white hover:bg-green-700 border border-white/10'
                }`}
                title="Toggle Mic"
              >
                {isMuted ? '🔇 Muted' : '🎤 Live Mic'}
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-2">{activeSpace.title}</h2>
          {activeSpace.description && (
            <p className="text-sm text-purple-200/90 mb-3">{activeSpace.description}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-purple-200">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE AUDIO
            </span>
            <span>·</span>
            <span>{activeSpace.listeners.toLocaleString()} listening</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">WebRTC 48kHz HD</span>
          </div>

          {/* Live Waveform Indicator */}
          <div className="flex items-center gap-1 h-6 mt-4">
            {[40, 75, 95, 60, 30, 85, 100, 70, 50, 90, 80, 45, 65, 95, 35, 80, 60, 90, 75, 40].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-pulse"
                style={{
                  height: `${isMuted ? 8 : h}%`,
                  animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Live Soundboard Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-900/20 via-pink-900/10 to-indigo-900/20 border-b border-[#38444d]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <span>🎛️ Live Soundboard (0ms Latency)</span>
            </span>
            <span className="text-[11px] text-gray-500">Synthesized Web Audio</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => playSoundEffect('applause')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-white border border-purple-500/30 active:scale-95 transition flex items-center gap-1.5"
            >
              <span>👏</span> Applause
            </button>
            <button
              onClick={() => playSoundEffect('drumroll')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 hover:text-white border border-pink-500/30 active:scale-95 transition flex items-center gap-1.5"
            >
              <span>🥁</span> Drumroll
            </button>
            <button
              onClick={() => playSoundEffect('chime')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 hover:text-white border border-amber-500/30 active:scale-95 transition flex items-center gap-1.5"
            >
              <span>🔔</span> Crystal Chime
            </button>
            <button
              onClick={() => playSoundEffect('celebration')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 hover:text-white border border-emerald-500/30 active:scale-95 transition flex items-center gap-1.5"
            >
              <span>🎉</span> Fanfare
            </button>
          </div>
        </div>

        {/* Speakers */}
        <div className="px-5 py-5 border-b border-[#38444d]/30">
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Active Speakers ({activeSpace.speakers.length})
          </h3>
          <div className="flex flex-wrap gap-6">
            {activeSpace.speakers.map(speaker => (
              <div key={speaker.id} className="flex flex-col items-center gap-1.5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl border-2 border-purple-400 ring-4 ring-purple-500/20">
                    {speaker.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-xs">🎤</span>
                  </div>
                </div>
                <span className={`text-xs font-bold text-center max-w-[84px] truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {speaker.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-purple-400 font-semibold">Host / Speaker</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collaborative Live Note Canvas */}
        <div className="px-5 py-5 border-b border-[#38444d]/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1.5`}>
              <span>📝 Live Note Canvas (Collaborative Scratchpad)</span>
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(liveNote);
                setCopiedNote(true);
                setTimeout(() => setCopiedNote(false), 2000);
              }}
              className="text-xs text-blue-400 hover:underline"
            >
              {copiedNote ? '✓ Copied' : 'Copy Notes'}
            </button>
          </div>
          <textarea
            rows={4}
            value={liveNote}
            onChange={e => setLiveNote(e.target.value)}
            className={`w-full p-3 rounded-xl text-xs font-mono border border-[#38444d]/50 ${
              isDark ? 'bg-gray-900/60 text-purple-200' : 'bg-gray-100 text-gray-900'
            } focus:outline-none focus:border-purple-500 transition leading-relaxed`}
          />
        </div>

        {/* Listeners */}
        <div className="px-5 py-5">
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Listeners ({activeSpace.listeners.toLocaleString()})
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm border border-white/5"
              >
                {['👤', '👩', '👨', '🧑', '👱'][i % 5]}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Directory View
  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pb-20`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Spaces</h1>
          </div>
          <button
            onClick={() => setShowStartModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>🎙️</span> Start a Space
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="p-4">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-blue-950/60 border border-purple-500/40 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Live Audio Conversations</h2>
            <p className="text-xs text-purple-200/80 mt-1 max-w-md">
              Speak, debate, and share ideas in real-time with crystal-clear 48kHz audio rooms.
            </p>
          </div>
          <button
            onClick={() => setShowStartModal(true)}
            className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl flex-shrink-0 shadow-md ml-3"
          >
            + Host Space
          </button>
        </div>
      </div>

      {/* Live Spaces */}
      <div className="mb-6">
        <h2 className={`px-4 text-base font-extrabold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          🔴 Live Now
        </h2>

        {liveSpaces.length === 0 ? (
          <div className="mx-4 p-8 text-center rounded-2xl border border-dashed border-gray-800">
            <p className="text-sm text-gray-500">No active Spaces at this moment. Be the first to start one!</p>
          </div>
        ) : (
          liveSpaces.map(space => (
            <div
              key={space.id}
              onClick={() => joinSpace(space)}
              className={`mx-4 mb-3 p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] shadow-lg ${
                isDark
                  ? 'bg-gradient-to-br from-purple-950/40 to-pink-950/30 border-purple-500/30 hover:border-purple-500/60'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      LIVE
                    </span>
                    <span className="text-xs text-gray-400">
                      👥 {space.listeners.toLocaleString()} listening
                    </span>
                    <span className="text-xs text-purple-400 font-semibold">#{space.tags[0] || 'Live'}</span>
                  </div>
                  <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{space.title}</h3>
                  {space.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{space.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-500/20">
                <div className="flex items-center gap-2">
                  {space.speakers.slice(0, 3).map(speaker => (
                    <div
                      key={speaker.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm border-2 border-black"
                    >
                      {speaker.avatar}
                    </div>
                  ))}
                  <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Hosted by {space.host.name}
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-500 text-white font-bold text-xs">
                  Listen Now →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upcoming Spaces */}
      <div>
        <h2 className={`px-4 text-base font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ⏰ Scheduled Spaces
        </h2>

        {upcomingSpaces.length === 0 ? (
          <div className="mx-4 p-8 text-center rounded-2xl border border-dashed border-gray-800">
            <p className="text-sm text-gray-500">No scheduled Spaces found.</p>
          </div>
        ) : (
          upcomingSpaces.map(space => {
            const hasReminder = remindedSpaces.includes(space.id);
            return (
              <div
                key={space.id}
                className={`mx-4 mb-3 p-4 rounded-2xl border ${
                  isDark ? 'border-gray-800 bg-gray-900/40' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs text-purple-400 font-semibold">
                  <span>📅 {new Date(space.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>·</span>
                  <span>#{space.tags[0] || 'Event'}</span>
                </div>
                <h3 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{space.title}</h3>
                {space.description && (
                  <p className="text-xs text-gray-400 mb-2">{space.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs">
                      {space.host.avatar}
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Hosted by {space.host.name}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleReminder(space.id)}
                    className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
                      hasReminder
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    }`}
                  >
                    {hasReminder ? '🔔 Reminder Set' : '🔔 Set Reminder'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Start Space Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowStartModal(false)} />
          <div className={`relative w-full max-w-lg ${isDark ? 'bg-[#15181c] text-white' : 'bg-white text-gray-900'} rounded-2xl border ${isDark ? 'border-gray-800' : 'border-gray-200'} p-6 shadow-2xl`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <h2 className="text-xl font-black">🎙️ Start a Space</h2>
              <button
                onClick={() => setShowStartModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSpace} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Space Title *
                </label>
                <input
                  type="text"
                  required
                  value={spaceTitle}
                  onChange={e => setSpaceTitle(e.target.value)}
                  placeholder="e.g. Next-Gen AI & Tech Ecosystem 2026"
                  className={`w-full px-4 py-2.5 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-300 bg-gray-50 text-black'} text-sm outline-none focus:border-purple-500`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={spaceDescription}
                  onChange={e => setSpaceDescription(e.target.value)}
                  placeholder="What will you discuss? Who should join?..."
                  className={`w-full px-4 py-2.5 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-300 bg-gray-50 text-black'} text-sm outline-none focus:border-purple-500 resize-none`}
                />
              </div>

              {/* Topic Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {topicOptions.map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setSpaceTopic(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        spaceTopic === t
                          ? 'bg-purple-600 text-white font-bold'
                          : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Now vs Schedule */}
              <div className="pt-2 border-t border-gray-800">
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                    <input
                      type="radio"
                      name="scheduleMode"
                      checked={!isScheduled}
                      onChange={() => setIsScheduled(false)}
                      className="accent-purple-500"
                    />
                    <span>🔴 Start Live Now</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                    <input
                      type="radio"
                      name="scheduleMode"
                      checked={isScheduled}
                      onChange={() => setIsScheduled(true)}
                      className="accent-purple-500"
                    />
                    <span>⏰ Schedule for Later</span>
                  </label>
                </div>

                {isScheduled && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={scheduledDateTime}
                      onChange={e => setScheduledDateTime(e.target.value)}
                      className={`w-full px-4 py-2 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-300 bg-gray-50 text-black'} text-xs outline-none`}
                    />
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowStartModal(false)}
                  className={`flex-1 py-2.5 rounded-full border ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'} text-sm font-bold`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!spaceTitle.trim() || (isScheduled && !scheduledDateTime)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 text-white font-bold text-sm rounded-full shadow-lg shadow-purple-500/30 transition-all"
                >
                  {isScheduled ? 'Schedule Space' : 'Go Live Now 🎙️'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
