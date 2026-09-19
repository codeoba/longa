import { useTheme } from './ThemeContext';

export const useThemeClasses = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    bg: isDark ? 'bg-black' : 'bg-white',
    bgSecondary: isDark ? 'bg-gray-900' : 'bg-gray-50',
    bgTertiary: isDark ? 'bg-gray-800' : 'bg-gray-100',
    bgHover: isDark ? 'hover:bg-gray-900/30' : 'hover:bg-gray-50',
    bgHoverSecondary: isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100',
    bgBackdrop: isDark ? 'bg-black/80' : 'bg-white/80',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-700',
    textTertiary: isDark ? 'text-gray-500' : 'text-gray-500',
    border: isDark ? 'border-gray-800/50' : 'border-gray-200',
    borderSecondary: isDark ? 'border-gray-800/30' : 'border-gray-100',
    input: isDark ? 'bg-gray-900 border-transparent focus-within:border-blue-500 focus-within:bg-black' : 'bg-gray-100 border-transparent focus-within:border-blue-500 focus-within:bg-white',
    modal: isDark ? 'bg-black border-gray-800/50' : 'bg-white border-gray-200',
    card: isDark ? 'bg-gray-900/40 border-gray-800/50' : 'bg-gray-50 border-gray-200',
  };
};
