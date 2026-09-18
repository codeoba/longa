import React, { useState, useCallback } from 'react';
import { Page, Post, Reply, User } from './types';
import { posts as initialPosts, currentUser, notifications as initialNotifications, messages as initialMessages, users, userLists as initialLists, suggestedLists } from './data';
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
import ThreadView from './components/ThreadView';
import UserProfile from './components/UserProfile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [followedUsers, setFollowedUsers] = useState<string[]>(users.filter(u => u.isFollowing).map(u => u.id));
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [lists, setLists] = useState(initialLists);
  const [followedLists, setFollowedLists] = useState<string[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    soundEffects: false,
    autoplay: true,
    language: 'English',
    contentFilter: 'medium',
  });
  const [premiumPlan, setPremiumPlan] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = initialMessages.filter(m => m.unread).length;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

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
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        const newBookmarked = !post.bookmarked;
        showToast(newBookmarked ? 'Post added to Bookmarks' : 'Post removed from Bookmarks');
        return { ...post, bookmarked: newBookmarked, bookmarks: newBookmarked ? post.bookmarks + 1 : post.bookmarks - 1 };
      }
      return post;
    }));
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
      isOwn: true,
      replyList: [],
    };
    setPosts(prev => [newPost, ...prev]);
    showToast('Your post was sent');
  }, []);

  const handleReply = useCallback((postId: string, content: string) => {
    const newReply: Reply = {
      id: 'r' + Date.now(),
      user: currentUser,
      content,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      replies: 0,
    };
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, replies: post.replies + 1, replyList: [...(post.replyList || []), newReply] }
        : post
    ));
    showToast('Your reply was sent');
  }, []);

  const handleDeletePost = useCallback((id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    showToast('Your post was deleted');
  }, []);

  const handlePinPost = useCallback((id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        const newPinned = !post.pinned;
        showToast(newPinned ? 'Pinned to your profile' : 'Unpinned from profile');
        return { ...post, pinned: newPinned };
      }
      // Unpin other posts when pinning a new one
      if (post.isOwn || post.user.id === currentUser.id) {
        return { ...post, pinned: false };
      }
      return post;
    }));
  }, []);

  const handleViewThread = useCallback((id: string) => {
    setSelectedThreadId(id);
    setCurrentPage('thread');
  }, []);

  const handleUserClick = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setCurrentPage('user-profile');
  }, []);

  const incrementViews = useCallback((id: string) => {
    setPosts(prev => prev.map(post =>
      post.id === id ? { ...post, views: post.views + 1 } : post
    ));
  }, []);

  const handleFollowUser = useCallback((userId: string) => {
    setFollowedUsers(prev => {
      const isFollowing = prev.includes(userId);
      if (isFollowing) {
        showToast('Unfollowed');
        return prev.filter(id => id !== userId);
      } else {
        showToast('Following');
        return [...prev, userId];
      }
    });
  }, []);

  const handleMuteUser = useCallback((userId: string) => {
    setMutedUsers(prev => {
      const isMuted = prev.includes(userId);
      showToast(isMuted ? 'Unmuted' : 'Muted');
      return isMuted ? prev.filter(id => id !== userId) : [...prev, userId];
    });
  }, []);

  const handleBlockUser = useCallback((userId: string) => {
    setBlockedUsers(prev => {
      const isBlocked = prev.includes(userId);
      showToast(isBlocked ? 'Unblocked' : 'Blocked');
      return isBlocked ? prev.filter(id => id !== userId) : [...prev, userId];
    });
  }, []);

  const handleMarkNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleCreateList = useCallback((name: string, description: string, isPrivate: boolean) => {
    const newList = {
      id: 'l' + Date.now(),
      name,
      members: 1,
      description,
      isPrivate,
      followers: 0,
      memberUsers: [currentUser],
    };
    setLists(prev => [...prev, newList]);
    showToast('List created successfully');
  }, []);

  const handleFollowList = useCallback((listId: string) => {
    setFollowedLists(prev => {
      const isFollowing = prev.includes(listId);
      showToast(isFollowing ? 'Unfollowed list' : 'Following list');
      return isFollowing ? prev.filter(id => id !== listId) : [...prev, listId];
    });
  }, []);

  const handleDeleteList = useCallback((listId: string) => {
    setLists(prev => prev.filter(l => l.id !== listId));
    showToast('List deleted');
  }, []);

  const handleNavigate = useCallback((page: Page | string) => {
    setCurrentPage(page as Page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Feed
            posts={posts}
            onLike={handleLike}
            onRetweet={handleRetweet}
            onBookmark={handleBookmark}
            onNewPost={handleNewPost}
            onReply={handleReply}
            onDelete={handleDeletePost}
            onPin={handlePinPost}
            onViewThread={handleViewThread}
            onUserClick={handleUserClick}
            incrementViews={incrementViews}
          />
        );
      case 'explore':
        return <Explore onNavigate={handleNavigate} />;
      case 'notifications':
        return (
          <Notifications
            notifications={notifications}
            onMarkAllRead={handleMarkNotificationsRead}
            onFollowUser={handleFollowUser}
            followedUsers={followedUsers}
          />
        );
      case 'messages':
        return <Messages />;
      case 'profile':
        return (
          <Profile
            user={currentUser}
            posts={posts.filter(p => p.user.id === currentUser.id || p.isOwn)}
            onLike={handleLike}
            onRetweet={handleRetweet}
            onBookmark={handleBookmark}
            onReply={handleReply}
            onDelete={handleDeletePost}
            onPin={handlePinPost}
            onViewThread={handleViewThread}
            onUserClick={handleUserClick}
            incrementViews={incrementViews}
            isOwnProfile
          />
        );
      case 'user-profile':
        const selectedUser = users.find(u => u.id === selectedUserId);
        if (selectedUser) {
          return (
            <UserProfile
              user={selectedUser}
              posts={posts.filter(p => p.user.id === selectedUser.id)}
              isFollowing={followedUsers.includes(selectedUser.id)}
              onFollow={() => handleFollowUser(selectedUser.id)}
              onLike={handleLike}
              onRetweet={handleRetweet}
              onBookmark={handleBookmark}
              onReply={handleReply}
              onViewThread={handleViewThread}
              onUserClick={handleUserClick}
              incrementViews={incrementViews}
              onBack={() => setCurrentPage('home')}
              isMuted={mutedUsers.includes(selectedUser.id)}
              isBlocked={blockedUsers.includes(selectedUser.id)}
              onMute={() => handleMuteUser(selectedUser.id)}
              onBlock={() => handleBlockUser(selectedUser.id)}
            />
          );
        }
        return null;
      case 'bookmarks':
        return (
          <Bookmarks
            posts={posts}
            onLike={handleLike}
            onRetweet={handleRetweet}
            onBookmark={handleBookmark}
            onReply={handleReply}
            onViewThread={handleViewThread}
            onUserClick={handleUserClick}
            incrementViews={incrementViews}
          />
        );
      case 'premium':
        return <PremiumPage selectedPlan={premiumPlan} onSelectPlan={setPremiumPlan} />;
      case 'settings':
        return <Settings settings={settings} onSettingsChange={setSettings} />;
      case 'lists':
        return (
          <Lists
            lists={lists}
            suggestedLists={suggestedLists}
            followedLists={followedLists}
            onCreateList={handleCreateList}
            onFollowList={handleFollowList}
            onDeleteList={handleDeleteList}
          />
        );
      case 'thread':
        const threadPost = posts.find(p => p.id === selectedThreadId);
        if (threadPost) {
          return (
            <ThreadView
              post={threadPost}
              allPosts={posts}
              onLike={handleLike}
              onRetweet={handleRetweet}
              onBookmark={handleBookmark}
              onReply={handleReply}
              onDelete={handleDeletePost}
              onPin={handlePinPost}
              onViewThread={handleViewThread}
              onUserClick={handleUserClick}
              incrementViews={incrementViews}
              onBack={() => setCurrentPage('home')}
            />
          );
        }
        return null;
      default:
        return null;
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
        <RightPanel onNavigate={handleNavigate} followedUsers={followedUsers} onFollowUser={handleFollowUser} />
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-blue-500 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  );
}
