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
  isFollowing?: boolean;
  isMuted?: boolean;
  isBlocked?: boolean;
}

export interface Reply {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
  replies: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: Date;
  hasVoted: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  voted: boolean;
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
  pinned?: boolean;
  isPremium?: boolean;
  replyList?: Reply[];
  isOwn?: boolean;
  poll?: Poll;
  quotePost?: Post;
}

export interface Notification {
  id: string;
  type: 'like' | 'retweet' | 'reply' | 'follow' | 'mention';
  user: User;
  content?: string;
  postContent?: string;
  timestamp: Date;
  read: boolean;
}

export interface Message {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  read?: boolean;
}

export interface Trend {
  id: string;
  category: string;
  name: string;
  posts: string;
  description?: string;
}

export interface UserList {
  id: string;
  name: string;
  members: number;
  description: string;
  isPrivate: boolean;
  followers: number;
  memberUsers?: User[];
}

export interface Draft {
  id: string;
  content: string;
  image?: string;
  poll?: Poll;
  createdAt: Date;
}

export interface Space {
  id: string;
  title: string;
  host: User;
  speakers: User[];
  listeners: number;
  isLive: boolean;
  startedAt: Date;
  description?: string;
  tags: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string;
  banner?: string;
  members: number;
  isMember: boolean;
  isPrivate: boolean;
  admin: User;
  rules: string[];
  topics: string[];
}

export interface AnalyticsData {
  period: '7d' | '30d' | '90d';
  impressions: number;
  engagements: number;
  engagementRate: number;
  followers: number;
  followersChange: number;
  topPosts: Post[];
  profileVisits: number;
  mentions: number;
}

export interface GrokMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type Page = 'home' | 'explore' | 'notifications' | 'messages' | 'bookmarks' | 'profile' | 'settings' | 'lists' | 'premium' | 'user-profile' | 'thread' | 'grok' | 'spaces' | 'communities' | 'analytics' | 'drafts' | 'stories' | 'videos' | 'live' | 'monetization' | 'advanced-analytics' | 'bookmark-collections' | 'reading-list' | 'location' | 'collaborative' | 'search' | 'scheduled' | 'ai-images' | 'themes' | 'offline' | 'thread-builder' | 'account-settings' | 'edit-profile';
