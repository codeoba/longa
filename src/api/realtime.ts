/**
 * Realtime Client using Server-Sent Events (SSE)
 */

import { getApiUrl } from './phpAdapter';

export interface RealtimeMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_handle: string;
  sender_avatar: string;
  content: string;
  created_at: string;
}

export interface RealtimeNotification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  actor_name: string;
  actor_avatar: string;
  created_at: string;
}

interface RealtimeCallbacks {
  onMessage?: (message: RealtimeMessage) => void;
  onNotification?: (notification: RealtimeNotification) => void;
  onStatusChange?: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
}

class RealtimeService {
  private eventSource: EventSource | null = null;
  private currentUserId: string | null = null;
  private callbacks: Set<RealtimeCallbacks> = new Set();
  private reconnectTimeout: any = null;
  private isConnecting: boolean = false;

  public subscribe(userId: string, callback: RealtimeCallbacks): () => void {
    this.callbacks.add(callback);
    this.currentUserId = userId;

    if (!this.eventSource && !this.isConnecting) {
      this.connect(userId);
    }

    return () => {
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) {
        this.disconnect();
      }
    };
  }

  private connect(userId: string) {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;

    this.isConnecting = true;
    try {
      const url = `${getApiUrl()}/realtime/stream?user_id=${encodeURIComponent(userId)}`;
      this.eventSource = new EventSource(url);

      this.eventSource.addEventListener('connected', () => {
        this.isConnecting = false;
        this.callbacks.forEach(cb => cb.onStatusChange?.('connected'));
      });

      this.eventSource.addEventListener('new_message', (e: MessageEvent) => {
        try {
          const data: RealtimeMessage = JSON.parse(e.data);
          this.callbacks.forEach(cb => cb.onMessage?.(data));
        } catch (err) {
          console.error('[Realtime] Failed to parse new_message:', err);
        }
      });

      this.eventSource.addEventListener('new_notification', (e: MessageEvent) => {
        try {
          const data: RealtimeNotification = JSON.parse(e.data);
          this.callbacks.forEach(cb => cb.onNotification?.(data));
        } catch (err) {
          console.error('[Realtime] Failed to parse new_notification:', err);
        }
      });

      this.eventSource.onerror = () => {
        this.isConnecting = false;
        this.callbacks.forEach(cb => cb.onStatusChange?.('reconnecting'));
        this.disconnect();
        
        // Reconnect after 3 seconds
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          if (this.currentUserId && this.callbacks.size > 0) {
            this.connect(this.currentUserId);
          }
        }, 3000);
      };
    } catch (err) {
      this.isConnecting = false;
      console.warn('[Realtime] Could not connect to SSE stream:', err);
    }
  }

  public disconnect() {
    clearTimeout(this.reconnectTimeout);
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.callbacks.forEach(cb => cb.onStatusChange?.('disconnected'));
  }
}

export const realtime = new RealtimeService();
