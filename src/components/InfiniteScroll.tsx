import { useEffect, useRef, useCallback, useState } from 'react';

export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setIsLoading(true);
        // Simulate loading delay
        setTimeout(() => {
          callback();
          setIsLoading(false);
        }, 1000);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, callback]);

  return { lastElementRef, isLoading };
}

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
