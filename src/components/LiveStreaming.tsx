import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface LiveStream {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  title: string;
  description: string;
  viewers: number;
  isLive: boolean;
  startedAt: Date;
  thumbnail: string;
  tags: string[];
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
}

export default function LiveStreaming() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sample live streams
  const sampleStreams: LiveStream[] = [
    {
      id: '1',
      hostId: '2',
      hostName: 'Zawadi Innovation',
      hostAvatar: '👩‍🔬',
      title: '🚀 AI Demo: Building the Future',
      description: 'Join me for a live demo of our latest AI project!',
      viewers: 234,
      isLive: true,
      startedAt: new Date(Date.now() - 1000 * 60 * 15),
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
      tags: ['AI', 'Tech', 'Demo'],
    },
    {
      id: '2',
      hostId: '3',
      hostName: 'Baraka Digital',
      hostAvatar: '🎨',
      title: '🎨 Live Design Session',
      description: 'Watch me design a mobile app from scratch',
      viewers: 89,
      isLive: true,
      startedAt: new Date(Date.now() - 1000 * 60 * 30),
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
      tags: ['Design', 'UI/UX', 'Tutorial'],
    },
  ];

  useEffect(() => {
    setStreams(sampleStreams);
  }, []);

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      setIsStreaming(true);
      setShowGoLiveModal(false);

      // Simulate viewer count increasing
      const interval = setInterval(() => {
        setStreams(prev => prev.map(s => 
          s.id === 'new' ? { ...s, viewers: s.viewers + Math.floor(Math.random() * 3) } : s
        ));
      }, 5000);

      return () => {
        clearInterval(interval);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setActiveStream(null);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user!.id.toString(),
      userName: user!.name,
      userAvatar: user!.avatar,
      message: newMessage,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const joinStream = (stream: LiveStream) => {
    setActiveStream(stream);
    // Simulate some chat messages
    setChatMessages([
      {
        id: '1',
        userId: '2',
        userName: 'Zawadi Innovation',
        userAvatar: '👩‍🔬',
        message: 'Welcome to the stream! 👋',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
      },
      {
        id: '2',
        userId: '3',
        userName: 'Baraka Digital',
        userAvatar: '🎨',
        message: 'This is amazing! 🔥',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
    ]);
  };

  const formatDuration = (startDate: Date) => {
    const diff = Date.now() - startDate.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (activeStream) {
    return (
      <div className={`min-h-screen ${tc.bg}`}>
        {/* Video Player */}
        <div className="relative bg-black aspect-video">
          {isStreaming ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={activeStream.thumbnail}
              alt={activeStream.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Live badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
            <div className="px-3 py-1 bg-black/60 text-white text-sm rounded flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" />
              </svg>
              {activeStream.viewers}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                {activeStream.hostAvatar}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{activeStream.hostName}</p>
                <p className="text-gray-300 text-xs">{formatDuration(activeStream.startedAt)}</p>
              </div>
            </div>

            {isStreaming ? (
              <button
                onClick={stopStreaming}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-sm"
              >
                End Stream
              </button>
            ) : (
              <button
                onClick={() => setActiveStream(null)}
                className="px-4 py-2 bg-black/60 hover:bg-black/80 text-white font-bold rounded-full text-sm"
              >
                Leave
              </button>
            )}
          </div>
        </div>

        {/* Stream Info */}
        <div className="p-4 border-b border-gray-800">
          <h2 className={`text-xl font-bold ${tc.text} mb-2`}>{activeStream.title}</h2>
          <p className={`text-sm ${tc.textSecondary} mb-3`}>{activeStream.description}</p>
          <div className="flex gap-2">
            {activeStream.tags.map(tag => (
              <span key={tag} className={`px-3 py-1 rounded-full text-xs ${tc.bgTertiary} ${tc.textSecondary}`}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex flex-col h-[calc(100vh-400px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map(msg => (
              <div key={msg.id} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                  {msg.userAvatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${tc.text}`}>{msg.userName}</span>
                    <span className={`text-xs ${tc.textSecondary}`}>
                      {msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-sm ${tc.textSecondary}`}>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className={`p-4 border-t ${tc.border}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Send a message..."
                className={`flex-1 px-4 py-2 rounded-full border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
              />
              <button
                onClick={sendMessage}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text}`}>Live</h1>
          <button
            onClick={() => setShowGoLiveModal(true)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-sm flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Go Live
          </button>
        </div>
      </div>

      {/* Live Streams */}
      <div className="p-4">
        {streams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📡</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No live streams</h3>
            <p className={tc.textSecondary}>Be the first to go live!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {streams.map(stream => (
              <div
                key={stream.id}
                className={`${tc.bgCard} rounded-xl overflow-hidden border ${tc.border} cursor-pointer hover:scale-[1.02] transition-transform`}
                onClick={() => joinStream(stream)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Live badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                    <div className="px-3 py-1 bg-black/60 text-white text-sm rounded flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" />
                      </svg>
                      {stream.viewers}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
                      {stream.hostAvatar}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${tc.text} mb-1`}>{stream.title}</h3>
                      <p className={`text-sm ${tc.textSecondary} mb-2`}>{stream.hostName}</p>
                      <p className={`text-xs ${tc.textSecondary}`}>
                        Live for {formatDuration(stream.startedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Go Live Modal */}
      {showGoLiveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGoLiveModal(false)} />
          <div className={`relative w-full max-w-lg mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>Go Live</h2>

            {/* Stream title */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Stream Title
              </label>
              <input
                type="text"
                placeholder="What's your stream about?"
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Description
              </label>
              <textarea
                placeholder="Tell viewers what to expect..."
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 resize-none`}
                rows={3}
              />
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="tech, tutorial, demo"
                className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
              />
            </div>

            {/* Camera preview */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Camera Preview
              </label>
              <div className={`aspect-video rounded-lg ${tc.bgTertiary} flex items-center justify-center`}>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowGoLiveModal(false)}
                className={`flex-1 py-2.5 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
              >
                Cancel
              </button>
              <button
                onClick={startStreaming}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full flex items-center justify-center gap-2"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Start Streaming
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
