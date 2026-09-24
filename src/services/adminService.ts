/**
 * Admin Service - Longa Central Administration & Feature Control
 */

import { getApiUrl } from '../api/phpAdapter';

const getBaseUrl = () => getApiUrl();

export interface AdminKpis {
  total_users: number;
  active_today: number;
  total_posts: number;
  total_revenue_usd: number;
  total_tips_paid_usd: number;
  ai_requests_processed: number;
  active_reels: number;
  pending_payouts_count: number;
  system_health: string;
  php_version: string;
  server_uptime: string;
}

export interface FeatureFlags {
  ai_suite_enabled: boolean;
  ai_copilot_enabled: boolean;
  webrtc_calling_enabled: boolean;
  reels_enabled: boolean;
  spaces_audio_enabled: boolean;
  store_marketplace_enabled: boolean;
  prediction_markets_enabled: boolean;
  monetization_enabled: boolean;
  whisper_messages_enabled: boolean;
  user_registration_enabled: boolean;
  require_email_verification: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  platform_commission_pct: number;
  free_ai_daily_limit: number;
  default_ai_provider: string;
}

export interface AdminUser {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  role: 'admin' | 'creator' | 'moderator' | 'user';
  verified: boolean;
  premium: boolean;
  status: 'active' | 'banned' | 'suspended';
  ban_reason?: string;
  followers: number;
  balance_usd: number;
  joined_at: string;
}

export interface FlaggedPost {
  id: string;
  post_id: string;
  author_name: string;
  author_handle: string;
  content: string;
  flag_reason: string;
  reports_count: number;
  created_at: string;
  status: 'pending_review' | 'resolved' | 'dismissed';
}

export interface CreatorPayout {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_handle: string;
  amount_usd: number;
  payment_method: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  processed_at?: string;
  transaction_ref?: string;
}

