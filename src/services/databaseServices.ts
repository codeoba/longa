import { db } from '../database';
import { COLLECTIONS } from '../database/config';
import { Post, User } from '../types';

// Posts Service - CRUD operations kwa posts
export class PostsService {
  // Create new post
  static async createPost(postData: Omit<Post, 'id'>): Promise<Post> {
    return db.create(COLLECTIONS.POSTS, {
      ...postData,
      createdAt: new Date().toISOString()
    });
  }
  
  // Get post by ID
  static async getPost(id: string): Promise<Post | null> {
    return db.read<Post>(COLLECTIONS.POSTS, id);
  }
  
  // Update post
  static async updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
    return db.update(COLLECTIONS.POSTS, id, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }
  
  // Delete post
  static async deletePost(id: string): Promise<boolean> {
    return db.delete(COLLECTIONS.POSTS, id);
  }
  
  // Get all posts (with pagination)
  static async getPosts(options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }): Promise<Post[]> {
    return db.list<Post>(COLLECTIONS.POSTS, options);
  }
  
  // Get posts by user
  static async getPostsByUser(userId: string): Promise<Post[]> {
    return db.query<Post>(COLLECTIONS.POSTS, [
      { field: 'user.id', operator: '==', value: userId }
    ]);
  }
  
  // Get trending posts (most liked)
  static async getTrendingPosts(limit: number = 10): Promise<Post[]> {
    return db.list<Post>(COLLECTIONS.POSTS, {
      limit,
      orderBy: 'likes',
      orderDirection: 'desc'
    });
  }
  
  // Get recent posts
  static async getRecentPosts(limit: number = 20): Promise<Post[]> {
    return db.list<Post>(COLLECTIONS.POSTS, {
      limit,
      orderBy: 'timestamp',
      orderDirection: 'desc'
    });
  }
  
  // Like post
  static async likePost(postId: string): Promise<Post | null> {
    const post = await this.getPost(postId);
    if (!post) return null;
    
    return this.updatePost(postId, {
      likes: (post.likes || 0) + 1,
      liked: true
    });
  }
  
  // Unlike post
  static async unlikePost(postId: string): Promise<Post | null> {
    const post = await this.getPost(postId);
    if (!post) return null;
    
    return this.updatePost(postId, {
      likes: Math.max(0, (post.likes || 0) - 1),
      liked: false
    });
  }
  
  // Retweet post
  static async retweetPost(postId: string): Promise<Post | null> {
    const post = await this.getPost(postId);
    if (!post) return null;
    
    return this.updatePost(postId, {
      retweets: (post.retweets || 0) + 1,
      retweeted: true
    });
  }
  
  // Search posts
  static async searchPosts(query: string): Promise<Post[]> {
    return db.query<Post>(COLLECTIONS.POSTS, [
      { field: 'content', operator: 'contains', value: query }
    ]);
  }
  
  // Subscribe to posts (real-time)
  static subscribeToPosts(callback: (posts: Post[]) => void): () => void {
    return db.subscribe<Post>(COLLECTIONS.POSTS, callback);
  }
}

// Users Service - CRUD operations kwa users
export class UsersService {
  // Create user
  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return db.create(COLLECTIONS.USERS, {
      ...userData,
      createdAt: new Date().toISOString()
    });
  }
  
  // Get user by ID
  static async getUser(id: string): Promise<User | null> {
    return db.read<User>(COLLECTIONS.USERS, id);
  }
  
  // Get user by handle
  static async getUserByHandle(handle: string): Promise<User | null> {
    const users = await db.query<User>(COLLECTIONS.USERS, [
      { field: 'handle', operator: '==', value: handle }
    ]);
    return users[0] || null;
  }
  
  // Update user
  static async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    return db.update(COLLECTIONS.USERS, id, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }
  
  // Follow user (increment counters)
  static async followUser(followingId: string): Promise<void> {
    const following = await this.getUser(followingId);
    if (!following) return;
    
    await this.updateUser(followingId, {
      followers: (following.followers || 0) + 1
    });
  }
  
  // Unfollow user (decrement counters)
  static async unfollowUser(followingId: string): Promise<void> {
    const following = await this.getUser(followingId);
    if (!following) return;
    
    await this.updateUser(followingId, {
      followers: Math.max(0, (following.followers || 0) - 1)
    });
  }
  
  // Search users
  static async searchUsers(query: string): Promise<User[]> {
    return db.query<User>(COLLECTIONS.USERS, [
      { field: 'name', operator: 'contains', value: query }
    ]);
  }
  
  // Get suggested users to follow
  static async getSuggestedUsers(userId: string, limit: number = 5): Promise<User[]> {
    const allUsers = await db.list<User>(COLLECTIONS.USERS, { limit: 100 });
    
    return allUsers
      .filter(u => u.id !== userId)
      .slice(0, limit);
  }
}

// Notifications Service
export class NotificationsService {
  static async createNotification(notification: any): Promise<any> {
    return db.create(COLLECTIONS.NOTIFICATIONS, {
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    });
  }
  
  static async getUserNotifications(userId: string): Promise<any[]> {
    return db.query(COLLECTIONS.NOTIFICATIONS, [
      { field: 'userId', operator: '==', value: userId }
    ]);
  }
  
  static async markAsRead(notificationId: string): Promise<void> {
    await db.update(COLLECTIONS.NOTIFICATIONS, notificationId, {
      read: true,
      readAt: new Date().toISOString()
    });
  }
  
  static async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getUserNotifications(userId);
    await Promise.all(
      notifications.map(n => this.markAsRead(n.id))
    );
  }
  
  static async getUnreadCount(userId: string): Promise<number> {
    return db.count(COLLECTIONS.NOTIFICATIONS, [
      { field: 'userId', operator: '==', value: userId },
      { field: 'read', operator: '==', value: false }
    ]);
  }
}

// Messages Service
export class MessagesService {
  static async sendMessage(conversationId: string, senderId: string, content: string): Promise<any> {
    return db.create(COLLECTIONS.MESSAGES, {
      conversationId,
      senderId,
      content,
      read: false,
      createdAt: new Date().toISOString()
    });
  }
  
  static async getConversationMessages(conversationId: string): Promise<any[]> {
    return db.query(COLLECTIONS.MESSAGES, [
      { field: 'conversationId', operator: '==', value: conversationId }
    ]);
  }
  
  static async markAsRead(messageId: string): Promise<void> {
    await db.update(COLLECTIONS.MESSAGES, messageId, {
      read: true,
      readAt: new Date().toISOString()
    });
  }
  
  static subscribeToConversation(conversationId: string, callback: (messages: any[]) => void): () => void {
    return db.subscribe(
      COLLECTIONS.MESSAGES,
      callback,
      [{ field: 'conversationId', operator: '==', value: conversationId }]
    );
  }
}
