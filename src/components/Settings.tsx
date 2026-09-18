import React, { useState } from 'react';
import { ArrowLeft } from './Icons';

interface SettingsProps {
  settings: {
    darkMode: boolean;
    notifications: boolean;
    soundEffects: boolean;
    autoplay: boolean;
    language: string;
    contentFilter: string;
  };
  onSettingsChange: (settings: SettingsProps['settings']) => void;
}

export default function Settings({ settings, onSettingsChange }: SettingsProps) {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const languages = ['English', 'Kiswahili', 'Français', 'Español', 'العربية', '中文'];
  const contentFilters = ['No filter', 'Hide sensitive content', 'Hide media with warnings'];

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center gap-6 px-4 py-2">
          <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Preferences */}
      <div className="px-4 py-4 border-b border-gray-800/50">
        <h3 className="text-xl font-extrabold text-white mb-4">Preferences</h3>

        <div className="space-y-4">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] text-white font-medium">Dark mode</p>
              <p className="text-[13px] text-gray-500">Use dark theme</p>
            </div>
            <button
              onClick={() => toggleSetting('darkMode')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.darkMode ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] text-white font-medium">Push notifications</p>
              <p className="text-[13px] text-gray-500">Receive push notifications</p>
            </div>
            <button
              onClick={() => toggleSetting('notifications')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.notifications ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.notifications ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] text-white font-medium">Sound effects</p>
              <p className="text-[13px] text-gray-500">Play sounds for interactions</p>
            </div>
            <button
              onClick={() => toggleSetting('soundEffects')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.soundEffects ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.soundEffects ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Autoplay */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] text-white font-medium">Autoplay videos</p>
              <p className="text-[13px] text-gray-500">Automatically play videos</p>
            </div>
            <button
              onClick={() => toggleSetting('autoplay')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.autoplay ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.autoplay ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Language */}
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="text-left">
              <p className="text-[15px] text-white font-medium">Language</p>
              <p className="text-[13px] text-gray-500">{settings.language}</p>
            </div>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
              <path d="M8.59 5.59L10 4.17l6.41 6.42L10 16.83 8.59 15.41 13.17 10.59z"/>
            </svg>
          </button>

          {/* Content Filter */}
          <button
            onClick={() => setShowContentModal(true)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="text-left">
              <p className="text-[15px] text-white font-medium">Content filter</p>
              <p className="text-[13px] text-gray-500">{settings.contentFilter}</p>
            </div>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
              <path d="M8.59 5.59L10 4.17l6.41 6.42L10 16.83 8.59 15.41 13.17 10.59z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Account Settings */}
      <div className="border-b border-gray-800/50">
        <h3 className="text-xl font-extrabold text-white px-4 pt-4 pb-2">Your Account</h3>
        {[
          { label: 'Account information', desc: 'See your account info' },
          { label: 'Change your password', desc: 'Update your password' },
          { label: 'Download your data', desc: 'Get an archive of your data' },
          { label: 'Deactivate your account', desc: 'Temporarily disable' },
        ].map((item) => (
          <button key={item.label} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-900/30 transition-colors">
            <div className="text-left">
              <p className="text-[15px] text-white">{item.label}</p>
              <p className="text-[13px] text-gray-500">{item.desc}</p>
            </div>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
              <path d="M8.59 5.59L10 4.17l6.41 6.42L10 16.83 8.59 15.41 13.17 10.59z"/>
            </svg>
          </button>
        ))}
      </div>

      {/* Privacy */}
      <div className="border-b border-gray-800/50">
        <h3 className="text-xl font-extrabold text-white px-4 pt-4 pb-2">Privacy and Safety</h3>
        {[
          { label: 'Audience and tagging', desc: 'Control who can interact' },
          { label: 'Your posts', desc: 'Manage your post visibility' },
          { label: 'Content you see', desc: 'Control what appears' },
          { label: 'Mute and block', desc: 'Manage blocked accounts' },
        ].map((item) => (
          <button key={item.label} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-900/30 transition-colors">
            <div className="text-left">
              <p className="text-[15px] text-white">{item.label}</p>
              <p className="text-[13px] text-gray-500">{item.desc}</p>
            </div>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
              <path d="M8.59 5.59L10 4.17l6.41 6.42L10 16.83 8.59 15.41 13.17 10.59z"/>
            </svg>
          </button>
        ))}
      </div>

      {/* About */}
      <div className="px-4 py-4">
        <h3 className="text-xl font-extrabold text-white mb-2">About</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-[15px]">
            <span className="text-gray-500">Version</span>
            <span className="text-white">10.50.0</span>
          </div>
          <div className="flex justify-between text-[15px]">
            <span className="text-gray-500">Build</span>
            <span className="text-white">2026.01.15</span>
          </div>
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLanguageModal(false)} />
          <div className="relative bg-black rounded-2xl border border-gray-800/50 p-4 max-w-[400px] w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Select Language</h3>
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { onSettingsChange({ ...settings, language: lang }); setShowLanguageModal(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors ${settings.language === lang ? 'bg-gray-800' : ''}`}
                >
                  <span className="text-white text-[15px]">{lang}</span>
                  {settings.language === lang && (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400" fill="currentColor">
                      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Filter Modal */}
      {showContentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContentModal(false)} />
          <div className="relative bg-black rounded-2xl border border-gray-800/50 p-4 max-w-[400px] w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Content Filter</h3>
            <div className="space-y-1">
              {contentFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => { onSettingsChange({ ...settings, contentFilter: filter }); setShowContentModal(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors ${settings.contentFilter === filter ? 'bg-gray-800' : ''}`}
                >
                  <span className="text-white text-[15px]">{filter}</span>
                  {settings.contentFilter === filter && (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400" fill="currentColor">
                      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
