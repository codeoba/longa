import React, { useState, useCallback } from 'react';
import { Page, Post } from './types';
import { posts as initialPosts, currentUser, notifications, messages } from './data';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Explore from './components/Explore';
import Notifications from './components/Notifications';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Bookmarks from './components/Bookmarks';
import PremiumPage from './components/PremiumPage';
import Settings from './components/Settings';
import Lists from './components/Lists';
import RightPanel from './components/RightPanel';
import ComposeTweet from './components/ComposeTweet';
import { Close, Verified, Premium } from './components/Icons';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  const handleLike = useCallback((id: string) => {
    setPosts(prev => prev.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  }, []);

  const handleRetweet = useCallback((id: string) => {
    setPosts(prev => prev.map(post =>
      post.id === id
        ? { ...post, retweeted: !post.retweeted, retweets: post.retweeted ? post.retweets - 1 : post.retweets + 1 }
        : post
    ));
  }, []);

  const handleBookmark = useCallback((id: string) => {
    setPosts(prev => prev.map(post =>
      post.id === id
        ? { ...post, bookmarked: !post.bookmarked, bookmarks: post.bookmarked ? post.bookmarks - 1 : post.bookmarks + 1 }
        : post
    ));
  }, []);

  const handleNewPost = useCallback((content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      content,
      timestamp: new Date(),
      likes: 0,
      retweets: 0,
      replies: 0,
      views: 0,
      bookmarks: 0,
      liked: false,
      retweeted: false,
      bookmarked: false,
      isPremium: true,
    };
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const handleNavigate = useCallback((page: Page | string) => {
    setCurrentPage(page as Page);
    setShowMobileMenu(false);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Feed posts={posts} onLike={handleLike} onRetweet={handleRetweet} onBookmark={handleBookmark} onNewPost={handleNewPost} />;
      case 'explore':
        return <Explore />;
      case 'notifications':
        return <Notifications />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <Profile onLike={handleLike} onRetweet={handleRetweet} onBookmark={handleBookmark} />;
      case 'bookmarks':
        return <Bookmarks posts={posts} onLike={handleLike} onRetweet={handleRetweet} onBookmark={handleBookmark} />;
      case 'premium':
        return <PremiumPage />;
      case 'settings':
        return <Settings />;
      case 'lists':
        return <Lists />;
      default:
        return <Feed posts={posts} onLike={handleLike} onRetweet={handleRetweet} onBookmark={handleBookmark} onNewPost={handleNewPost} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onCompose={() => setShowComposeModal(true)}
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-gray-800/50 md:hidden">
        <div className="flex items-center justify-around py-2">
          <button onClick={() => handleNavigate('home')} className={`p-3 ${currentPage === 'home' ? 'text-white' : 'text-gray-500'}`}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696z"/>
            </svg>
          </button>
          <button onClick={() => handleNavigate('explore')} className={`p-3 ${currentPage === 'explore' ? 'text-white' : 'text-gray-500'}`}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
            </svg>
          </button>
          <button onClick={() => handleNavigate('notifications')} className={`p-3 relative ${currentPage === 'notifications' ? 'text-white' : 'text-gray-500'}`}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958z"/>
            </svg>
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button onClick={() => handleNavigate('messages')} className={`p-3 relative ${currentPage === 'messages' ? 'text-white' : 'text-gray-500'}`}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13z"/>
            </svg>
            {unreadMessages > 0 && (
              <span className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-[68px] xl:ml-[275px] flex justify-center">
        <div className="w-full max-w-[600px] min-h-screen border-r border-gray-800/50 pb-16 md:pb-0">
          {renderPage()}
        </div>
        <RightPanel onNavigate={handleNavigate} />
      </main>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16">
          <div className="absolute inset-0 bg-blue-300/20 backdrop-blur-sm" onClick={() => setShowComposeModal(false)} />
          <div className="relative w-full max-w-[600px] mx-4 bg-black rounded-2xl border border-gray-800/50 shadow-2xl">
            <ComposeTweet
              isModal
              onClose={() => setShowComposeModal(false)}
              onSubmit={handleNewPost}
            />
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setShowComposeModal(true)}
        className="fixed bottom-20 right-4 z-50 md:hidden w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M23 3c-6.62 0-10.69 2.68-13.04 5.95-2.33 3.26-3.76 7.78-3.76 14.05h2c0-5.53 1.23-9.5 3.15-12.19C13.24 8.19 16.38 6 22 6v4.5l5-5-5-5V3z"/>
        </svg>
      </button>
    </div>
  );
}
