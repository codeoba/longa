import React, { useState, useEffect } from 'react';
import { useThemeClasses } from '../themeUtils';

export default function OfflineMode() {
  const tc = useThemeClasses();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if PWA is installable
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleSync = () => {
    // In real app, this would sync offline data
    alert('Syncing offline data...');
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text} mb-1`}>Offline Mode</h1>
          <p className={`text-sm ${tc.textSecondary}`}>
            Manage offline data and app installation
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Connection Status */}
        <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-lg font-bold ${tc.text}`}>Connection Status</h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}
              />
              <span className={`font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <p className={`text-sm ${tc.textSecondary}`}>
            {isOnline
              ? 'You are connected to the internet. All features are available.'
              : 'You are offline. Some features may be limited. Data will sync when you reconnect.'}
          </p>
        </div>

        {/* Install PWA */}
        {isInstallable && (
          <div className={`${tc.bgCard} rounded-xl p-4 border-2 border-blue-500`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="text-4xl">📱</div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${tc.text} mb-1`}>
                  Install X App
                </h3>
                <p className={`text-sm ${tc.textSecondary}`}>
                  Install this app on your device for a native experience with offline support and push notifications.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
              >
                Install Now
              </button>
              <button
                onClick={() => setIsInstallable(false)}
                className={`px-4 py-2.5 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
              >
                Later
              </button>
            </div>
          </div>
        )}

        {/* Offline Data */}
        <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
          <h3 className={`text-lg font-bold ${tc.text} mb-3`}>Offline Data</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${tc.text}`}>Cached Posts</p>
                <p className={`text-xs ${tc.textSecondary}`}>156 posts saved for offline viewing</p>
              </div>
              <button className="px-3 py-1.5 bg-red-500/10 text-red-500 text-sm font-bold rounded-full hover:bg-red-500/20">
                Clear
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${tc.text}`}>Draft Posts</p>
                <p className={`text-xs ${tc.textSecondary}`}>3 drafts saved locally</p>
              </div>
              <button className="px-3 py-1.5 bg-blue-500/10 text-blue-500 text-sm font-bold rounded-full hover:bg-blue-500/20">
                View
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${tc.text}`}>Images & Media</p>
                <p className={`text-xs ${tc.textSecondary}`}>24.5 MB cached</p>
              </div>
              <button className="px-3 py-1.5 bg-red-500/10 text-red-500 text-sm font-bold rounded-full hover:bg-red-500/20">
                Clear
              </button>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={!isOnline}
            className="w-full mt-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Now
          </button>
        </div>

        {/* Settings */}
        <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
          <h3 className={`text-lg font-bold ${tc.text} mb-3`}>Offline Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${tc.text}`}>Auto-sync when online</p>
                <p className={`text-xs ${tc.textSecondary}`}>Automatically sync data when connection is restored</p>
              </div>
              <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${tc.text}`}>Cache images</p>
                <p className={`text-xs ${tc.textSecondary}`}>Save images for offline viewing</p>
              </div>
              <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${tc.text}`}>Background sync</p>
                <p className={`text-xs ${tc.textSecondary}`}>Sync data in background (requires PWA)</p>
              </div>
              <button className={`w-11 h-6 rounded-full ${tc.bgTertiary} relative`}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className={`p-4 rounded-xl ${tc.bgCard} border ${tc.border}`}>
          <h3 className={`font-bold ${tc.text} mb-2`}>💡 About Offline Mode</h3>
          <ul className={`text-sm ${tc.textSecondary} space-y-1`}>
            <li>• View cached posts and profiles offline</li>
            <li>• Compose posts offline - they'll be sent when online</li>
            <li>• Install as app for better experience</li>
            <li>• Push notifications (when installed)</li>
            <li>• Faster loading with cached content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
