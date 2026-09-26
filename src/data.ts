import { User, Post, Notification, Message, Trend, UserList, Reply, Draft, Space, Community, AnalyticsData } from './types';

export const currentUser: User = {
  id: '1',
  name: 'Amani Tech',
  handle: '@longa_user',
  avatar: '👨‍💻',
  bio: '🚀 Full Stack Developer | Building the future | Open Source Contributor | Tech Enthusiast from Tanzania 🇹🇿',
  verified: true,
  premium: true,
  followers: 15420,
  following: 892,
  posts: 3241,
  joinedDate: 'March 2019',
  location: 'Dar es Salaam, Tanzania',
  website: 'amanitech.dev',
  isFollowing: false,
};

export const users: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Zawadi Innovation',
    handle: '@zawadi_innov',
    avatar: '👩‍🔬',
    bio: 'Innovation Lead @TechAfrica | AI & ML Researcher | Speaker',
    verified: true,
    premium: true,
    followers: 89200,
    following: 432,
    posts: 12500,
    joinedDate: 'January 2018',
    location: 'Nairobi, Kenya',
    isFollowing: true,
  },
  {
    id: '3',
    name: 'Baraka Digital',
    handle: '@barakadigital',
    avatar: '🎨',
    bio: 'UI/UX Designer | Creative Director | Making pixels beautiful ✨',
    verified: true,
    premium: false,
    followers: 45600,
    following: 1200,
    posts: 8900,
    joinedDate: 'June 2020',
    isFollowing: false,
  },
  {
    id: '4',
    name: 'Neema AI',
    handle: '@neema_ai',
    avatar: '🤖',
    bio: 'Artificial Intelligence Researcher | Deep Learning | NLP | Building the future of AI',
    verified: true,
    premium: true,
    followers: 125000,
    following: 234,
    posts: 5600,
    joinedDate: 'September 2017',
    location: 'San Francisco, CA',
    isFollowing: true,
  },
  {
    id: '5',
    name: 'Furaha Dev',
    handle: '@furahadev',
    avatar: '👨‍🎓',
    bio: 'Software Engineer @BigTech | React | TypeScript | Node.js',
    verified: false,
    premium: false,
    followers: 8900,
    following: 567,
    posts: 2340,
    joinedDate: 'February 2021',
    isFollowing: false,
  },
  {
    id: '6',
    name: 'Upendo Crypto',
    handle: '@upendo_crypto',
    avatar: '💎',
    bio: 'Blockchain Developer | Web3 Enthusiast | DeFi Builder | Ethereum Maximalist',
    verified: true,
    premium: true,
    followers: 67800,
    following: 345,
    posts: 9800,
    joinedDate: 'April 2019',
    isFollowing: true,
  },
  {
    id: '7',
    name: 'Rehema Cloud',
    handle: '@rehemacloud',
    avatar: '☁️',
    bio: 'Cloud Architect | AWS | GCP | DevOps | Infrastructure as Code',
    verified: true,
    premium: false,
    followers: 34500,
    following: 678,
    posts: 6700,
    joinedDate: 'July 2018',
    isFollowing: false,
  },
  {
    id: '8',
    name: 'Jabali Security',
    handle: '@jabali_sec',
    avatar: '🛡️',
    bio: 'Cybersecurity Expert | Penetration Testing | Bug Bounty Hunter | CTF Player',
    verified: true,
    premium: true,
    followers: 52300,
    following: 189,
    posts: 4200,
    joinedDate: 'November 2019',
    isFollowing: false,
  },
];

export const replies: Record<string, Reply[]> = {};

export const posts: Post[] = [];


export const notifications: Notification[] = [];

export const messages: Message[] = [];


export const trends: Trend[] = [
  { id: '1', category: 'Technology · Trending', name: '#AIRevolution', posts: '125K posts', description: 'Artificial Intelligence is transforming every industry' },
  { id: '2', category: 'Trending in Tanzania', name: '#TechAfrica', posts: '89.2K posts', description: 'African tech ecosystem growing rapidly' },
  { id: '3', category: 'Programming · Trending', name: 'TypeScript 6.0', posts: '67.8K posts', description: 'New features in the latest TypeScript release' },
  { id: '4', category: 'Business · Trending', name: '#StartupLife', posts: '45.6K posts', description: 'Entrepreneurs sharing their journey' },
  { id: '5', category: 'Science · Trending', name: 'Quantum Computing', posts: '34.5K posts', description: 'Breakthroughs in quantum technology' },
  { id: '6', category: 'Trending in East Africa', name: '#Innovation2026', posts: '28.9K posts', description: 'New innovations shaping the future' },
  { id: '7', category: 'Technology · Trending', name: '#WebDevelopment', posts: '23.4K posts', description: 'Latest trends in web development' },
  { id: '8', category: 'Entertainment · Trending', name: '#OpenSource', posts: '19.8K posts', description: 'Open source projects making impact' },
  { id: '9', category: 'Sports · Trending', name: '#eSports2026', posts: '15.6K posts', description: 'Competitive gaming reaches new heights' },
  { id: '10', category: 'Music · Trending', name: '#Afrobeats', posts: '12.3K posts', description: 'African music taking over the world' },
];

