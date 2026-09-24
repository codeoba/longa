/**
 * PHP Backend Adapter for Frontend
 * 
 * Hii adapter inaruhusu frontend kuconnect na PHP backend
 */

export const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      // Default local PHP dev server address (run: php -S localhost:8000 -t backend)
      return 'http://localhost:8000';
    }
    // In production, fallback to relative /api or api subdomain
    return window.location.origin + '/api';
  }
  
  return 'https://api.longa.app';
};

export const API_URL = getApiUrl();

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Helper function kwa API calls
async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const authHeaders: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  const config: ApiOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({ error: 'Invalid JSON response from server' }));
    
    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error: any) {
    console.warn(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}


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

// ==================== POSTS API ====================
export const PostsAPI = {
  getAll: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/posts${query ? '?' + query : ''}`);
  },
  
  get: (id: string | number) => apiCall(`/posts/${id}`),
  
  create: (data: any) => apiCall('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => apiCall(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => apiCall(`/posts/${id}`, {
    method: 'DELETE',
  }),
  
  like: (id: string | number) => apiCall(`/posts/${id}/like`, {
    method: 'POST',
  }),
  
  unlike: (id: string | number) => apiCall(`/posts/${id}/unlike`, {
    method: 'POST',
  }),
  
  retweet: (id: string | number) => apiCall(`/posts/${id}/retweet`, {
    method: 'POST',
  }),
};

// ==================== USERS API ====================
export const UsersAPI = {
  getAll: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/users${query ? '?' + query : ''}`);
  },
  
  get: (id: string | number) => apiCall(`/users/${id}`),
  
  search: (query: string, limit: number = 20) => 
    apiCall(`/users/search?q=${query}&limit=${limit}`),
  
  create: (data: any) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
  
  follow: (id: string | number, followerId: string | number) => apiCall(`/users/${id}/follow`, {
    method: 'POST',
    body: JSON.stringify({ follower_id: followerId }),
  }),
  
  unfollow: (id: string | number) => apiCall(`/users/${id}/unfollow`, {
    method: 'POST',
  }),
};

// ==================== NOTIFICATIONS API ====================
export const NotificationsAPI = {
  getAll: (userId: string | number, limit: number = 50) => 
    apiCall(`/notifications?user_id=${userId}&limit=${limit}`),
  
  getUnreadCount: (userId: string | number) => 
    apiCall(`/notifications/unread-count?user_id=${userId}`),
  
  create: (data: any) => apiCall('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  markAsRead: (id: string | number) => apiCall(`/notifications/${id}/read`, {
    method: 'PUT',
  }),
  
  markAllAsRead: (userId: string | number) => apiCall('/notifications/read-all', {
    method: 'PUT',
    body: JSON.stringify({ user_id: userId }),
  }),
};

// ==================== MESSAGES API ====================
export const MessagesAPI = {
  getConversations: (userId: string | number) => 
    apiCall(`/messages?user_id=${userId}`),
  
  getMessages: (conversationId: string, limit: number = 50) => 
    apiCall(`/messages/${conversationId}?limit=${limit}`),
  
  getUnreadCount: (userId: string | number) => 
    apiCall(`/messages/unread-count?user_id=${userId}`),
  
  send: (data: any) => apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  markAsRead: (id: string | number) => apiCall(`/messages/${id}/read`, {
    method: 'PUT',
  }),
  
  markAllAsRead: (conversationId: string, userId: string | number) => 
    apiCall('/messages/read-all', {
      method: 'PUT',
      body: JSON.stringify({ conversation_id: conversationId, user_id: userId }),
    }),
};

// ==================== UPLOAD API ====================
export const UploadAPI = {
  upload: async (file: File | Blob | string): Promise<{ url: string; filename: string }> => {
    const baseUrl = getApiUrl();
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const authHeaders: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

    if (typeof file === 'string' && file.startsWith('data:')) {
      const res = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ data: file }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      return json;
    }

    const formData = new FormData();
    formData.append('file', file as Blob);

    const res = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: {
        ...authHeaders,
      },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    return json;
  }
};

export const uploadMedia = UploadAPI.upload;

// Export all APIs
export default {
  auth: AuthAPI,
  posts: PostsAPI,
  users: UsersAPI,
  notifications: NotificationsAPI,
  messages: MessagesAPI,
  upload: UploadAPI,
};
