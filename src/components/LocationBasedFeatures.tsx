import React, { useState, useEffect } from 'react';
import { useThemeClasses } from '../themeUtils';

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

export default function LocationBasedFeatures() {
  const tc = useThemeClasses();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPosts, setNearbyPosts] = useState<NearbyPost[]>([]);
  const [radius, setRadius] = useState(10); // km
  const [loading, setLoading] = useState(false);

  // Sample nearby posts
  const samplePosts: NearbyPost[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Zawadi Innovation',
      userAvatar: '👩‍🔬',
      content: '🚀 Just opened our new tech hub in Dar es Salaam! Come visit us and collaborate on amazing projects.',
      distance: 2.3,
      location: 'Dar es Salaam, Tanzania',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 234,
      comments: 45,
    },
    {
      id: '2',
      userId: '3',
      userName: 'Baraka Digital',
      userAvatar: '🎨',
      content: '🎨 Free design workshop this Saturday at the community center. All skill levels welcome!',
      distance: 5.7,
      location: 'Arusha, Tanzania',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      likes: 189,
      comments: 23,
    },
    {
      id: '3',
      userId: '4',
      userName: 'Neema AI',
      userAvatar: '🤖',
      content: '🤖 Looking for AI engineers in Nairobi for a new startup. Remote-friendly but prefer local talent!',
      distance: 8.1,
      location: 'Nairobi, Kenya',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      likes: 567,
      comments: 89,
    },
  ];

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
            setNearbyPosts(samplePosts);
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Could not get your location. Please enable location services.');
            setLoading(false);
          }
        );
      } else {
        alert('Geolocation is not supported by your browser');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const disableLocation = () => {
    setLocationEnabled(false);
    setCurrentLocation(null);
    setNearbyPosts([]);
  };

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
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
      <div>
        {/* Header */}
        <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
          <div className="px-4 py-3">
            <h1 className={`text-xl font-bold ${tc.text} mb-1`}>Nearby</h1>
            <p className={`text-sm ${tc.textSecondary}`}>Discover posts from people around you</p>
          </div>
        </div>

        {/* Enable Location */}
        <div className="p-4">
          <div className={`${tc.bgCard} rounded-xl p-8 border ${tc.border} text-center`}>
            <div className="text-6xl mb-4">📍</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>Enable Location</h3>
            <p className={`${tc.textSecondary} mb-6`}>
              Allow location access to see posts from people near you
            </p>
            <button
              onClick={enableLocation}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Enable Location
                </>
              )}
            </button>

            <div className={`mt-6 p-4 rounded-lg ${tc.bgTertiary} text-left`}>
              <h4 className={`font-bold ${tc.text} mb-2`}>🔒 Privacy First</h4>
              <ul className={`text-sm ${tc.textSecondary} space-y-1`}>
                <li>• Your exact location is never shared</li>
                <li>• Only approximate distance is shown</li>
                <li>• You can disable anytime</li>
                <li>• Location data stays on your device</li>
              </ul>
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
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className={`text-xl font-bold ${tc.text}`}>Nearby</h1>
            <button
              onClick={disableLocation}
              className={`px-3 py-1.5 rounded-full text-sm ${tc.bgTertiary} ${tc.textSecondary} hover:bg-gray-500/20`}
            >
              Disable
            </button>
          </div>
          <p className={`text-sm ${tc.textSecondary}`}>
            Showing posts within {radius}km
          </p>
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
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(radius / 50) * 100}%, #374151 ${(radius / 50) * 100}%, #374151 100%)`,
              }}
            />
            <span className={`text-xs ${tc.textSecondary}`}>50km</span>
          </div>
        </div>
      </div>

      {/* Nearby Posts */}
      <div className="p-4 space-y-3">
        {nearbyPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📍</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No posts nearby</h3>
            <p className={tc.textSecondary}>Try increasing your search radius</p>
          </div>
        ) : (
          nearbyPosts
            .filter(post => post.distance <= radius)
            .map(post => (
              <div key={post.id} className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
                    {post.userAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-bold ${tc.text}`}>{post.userName}</p>
                      <div className="flex items-center gap-1 text-xs text-green-500">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {formatDistance(post.distance)}
                      </div>
                    </div>
                    <p className={`text-xs ${tc.textSecondary}`}>
                      📍 {post.location} · {formatTime(post.timestamp)}
                    </p>
                  </div>
                </div>

                <p className={`${tc.text} text-[15px] mb-3`}>{post.content}</p>

                <div className={`flex items-center gap-4 text-sm ${tc.textSecondary}`}>
                  <button className="flex items-center gap-1 hover:text-pink-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 ml-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Directions
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Location Info */}
      {currentLocation && (
        <div className={`mx-4 mb-4 p-3 rounded-lg ${tc.bgCard} border ${tc.border}`}>
          <p className={`text-xs ${tc.textSecondary} text-center`}>
            📍 Your approximate location: {currentLocation.lat.toFixed(2)}°, {currentLocation.lng.toFixed(2)}°
          </p>
        </div>
      )}
    </div>
  );
}
