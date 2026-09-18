import React, { useState } from 'react';
import { ArrowLeft } from './Icons';
import { UserList } from '../types';

interface ListsProps {
  lists: UserList[];
  suggestedLists: UserList[];
  followedLists: string[];
  onCreateList: (name: string, description: string, isPrivate: boolean) => void;
  onFollowList: (listId: string) => void;
  onDeleteList: (listId: string) => void;
}

export default function Lists({ lists, suggestedLists, followedLists, onCreateList, onFollowList, onDeleteList }: ListsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [newListPrivate, setNewListPrivate] = useState(false);
  const [selectedList, setSelectedList] = useState<UserList | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleCreate = () => {
    if (newListName.trim()) {
      onCreateList(newListName, newListDesc, newListPrivate);
      setNewListName('');
      setNewListDesc('');
      setNewListPrivate(false);
      setShowCreateModal(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
              <ArrowLeft />
            </button>
            <h1 className="text-xl font-bold text-white">Lists</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Your Lists */}
      <div className="px-4 py-4 border-b border-gray-800/50">
        <h2 className="text-xl font-extrabold text-white mb-1">Your Lists</h2>
        <p className="text-[13px] text-gray-500">Create and manage your custom lists</p>
      </div>

      {/* Create List Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-900/30 transition-colors border-b border-gray-800/30"
      >
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400" fill="currentColor">
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
          </svg>
        </div>
        <div className="text-left">
          <p className="font-bold text-[15px] text-white">Create a new List</p>
          <p className="text-[13px] text-gray-500">Discover and organize content</p>
        </div>
      </button>

      {/* Lists */}
      {lists.map((list) => (
        <div
          key={list.id}
          className="flex items-center gap-4 px-4 py-4 hover:bg-gray-900/30 transition-colors cursor-pointer border-b border-gray-800/30"
          onClick={() => setSelectedList(list)}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-300" fill="currentColor">
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[15px] text-white">{list.name}</span>
              {list.isPrivate && (
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="currentColor">
                  <path d="M12 1C8.98 1 6.5 3.48 6.5 6.5S8.98 12 12 12s5.5-2.48 5.5-5.5S15.02 1 12 1zm0 9c-1.93 0-3.5-1.57-3.5-3.5S10.07 3 12 3s3.5 1.57 3.5 3.5S13.93 10 12 10zm0 3c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
            <p className="text-[13px] text-gray-500 mt-0.5">{list.members} members · {list.description}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(list.id); }}
            className="p-2 rounded-full hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.88 10.91c.04.55.5 1.09 1.06 1.09h12c.56 0 1.02-.54 1.06-1.09L19.94 8H21V6h-5z"/>
            </svg>
          </button>
        </div>
      ))}

      {/* Suggested Lists */}
      <div className="px-4 py-4 border-b border-gray-800/50">
        <h2 className="text-xl font-extrabold text-white">Discover new Lists</h2>
      </div>
      {suggestedLists.map((list) => (
        <div key={list.id} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-900/30 transition-colors cursor-pointer border-b border-gray-800/30">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400" fill="currentColor">
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[15px] text-white">{list.name}</p>
            <p className="text-[13px] text-gray-500 mt-0.5">{list.members} members · {list.followers.toLocaleString()} followers</p>
          </div>
          <button
            onClick={() => onFollowList(list.id)}
            className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
              followedLists.includes(list.id)
                ? 'bg-transparent border border-gray-600 text-white hover:border-red-500/50 hover:text-red-500'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {followedLists.includes(list.id) ? 'Following' : 'Follow'}
          </button>
        </div>
      ))}

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-black rounded-2xl border border-gray-800/50 p-4 max-w-[500px] w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
                </svg>
              </button>
              <h2 className="text-xl font-bold text-white">Create List</h2>
              <div className="w-9" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-gray-500 block mb-1">Name</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name"
                  maxLength={25}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
                <span className="text-[12px] text-gray-500 mt-1 block">{newListName.length}/25</span>
              </div>
              <div>
                <label className="text-[13px] text-gray-500 block mb-1">Description</label>
                <textarea
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="Describe your list"
                  maxLength={100}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 resize-none"
                  rows={2}
                />
                <span className="text-[12px] text-gray-500 mt-1 block">{newListDesc.length}/100</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[15px] text-white font-medium">Make private</p>
                  <p className="text-[13px] text-gray-500">Only you can see this list</p>
                </div>
                <button
                  onClick={() => setNewListPrivate(!newListPrivate)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${newListPrivate ? 'bg-blue-500' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${newListPrivate ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <button
                onClick={handleCreate}
                disabled={!newListName.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative bg-black rounded-2xl border border-gray-800/50 p-6 max-w-[320px] mx-4 text-center">
            <h3 className="text-xl font-extrabold text-white mb-2">Delete List?</h3>
            <p className="text-gray-400 text-[15px] mb-6">This can't be undone and you'll lose this list.</p>
            <div className="space-y-2">
              <button
                onClick={() => { onDeleteList(showDeleteConfirm); setShowDeleteConfirm(null); }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-full transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="w-full border border-gray-600 text-white font-bold py-2.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Detail Modal */}
      {selectedList && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedList(null)} />
          <div className="relative bg-black rounded-2xl border border-gray-800/50 p-4 max-w-[500px] w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedList(null)} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
                </svg>
              </button>
              <h2 className="text-xl font-bold text-white">{selectedList.name}</h2>
              <div className="w-9" />
            </div>
            <p className="text-gray-400 text-[15px] mb-4">{selectedList.description}</p>
            <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-4">
              <span>{selectedList.members} members</span>
              <span>{selectedList.followers} followers</span>
              {selectedList.isPrivate && <span>🔒 Private</span>}
            </div>
            {selectedList.memberUsers && selectedList.memberUsers.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-2">Members</h3>
                <div className="space-y-2">
                  {selectedList.memberUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900/50">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-[14px] text-white font-medium">{user.name}</p>
                        <p className="text-[12px] text-gray-500">{user.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
