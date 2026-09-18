export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  verified: boolean;
  premium: boolean;
  followers: number;
  following: number;
  posts: number;
  joinedDate: string;
  location?: string;
  website?: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  bookmarks: number;
  liked: boolean;
  retweeted: boolean;
  bookmarked: boolean;
  isPremium?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'retweet' | 'reply' | 'follow' | 'mention';
  user: User;
  content?: string;
  timestamp: Date;
  read: boolean;
}

export interface Message {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export interface Trend {
  id: string;
  category: string;
  name: string;
  posts: string;
}

export type Page = 'home' | 'explore' | 'notifications' | 'messages' | 'bookmarks' | 'profile' | 'settings' | 'lists' | 'premium';
