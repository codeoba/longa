/**
 * PHP Backend Adapter for Frontend
 * 
 * Hii adapter inaruhusu frontend kuconnect na PHP backend
 * Badilisha API_URL na URL ya backend yako
 */

const API_URL = 'https://yourdomain.com/api'; // Badilisha na URL yako

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Helper function kwa API calls
async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config: ApiOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== POSTS API ====================
export const PostsAPI = {
  // Get all posts
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/posts${query ? '?' + query : ''}`);
  },
  
  // Get single post
  get: (id) => apiCall(`/posts/${id}`),
  
  // Create post
  create: (data) => apiCall('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update post
  update: (id, data) => apiCall(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete post
  delete: (id) => apiCall(`/posts/${id}`, {
    method: 'DELETE',
  }),
  
  // Like post
  like: (id) => apiCall(`/posts/${id}/like`, {
    method: 'POST',
  }),
  
  // Unlike post
  unlike: (id) => apiCall(`/posts/${id}/unlike`, {
    method: 'POST',
  }),
  
  // Retweet post
  retweet: (id) => apiCall(`/posts/${id}/retweet`, {
    method: 'POST',
  }),
};

// ==================== USERS API ====================
export const UsersAPI = {
  // Get all users
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/users${query ? '?' + query : ''}`);
  },
  
  // Get single user
  get: (id) => apiCall(`/users/${id}`),
  
  // Search users
  search: (query, limit = 20) => apiCall(`/users/search?q=${query}&limit=${limit}`),
  
  // Create user
  create: (data) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update user
  update: (id, data) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete user
  delete: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
  
  // Follow user
  follow: (id, followerId) => apiCall(`/users/${id}/follow`, {
    method: 'POST',
    body: JSON.stringify({ follower_id: followerId }),
  }),
  
  // Unfollow user
  unfollow: (id) => apiCall(`/users/${id}/unfollow`, {
    method: 'POST',
  }),
};

// ==================== NOTIFICATIONS API ====================
export const NotificationsAPI = {
  // Get notifications
  getAll: (userId, limit = 50) => apiCall(`/notifications?user_id=${userId}&limit=${limit}`),
  
  // Get unread count
  getUnreadCount: (userId) => apiCall(`/notifications/unread-count?user_id=${userId}`),
  
  // Create notification
  create: (data) => apiCall('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Mark as read
  markAsRead: (id) => apiCall(`/notifications/${id}/read`, {
    method: 'PUT',
  }),
  
  // Mark all as read
  markAllAsRead: (userId) => apiCall('/notifications/read-all', {
    method: 'PUT',
    body: JSON.stringify({ user_id: userId }),
  }),
};

// ==================== MESSAGES API ====================
export const MessagesAPI = {
  // Get conversations
  getConversations: (userId) => apiCall(`/messages?user_id=${userId}`),
  
  // Get messages in conversation
  getMessages: (conversationId, limit = 50) => 
    apiCall(`/messages/${conversationId}?limit=${limit}`),
  
  // Get unread count
  getUnreadCount: (userId) => apiCall(`/messages/unread-count?user_id=${userId}`),
  
  // Send message
  send: (data) => apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Mark as read
  markAsRead: (id) => apiCall(`/messages/${id}/read`, {
    method: 'PUT',
  }),
  
  // Mark all as read
  markAllAsRead: (conversationId, userId) => apiCall('/messages/read-all', {
    method: 'PUT',
    body: JSON.stringify({ conversation_id: conversationId, user_id: userId }),
  }),
};

// ==================== AUTH API ====================
export const AuthAPI = {
  // Register new user
  register: (name: string, handle: string, email: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, handle, email, password }),
    }),

  // Login user
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Logout user
  logout: () => apiCall('/auth/logout', { method: 'POST' }),

  // Get current user
  me: () => apiCall('/auth/me'),

  // Verify email
  verifyEmail: (token: string) =>
    apiCall('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  // Forgot password
  forgotPassword: (email: string) =>
    apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Reset password
  resetPassword: (token: string, password: string) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  // Change password
  changePassword: (currentPassword: string, newPassword: string) =>
    apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),
};

// Export all APIs
export default {
  auth: AuthAPI,
  posts: PostsAPI,
  users: UsersAPI,
  notifications: NotificationsAPI,
  messages: MessagesAPI,
};
