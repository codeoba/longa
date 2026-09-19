import React, { useEffect } from 'react';
import { Page } from '../types';

interface KeyboardShortcutsProps {
  onNavigate: (page: Page) => void;
  onCompose: () => void;
}

export function useKeyboardShortcuts({ onNavigate, onCompose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'g':
        case 'G':
          if (!e.ctrlKey && !e.metaKey) {
            // Show shortcut hint
            const hint = document.createElement('div');
            hint.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl text-sm';
            hint.textContent = 'Press: H=Home, E=Explore, N=Notifications, M=Messages, P=Profile, N=New Post';
            document.body.appendChild(hint);
            setTimeout(() => hint.remove(), 3000);
          }
          break;
        case 'h':
        case 'H':
          onNavigate('home');
          break;
        case 'e':
        case 'E':
          onNavigate('explore');
          break;
        case 'n':
        case 'N':
          if (e.shiftKey) {
            onCompose();
          } else {
            onNavigate('notifications');
          }
          break;
        case 'm':
        case 'M':
          onNavigate('messages');
          break;
        case 'p':
        case 'P':
          onNavigate('profile');
          break;
        case 'b':
        case 'B':
          onNavigate('bookmarks');
          break;
        case 's':
        case 'S':
          onNavigate('settings');
          break;
        case 'Escape':
          // Close any open modals
          const modals = document.querySelectorAll('[data-modal]');
          modals.forEach(modal => {
            const event = new CustomEvent('close-modal');
            modal.dispatchEvent(event);
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, onCompose]);
}

export default function KeyboardShortcutsHelp() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 text-white p-4 rounded-xl shadow-xl text-xs space-y-2 max-w-[200px]">
        <h3 className="font-bold text-sm mb-2">Keyboard Shortcuts</h3>
        <div className="flex justify-between"><span>Home</span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded">H</kbd></div>
        <div className="flex justify-between"><span>Explore</span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded">E</kbd></div>
        <div className="flex justify-between"><span>Notifications</span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded">N</kbd></div>
        <div className="flex justify-between"><span>Messages</span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded">M</kbd></div>
        <div className="flex justify-between"><span>Profile</span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded">P</kbd></div>
        <div className="flex justify-between"><span>Bookmarks</span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded">B</kbd></div>
        <div className="flex justify-between"><span>New Post</span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded">⇧N</kbd></div>
      </div>
    </div>
  );
}
