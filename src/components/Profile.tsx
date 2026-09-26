import React, { useState, useRef, useEffect } from 'react';
import { User, Post } from '../types';
import PostComponent from './Post';
import { Calendar, MapPin, LinkIcon, Verified, Premium } from './Icons';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';
import { UsersAPI, uploadMedia } from '../api/phpAdapter';
import { isImageUrl } from './Avatar';

interface ProfileProps {
  user: User;
  posts: Post[];
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
  onReply: (postId: string, content: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onViewThread: (id: string) => void;
  onUserClick: (userId: string) => void;
  incrementViews: (id: string) => void;
  isOwnProfile: boolean;
}

export default function Profile({
  user,
  posts,
  onLike,
  onRetweet,
  onBookmark,
  onReply,
  onDelete,
  onPin,
  onViewThread,
  onUserClick,
  incrementViews,
  isOwnProfile,
}: ProfileProps) {
  const { user: authUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editLocation, setEditLocation] = useState(user.location || '');
  const [editWebsite, setEditWebsite] = useState(user.website || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar || '👤');
  const [editBanner, setEditBanner] = useState(user.banner || '');

  // File uploads
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingDirect, setUploadingDirect] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Direct file inputs
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const modalAvatarRef = useRef<HTMLInputElement>(null);
  const modalBannerRef = useRef<HTMLInputElement>(null);

  const tc = useThemeClasses();
  const tabs = ['posts', 'replies', 'highlights', 'media', 'likes'];

  // Sync state if user changes
  useEffect(() => {
    setEditName(user.name);
    setEditBio(user.bio || '');
    setEditLocation(user.location || '');
    setEditWebsite(user.website || '');
    setEditAvatar(user.avatar || '👤');
    setEditBanner(user.banner || '');
  }, [user]);

