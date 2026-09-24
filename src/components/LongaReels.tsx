import React, { useState, useRef, useEffect } from 'react';
import { ReelItem } from '../types';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';

export const LongaReels: React.FC = () => {
  const tc = useThemeClasses();
  const { user } = useAuth();

  const sampleReels: ReelItem[] = [
    {
      id: 'reel_1',
      creatorId: 'user_1',
      creatorName: 'Amani Joseph',
      creatorHandle: 'amanitech',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-code-on-a-computer-screen-monitor-32863-large.mp4',
      caption: 'Why building on Longa in 2026 is faster than ever. Zero server setup, native WebRTC, and real-time SSE! 🚀💻',
      likesCount: 1420,
      commentsCount: 184,
      sharesCount: 92,
      audioTrack: 'Amani Tech • Original Audio - Future Synth',
      tags: ['Coding', 'Tech2026', 'LongaDev']
    },
    {
      id: 'reel_2',
      creatorId: 'user_2',
      creatorName: 'Sarah M.',
      creatorHandle: 'sarahdesigns',
      creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphone-with-green-screen-mockup-41551-large.mp4',
      caption: 'Testing the new Longa Creator Store UI on mobile. Glassmorphism + responsive micro-interactions are chef kiss ✨',
      likesCount: 2310,
      commentsCount: 312,
      sharesCount: 140,
      audioTrack: 'Sarah Designs • Chill Lo-Fi Beats',
      tags: ['Design', 'UIUX', 'Figma']
    },
    {
      id: 'reel_3',
      creatorId: 'user_3',
      creatorName: 'Kibo Robotics',
      creatorHandle: 'kiborobotics',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-artificial-intelligence-and-technology-hologram-42998-large.mp4',
      caption: 'Autonomous neural network agents running on the edge. The future of decentralized social networking is here.',
      likesCount: 3840,
      commentsCount: 520,
      sharesCount: 420,
      audioTrack: 'Cyberpunk Soundscapes • Neural Waves',
      tags: ['AI', 'Robotics', 'DeepTech']
    }
  ];

  const [reels, setReels] = useState<ReelItem[]>(sampleReels);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipSuccess, setTipSuccess] = useState(false);
  const [tipAmount, setTipAmount] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: '1', user: 'Zainab J.', text: 'This vertical video layout is so clean! 🔥', time: '5m ago' },
    { id: '2', user: 'Baraka Dev', text: 'Where can I find the GitHub repository for this demo?', time: '12m ago' },
    { id: '3', user: 'Elena R.', text: 'The glassmorphism theme matches the web app perfectly.', time: '20m ago' }
  ]);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentIndex) {
        video.play().catch(() => {});
        video.currentTime = 0;
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDoubleTap = () => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
    setReels(prev =>
      prev.map((r, i) =>
        i === currentIndex
          ? { ...r, isLiked: true, likesCount: r.isLiked ? r.likesCount : r.likesCount + 1 }
          : r
      )
    );
  };

  const toggleLike = () => {
    setReels(prev =>
      prev.map((r, i) =>
        i === currentIndex
          ? { ...r, isLiked: !r.isLiked, likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1 }
          : r
      )
    );
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList(prev => [
      {
        id: 'c_' + Date.now(),
        user: user?.name || 'You',
        text: commentText,
        time: 'Just now'
      },
      ...prev
    ]);
    setReels(prev =>
      prev.map((r, i) => i === currentIndex ? { ...r, commentsCount: r.commentsCount + 1 } : r)
    );
    setCommentText('');
  };

  const handleSendTip = () => {
    setTipSuccess(true);
    setTimeout(() => {
      setTipSuccess(false);
      setShowTipModal(false);
    }, 2000);
  };

  return (
    <div className={`relative w-full h-[calc(100vh-60px)] md:h-[calc(100vh-20px)] flex justify-center items-center overflow-hidden ${tc.bg}`}>
      {/* Video Container - Aspect Ratio 9:16 */}
      <div className="relative w-full max-w-[440px] h-full max-h-[820px] rounded-3xl overflow-hidden bg-black shadow-2xl border border-[#38444d]/40 flex flex-col justify-between">
        
        {/* Active Video */}
        <div
          className="absolute inset-0 cursor-pointer"
          onDoubleClick={handleDoubleTap}
          onClick={() => {
            const v = videoRefs.current[currentIndex];
            if (v) {
              if (v.paused) {
                v.play();
                setIsPlaying(true);
              } else {
                v.pause();
                setIsPlaying(false);
              }
            }
          }}
        >
          <video
            ref={el => { videoRefs.current[currentIndex] = el; }}
            src={currentReel.videoUrl}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white text-3xl">
                ▶
              </div>
            </div>
          )}

          {/* Double Tap Heart Animation */}
          {showHeartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 duration-300 fade-out-90">
              <span className="text-8xl drop-shadow-2xl filter animate-bounce">❤️</span>
            </div>
          )}
        </div>

        {/* Top Header Overlay */}
        <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600/90 text-white backdrop-blur-md uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Longa Reels
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition"
              title="Toggle Audio"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
          {/* Creator Avatar with follow plus */}
          <div className="relative mb-2">
            <img
              src={currentReel.creatorAvatar}
              alt={currentReel.creatorName}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shadow">
              +
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            className="flex flex-col items-center gap-1 group active:scale-75 transition transform"
          >
            <div className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center text-xl shadow-lg transition ${
              currentReel.isLiked ? 'bg-red-500 text-white' : 'bg-black/50 text-white group-hover:bg-black/70'
            }`}>
              {currentReel.isLiked ? '❤️' : '🤍'}
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
            className="flex flex-col items-center gap-1 group active:scale-75 transition transform"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white text-xl group-hover:bg-black/70 shadow-lg">
              💬
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.commentsCount.toLocaleString()}
            </span>
          </button>

          {/* Tip Creator Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTipModal(true);
            }}
            className="flex flex-col items-center gap-1 group active:scale-75 transition transform"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black font-extrabold flex items-center justify-center text-lg shadow-lg shadow-amber-500/30">
              ⚡
            </div>
            <span className="text-[11px] font-bold text-amber-300 drop-shadow">
              Tip
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(window.location.href);
              alert('Reel link copied to clipboard!');
            }}
            className="flex flex-col items-center gap-1 group active:scale-75 transition transform"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white text-xl group-hover:bg-black/70 shadow-lg">
              ↗
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.sharesCount}
            </span>
          </button>

          {/* Spinning Audio Track Vinyl */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 border border-gray-600 flex items-center justify-center animate-spin duration-3000 shadow-lg">
            <span className="text-xs">🎵</span>
          </div>
        </div>

        {/* Bottom Details Overlay */}
        <div className="relative z-20 p-4 pb-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-white text-sm drop-shadow">
              {currentReel.creatorName}
            </span>
            <span className="text-xs text-gray-300">
              @{currentReel.creatorHandle}
            </span>
            <span className="text-blue-400 text-xs">✓</span>
          </div>

          <p className="text-xs text-white/95 line-clamp-3 leading-relaxed mb-3 drop-shadow">
            {currentReel.caption}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {currentReel.tags.map((tag, i) => (
              <span key={i} className="text-[11px] font-semibold text-blue-400">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span>🎵</span>
            <span className="truncate max-w-[240px] text-[11px] font-medium">
              {currentReel.audioTrack}
            </span>
          </div>
        </div>

        {/* Navigation Arrows for Desktop */}
        <div className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 shadow-lg transition"
          >
            ▲
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === reels.length - 1}
            className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 shadow-lg transition"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Tip Creator Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-[#15202b] border border-[#38444d] shadow-2xl text-white relative">
            <button
              onClick={() => setShowTipModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {tipSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-amber-400 text-black rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
                  ⚡
                </div>
                <h3 className="text-xl font-bold">Tip Sent!</h3>
                <p className="text-xs text-gray-300 mt-1">
                  You tipped ${tipAmount} to {currentReel.creatorName}.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={currentReel.creatorAvatar}
                    alt={currentReel.creatorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm">Send Tip to {currentReel.creatorName}</h3>
                    <p className="text-xs text-gray-400">@{currentReel.creatorHandle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[2, 5, 10, 25].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTipAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        tipAmount === amt
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-[#253341] text-gray-300 border-[#38444d] hover:border-amber-400'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSendTip}
                  className="w-full py-3 rounded-full font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-400/20 active:scale-95 transition"
                >
                  Confirm & Send ${tipAmount} Tip
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments Drawer */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
          <div className="w-full max-w-md h-[65vh] rounded-t-3xl md:rounded-3xl p-5 bg-[#15202b] border border-[#38444d] shadow-2xl text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#38444d]/40 mb-3">
                <h3 className="font-bold text-sm">Comments ({commentsList.length})</h3>
                <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto max-h-[42vh] space-y-3 pr-1">
                {commentsList.map(c => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-[#253341]/40 border border-[#38444d]/30">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-blue-400">{c.user}</span>
                      <span className="text-[10px] text-gray-500">{c.time}</span>
                    </div>
                    <p className="text-xs text-gray-200">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendComment} className="pt-3 border-t border-[#38444d]/40 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full text-xs bg-[#253341] border border-[#38444d] text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 rounded-full font-bold text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
