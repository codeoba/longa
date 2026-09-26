import React from 'react';

interface AvatarProps {
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  alt?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const isImageUrl = (avatar?: string): boolean => {
  if (!avatar) return false;
  return (
    avatar.startsWith('http://') ||
    avatar.startsWith('https://') ||
    avatar.startsWith('/uploads/') ||
    avatar.startsWith('data:image/') ||
    avatar.startsWith('blob:') ||
    avatar.includes('/api/uploads/')
  );
};

export default function Avatar({
  src = '👤',
  size = 'md',
  className = '',
  alt = 'Avatar',
  onClick,
}: AvatarProps) {
  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-2xl',
    '2xl': 'w-[120px] h-[120px] text-5xl',
  };

  const baseSize = sizeClasses[size] || '';
  const isImg = isImageUrl(src);

  return (
    <div
      onClick={onClick}
      className={`rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 select-none ${
        isImg ? 'bg-zinc-800' : 'bg-gradient-to-br from-blue-500 to-purple-600'
      } ${baseSize} ${className}`}
    >
      {isImg ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{src || '👤'}</span>
      )}
    </div>
  );
}
