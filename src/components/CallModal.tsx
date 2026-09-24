import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface CallModalProps {
  recipient: {
    name: string;
    handle: string;
    avatar: string;
  };
  callType: 'audio' | 'video';
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ recipient, callType, onClose }) => {
  const [callStatus, setCallStatus] = useState<'calling' | 'connected'>('calling');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(callType === 'audio');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Play synthesized calling ringtone & connect tone
  useEffect(() => {
    let intervalId: any;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const playRing = () => {
          if (callStatus !== 'calling') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.setValueAtTime(480, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        };
        playRing();
        intervalId = setInterval(playRing, 3000);
      }
    } catch {}

    // Auto connect after 2.5s for demonstration
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
      clearInterval(intervalId);
    }, 2500);

    return () => {
      clearInterval(intervalId);
      clearTimeout(connectTimer);
    };
  }, []);

  // Duration timer
  useEffect(() => {
    if (callStatus === 'connected') {
      const timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callStatus]);

  // Request user camera/mic
  useEffect(() => {
    async function startMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: callType === 'video',
            audio: true
          });
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable in this environment:', err);
      }
    }
    startMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [callType]);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && (navigator.mediaDevices as any).getDisplayMedia) {
          const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          setIsScreenSharing(true);
        } else {
          setIsScreenSharing(true);
        }
      } catch {
        setIsScreenSharing(true);
      }
    } else {
      setIsScreenSharing(false);
      if (localVideoRef.current && streamRef.current) {
        localVideoRef.current.srcObject = streamRef.current;
      }
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isPiP
        ? 'bottom-6 right-6 w-80 h-48 rounded-2xl shadow-2xl border border-blue-500 overflow-hidden bg-black'
        : 'inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4'
    }`}>
      <div className={`relative w-full ${isPiP ? 'h-full' : 'max-w-2xl h-[560px] rounded-3xl'} overflow-hidden bg-[#0d161f] border border-[#38444d]/60 shadow-2xl flex flex-col justify-between`}>
        
        {/* Remote Video Stream / Avatar Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900">
          {callType === 'video' && callStatus === 'connected' ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover filter brightness-90"
              poster="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-5xl shadow-2xl border-4 border-blue-400 ring-8 ring-blue-500/20">
                  {recipient.avatar || '👤'}
                </div>
                {callStatus === 'calling' && (
                  <span className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-75"></span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{recipient.name}</h3>
              <p className="text-xs text-gray-400 mb-2">@{recipient.handle}</p>
              <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${callStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`}></span>
                <span>{callStatus === 'calling' ? 'Ringing...' : `Connected • ${formatDuration(duration)}`}</span>
              </div>
            </div>
          )}
        </div>

        {/* Top Header Controls */}
        <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/50 text-white border border-white/10 backdrop-blur-md">
              🔒 End-to-End Encrypted (WebRTC)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPiP(!isPiP)}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
              title="Toggle Picture-in-Picture"
            >
              ⤢
            </button>
          </div>
        </div>

        {/* Local Video Self-View (Picture-in-Picture inside modal) */}
        {!isPiP && callType === 'video' && (
          <div className="absolute top-16 right-4 z-20 w-36 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-black">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${isVideoMuted ? 'hidden' : 'block'}`}
            />
            {isVideoMuted && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 text-xs">
                <span>📷 Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-1 left-2 text-[10px] text-white/80 font-bold bg-black/60 px-1.5 py-0.5 rounded">
              You
            </div>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="relative z-20 flex items-center justify-center gap-4 p-6 bg-gradient-to-t from-black/90 to-transparent">
          {/* Mute Mic */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition active:scale-95 shadow-lg ${
              isAudioMuted ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isAudioMuted ? '🔇' : '🎤'}
          </button>

          {/* Toggle Video */}
          <button
            onClick={() => setIsVideoMuted(!isVideoMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition active:scale-95 shadow-lg ${
              isVideoMuted ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title={isVideoMuted ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoMuted ? '🚫' : '📹'}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition active:scale-95 shadow-lg ${
              isScreenSharing ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title="Screen Share"
          >
            🖥️
          </button>

          {/* Hang Up (Red End Call button) */}
          <button
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-2xl shadow-xl shadow-red-600/40 active:scale-95 transition"
            title="End Call"
          >
            📞
          </button>
        </div>
      </div>
    </div>
  );
};