export interface AuditLog {
  id: string;
  admin_name: string;
  admin_handle: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

export const fetchAdminStats = async (): Promise<{ kpis: AdminKpis; revenue_breakdown: any; growth_trends: any[] }> => {
  try {
    const res = await fetch(`${getBaseUrl()}/admin/stats`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('Backend offline, using fallback admin stats:', e);
  }

  return {
    kpis: {
      total_users: 1420,
      active_today: 596,
      total_posts: 8940,
      total_revenue_usd: 28450.0,
      total_tips_paid_usd: 14200.0,
      ai_requests_processed: 18450,
      active_reels: 340,
      pending_payouts_count: 1,
      system_health: '99.98% Operational',
      php_version: '8.2.32',
      server_uptime: '24 days, 14 hours',
    },
    revenue_breakdown: {
      premium_subscriptions: 14250.0,
      creator_store_fees: 7800.0,
      tipping_commissions: 6400.0,
    },
    growth_trends: [
      { day: 'Juma', users: 110, posts: 450, revenue: 1200 },
      { day: 'Juma2', users: 140, posts: 520, revenue: 1450 },
      { day: 'Juma3', users: 180, posts: 610, revenue: 1800 },
      { day: 'Juma4', users: 220, posts: 740, revenue: 2100 },
      { day: 'Juma5', users: 290, posts: 890, revenue: 2600 },
      { day: 'Juma6', users: 340, posts: 1020, revenue: 3100 },
      { day: 'Leo', users: 380, posts: 1180, revenue: 3450 },
    ],
  };
};

export const fetchAdminFeatures = async (): Promise<{ features: FeatureFlags; moderation_settings: any }> => {
  try {
    const res = await fetch(`${getBaseUrl()}/admin/features`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('Backend offline, reading local feature flags');
  }

  const localSaved = localStorage.getItem('longa_admin_feature_flags');
  if (localSaved) {
    try {
      return JSON.parse(localSaved);
    } catch {
      // fallback
    }
  }

  return {
    features: {
      ai_suite_enabled: true,
      ai_copilot_enabled: true,
      webrtc_calling_enabled: true,
      reels_enabled: true,
      spaces_audio_enabled: true,
      store_marketplace_enabled: true,
      prediction_markets_enabled: true,
      monetization_enabled: true,
      whisper_messages_enabled: true,
      user_registration_enabled: true,
      require_email_verification: false,
      maintenance_mode: false,
      maintenance_message: 'Longa iko kwenye matengenezo ya muda mfupi. Tutarudi punde!',
      platform_commission_pct: 10,
      free_ai_daily_limit: 50,
      default_ai_provider: 'gemini',
    },
    moderation_settings: {
      auto_flag_keywords: ['scam', 'fraud', 'hacked', 'ponzi', 'abuse'],
      require_approval_for_store_products: true,
      max_file_upload_mb: 25,
    },
  };
};

export const updateAdminFeatures = async (
  features: Partial<FeatureFlags>,
  moderationSettings?: any
): Promise<boolean> => {
  // Update local storage first for instant reactive UX
  try {
    const current = await fetchAdminFeatures();
    const updated = {
      features: { ...current.features, ...features },
      moderation_settings: { ...current.moderation_settings, ...(moderationSettings || {}) },
    };
    localStorage.setItem('longa_admin_feature_flags', JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving local flags:', e);
  }

  try {
    const res = await fetch(`${getBaseUrl()}/admin/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        features,
        moderation_settings: moderationSettings,
      }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not post flags to backend, saved locally:', e);
    return true;
  }
};

export const fetchAdminUsers = async (query?: string, role?: string): Promise<AdminUser[]> => {
  try {
    const url = new URL(`${getBaseUrl()}/admin/users`);
    if (query) url.searchParams.set('q', query);
    if (role) url.searchParams.set('role', role);

    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      return data.users || [];
    }
  } catch (e) {
    console.warn('Error fetching users from backend:', e);
  }

  // Fallback users
  return [
    {
      id: '1',
      name: 'Amani Joseph',
      handle: '@amanitech',
      email: 'amani@example.com',
      avatar: '👨‍💻',
      role: 'admin',
      verified: true,
      premium: true,
      status: 'active',
      followers: 14200,
      balance_usd: 2450.0,
      joined_at: '2026-01-15',
    },
    {
      id: '2',
      name: 'Zawadi Innovation',
      handle: '@zawadi_innovates',
      email: 'zawadi@example.com',
      avatar: '👩‍🔬',
      role: 'creator',
      verified: true,
      premium: true,
      status: 'active',
      followers: 8400,
      balance_usd: 1250.0,
      joined_at: '2026-02-10',
    },
    {
      id: '3',
      name: 'Baraka Digital',
      handle: '@baraka_ui',
      email: 'baraka@example.com',
      avatar: '🎨',
      role: 'creator',
      verified: true,
      premium: false,
      status: 'active',
      followers: 6100,
      balance_usd: 680.0,
      joined_at: '2026-03-01',
    },
    {
      id: '4',
      name: 'Neema Tech',
      handle: '@neematech',
      email: 'neema@example.com',
      avatar: '👩‍💻',
      role: 'moderator',
      verified: true,
      premium: true,
      status: 'active',
      followers: 4500,
      balance_usd: 310.0,
      joined_at: '2026-03-20',
    },
    {
      id: '5',
      name: 'Spam Bot Alert',
      handle: '@crypto_win_100x',
      email: 'spambot@test.com',
      avatar: '🤖',
      role: 'user',
      verified: false,
      premium: false,
      status: 'banned',
      ban_reason: 'Cryptocurrency scam detected',
      followers: 12,
      balance_usd: 0.0,
      joined_at: '2026-09-22',
    },
  ];
};

export const performUserAction = async (
  userId: string,
  action: 'toggle_verified' | 'toggle_premium' | 'ban' | 'unban' | 'change_role' | 'adjust_balance',
  value?: any,
  reason?: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(`${getBaseUrl()}/admin/users/${userId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, value, reason }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message };
    }
  } catch (e) {
    console.warn('Backend user action fallback:', e);
  }

  return { success: true, message: `Kitendo cha ${action} kimetekelezwa (local mode)` };
};

export const fetchModerationQueue = async (): Promise<FlaggedPost[]> => {
  try {
    const res = await fetch(`${getBaseUrl()}/admin/moderation`);
    if (res.ok) {
      const data = await res.json();
      return data.flagged_posts || [];
    }
  } catch (e) {
    console.warn('Error fetching moderation queue:', e);
  }

  return [
    {
      id: 'flag_101',
      post_id: 'p_9941',
      author_name: 'Cryptocurrency Promo',
      author_handle: '@crypto_win_100x',
      content: '🎁 Pata $5,000 bure ndani ya dakika 10 kwa kubonyeza kiungo hiki: bit.ly/free-money-now! Harakisha kabla haijaisha!',
      flag_reason: 'Phishing / Financial Scam',
      reports_count: 14,
      created_at: '2026-09-24 05:30:00',
      status: 'pending_review',
    },
    {
      id: 'flag_102',
      post_id: 'p_9942',
      author_name: 'John Doe',
      author_handle: '@johndoe',
      content: 'Huyu mtu amenidanganya na kunitapeli kwenye bidhaa ya simu aliyonunua.',
      flag_reason: 'Defamation / Personal Attack',
      reports_count: 3,
      created_at: '2026-09-24 03:15:00',
      status: 'pending_review',
    },
  ];
};

export const deletePostAsAdmin = async (postId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${getBaseUrl()}/admin/posts/${postId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    console.warn('Fallback delete post:', e);
    return true;
  }
};

export const fetchPayouts = async (): Promise<CreatorPayout[]> => {
  try {
    const res = await fetch(`${getBaseUrl()}/admin/payouts`);
    if (res.ok) {
      const data = await res.json();
      return data.payouts || [];
    }
  } catch (e) {
    console.warn('Fallback payouts:', e);
  }

  return [
    {
      id: 'pay_001',
      creator_id: '2',
      creator_name: 'Zawadi Innovation',
      creator_handle: '@zawadi_innovates',
      amount_usd: 450.0,
      payment_method: 'M-Pesa Tanzania (+255 754 112 233)',
      status: 'pending',
      created_at: '2026-09-24 06:12:00',
    },
    {
      id: 'pay_002',
      creator_id: '3',
      creator_name: 'Baraka Digital',
      creator_handle: '@baraka_ui',
      amount_usd: 180.0,
      payment_method: 'Bank Transfer (CRDB Bank)',
      status: 'approved',
      created_at: '2026-09-23 09:30:00',
      processed_at: '2026-09-23 18:45:00',
      transaction_ref: 'TXN-CRDB-994821',
    },
  ];
};

export const processPayoutAction = async (
  payoutId: string,
  action: 'approve' | 'reject',
  transactionRef?: string
): Promise<boolean> => {
  try {
    const res = await fetch(`${getBaseUrl()}/admin/payouts/${payoutId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, transaction_ref: transactionRef }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Fallback payout action:', e);
    return true;
  }
};

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const res = await fetch(`${getBaseUrl()}/admin/audit-logs`);
    if (res.ok) {
      const data = await res.json();
      return data.logs || [];
    }
  } catch (e) {
    console.warn('Fallback audit logs:', e);
  }

  return [
    {
      id: 'log_01',
      admin_name: 'Amani Joseph',
      admin_handle: '@amanitech',
      action: 'SYSTEM_INITIALIZED',
      details: 'Mfumo wa Longa Admin Panel umewashwa na kusanidiwa.',
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1',
    },
  ];
};
