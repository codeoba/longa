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
    // Dark mode: Longa-style dark blue-gray (60% less dark than pure black)
    // Light mode: Pure white
    bg: isDark ? 'bg-[#15202b]' : 'bg-white',
    bgSecondary: isDark ? 'bg-[#192734]' : 'bg-gray-50',
    bgTertiary: isDark ? 'bg-[#22303c]' : 'bg-gray-100',
    bgHover: isDark ? 'hover:bg-[#192734]' : 'hover:bg-gray-50',
    bgHoverSecondary: isDark ? 'hover:bg-[#22303c]' : 'hover:bg-gray-100',
    bgBackdrop: isDark ? 'bg-[#15202b]/80' : 'bg-white/80',
    bgCard: isDark ? 'bg-[#192734]/60' : 'bg-gray-50',
    bgInput: isDark ? 'bg-[#253341]' : 'bg-gray-100',
    bgModal: isDark ? 'bg-[#15202b]' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-700',
    textTertiary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-500',
    border: isDark ? 'border-[#38444d]' : 'border-gray-200',
    borderSecondary: isDark ? 'border-[#38444d]/50' : 'border-gray-100',
    borderLight: isDark ? 'border-[#38444d]' : 'border-gray-300',
    shadow: isDark ? 'shadow-black/50' : 'shadow-gray-300/50',
  };
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
