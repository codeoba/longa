import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface VideoPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  duration: number;
  likes: number;
  views: number;
  comments: number;
  timestamp: Date;
}

export default function VideoPosts() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [posts, setPosts] = useState<VideoPost[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample video posts
  const samplePosts: VideoPost[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Zawadi Innovation',
      userAvatar: '👩‍🔬',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
      caption: '🚀 Check out our latest AI demo! This is the future of technology.',
      duration: 45,
      likes: 2341,
      views: 89000,
      comments: 189,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      userId: '3',
      userName: 'Baraka Digital',
      userAvatar: '🎨',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
      caption: '🎨 Design tutorial: How to create stunning UI animations',
      duration: 120,
      likes: 1892,
      views: 56000,
      comments: 78,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
  ];

  React.useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('Video must be less than 100MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleUploadComplete(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleUploadComplete = (file: File) => {
    const newPost: VideoPost = {
      id: Date.now().toString(),
      userId: user!.id.toString(),
      userName: user!.name,
      userAvatar: user!.avatar,
      videoUrl: URL.createObjectURL(file),
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
      caption: 'New video post!',
      duration: 30,
      likes: 0,
      views: 0,
      comments: 0,
      timestamp: new Date(),
    };

    setPosts([newPost, ...posts]);
    setUploading(false);
    setShowUploadModal(false);
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
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

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text}`}>Videos</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="p-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No videos yet</h3>
            <p className={tc.textSecondary}>Upload your first video to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`${tc.bgCard} rounded-xl overflow-hidden border ${tc.border} cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => setSelectedVideo(post)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={post.thumbnail}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                    {formatDuration(post.duration)}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                      {post.userAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${tc.text} line-clamp-2`}>
                        {post.caption}
                      </p>
                      <p className={`text-xs ${tc.textSecondary} mt-1`}>
                        {post.userName}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className={`flex items-center gap-3 text-xs ${tc.textSecondary}`}>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {formatNumber(post.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" />
                      </svg>
                      {formatNumber(post.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                      </svg>
                      {formatNumber(post.comments)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !uploading && setShowUploadModal(false)} />
          <div className={`relative w-full max-w-lg mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>Upload Video</h2>

            {!uploading ? (
              <>
                {/* Upload area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed ${tc.border} rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors`}
                >
                  <svg className={`w-16 h-16 mx-auto mb-4 ${tc.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className={`${tc.text} font-bold mb-2`}>Click to upload video</p>
                  <p className={`text-sm ${tc.textSecondary}`}>
                    MP4, WebM, or MOV • Max 100MB • Up to 3 minutes
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Caption */}
                <div className="mt-4">
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Caption
                  </label>
                  <textarea
                    placeholder="Write a caption for your video..."
                    className={`w-full px-4 py-3 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 resize-none`}
                    rows={3}
                    maxLength={280}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className={`flex-1 py-2.5 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
                  >
                    Choose Video
                  </button>
                </div>
              </>
            ) : (
              /* Upload progress */
              <div className="py-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className={`text-lg font-bold ${tc.text}`}>Uploading video...</p>
                  <p className={`text-sm ${tc.textSecondary}`}>Please wait</p>
                </div>

                {/* Progress bar */}
                <div className={`w-full h-2 rounded-full ${tc.bgTertiary} overflow-hidden`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className={`text-center text-sm ${tc.textSecondary} mt-2`}>
                  {uploadProgress}% complete
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Video */}
          <div className="w-full max-w-4xl">
            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              className="w-full rounded-lg"
            />

            {/* Video info */}
            <div className="mt-4 px-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                  {selectedVideo.userAvatar}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold">{selectedVideo.userName}</p>
                  <p className="text-gray-400 text-sm">{selectedVideo.userAvatar}</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm">
                  Follow
                </button>
              </div>

              <p className="text-white text-[15px] mb-3">{selectedVideo.caption}</p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-gray-400 text-sm">
                <button
                  onClick={() => handleLike(selectedVideo.id)}
                  className="flex items-center gap-2 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {formatNumber(selectedVideo.likes)}
                </button>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                  </svg>
                  {formatNumber(selectedVideo.comments)}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" />
                  </svg>
                  {formatNumber(selectedVideo.views)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
