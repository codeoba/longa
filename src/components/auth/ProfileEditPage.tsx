import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UsersAPI } from '../../api/phpAdapter';
import { ArrowLeft } from '../Icons';
import { useThemeClasses } from '../../themeUtils';

interface ProfileEditPageProps {
  onBack: () => void;
}

export default function ProfileEditPage({ onBack }: ProfileEditPageProps) {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const tc = useThemeClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const updatedUser = await UsersAPI.update(user!.id, {
        name,
        bio,
        location,
        website,
      });

      updateUser({ ...user!, name, bio, location, website });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-2">
          <button onClick={onBack} className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${tc.text}`}>Edit Profile</h1>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold rounded-full transition-colors text-sm"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
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
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl">
              {user?.avatar || '👤'}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
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
              type="url"
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