  // Direct banner upload from profile header
  const handleDirectBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDirect('Inapakia picha ya jalada (banner)...');
    try {
      const uploadRes = await uploadMedia(file);
      const newBannerUrl = uploadRes.url;
      setEditBanner(newBannerUrl);

      // Save to backend
      const targetUserId = authUser?.id || user.id;
      await UsersAPI.update(targetUserId, { banner: newBannerUrl });

      // Update auth context & localStorage
      if (authUser) {
        updateUser({ ...authUser, banner: newBannerUrl });
      }

      setStatusMessage({ type: 'success', text: 'Picha ya jalada (Banner) imebadilishwa kikamilifu!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Imeshindikana kupakia banner' });
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setUploadingDirect(null);
      if (e.target) e.target.value = '';
    }
  };

  // Direct avatar upload from profile header
  const handleDirectAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDirect('Inapakia picha ya profaili (avatar)...');
    try {
      const uploadRes = await uploadMedia(file);
      const newAvatarUrl = uploadRes.url;
      setEditAvatar(newAvatarUrl);

      // Save to backend
      const targetUserId = authUser?.id || user.id;
      await UsersAPI.update(targetUserId, { avatar: newAvatarUrl });

      // Update auth context & localStorage
      if (authUser) {
        updateUser({ ...authUser, avatar: newAvatarUrl });
      }

      setStatusMessage({ type: 'success', text: 'Picha ya profaili (Avatar) imebadilishwa kikamilifu!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Imeshindikana kupakia picha ya profaili' });
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setUploadingDirect(null);
      if (e.target) e.target.value = '';
    }
  };

  // Modal banner file selection
  const handleModalBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant preview
    const reader = new FileReader();
    reader.onload = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uploadRes = await uploadMedia(file);
      setEditBanner(uploadRes.url);
    } catch (err: any) {
      alert('Hitilafu ya kupakia banner: ' + (err.message || 'Jaribu tena'));
    }
  };

  // Modal avatar file selection
  const handleModalAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant preview
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uploadRes = await uploadMedia(file);
      setEditAvatar(uploadRes.url);
    } catch (err: any) {
      alert('Hitilafu ya kupakia avatar: ' + (err.message || 'Jaribu tena'));
    }
  };

  // Save changes from Edit Modal
  const handleSaveModal = async () => {
    setSaving(true);
    setStatusMessage(null);

    try {
      const targetUserId = authUser?.id || user.id;
      const updatePayload = {
        name: editName,
        bio: editBio,
        location: editLocation,
        website: editWebsite,
        avatar: editAvatar,
        banner: editBanner,
      };

      await UsersAPI.update(targetUserId, updatePayload);

      if (authUser) {
        updateUser({
          ...authUser,
          ...updatePayload,
        });
      }

      setShowEditModal(false);
      setAvatarPreview(null);
      setBannerPreview(null);
      setStatusMessage({ type: 'success', text: 'Profaili imehifadhiwa kikamilifu!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Hitilafu ya kuhifadhi mabadiliko' });
    } finally {
      setSaving(false);
    }
  };

  const currentBanner = bannerPreview || editBanner || user.banner;
  const currentAvatar = avatarPreview || editAvatar || user.avatar;

  return (
    <div>
      {/* Hidden file inputs for direct clicks */}
      <input
        type="file"
        ref={bannerFileRef}
        onChange={handleDirectBannerChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={avatarFileRef}
        onChange={handleDirectAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-2">
          <div>
            <h1 className={`text-xl font-bold ${tc.text} flex items-center gap-1`}>
              {user.name}
              <Verified />
              <Premium />
            </h1>
            <p className="text-[13px] text-gray-500">{user.posts.toLocaleString()} posts</p>
          </div>

          {uploadingDirect && (
            <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{uploadingDirect}</span>
            </div>
          )}
        </div>
      </div>

      {/* Global Status Message Toast */}
      {statusMessage && (
        <div className={`mx-4 mt-3 p-3 rounded-xl text-sm flex items-center justify-between shadow-lg ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-xs opacity-75 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Banner */}
      <div className="h-[200px] w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 group">
        {currentBanner ? (
          <img
            src={currentBanner}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        )}

        {isOwnProfile && (
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => bannerFileRef.current?.click()}
              className="px-3.5 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-all shadow-lg flex items-center gap-2 text-xs font-semibold border border-white/20 hover:scale-105 active:scale-95"
              title="Bonyeza hapa kubadilisha Banner yako"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Badilisha Banner</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className={`px-4 pb-4 border-b ${tc.border}`}>
        <div className="flex items-end justify-between -mt-16 mb-3">
          {/* Avatar with edit overlay */}
          <div className="relative group">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden flex items-center justify-center text-5xl border-4 border-black bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl relative select-none">
              {isImageUrl(currentAvatar) ? (
                <img
                  src={currentAvatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{currentAvatar || '👤'}</span>
              )}
            </div>

            {isOwnProfile && (
              <>
                {/* Hover overlay on desktop */}
                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all border-4 border-transparent cursor-pointer backdrop-blur-[2px]"
                  title="Badilisha picha ya profaili"
                >
                  <svg className="w-6 h-6 mb-0.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[11px] font-bold">Badili Picha</span>
                </button>

                {/* Floating camera button for mobile & easy click */}
                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full border-2 border-black transition-transform hover:scale-110 shadow-lg flex items-center justify-center"
                  title="Badilisha picha ya profaili"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2 mt-12">
            <button className={`px-4 py-1.5 rounded-full border ${tc.borderLight} ${tc.text} font-bold text-[15px] ${tc.bgHoverSecondary} transition-colors`}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 inline" fill="currentColor">
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                className={`px-5 py-1.5 rounded-full font-bold text-[15px] transition-colors ${tc.bgTertiary} ${tc.text} ${tc.bgHoverSecondary} border border-gray-600/30 flex items-center gap-1.5`}
              >
                <span>Edit profile</span>
              </button>
            )}
          </div>
        </div>

        <h2 className={`text-xl font-extrabold ${tc.text} flex items-center gap-1`}>
          {user.name}
          <Verified />
          <Premium />
        </h2>
        <p className="text-[15px] text-gray-500">{user.handle}</p>
        <p className={`text-[15px] ${tc.text} mt-3 leading-relaxed`}>{user.bio || 'Hakuna wasifu uliowekwa bado.'}</p>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-[15px] text-gray-500">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin />
              {user.location}
            </span>
          )}
          {user.website && (
            <span className="flex items-center gap-1">
              <LinkIcon />
              <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {user.website}
              </a>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar />
            Joined {user.joinedDate}
          </span>
        </div>

        <div className="flex items-center gap-5 mt-3">
          <span className="text-[15px]">
            <span className={`font-bold ${tc.text}`}>{user.following.toLocaleString()}</span>
            <span className="text-gray-500 ml-1">Following</span>
          </span>
          <span className="text-[15px]">
            <span className={`font-bold ${tc.text}`}>{(user.followers / 1000).toFixed(1)}K</span>
            <span className="text-gray-500 ml-1">Followers</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${tc.border}`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[15px] font-medium capitalize transition-colors relative ${
              activeTab === tab ? `${tc.text} font-bold` : `text-gray-500 ${tc.bgHover}`
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Posts */}
      {activeTab === 'posts' && (
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                onLike={onLike}
                onRetweet={onRetweet}
                onBookmark={onBookmark}
                onReply={onReply}
                onDelete={onDelete}
                onPin={onPin}
                onViewThread={onViewThread}
                onUserClick={onUserClick}
                incrementViews={incrementViews}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <h3 className={`text-3xl font-extrabold ${tc.text}`}>No posts yet</h3>
              <p className="text-gray-500 text-[15px] mt-2 text-center">When you post, they'll show up here.</p>
            </div>
          )}
        </div>
      )}

      {activeTab !== 'posts' && (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <h3 className={`text-3xl font-extrabold ${tc.text}`}>Nothing to see here</h3>
          <p className="text-gray-500 text-[15px] mt-2 text-center">
            {activeTab === 'replies' && "You haven't replied to any posts yet."}
            {activeTab === 'highlights' && "You haven't highlighted any posts yet."}
            {activeTab === 'media' && "You haven't posted any media yet."}
            {activeTab === 'likes' && "Posts you like will show up here."}
          </p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-8 pb-8 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setShowEditModal(false)} />
          <div className={`relative w-full max-w-[620px] mx-4 my-auto ${tc.bgModal} rounded-2xl border ${tc.border} shadow-2xl overflow-hidden`}>
            
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${tc.border} sticky top-0 ${tc.bgModal} z-10`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={saving}
                  className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}
                >
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${tc.text}`} fill="currentColor">
                    <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
                  </svg>
                </button>
                <h2 className={`text-lg font-bold ${tc.text}`}>Hariri Profaili (Edit Profile)</h2>
              </div>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={saving}
                className="bg-white text-black font-bold px-6 py-1.5 rounded-full text-[15px] hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                <span>{saving ? 'Inahifadhi...' : 'Hifadhi'}</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[75vh] overflow-y-auto">
              {/* Banner Upload Area */}
              <div className="relative h-[160px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center group overflow-hidden">
                {(bannerPreview || editBanner) ? (
                  <img
                    src={bannerPreview || editBanner}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3">
                  <input
                    type="file"
                    ref={modalBannerRef}
                    onChange={handleModalBannerChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => modalBannerRef.current?.click()}
                    className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all hover:scale-110"
                    title="Weka Picha ya Banner"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  {(bannerPreview || editBanner) && (
                    <button
                      type="button"
                      onClick={() => { setEditBanner(''); setBannerPreview(null); }}
                      className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all hover:scale-110"
                      title="Ondoa Banner"
                    >
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Avatar Upload Area */}
              <div className="px-4 pb-4">
                <div className="relative -mt-12 mb-4 w-24 h-24 rounded-full overflow-hidden border-4 border-black bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl shadow-xl group">
                  {isImageUrl(avatarPreview || editAvatar) ? (
                    <img
                      src={avatarPreview || editAvatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{editAvatar || '👤'}</span>
                  )}
                  <input
                    type="file"
                    ref={modalAvatarRef}
                    onChange={handleModalAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => modalAvatarRef.current?.click()}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity backdrop-blur-[1px]"
                    title="Badilisha picha ya Avatar"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  {/* Avatar Emoji presets */}
                  <div>
                    <label className="text-[13px] text-gray-500 block mb-1.5">Au chagua Avatar ya Emoji / Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {['👤', '🧑‍💻', '👩‍💻', '👨‍🚀', '👸', '👑', '🔥', '⚡', '🦁', '🌟', '🚀'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setEditAvatar(emoji);
                            setAvatarPreview(null);
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-110 border ${
                            editAvatar === emoji && !avatarPreview ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 bg-zinc-800'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] text-gray-500 block mb-1">Jina (Name)</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full bg-transparent border ${tc.borderLight} rounded-lg px-3 py-2 ${tc.text} outline-none focus:border-blue-500`}
                    />
                  </div>

                  <div>
                    <label className="text-[13px] text-gray-500 block mb-1">Wasifu (Bio)</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className={`w-full bg-transparent border ${tc.borderLight} rounded-lg px-3 py-2 ${tc.text} outline-none focus:border-blue-500 resize-none`}
                      rows={3}
                      placeholder="Eleza kwa ufupi kukuhusu..."
                    />
                  </div>

                  <div>
                    <label className="text-[13px] text-gray-500 block mb-1">Mahali (Location)</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="Mfano: Dar es Salaam, Tanzania"
                      className={`w-full bg-transparent border ${tc.borderLight} rounded-lg px-3 py-2 ${tc.text} outline-none focus:border-blue-500`}
                    />
                  </div>

                  <div>
                    <label className="text-[13px] text-gray-500 block mb-1">Tovuti (Website)</label>
                    <input
                      type="text"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className={`w-full bg-transparent border ${tc.borderLight} rounded-lg px-3 py-2 ${tc.text} outline-none focus:border-blue-500`}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
