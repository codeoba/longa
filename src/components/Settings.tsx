import React, { useState } from 'react';
import { ArrowLeft } from './Icons';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const settingsSections = [
    {
      title: 'Your Account',
      items: [
        { label: 'Account information', desc: 'See your account info' },
        { label: 'Change your password', desc: 'Update your password' },
        { label: 'Download your data', desc: 'Get an archive of your data' },
        { label: 'Deactivate your account', desc: 'Temporarily disable' },
      ]
    },
    {
      title: 'Privacy and Safety',
      items: [
        { label: 'Audience and tagging', desc: 'Control who can interact' },
        { label: 'Your posts', desc: 'Manage your post visibility' },
        { label: 'Content you see', desc: 'Control what appears' },
        { label: 'Mute and block', desc: 'Manage blocked accounts' },
      ]
    },
  ];

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
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${darkMode ? 'translate-x-5.5 left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] text-white font-medium">Push notifications</p>
              <p className="text-[13px] text-gray-500">Receive push notifications</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${notifications ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] text-white font-medium">Sound effects</p>
              <p className="text-[13px] text-gray-500">Play sounds for interactions</p>
            </div>
            <button
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-11 h-6 rounded-full transition-colors relative ${soundEffects ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${soundEffects ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Autoplay */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] text-white font-medium">Autoplay videos</p>
              <p className="text-[13px] text-gray-500">Automatically play videos</p>
            </div>
            <button
              onClick={() => setAutoplay(!autoplay)}
              className={`w-11 h-6 rounded-full transition-colors relative ${autoplay ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${autoplay ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <div key={section.title} className="border-b border-gray-800/50">
          <h3 className="text-xl font-extrabold text-white px-4 pt-4 pb-2">{section.title}</h3>
          {section.items.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-900/30 transition-colors"
            >
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
      ))}

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
    </div>
  );
}
