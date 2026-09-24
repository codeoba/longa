import React, { useState } from 'react';
import { Space } from '../types';
import { spaces as initialSpaces } from '../data';
import { ArrowLeft, Verified } from './Icons';
import { useTheme } from '../ThemeContext';

export default function Spaces() {
  const [spaces, setSpaces] = useState(initialSpaces);
  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const liveSpaces = spaces.filter(s => s.isLive);
  const upcomingSpaces = spaces.filter(s => !s.isLive);

  const joinSpace = (space: Space) => {
    setActiveSpace(space);
  };

  const leaveSpace = () => {
    setActiveSpace(null);
    setHandRaised(false);
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
        // Final crash
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

  const [liveNote, setLiveNote] = useState('🔥 Main takeaways:\n- Scalable architecture in 2026 demands reactive state sync.\n- Longa AI composer boosts engagement by 3.4x.');
  const [copiedNote, setCopiedNote] = useState(false);

  if (activeSpace) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pb-12`}>
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
                className={`p-2.5 rounded-full transition-transform active:scale-90 text-sm ${handRaised ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}
                title="Raise Hand"
              >
                ✋
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-full transition-transform active:scale-90 text-sm ${isMuted ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}
                title="Toggle Mic"
              >
                {isMuted ? '🔇' : '🎤'}
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{activeSpace.title}</h2>
          <div className="flex items-center gap-3 text-xs text-purple-200">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE AUDIO
            </span>
            <span>·</span>
            <span>{activeSpace.listeners.toLocaleString()} listening</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">HD WebRTC 48kHz</span>
          </div>

          {/* Live Waveform Indicator */}
          <div className="flex items-center gap-1 h-6 mt-4">
            {[40, 75, 95, 60, 30, 85, 100, 70, 50, 90, 80, 45, 65, 95, 35, 80, 60, 90, 75, 40].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-pulse"
                style={{
                  height: `${isMuted ? 8 : h}%`,
                  animationDuration: `${0.4 + (i % 5) * 0.15}s`
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
          <p className="text-xs text-gray-500 mb-2">Speakers & listeners can sync key ideas and links live during this Space.</p>
          <textarea
            rows={4}
            value={liveNote}
            onChange={e => setLiveNote(e.target.value)}
            className={`w-full p-3 rounded-xl text-xs font-mono border border-[#38444d]/50 ${isDark ? 'bg-gray-900/60 text-purple-200' : 'bg-gray-100 text-gray-900'} focus:outline-none focus:border-purple-500 transition leading-relaxed`}
          />
        </div>

        {/* Listeners */}
        <div className="px-5 py-5">
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Listeners ({activeSpace.listeners.toLocaleString()})
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm border border-white/5">
                {['👤', '👩', '👨', '🧑', '👱'][i % 5]}
              </div>
            ))}
            {activeSpace.listeners > 18 && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-gray-800 text-purple-300' : 'bg-gray-200 text-gray-600'}`}>
                +{activeSpace.listeners - 18}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Spaces</h1>
        </div>
      </div>

      {/* Start Space Button */}
      <div className="px-4 py-4">
        <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full transition-colors flex items-center justify-center gap-2">
          <span>🎙️</span>
          Start a Space
        </button>
      </div>

      {/* Live Spaces */}
      {liveSpaces.length > 0 && (
        <div className="mb-4">
          <h2 className={`px-4 text-lg font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🔴 Live now
          </h2>
          {liveSpaces.map(space => (
            <div
              key={space.id}
              onClick={() => joinSpace(space)}
              className={`mx-4 mb-2 p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                isDark
                  ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 hover:border-purple-500/50'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      LIVE
                    </span>
                    <span className="text-xs text-gray-500">{space.listeners.toLocaleString()} listening</span>
                  </div>
                  <h3 className={`font-bold text-[17px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{space.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {space.speakers.slice(0, 3).map(speaker => (
                  <div key={speaker.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm border-2 border-black">
                    {speaker.avatar}
                  </div>
                ))}
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {space.speakers.map(s => s.name.split(' ')[0]).join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Spaces */}
      {upcomingSpaces.length > 0 && (
        <div>
          <h2 className={`px-4 text-lg font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ⏰ Upcoming
          </h2>
          {upcomingSpaces.map(space => (
            <div
              key={space.id}
              className={`mx-4 mb-2 p-4 rounded-2xl border ${isDark ? 'border-gray-800/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500">
                  Started {Math.floor((Date.now() - space.startedAt.getTime()) / 3600000)}h ago
                </span>
              </div>
              <h3 className={`font-bold text-[17px] mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{space.title}</h3>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                  {space.host.avatar}
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Hosted by {space.host.name}
                </span>
              </div>
              <button className="mt-3 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm hover:bg-purple-500/30 transition-colors">
                Set Reminder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
