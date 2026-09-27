import React, { useState, useRef, useEffect } from 'react';
import { ReelItem } from '../types';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl, uploadMedia } from '../api/phpAdapter';
import Avatar from './Avatar';

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

  // Create Reel Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [uploadVideoUrl, setUploadVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [audioTrack, setAudioTrack] = useState('');
  const [tags, setTags] = useState<string[]>(['Tech', 'Viral']);
  const [tagInput, setTagInput] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Fetch reels from backend
  const fetchReels = async () => {
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(`${baseUrl}/reels`);
      if (res.ok) {
        const data = await res.json();
        if (data.reels && Array.isArray(data.reels) && data.reels.length > 0) {
          setReels(data.reels);
        }
      }
    } catch {
      // Fallback to sample reels
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const currentReel = reels[currentIndex] || sampleReels[0];

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  // Video File Upload handler
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 30MB
    if (file.size > 30 * 1024 * 1024) {
      alert('Please select a video under 30MB.');
      return;
    }

    setUploadingVideo(true);
    try {
      const res = await uploadMedia(file);
      setUploadVideoUrl(res.url);
      if (!audioTrack) {
        setAudioTrack(`${user?.name || 'Original Audio'} • Sound`);
      }
    } catch (err: any) {
      alert('Failed to upload video: ' + (err.message || 'Please try again'));
    } finally {
      setUploadingVideo(false);
      if (e.target) e.target.value = '';
    }
  };

  // Tag helper
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const removeTag = (tToRemove: string) => {
    setTags(tags.filter(t => t !== tToRemove));
  };

  // Publish Reel
  const handlePublishReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadVideoUrl.trim()) {
      alert('Please upload a video before publishing.');
      return;
    }

    setIsPublishing(true);
    const newReelItem: ReelItem = {
      id: 'reel_' + Date.now(),
      creatorId: user?.id || 'me',
      creatorName: user?.name || 'Creator',
      creatorHandle: user?.handle || '@creator',
      creatorAvatar: user?.avatar || '👤',
      videoUrl: uploadVideoUrl,
      caption: caption || 'New reel on Longa ✨',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      audioTrack: audioTrack || `${user?.name || 'Creator'} • Original Audio`,
      tags: tags.length > 0 ? tags : ['Reel', 'Viral']
    };

    try {
      const baseUrl = getApiUrl();
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      await fetch(`${baseUrl}/reels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newReelItem)
      });
    } catch {
      // Offline fallback
    } finally {
      // Prepend to reels feed & jump to it
      setReels(prev => [newReelItem, ...prev]);
      setCurrentIndex(0);
      setIsPlaying(true);
      setIsPublishing(false);
      setIsCreateModalOpen(false);

      // Reset form
      setUploadVideoUrl('');
      setCaption('');
      setAudioTrack('');

      showToast('🎉 Hongera! Reel yako imechapishwa kikamilifu!');
    }
  };

  return (
    <div className={`relative w-full h-[calc(100vh-60px)] md:h-[calc(100vh-20px)] flex justify-center items-center overflow-hidden ${tc.bg}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-top-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

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

        {/* Top Header Overlay with Create Reel Button */}
        <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600/90 text-white backdrop-blur-md uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Longa Reels
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Create Reel Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCreateModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full font-bold text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 flex items-center gap-1.5 active:scale-95 transition backdrop-blur-md border border-white/20 hover:scale-105"
              title="Create a new Reel"
            >
              <span className="text-sm">📹</span>
              <span>+ Create Reel</span>
            </button>

            {/* Mute / Unmute Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition border border-white/10"
              title="Toggle Audio"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
          {/* Creator Avatar with follow plus */}
          <div
            className="relative mb-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreateModalOpen(true);
            }}
            title="Click here to upload your Reel"
          >
            <Avatar src={currentReel.creatorAvatar} size="md" className="border-2 border-white shadow-lg" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow hover:scale-110 transition">
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
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center text-lg shadow-lg group-hover:bg-black/70">
              💬
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.commentsCount.toLocaleString()}
            </span>
          </button>

          {/* Tip Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTipModal(true);
            }}
            className="flex flex-col items-center gap-1 group active:scale-75 transition transform"
          >
            <div className="w-11 h-11 rounded-full bg-amber-400 text-black flex items-center justify-center text-lg shadow-lg shadow-amber-400/20 group-hover:scale-105">
              ⚡
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              Tip
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(window.location.href);
              showToast('Kiungo cha Reel kimenakiliwa!');
            }}
            className="flex flex-col items-center gap-1 group active:scale-75 transition transform"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center text-lg shadow-lg group-hover:bg-black/70">
              ↗
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.sharesCount}
            </span>
          </button>

          {/* Sound Disc Spinning */}
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
            title="Video Iliyotangulia"
          >
            ▲
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === reels.length - 1}
            className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 shadow-lg transition"
            title="Video Inayofuata"
          >
            ▼
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ================= CREATE REEL MODAL (STUDIO) ============================ */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
          <div className={`w-full max-w-xl my-auto rounded-3xl ${tc.bgModal} border border-[#38444d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]`}>
            
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b border-[#38444d]/50 flex items-center justify-between sticky top-0 ${tc.bgModal} z-10`}>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📹</span>
                <div>
                  <h3 className="font-bold text-base text-white">Create New Reel</h3>
                  <p className="text-[11px] text-gray-400">Upload a 9:16 vertical video for your audience.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePublishReel} className="p-6 overflow-y-auto space-y-5">
              
              {/* Video Upload Area */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  Reel Video (MP4, WebM, MOV) <span className="text-red-400">*</span>
                </label>

                <input
                  type="file"
                  ref={videoFileInputRef}
                  onChange={handleVideoFileChange}
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                />

                {uploadVideoUrl ? (
                  <div className="relative aspect-[9/12] max-h-64 mx-auto rounded-2xl overflow-hidden border border-blue-500/50 bg-black group">
                    <video
                      src={uploadVideoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadVideoUrl('')}
                      className="absolute top-3 right-3 p-1.5 bg-black/80 hover:bg-red-600 rounded-full text-white text-xs transition"
                      title="Remove this video"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#38444d] hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition bg-[#38444d]/10 hover:bg-[#38444d]/20"
                  >
                    {uploadingVideo ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-blue-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent" />
                        <span className="text-xs font-bold">Uploading video...</span>
                      </div>
                    ) : (
                      <div>
                        <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto text-2xl mb-2">
                          📹
                        </div>
                        <p className="text-xs font-bold text-white">Click here to upload a video from your device</p>
                        <p className="text-[11px] text-gray-400 mt-1">Vertical 9:16 format recommended • Up to 30MB</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Or paste link */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] text-gray-400">Or paste direct video URL:</span>
                  </div>
                  <input
                    type="url"
                    placeholder="https://assets.mixkit.co/videos/preview/...mp4"
                    value={uploadVideoUrl}
                    onChange={e => setUploadVideoUrl(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300">Caption</label>
                  <span className="text-[11px] text-gray-500">{caption.length}/280</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={280}
                  placeholder="Write a captivating caption..."
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500 resize-none`}
                />

                {/* Quick Emoji Buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  {['🔥', '🚀', '💻', '✨', '😂', '👏', '❤️'].map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCaption(prev => prev + em)}
                      className="w-7 h-7 rounded-lg bg-[#38444d]/30 hover:bg-[#38444d]/60 flex items-center justify-center text-sm transition"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Track */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Audio Track</label>
                <input
                  type="text"
                  placeholder="e.g. Your Name • Original Audio"
                  value={audioTrack}
                  onChange={e => setAudioTrack(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Hashtags (#)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter tag and press Enter (e.g. Tech, Viral)"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className={`flex-1 px-3.5 py-2 rounded-xl text-xs border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1 border border-blue-500/30">
                      <span>#{t}</span>
                      <button type="button" onClick={() => removeTag(t)} className="hover:text-white">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing || !uploadVideoUrl}
                  className="px-7 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-xl shadow-blue-500/25 active:scale-95 transition flex items-center gap-2"
                >
                  {isPublishing && (
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  )}
                  <span>{isPublishing ? 'Publishing...' : 'Publish Reel Now'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

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
                  <Avatar src={currentReel.creatorAvatar} size="lg" />
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
