import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UsersAPI, uploadMedia } from '../../api/phpAdapter';
import { ArrowLeft } from '../Icons';
import { useThemeClasses } from '../../themeUtils';
import { isImageUrl } from '../Avatar';

interface ProfileEditPageProps {
  onBack: () => void;
}

export default function ProfileEditPage({ onBack }: ProfileEditPageProps) {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [avatar, setAvatar] = useState(user?.avatar || '👤');
  const [banner, setBanner] = useState(user?.banner || '');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const tc = useThemeClasses();

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const res = await uploadMedia(file);
      setBanner(res.url);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Imeshindikana kupakia banner: ' + (err.message || 'Jaribu tena') });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const res = await uploadMedia(file);
      setAvatar(res.url);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Imeshindikana kupakia picha: ' + (err.message || 'Jaribu tena') });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const payload = {
        name,
        bio,
        location,
        website,
        avatar,
        banner,
      };

      await UsersAPI.update(user!.id, payload);

      updateUser({ ...user!, ...payload });
      setMessage({ type: 'success', text: 'Profaili imehifadhiwa kikamilifu!' });
      
      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const currentBanner = bannerPreview || banner;
  const currentAvatar = avatarPreview || avatar;

  return (
    <div>
      <input
        type="file"
        ref={bannerInputRef}
        onChange={handleBannerUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
              <ArrowLeft />
            </button>
            <h1 className={`text-xl font-bold ${tc.text}`}>Edit Profile</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold rounded-full transition-colors text-sm flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            <span>{loading ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Banner Area */}
      <div className="relative h-[180px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center overflow-hidden group">
        {currentBanner && (
          <img src={currentBanner} alt="Banner" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{currentBanner ? 'Badilisha Banner' : 'Weka Picha ya Banner'}</span>
          </button>
          {currentBanner && (
            <button
              type="button"
              onClick={() => { setBanner(''); setBannerPreview(null); }}
              className="p-2 bg-black/70 hover:bg-black/90 text-red-400 rounded-full transition-all hover:scale-105"
              title="Ondoa banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-500'
              : 'bg-red-500/10 border border-red-500/30 text-red-500'
          }`}>
            {message.text}
          </div>
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center -mt-16 mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-black bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl shadow-xl">
              {isImageUrl(currentAvatar) ? (
                <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{currentAvatar || '👤'}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-black shadow-md transition-transform hover:scale-110"
              title="Badilisha picha ya Avatar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Emoji Avatar Presets */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {['👤', '🧑‍💻', '👩‍💻', '👨‍🚀', '👸', '👑', '🔥', '⚡', '🦁', '🌟', '🚀'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setAvatar(emoji);
                  setAvatarPreview(null);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-transform hover:scale-110 border ${
                  avatar === emoji && !avatarPreview ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 bg-zinc-800'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
            />
            <span className={`text-xs ${tc.textMuted} mt-1 block`}>{name.length}/50</span>
          </div>

          {/* Bio */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
              placeholder="Tell us about yourself"
              className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors resize-none`}
            />
            <span className={`text-xs ${tc.textMuted} mt-1 block`}>{bio.length}/160</span>
          </div>

          {/* Location */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dar es Salaam, Tanzania"
              maxLength={30}
              className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
            />
          </div>

          {/* Website */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-1`}>
              Website
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 transition-colors`}
            />
          </div>

          {/* Save Button (Mobile) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-full transition-colors md:hidden"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
