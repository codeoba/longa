import React, { useState } from 'react';
import { Draft } from '../types';
import { initialDrafts } from '../data';
import { ArrowLeft } from './Icons';
import { useTheme } from '../ThemeContext';

interface DraftsProps {
  drafts: Draft[];
  onDeleteDraft: (id: string) => void;
  onPostDraft: (draft: Draft) => void;
}

export default function Drafts({ drafts, onDeleteDraft, onPostDraft }: DraftsProps) {
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const allDrafts = [...drafts, ...initialDrafts];

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Drafts</h1>
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{allDrafts.length}</span>
        </div>
      </div>

      {/* Drafts List */}
      {allDrafts.length > 0 ? (
        <div>
          {allDrafts.map(draft => (
            <div
              key={draft.id}
              className={`px-4 py-4 border-b cursor-pointer transition-colors ${
                isDark ? 'border-gray-800/30 hover:bg-gray-900/30' : 'border-gray-100 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedDraft(draft)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`text-[15px] line-clamp-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {draft.content}
                  </p>
                  <p className="text-[13px] text-gray-500 mt-2">
                    {draft.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                    {draft.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(draft.id); }}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-500' : 'hover:bg-gray-200 text-gray-400'}`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.88 10.91c.04.55.5 1.09 1.06 1.09h12c.56 0 1.02-.54 1.06-1.09L19.94 8H21V6h-5z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="text-6xl mb-4">📝</div>
          <h3 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>No drafts</h3>
          <p className="text-gray-500 text-[15px] mt-2 text-center max-w-[360px]">
            Posts you start but don't send will show up here.
          </p>
        </div>
      )}

      {/* Draft Detail Modal */}
      {selectedDraft && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDraft(null)} />
          <div className={`relative w-full max-w-[600px] mx-4 rounded-2xl border shadow-2xl mb-4 sm:mb-0 ${isDark ? 'bg-black border-gray-800/50' : 'bg-white border-gray-200'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-800/50' : 'border-gray-200'}`}>
              <button onClick={() => setSelectedDraft(null)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}>
                <svg viewBox="0 0 24 24" className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="currentColor">
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
                </svg>
              </button>
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Draft</span>
              <div className="w-9" />
            </div>
            <div className="p-4">
              <textarea
                defaultValue={selectedDraft.content}
                className={`w-full bg-transparent text-[17px] outline-none resize-none min-h-[150px] ${isDark ? 'text-white' : 'text-gray-900'}`}
              />
            </div>
            <div className={`flex items-center justify-between p-4 border-t ${isDark ? 'border-gray-800/50' : 'border-gray-200'}`}>
              <button
                onClick={() => { setShowDeleteConfirm(selectedDraft.id); setSelectedDraft(null); }}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
              >
                Delete
              </button>
              <button
                onClick={() => { onPostDraft(selectedDraft); setSelectedDraft(null); }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          <div className={`relative rounded-2xl border p-6 max-w-[320px] mx-4 text-center ${isDark ? 'bg-black border-gray-800/50' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Delete draft?</h3>
            <p className={`text-[15px] mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>This can't be undone. You'll lose this draft.</p>
            <div className="space-y-2">
              <button
                onClick={() => { onDeleteDraft(showDeleteConfirm); setShowDeleteConfirm(null); }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-full transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={`w-full border font-bold py-2.5 rounded-full transition-colors ${isDark ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
