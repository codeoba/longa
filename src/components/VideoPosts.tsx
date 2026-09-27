import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';
import { uploadMedia } from '../api/phpAdapter';

interface VideoComment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  time: string;
}

interface VideoPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  videoUrl: string;
  thumbnail: string;
  title?: string;
  caption: string;
  category?: string;
  duration: number;
  likes: number;
  views: number;
  comments: number;
  timestamp: Date;
  commentList?: VideoComment[];
}

const VIDEO_POSTS_KEY = 'longa_video_posts_v2';

export default function VideoPosts() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  
  const samplePosts: VideoPost[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Zawadi Innovation',
      userAvatar: '👩‍🔬',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=350&fit=crop',
      title: 'AI & Next-Gen Automation 2026',
      caption: '🚀 Watch how our new generative platform streamlines developer workflows.',
      category: 'Technology',
      duration: 45,
      likes: 2341,
      views: 89000,
      comments: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      commentList: [
        { id: 'vc1', userName: 'Baraka Digital', userAvatar: '🎨', text: 'Incredible demo! Super sleek.', time: '10m ago' },
        { id: 'vc2', userName: 'Neema AI', userAvatar: '🤖', text: 'Impressive responsiveness and audio sync.', time: '5m ago' }
      ]
    },
    {
      id: '2',
      userId: '3',
      userName: 'Baraka Digital',
      userAvatar: '🎨',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=350&fit=crop',
      title: 'How to Build Modern High-FPS UI Animations',
      caption: '🎨 Step-by-step masterclass on responsive transitions and micro-interactions.',
      category: 'Tutorials',
      duration: 120,
      likes: 1892,
      views: 56000,
      comments: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      commentList: [
        { id: 'vc3', userName: 'Amani Tech', userAvatar: '👨‍💻', text: 'Thanks for this practical tutorial!', time: '20m ago' }
      ]
    },
  ];

  const [posts, setPosts] = useState<VideoPost[]>(() => {
    try {
      const saved = localStorage.getItem(VIDEO_POSTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp),
        }));
      }
    } catch (e) {
      console.warn('Failed to load video posts:', e);
    }
    return samplePosts;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [videoCategory, setVideoCategory] = useState('Technology');
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null);
  const [detectedDuration, setDetectedDuration] = useState<number>(30);

  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    localStorage.setItem(VIDEO_POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  const categories = ['All', 'Technology', 'Tutorials', 'Music', 'Comedy', 'Gaming', 'Business'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, WebM, MOV)');
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      alert('Video file size must be less than 200MB');
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(localUrl);

    if (!videoTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setVideoTitle(cleanName);
    }
  };

  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadMedia(file);
      setCustomThumbnail(url);
    } catch {
      setCustomThumbnail(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a video file first');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading video to cloud...');

    try {
      let finalVideoUrl = '';
      try {
        finalVideoUrl = await uploadMedia(selectedFile);
      } catch (err) {
        console.warn('Direct upload error, falling back:', err);
        finalVideoUrl = videoPreviewUrl || URL.createObjectURL(selectedFile);
      }

      setUploadStatus('Finalizing video processing...');

      const finalThumb = customThumbnail || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=350&fit=crop';

      const newPost: VideoPost = {
        id: 'vid_' + Date.now(),
        userId: user?.id ? user.id.toString() : 'me',
        userName: user?.name || 'User',
        userAvatar: user?.avatar || '👤',
        videoUrl: finalVideoUrl,
        thumbnail: finalThumb,
        title: videoTitle.trim() || 'New Video',
        caption: videoCaption.trim() || videoTitle.trim(),
        category: videoCategory,
        duration: Math.round(detectedDuration) || 30,
        likes: 0,
        views: 1,
        comments: 0,
        timestamp: new Date(),
        commentList: []
      };

      setPosts([newPost, ...posts]);
      setUploading(false);
      setShowUploadModal(false);

      // Reset
      setSelectedFile(null);
      setVideoPreviewUrl(null);
      setVideoTitle('');
      setVideoCaption('');
      setCustomThumbnail(null);
    } catch (err: any) {
      alert('Error uploading video: ' + (err.message || 'Please try again'));
      setUploading(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ));
    if (selectedVideo && selectedVideo.id === postId) {
      setSelectedVideo(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleOpenVideo = (post: VideoPost) => {
    const updated = { ...post, views: post.views + 1 };
    setPosts(posts.map(p => p.id === post.id ? updated : p));
    setSelectedVideo(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedVideo) return;

    const newComment: VideoComment = {
      id: 'c_' + Date.now(),
      userName: user?.name || 'User',
      userAvatar: user?.avatar || '👤',
      text: newCommentText.trim(),
      time: 'Just now',
    };

    const updatedComments = [newComment, ...(selectedVideo.commentList || [])];
    const updatedVideo: VideoPost = {
      ...selectedVideo,
      comments: (selectedVideo.comments || 0) + 1,
      commentList: updatedComments,
    };

    setSelectedVideo(updatedVideo);
    setPosts(posts.map(p => p.id === selectedVideo.id ? updatedVideo : p));
    setNewCommentText('');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Videos</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
              HD Media
            </span>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>+</span> Upload Video
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : `${tc.bgTertiary} text-gray-400 hover:text-white`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="p-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-lg font-bold mb-2">No videos found in this category</h3>
            <p className={`text-xs ${tc.textSecondary} mb-4`}>Be the first to publish a video here!</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full"
            >
              Upload Video Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`${tc.bgCard} rounded-2xl overflow-hidden border ${tc.border} cursor-pointer hover:border-blue-500/60 transition-all shadow-md group flex flex-col`}
                onClick={() => handleOpenVideo(post)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title || post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[11px] font-mono font-bold rounded">
                    {formatDuration(post.duration)}
                  </div>
                  {/* Category badge */}
                  {post.category && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30">
                      {post.category}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                        {post.userAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold truncate leading-tight">
                          {post.title || post.caption}
                        </h3>
                        <p className={`text-xs ${tc.textSecondary} mt-0.5`}>
                          {post.userName}
                        </p>
                      </div>
                    </div>
                    {post.caption && post.title && (
                      <p className={`text-xs line-clamp-2 ${tc.textSecondary} mb-2`}>
                        {post.caption}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className={`flex items-center gap-4 text-xs ${tc.textSecondary} pt-2 border-t border-gray-800/40`}>
                    <span className="flex items-center gap-1 font-semibold">
                      <span>👁️</span>
                      {formatNumber(post.views)}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <span>❤️</span>
                      {formatNumber(post.likes)}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <span>💬</span>
                      {formatNumber(post.comments)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Video Studio Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => !uploading && setShowUploadModal(false)}
          />
          <div className={`relative w-full max-w-xl ${tc.bgModal} rounded-2xl border ${tc.border} p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <h2 className="text-xl font-black">Video Creator Studio</h2>
              {!uploading && (
                <button
                  onClick={() => setShowUploadModal(false)}
                  className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-gray-400 hover:text-white`}
                >
                  ✕
                </button>
              )}
            </div>

            {!uploading ? (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* File picker */}
                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed ${tc.border} rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors bg-blue-500/5`}
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl">
                      🎥
                    </div>
                    <p className="font-bold text-base mb-1">Click to select video</p>
                    <p className={`text-xs ${tc.textSecondary}`}>
                      MP4, WebM or MOV • Up to 200MB
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-700 p-3 bg-black/40">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-2">
                      <video
                        ref={previewVideoRef}
                        src={videoPreviewUrl || undefined}
                        controls
                        className="w-full h-full object-contain"
                        onLoadedMetadata={(e) => {
                          setDetectedDuration(e.currentTarget.duration || 30);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span className="truncate max-w-xs">{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setVideoPreviewUrl(null);
                        }}
                        className="text-red-400 hover:underline font-bold"
                      >
                        Change Video
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter an engaging video title..."
                    className={`w-full px-4 py-2.5 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-sm outline-none focus:border-blue-500`}
                  />
                </div>

                {/* Category & Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Category
                    </label>
                    <select
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Duration (Seconds)
                    </label>
                    <input
                      type="number"
                      value={Math.round(detectedDuration)}
                      onChange={(e) => setDetectedDuration(Number(e.target.value))}
                      className={`w-full px-3 py-2.5 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none`}
                    />
                  </div>
                </div>

                {/* Caption / Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Description & Hashtags
                  </label>
                  <textarea
                    rows={3}
                    value={videoCaption}
                    onChange={(e) => setVideoCaption(e.target.value)}
                    placeholder="Describe your video, add #tags and credits..."
                    className={`w-full px-4 py-2.5 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none focus:border-blue-500 resize-none`}
                  />
                </div>

                {/* Custom Thumbnail */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Cover Thumbnail (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => thumbInputRef.current?.click()}
                      className={`px-4 py-2 rounded-xl border ${tc.border} ${tc.bgTertiary} text-xs font-bold text-blue-400 hover:border-blue-500`}
                    >
                      📷 Choose Custom Thumbnail
                    </button>
                    {customThumbnail && (
                      <div className="w-12 h-8 rounded border border-gray-700 overflow-hidden">
                        <img src={customThumbnail} alt="thumb" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className={`flex-1 py-2.5 rounded-full border ${tc.border} text-xs font-bold hover:bg-gray-800`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile || !videoTitle.trim()}
                    className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/25"
                  >
                    Upload & Publish Video
                  </button>
                </div>
              </form>
            ) : (
              /* Uploading State */
              <div className="py-12 text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-1">{uploadStatus}</h3>
                <p className={`text-xs ${tc.textSecondary}`}>
                  Please wait while your video is processed and saved...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-20"
          >
            ✕
          </button>

          <div className="w-full max-w-5xl max-h-[92vh] flex flex-col lg:flex-row rounded-2xl overflow-hidden bg-[#101216] border border-gray-800 shadow-2xl">
            {/* Left: Video Player */}
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px]">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Right: Info & Comments */}
            <div className="w-full lg:w-96 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-800 p-4 max-h-[45vh] lg:max-h-none overflow-y-auto">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                  {selectedVideo.userAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{selectedVideo.userName}</p>
                  <p className="text-[11px] text-gray-400">{selectedVideo.category || 'Video'}</p>
                </div>
                <button
                  onClick={() => handleLike(selectedVideo.id)}
                  className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold flex items-center gap-1"
                >
                  <span>❤️</span>
                  <span>{selectedVideo.likes}</span>
                </button>
              </div>

              <div className="my-3">
                <h2 className="text-base font-black text-white leading-snug">
                  {selectedVideo.title || selectedVideo.caption}
                </h2>
                {selectedVideo.caption && selectedVideo.title && (
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {selectedVideo.caption}
                  </p>
                )}
                <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-2">
                  <span>👁️ {formatNumber(selectedVideo.views)} views</span>
                  <span>⏱️ {formatDuration(selectedVideo.duration)}</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 border-t border-gray-800 pt-3 flex flex-col">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Comments ({selectedVideo.comments || 0})
                </h4>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-48 pr-1">
                  {(selectedVideo.commentList || []).length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No comments yet. Be the first!</p>
                  ) : (
                    (selectedVideo.commentList || []).map(c => (
                      <div key={c.id} className="text-xs bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/80">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-300">{c.userAvatar} {c.userName}</span>
                          <span className="text-[10px] text-gray-500">{c.time}</span>
                        </div>
                        <p className="text-gray-200">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="flex gap-2 mt-3 pt-2 border-t border-gray-800">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
