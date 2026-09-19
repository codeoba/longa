import { useTheme } from './ThemeContext';

export interface ThemeClasses {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  bgHover: string;
  bgHoverSecondary: string;
  bgBackdrop: string;
  bgCard: string;
  bgInput: string;
  bgModal: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  border: string;
  borderSecondary: string;
  borderLight: string;
  shadow: string;
}

export function useThemeClasses(): ThemeClasses {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    bg: isDark ? 'bg-black' : 'bg-white',
    bgSecondary: isDark ? 'bg-gray-900' : 'bg-gray-50',
    bgTertiary: isDark ? 'bg-gray-800' : 'bg-gray-100',
    bgHover: isDark ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50',
    bgHoverSecondary: isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100',
    bgBackdrop: isDark ? 'bg-black/80' : 'bg-white/80',
    bgCard: isDark ? 'bg-gray-900/40' : 'bg-gray-50',
    bgInput: isDark ? 'bg-gray-900' : 'bg-gray-100',
    bgModal: isDark ? 'bg-black' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-700',
    textTertiary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-500',
    border: isDark ? 'border-gray-800/50' : 'border-gray-200',
    borderSecondary: isDark ? 'border-gray-800/30' : 'border-gray-100',
    borderLight: isDark ? 'border-gray-700' : 'border-gray-300',
    shadow: isDark ? 'shadow-black/50' : 'shadow-gray-300/50',
  };
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
