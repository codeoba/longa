import React, { useState, useEffect } from 'react';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';

interface NearbyPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  distance: number; // in km
  location: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

const NEARBY_POSTS_KEY = 'longa_nearby_posts_v2';

const samplePosts: NearbyPost[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Zawadi Innovation',
    userAvatar: '👩‍🔬',
    content: '🚀 Welcome to our new tech and design workspace! Open house this entire week with live coding sessions.',
    distance: 2.3,
    location: 'Innovation District, Downtown',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    likes: 234,
    comments: 45,
  },
  {
    id: '2',
    userId: '3',
    userName: 'Baraka Digital',
    userAvatar: '🎨',
    content: '🎨 Free product design meetup this Saturday at the creative hub. RSVP open!',
    distance: 5.7,
    location: 'Central Plaza',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    likes: 189,
    comments: 23,
  },
  {
    id: '3',
    userId: '4',
    userName: 'Neema AI',
    userAvatar: '🤖',
    content: '🤖 Looking for software engineers and ML practitioners in the area for a high-impact startup launch.',
    distance: 8.1,
    location: 'Westside Tech Park',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    likes: 567,
    comments: 89,
  },
];

export default function LocationBasedFeatures() {
  const tc = useThemeClasses();
  const { user } = useAuth();

  const [locationEnabled, setLocationEnabled] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>({
    lat: -6.7924,
    lng: 39.2083,
  });

  const [nearbyPosts, setNearbyPosts] = useState<NearbyPost[]>(() => {
    try {
      const saved = localStorage.getItem(NEARBY_POSTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp),
        }));
      }
    } catch (e) {
      console.warn('Failed to load nearby posts:', e);
    }
    return samplePosts;
  });

  const [radius, setRadius] = useState(15); // km
  const [loading, setLoading] = useState(false);

  // Share Nearby Post Modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postLocationName, setPostLocationName] = useState('Central District');

  useEffect(() => {
    localStorage.setItem(NEARBY_POSTS_KEY, JSON.stringify(nearbyPosts));
  }, [nearbyPosts]);

  const enableLocation = async () => {
    setLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationEnabled(true);
            setLoading(false);
          },
          () => {
            setCurrentLocation({ lat: -6.7924, lng: 39.2083 });
            setLocationEnabled(true);
            setLoading(false);
          }
        );
      } else {
        setLocationEnabled(true);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  const disableLocation = () => {
    setLocationEnabled(false);
  };

  const handleShareNearbyPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost: NearbyPost = {
      id: 'np_' + Date.now(),
      userId: user?.id ? user.id.toString() : 'me',
      userName: user?.name || 'User',
      userAvatar: user?.avatar || '👤',
      content: postContent.trim(),
      distance: 0.1,
      location: postLocationName.trim() || 'Right Here (Nearby)',
      timestamp: new Date(),
      likes: 1,
      comments: 0,
    };

    setNearbyPosts([newPost, ...nearbyPosts]);
    setPostContent('');
    setShowShareModal(false);
  };

  const handleLike = (id: string) => {
    setNearbyPosts(nearbyPosts.map(p =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m away`;
    }
    return `${km.toFixed(1)}km away`;
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!locationEnabled) {
    return (
      <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
        {/* Header */}
        <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold">Nearby</h1>
            <p className={`text-xs ${tc.textSecondary}`}>Discover posts and creators in your immediate vicinity</p>
          </div>
        </div>

        {/* Enable Location */}
        <div className="p-4">
          <div className={`${tc.bgCard} rounded-2xl p-8 border ${tc.border} text-center shadow-lg`}>
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-lg font-bold mb-2">Enable Location Access</h3>
            <p className={`text-xs ${tc.textSecondary} mb-6 max-w-sm mx-auto`}>
              Allow approximate location to explore happenings, events, and community updates near you.
            </p>
            <button
              onClick={enableLocation}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full text-xs flex items-center gap-2 mx-auto shadow-lg shadow-blue-500/25"
            >
              {loading ? 'Detecting Location...' : 'Enable Location'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold">Nearby</h1>
            <p className={`text-xs ${tc.textSecondary}`}>
              Showing posts within {radius}km radius
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full shadow-md"
            >
              + Post Check-in
            </button>
            <button
              onClick={disableLocation}
              className={`px-3 py-1.5 rounded-full text-xs ${tc.bgTertiary} ${tc.textSecondary} hover:text-white`}
            >
              Disable
            </button>
          </div>
        </div>

        {/* Radius slider */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <span className={`text-xs ${tc.textSecondary}`}>1km</span>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
            <span className={`text-xs ${tc.textSecondary}`}>50km</span>
          </div>
        </div>
      </div>

      {/* Nearby Posts List */}
      <div className="p-4 space-y-3">
        {nearbyPosts.filter(p => p.distance <= radius).length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${tc.border} ${tc.bgCard}`}>
            <div className="text-6xl mb-3">📍</div>
            <h3 className="text-base font-bold mb-1">No posts found within this distance</h3>
            <p className={`text-xs ${tc.textSecondary} mb-4`}>
              Try expanding your search radius or share the first local update!
            </p>
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-full"
            >
              + Post First Check-in
            </button>
          </div>
        ) : (
          nearbyPosts
            .filter(post => post.distance <= radius)
            .map(post => (
              <div key={post.id} className={`${tc.bgCard} rounded-2xl p-4 border ${tc.border} hover:border-blue-500/50 transition-all shadow-sm`}>
                <div className="flex items-start gap-3 mb-2.5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0 shadow-md">
                    {post.userAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm truncate">{post.userName}</p>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        📍 {formatDistance(post.distance)}
                      </span>
                    </div>
                    <p className={`text-xs ${tc.textSecondary} mt-0.5`}>
                      {post.location} · {formatTime(post.timestamp)}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

                <div className={`flex items-center gap-6 text-xs ${tc.textSecondary} pt-2.5 border-t border-gray-800/40`}>
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
                  >
                    <span>❤️</span>
                    <span>{post.likes}</span>
                  </button>
                  <span className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                    <span>💬</span>
                    <span>{post.comments} comments</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400 font-semibold ml-auto cursor-pointer">
                    <span>🗺️</span>
                    <span>Directions</span>
                  </span>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Share Nearby Post Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
          <div className={`relative w-full max-w-md ${tc.bgModal} rounded-2xl border ${tc.border} p-6 shadow-2xl`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <h2 className="text-lg font-black">📍 Share Local Update</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className={`p-1.5 rounded-full ${tc.bgHoverSecondary} text-gray-400 hover:text-white`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleShareNearbyPost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Location / Venue / Neighborhood *
                </label>
                <input
                  type="text"
                  required
                  value={postLocationName}
                  onChange={(e) => setPostLocationName(e.target.value)}
                  placeholder="e.g. Innovation Hub, Downtown"
                  className={`w-full px-4 py-2 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Message / Event / Notice *
                </label>
                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's happening nearby? Share deals, meetups or questions..."
                  className={`w-full px-4 py-2.5 rounded-xl border ${tc.border} ${tc.bgInput} ${tc.text} text-xs outline-none focus:border-blue-500 resize-none`}
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className={`flex-1 py-2.5 rounded-full border ${tc.border} text-xs font-bold hover:bg-gray-800`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!postContent.trim()}
                  className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/25"
                >
                  Post Nearby
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