export const userLists: UserList[] = [
  { id: '1', name: 'Tech Leaders', members: 45, description: 'Top tech influencers and innovators', isPrivate: false, followers: 1200, memberUsers: [users[1], users[3], users[4]] },
  { id: '2', name: 'AI Researchers', members: 23, description: 'Artificial intelligence experts', isPrivate: false, followers: 890, memberUsers: [users[3], users[7]] },
  { id: '3', name: 'Design Inspiration', members: 67, description: 'Creative designers and artists', isPrivate: true, followers: 2300, memberUsers: [users[2]] },
  { id: '4', name: 'Startup Founders', members: 34, description: 'Entrepreneurs building the future', isPrivate: false, followers: 560, memberUsers: [users[5], users[6]] },
];

export const suggestedLists: UserList[] = [
  { id: 's1', name: 'Top Tech Voices', members: 250, description: 'The most influential voices in tech', isPrivate: false, followers: 12500 },
  { id: 's2', name: 'AI & Machine Learning', members: 180, description: 'Everything about AI and ML', isPrivate: false, followers: 8200 },
  { id: 's3', name: 'Startup Ecosystem', members: 120, description: 'Startups, VCs, and innovation', isPrivate: false, followers: 5700 },
  { id: 's4', name: 'Web3 Builders', members: 95, description: 'Blockchain and DeFi developers', isPrivate: false, followers: 4300 },
];

export const emojiList = ['😀', '😂', '🥰', '😎', '🤔', '👍', '👏', '🙌', '🔥', '💯', '🚀', '💡', '🎉', '❤️', '💪', '✨', '🌟', '🎯', '💻', '🤖', '☁️', '🔗', '🛡️', '📱', '⚡', '🌍', '🇹🇿', '🇰🇪', '🏆', '📊'];

export const initialDrafts: Draft[] = [];


export const spaces: Space[] = [
  {
    id: 'sp1',
    title: 'The Future of AI in Africa',
    host: users[3],
    speakers: [users[1], users[3], users[7]],
    listeners: 2340,
    isLive: true,
    startedAt: new Date(Date.now() - 1000 * 60 * 45),
    description: 'Discussing how AI will shape the African tech ecosystem in the next decade',
    tags: ['AI', 'Africa', 'Tech', 'Future'],
  },
  {
    id: 'sp2',
    title: 'Web3 Builders Roundtable',
    host: users[5],
    speakers: [users[5], users[6]],
    listeners: 890,
    isLive: true,
    startedAt: new Date(Date.now() - 1000 * 60 * 20),
    description: 'Weekly discussion on blockchain development and DeFi',
    tags: ['Web3', 'Blockchain', 'DeFi'],
  },
  {
    id: 'sp3',
    title: 'Design Systems at Scale',
    host: users[2],
    speakers: [users[2]],
    listeners: 567,
    isLive: false,
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    description: 'How to build and maintain design systems for large organizations',
    tags: ['Design', 'UI/UX', 'Systems'],
  },
];

export const communities: Community[] = [
  {
    id: 'c1',
    name: 'React Developers',
    description: 'A community for React developers to share knowledge, ask questions, and discuss best practices.',
    avatar: '⚛️',
    members: 45600,
    isMember: true,
    isPrivate: false,
    admin: users[4],
    rules: ['Be respectful', 'No spam', 'Stay on topic', 'Help others'],
    topics: ['React', 'JavaScript', 'Frontend', 'Web Development'],
  },
  {
    id: 'c2',
    name: 'AI & Machine Learning',
    description: 'Explore the latest in artificial intelligence and machine learning research and applications.',
    avatar: '🤖',
    members: 89200,
    isMember: true,
    isPrivate: false,
    admin: users[3],
    rules: ['Scientific discussions only', 'Cite sources', 'No misinformation'],
    topics: ['AI', 'ML', 'Deep Learning', 'NLP', 'Computer Vision'],
  },
  {
    id: 'c3',
    name: 'African Tech Hub',
    description: 'Connecting tech innovators across Africa. Share opportunities, collaborate on projects.',
    avatar: '🌍',
    members: 23400,
    isMember: false,
    isPrivate: false,
    admin: users[1],
    rules: ['Africa-focused content', 'Support local talent', 'Share opportunities'],
    topics: ['Africa', 'Tech', 'Startups', 'Innovation'],
  },
  {
    id: 'c4',
    name: 'Open Source Contributors',
    description: 'For developers who contribute to open source projects. Share your work and find collaborators.',
    avatar: '💻',
    members: 67800,
    isMember: false,
    isPrivate: false,
    admin: users[0],
    rules: ['Share your contributions', 'Help newcomers', 'No self-promotion spam'],
    topics: ['Open Source', 'GitHub', 'Contributing', 'FOSS'],
  },
];

export const analyticsData: AnalyticsData = {
  period: '30d',
  impressions: 0,
  engagements: 0,
  engagementRate: 0,
  followers: 0,
  followersChange: 0,
  topPosts: [],
  profileVisits: 0,
  mentions: 0,
};
