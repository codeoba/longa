import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { useThemeClasses } from '../themeUtils';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  preview: string;
}

export default function CustomThemes() {
  const { theme, setTheme } = useTheme();
  const tc = useThemeClasses();
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#1d9bf0',
    secondary: '#8b5cf6',
    background: '#15202b',
    surface: '#192734',
    text: '#ffffff',
  });

  const themes: Theme[] = [
    {
      id: 'default',
      name: 'Default Dark',
      description: 'Classic dark theme',
      colors: {
        primary: '#1d9bf0',
        secondary: '#8b5cf6',
        background: '#15202b',
        surface: '#192734',
        text: '#ffffff',
      },
      preview: '🌙',
    },
    {
      id: 'midnight',
      name: 'Midnight Blue',
      description: 'Deep blue darkness',
      colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
      },
      preview: '🌌',
    },
    {
      id: 'sunset',
      name: 'Sunset Vibes',
      description: 'Warm orange tones',
      colors: {
        primary: '#f97316',
        secondary: '#ef4444',
        background: '#1c1917',
        surface: '#292524',
        text: '#fafaf9',
      },
      preview: '🌅',
    },
    {
      id: 'forest',
      name: 'Forest Green',
      description: 'Nature inspired',
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        background: '#064e3b',
        surface: '#065f46',
        text: '#ecfdf5',
      },
      preview: '🌲',
    },
    {
      id: 'ocean',
      name: 'Ocean Deep',
      description: 'Calm blue waters',
      colors: {
        primary: '#06b6d4',
        secondary: '#0891b2',
        background: '#164e63',
        surface: '#155e75',
        text: '#ecfeff',
      },
      preview: '🌊',
    },
    {
      id: 'lavender',
      name: 'Lavender Dream',
      description: 'Soft purple tones',
      colors: {
        primary: '#a855f7',
        secondary: '#9333ea',
        background: '#3b0764',
        surface: '#4c1d95',
        text: '#faf5ff',
      },
      preview: '💜',
    },
  ];

  const handleApplyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    const selectedThemeData = themes.find((t) => t.id === themeId);
    if (selectedThemeData) {
      setCustomColors(selectedThemeData.colors);
      // In real app, this would update CSS variables or context
      console.log('Applied theme:', selectedThemeData.name);
    }
  };

  const handleCustomColorChange = (key: keyof typeof customColors, value: string) => {
    setCustomColors({ ...customColors, [key]: value });
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text}`}>Themes</h1>
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm"
          >
            {showCustomizer ? 'Browse Themes' : 'Customize'}
          </button>
        </div>
      </div>

      {!showCustomizer ? (
        /* Theme Gallery */
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleApplyTheme(theme.id)}
                className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : tc.border
                }`}
              >
                {/* Preview */}
                <div
                  className="aspect-video flex items-center justify-center text-6xl"
                  style={{ background: theme.colors.background }}
                >
                  {theme.preview}
                </div>

                {/* Info */}
                <div className={`p-3 ${tc.bgCard}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold ${tc.text}`}>{theme.name}</h3>
                    {selectedTheme === theme.id && (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${tc.textSecondary}`}>{theme.description}</p>

                  {/* Color dots */}
                  <div className="flex gap-1 mt-2">
                    {Object.values(theme.colors).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info */}
          <div className={`mt-6 p-4 rounded-xl ${tc.bgCard} border ${tc.border}`}>
            <h3 className={`font-bold ${tc.text} mb-2`}>💡 Pro Tip</h3>
            <p className={`text-sm ${tc.textSecondary}`}>
              You can create your own custom theme by clicking the "Customize" button above. 
              Mix and match colors to create your perfect look!
            </p>
          </div>
        </div>
      ) : (
        /* Custom Theme Creator */
        <div className="p-4 space-y-6">
          {/* Preview */}
          <div
            className="rounded-xl p-6 border-2 border-blue-500"
            style={{ background: customColors.background }}
          >
            <div
              className="rounded-lg p-4 mb-3"
              style={{ background: customColors.surface }}
            >
              <p style={{ color: customColors.text }} className="font-bold mb-2">
                Preview
              </p>
              <p style={{ color: customColors.text }} className="text-sm opacity-80">
                This is how your theme will look
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-full font-bold text-sm"
                style={{ background: customColors.primary, color: '#ffffff' }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-full font-bold text-sm"
                style={{ background: customColors.secondary, color: '#ffffff' }}
              >
                Secondary
              </button>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${tc.text}`}>Customize Colors</h3>

            {Object.entries(customColors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <label className={`flex-1 text-sm font-medium ${tc.text} capitalize`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleCustomColorChange(key as keyof typeof customColors, e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleCustomColorChange(key as keyof typeof customColors, e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} text-sm font-mono`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowCustomizer(false)}
              className={`flex-1 py-3 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Save custom theme
                console.log('Custom theme saved:', customColors);
                setShowCustomizer(false);
              }}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
            >
              Save Theme
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              const defaultTheme = themes.find((t) => t.id === 'default');
              if (defaultTheme) {
                setCustomColors(defaultTheme.colors);
              }
            }}
            className={`w-full py-2 text-sm ${tc.textSecondary} hover:text-blue-500 transition-colors`}
          >
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}
