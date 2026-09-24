import React, { useState, useEffect } from 'react';
import { useThemeClasses } from '../../themeUtils';
import {
  AdminKpis,
  FeatureFlags,
  AdminUser,
  FlaggedPost,
  CreatorPayout,
  AuditLog,
  fetchAdminStats,
  fetchAdminFeatures,
  updateAdminFeatures,
  fetchAdminUsers,
  performUserAction,
  fetchModerationQueue,
  deletePostAsAdmin,
  fetchPayouts,
  processPayoutAction,
  fetchAuditLogs,
} from '../../services/adminService';

type AdminTab = 'overview' | 'features' | 'users' | 'moderation' | 'financials' | 'logs';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [kpis, setKpis] = useState<AdminKpis | null>(null);
  const [revenueBreakdown, setRevenueBreakdown] = useState<any>(null);
  const [growthTrends, setGrowthTrends] = useState<any[]>([]);
  const [features, setFeatures] = useState<FeatureFlags | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [flaggedPosts, setFlaggedPosts] = useState<FlaggedPost[]>([]);
  const [payouts, setPayouts] = useState<CreatorPayout[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Ban modal state
  const [banModalUser, setBanModalUser] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState<string>('');

  const tc = useThemeClasses();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, featData, usersData, modData, payoutsData, logsData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminFeatures(),
        fetchAdminUsers(),
        fetchModerationQueue(),
        fetchPayouts(),
        fetchAuditLogs(),
      ]);

      setKpis(statsData.kpis);
      setRevenueBreakdown(statsData.revenue_breakdown);
      setGrowthTrends(statsData.growth_trends);
      setFeatures(featData.features);
      setUsers(usersData);
      setFlaggedPosts(modData);
      setPayouts(payoutsData);
      setAuditLogs(logsData);
    } catch (e) {
      console.error('Error loading admin panel data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.handle.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Toggle feature flag
  const handleToggleFeature = async (key: keyof FeatureFlags) => {
    if (!features) return;
    const updatedVal = !features[key];
    const newFeatures = { ...features, [key]: updatedVal };
    setFeatures(newFeatures);

    await updateAdminFeatures({ [key]: updatedVal });
    showToast(`Kipengele '${key}' kimebadilishwa kuwa: ${updatedVal ? 'WASHWA (ON)' : 'ZIMWA (OFF)'}`);
  };

  // User Actions
  const handleUserVerifyToggle = async (user: AdminUser) => {
    const newVerified = !user.verified;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, verified: newVerified } : u)));
    await performUserAction(user.id, 'toggle_verified', newVerified);
    showToast(`${user.name} amewekewa Verified: ${newVerified ? 'Ndio (Badge Ipo)' : 'Hapana'}`);
  };

  const handleUserPremiumToggle = async (user: AdminUser) => {
    const newPremium = !user.premium;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, premium: newPremium } : u)));
    await performUserAction(user.id, 'toggle_premium', newPremium);
    showToast(`${user.name} Premium imebadilishwa: ${newPremium ? 'Activated' : 'Revoked'}`);
  };

  const handleUserRoleChange = async (userId: string, newRole: 'admin' | 'creator' | 'moderator' | 'user') => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    await performUserAction(userId, 'change_role', newRole);
    showToast(`Jukumu la mtumiaji limebadilishwa kuwa: ${newRole.toUpperCase()}`);
  };

  const handleConfirmBan = async () => {
    if (!banModalUser) return;
    const isCurrentlyBanned = banModalUser.status === 'banned';
    const newStatus = isCurrentlyBanned ? 'active' : 'banned';

    setUsers((prev) =>
      prev.map((u) =>
        u.id === banModalUser.id ? { ...u, status: newStatus, ban_reason: isCurrentlyBanned ? undefined : banReason } : u
      )
    );

    await performUserAction(
      banModalUser.id,
      isCurrentlyBanned ? 'unban' : 'ban',
      null,
      isCurrentlyBanned ? 'Admin unban' : banReason || 'Violated community guidelines'
    );

    showToast(isCurrentlyBanned ? `Mtumiaji @${banModalUser.handle} ameondolewa ban!` : `Mtumiaji @${banModalUser.handle} amepigwa BAN!`);
    setBanModalUser(null);
    setBanReason('');
  };

  // Moderation Actions
  const handleDeletePost = async (post: FlaggedPost) => {
    if (!confirm(`Una uhakika unataka kufuta chapisho hili la @${post.author_handle}?`)) return;
    setFlaggedPosts((prev) => prev.filter((p) => p.id !== post.id));
    await deletePostAsAdmin(post.post_id);
    showToast(`Chapisho la @${post.author_handle} limefutwa kabisa!`);
  };

  const handleDismissReport = (id: string) => {
    setFlaggedPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('Ripoti imeondolewa kwenye foleni (Marked as Safe)');
  };

  // Payout actions
  const handlePayout = async (payoutId: string, action: 'approve' | 'reject') => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: action === 'approve' ? 'approved' : 'rejected' } : p))
    );
    await processPayoutAction(payoutId, action);
    showToast(`Ombi la malipo #${payoutId} limeidhinishwa: ${action.toUpperCase()}`);
  };

  return (
    <div className={`flex flex-col min-h-screen ${tc.bg}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce bg-blue-600 text-white font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-blue-400/40 flex items-center gap-2">
          <span>🛡️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border} px-6 py-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-red-500/20">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl font-black ${tc.text}`}>Longa Mission Control</h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Usimamizi wa Kina wa Vipengele, Watumiaji, Usalama na Mapato ya Jukwaa
              </p>
            </div>
          </div>

          {/* Quick Badges & Refresh */}
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{kpis?.system_health || '99.98% Healthy'}</span>
            </div>
            <button
              onClick={loadData}
              className={`p-2 rounded-xl border ${tc.border} ${tc.bgHoverSecondary} text-gray-300 hover:text-white transition-colors`}
              title="Pakia Upya Takwimu"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: '📊' },
            { id: 'features', label: 'Feature Switches', icon: '🎛️' },
            { id: 'users', label: 'User Governance', icon: '👥' },
            { id: 'moderation', label: 'Content Moderation', icon: '🛡️', badge: flaggedPosts.length },
            { id: 'financials', label: 'Financials & Payouts', icon: '💰', badge: payouts.filter((p) => p.status === 'pending').length },
            { id: 'logs', label: 'Audit Logs', icon: '📜' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : `${tc.bgSecondary} text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border border-transparent`
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-500 text-white font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 py-6 space-y-6 max-w-7xl w-full mx-auto">
        {loading && (
          <div className="text-center py-12 text-gray-400 animate-pulse text-sm">
            Inapakia taarifa za Mission Control...
          </div>
        )}

        {!loading && activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-5 rounded-3xl border ${tc.bgSecondary} ${tc.border} relative overflow-hidden group`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jumla ya Watumiaji</span>
                  <span className="text-lg">👥</span>
                </div>
                <div className="text-3xl font-black text-white">{kpis?.total_users.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400">
                  <span>↑ +18.4% wiki hii</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{kpis?.active_today} wako hewani</span>
                </div>
              </div>

              <div className={`p-5 rounded-3xl border ${tc.bgSecondary} ${tc.border} relative overflow-hidden group`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mapato ya Jukwaa</span>
                  <span className="text-lg">💵</span>
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  ${kpis?.total_revenue_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400">
                  <span>${kpis?.total_tips_paid_usd.toLocaleString()} zimetolewa kwa wabunifu</span>
                </div>
              </div>

              <div className={`p-5 rounded-3xl border ${tc.bgSecondary} ${tc.border} relative overflow-hidden group`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Machapisho & Reels</span>
                  <span className="text-lg">📱</span>
                </div>
                <div className="text-3xl font-black text-indigo-400">{kpis?.total_posts.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span>Reels: {kpis?.active_reels}</span>
                  <span className="text-gray-500">•</span>
                  <span>Viral posts: 142</span>
                </div>
              </div>

              <div className={`p-5 rounded-3xl border ${tc.bgSecondary} ${tc.border} relative overflow-hidden group`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Maombi ya AI (Requests)</span>
                  <span className="text-lg">🤖</span>
                </div>
                <div className="text-3xl font-black text-purple-400">{kpis?.ai_requests_processed.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2 text-xs text-purple-400">
                  <span>Multi-Provider Active</span>
                </div>
              </div>
            </div>

            {/* Growth Trends & Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trends Bar Chart Visualizer */}
              <div className={`lg:col-span-2 p-6 rounded-3xl border ${tc.bgSecondary} ${tc.border}`}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                  <span>📈 Mwelekeo wa Ukuaji wa Siku 7 (Growth & Activity)</span>
                  <span className="text-xs text-blue-400 font-normal">Real-Time Data</span>
                </h3>
                <div className="space-y-4">
                  {growthTrends.map((t, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-300">{t.day}</span>
                        <div className="flex gap-4 text-gray-400">
                          <span>Watumiaji: <strong className="text-blue-400">+{t.users}</strong></span>
                          <span>Posts: <strong className="text-indigo-400">+{t.posts}</strong></span>
                          <span>Mapato: <strong className="text-emerald-400">${t.revenue}</strong></span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                        <div style={{ width: `${(t.revenue / 3500) * 100}%` }} className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className={`p-6 rounded-3xl border ${tc.bgSecondary} ${tc.border} space-y-4`}>
                <h3 className="text-sm font-bold text-white mb-2">💰 Mgawanyo wa Mapato</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-gray-900/60 border border-gray-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Usajili wa Premium (Verified)</p>
                      <p className="text-[11px] text-gray-400">Ada za kila mwezi</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      ${revenueBreakdown?.premium_subscriptions.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-900/60 border border-gray-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Creator Store Commissions</p>
                      <p className="text-[11px] text-gray-400">{features?.platform_commission_pct || 10}% ya mauzo ya bidhaa</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-blue-400">
                      ${revenueBreakdown?.creator_store_fees.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-900/60 border border-gray-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Ada za Tips & Zawadi</p>
                      <p className="text-[11px] text-gray-400">Makato ya huduma</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-purple-400">
                      ${revenueBreakdown?.tipping_commissions.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                  ⚡ <strong>Admin Tip:</strong> Unaweza kurekebisha asilimia ya makato kwenye tabu ya <em>Feature Switches</em>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Feature Control & Kill-Switches */}
        {!loading && activeTab === 'features' && features && (
          <div className="space-y-6 animate-fade-in">
            {/* Global Maintenance Alert */}
            <div className={`p-5 rounded-3xl border ${features.maintenance_mode ? 'bg-red-500/15 border-red-500/40' : `${tc.bgSecondary} ${tc.border}`} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>🚧 Hali ya Matengenezo (Maintenance Mode Kill-Switch)</span>
                  {features.maintenance_mode && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase">
                      Active (Locked)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Inapowashwa, watumiaji wa kawaida wanazuiliwa kuingia na kuona ujumbe wa matengenezo.
                </p>
              </div>
              <button
                onClick={() => handleToggleFeature('maintenance_mode')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-lg ${
                  features.maintenance_mode
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                }`}
              >
                {features.maintenance_mode ? 'ZIMA MATENGENEZO' : 'WASHA MATENGENEZO'}
              </button>
            </div>

            {/* Feature Flags Grid */}
            <div className={`p-6 rounded-3xl border ${tc.bgSecondary} ${tc.border} space-y-4`}>
              <h3 className="text-sm font-bold text-white mb-2">🎛️ Vidhibiti vya Vipengele vya Jukwaa (Live Feature Switches)</h3>
              <p className="text-xs text-gray-400 mb-4">
                Washa au zima vipengele vya Longa kwa mbofyo mmoja bila kuanzisha upya seva:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'ai_suite_enabled', label: 'Longa AI Chat & Suite', desc: 'Uwezo mkuu wa akili mnemba', icon: '🤖' },
                  { key: 'ai_copilot_enabled', label: 'Feed AI Co-Pilot', desc: 'Vitufe vya TL;DR & Fact-check kwenye posts', icon: '💡' },
                  { key: 'webrtc_calling_enabled', label: 'WebRTC Video & Voice Calls', desc: 'Simu za moja kwa moja kwenye DMs', icon: '📹' },
                  { key: 'reels_enabled', label: 'Longa Reels (Shorts)', desc: 'Kicheza video za wima za mtindo wa TikTok', icon: '📱' },
                  { key: 'spaces_audio_enabled', label: 'Audio Spaces & Soundboard', desc: 'Vyumba vya sauti na milio ya moja kwa moja', icon: '🎙️' },
                  { key: 'store_marketplace_enabled', label: 'Creator Store & Marketplace', desc: 'Soko la bidhaa na kazi za dijitali', icon: '🏪' },
                  { key: 'prediction_markets_enabled', label: 'Prediction Markets', desc: 'Masoko ya utabiri wa kidijitali', icon: '🏆' },
                  { key: 'monetization_enabled', label: 'Tipping & Monetization', desc: 'Malipo ya zawadi, M-Pesa na usajili', icon: '💳' },
                  { key: 'whisper_messages_enabled', label: 'Secret Whisper Messages', desc: 'Ujumbe unaojifuta baada ya sekunde 30', icon: '🔒' },
                  { key: 'user_registration_enabled', label: 'Usajili Mpya wa Watumiaji', desc: 'Ruhusu watumiaji wapya kujiunga', icon: '👤' },
                  { key: 'require_email_verification', label: 'Lazimisha Uthibitisho wa Email', desc: 'Kuzuia kuingia bila ku-verify email', icon: '📧' },
                ].map((item) => {
                  const isEnabled = !!features[item.key as keyof FeatureFlags];
                  return (
                    <div
                      key={item.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        isEnabled
                          ? 'border-blue-500/30 bg-blue-500/5'
                          : 'border-gray-800 bg-gray-900/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.label}</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>

                        {/* Toggle Pill Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(item.key as keyof FeatureFlags)}
                          className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                            isEnabled ? 'bg-blue-600' : 'bg-gray-700'
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                              isEnabled ? 'left-6' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sliders and Platform Parameters */}
              <div className="pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    Asilimia ya Ada ya Jukwaa (Platform Commission):{' '}
                    <span className="text-blue-400 font-mono">{features.platform_commission_pct}%</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={features.platform_commission_pct}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setFeatures({ ...features, platform_commission_pct: val });
                      updateAdminFeatures({ platform_commission_pct: val });
                    }}
                    className="w-full accent-blue-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Asilimia inayokatwa na Longa kwenye mauzo ya Creator Store na Creator Tipping.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    Kikomo cha Maswali ya Bure ya AI kwa Siku (Free AI Quota):{' '}
                    <span className="text-blue-400 font-mono">{features.free_ai_daily_limit} queries</span>
                  </label>
                  <input
                    type="number"
                    value={features.free_ai_daily_limit}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 10;
                      setFeatures({ ...features, free_ai_daily_limit: val });
                      updateAdminFeatures({ free_ai_daily_limit: val });
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border ${tc.bgInput} ${tc.text} ${tc.border}`}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Watumiaji wa kawaida hupata maswali haya kabla ya kuombwa kuweka API Key yao au kujiunga na Premium.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: User Governance */}
        {!loading && activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter Bar */}
            <div className={`p-4 rounded-3xl border ${tc.bgSecondary} ${tc.border} flex flex-col sm:flex-row items-center justify-between gap-4`}>
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Tafuta mtumiaji kwa jina, handle (@amanitech), au email..."
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs border outline-none ${tc.bgInput} ${tc.text} ${tc.border} focus:border-blue-500`}
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400 font-semibold">Jukumu:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs border outline-none ${tc.bgInput} ${tc.text} ${tc.border}`}
                >
                  <option value="all">Wote ({users.length})</option>
                  <option value="admin">Admins</option>
                  <option value="creator">Creators</option>
                  <option value="moderator">Moderators</option>
                  <option value="user">Users</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className={`rounded-3xl border ${tc.bgSecondary} ${tc.border} overflow-hidden shadow-xl`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${tc.border} bg-gray-900/60 text-gray-400 font-bold uppercase tracking-wider`}>
                    <tr>
                      <th className="px-5 py-3.5">Mtumiaji</th>
                      <th className="px-4 py-3.5">Jukumu</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Beji & Premium</th>
                      <th className="px-4 py-3.5">Salio</th>
                      <th className="px-5 py-3.5 text-right">Vitendo vya Utawala</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{u.avatar}</span>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {u.verified && <span className="text-blue-400 text-xs">✓</span>}
                              </div>
                              <div className="text-gray-400 text-[11px] font-mono">{u.handle}</div>
                              <div className="text-gray-500 text-[10px]">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUserRoleChange(u.id, e.target.value as any)}
                            className="bg-gray-900 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-700 outline-none"
                          >
                            <option value="admin">👑 Admin</option>
                            <option value="creator">✨ Creator</option>
                            <option value="moderator">🛡️ Moderator</option>
                            <option value="user">👤 User</option>
                          </select>
                        </td>

                        <td className="px-4 py-4">
                          {u.status === 'banned' ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase text-[10px]">
                              BANNED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[10px]">
                              ACTIVE
                            </span>
                          )}
                          {u.ban_reason && (
                            <p className="text-[10px] text-red-400/80 mt-1 max-w-[150px] truncate" title={u.ban_reason}>
                              {u.ban_reason}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 space-x-1.5">
                          <button
                            onClick={() => handleUserVerifyToggle(u)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              u.verified
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                            }`}
                            title="Bonyeza kutoa au kubatilisha Blue Badge"
                          >
                            {u.verified ? '✓ Verified' : '+ Verify'}
                          </button>

                          <button
                            onClick={() => handleUserPremiumToggle(u)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              u.premium
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                            }`}
                          >
                            {u.premium ? '★ Premium' : '+ Premium'}
                          </button>
                        </td>

                        <td className="px-4 py-4 font-mono font-bold text-emerald-400">
                          ${u.balance_usd?.toFixed(2) || '0.00'}
                        </td>

                        <td className="px-5 py-4 text-right space-x-2">
                          <button
                            onClick={() => setBanModalUser(u)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              u.status === 'banned'
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                            }`}
                          >
                            {u.status === 'banned' ? 'Ondoa Ban' : 'Piga Ban'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Content Moderation */}
        {!loading && activeTab === 'moderation' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Maudhui Yaliyoripotiwa na Wanajamii (Flagged Content)</h3>
                <p className="text-xs text-gray-400">Pitia malalamiko ya machapisho yenye viashiria vya utapeli au kashfa:</p>
              </div>
              <span className="text-xs font-bold text-gray-400">
                Jumla ya ripoti: <strong className="text-red-400">{flaggedPosts.length}</strong>
              </span>
            </div>

            {flaggedPosts.length === 0 ? (
              <div className={`p-8 rounded-3xl border ${tc.bgSecondary} ${tc.border} text-center text-gray-400 text-xs`}>
                🎉 Hakuna maudhui yaliyoripotiwa kwa sasa. Mfumo uko salama!
              </div>
            ) : (
              <div className="space-y-4">
                {flaggedPosts.map((post) => (
                  <div key={post.id} className={`p-5 rounded-3xl border border-red-500/30 bg-red-500/5 space-y-3`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{post.author_name}</span>
                          <span className="text-gray-400 text-xs font-mono">{post.author_handle}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                            {post.flag_reason}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Iliripotiwa mara {post.reports_count} • {post.created_at}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDismissReport(post.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                        >
                          Mark as Safe
                        </button>
                        <button
                          onClick={() => handleDeletePost(post)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-500/20"
                        >
                          Futa Chapisho
                        </button>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-gray-800 text-xs text-gray-200 leading-relaxed font-mono">
                      "{post.content}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Financials & Payouts */}
        {!loading && activeTab === 'financials' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Maombi ya Malipo ya Watayarishi (Creator Payouts)</h3>
                <p className="text-xs text-gray-400">Idhinisha kutoa pesa za mapato ya bidhaa na zawadi:</p>
              </div>
            </div>

            <div className={`rounded-3xl border ${tc.bgSecondary} ${tc.border} overflow-hidden shadow-xl`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${tc.border} bg-gray-900/60 text-gray-400 font-bold uppercase tracking-wider`}>
                    <tr>
                      <th className="px-5 py-3.5">Mtayarishi</th>
                      <th className="px-4 py-3.5">Kiasi</th>
                      <th className="px-4 py-3.5">Njia ya Malipo</th>
                      <th className="px-4 py-3.5">Tarehe</th>
                      <th className="px-4 py-3.5">Hali</th>
                      <th className="px-5 py-3.5 text-right">Kitendo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-white">{p.creator_name}</div>
                          <div className="text-gray-400 text-[11px] font-mono">{p.creator_handle}</div>
                        </td>
                        <td className="px-4 py-4 font-mono font-bold text-emerald-400 text-sm">
                          ${p.amount_usd.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-gray-300">{p.payment_method}</td>
                        <td className="px-4 py-4 text-gray-400 text-[11px]">{p.created_at}</td>
                        <td className="px-4 py-4">
                          {p.status === 'approved' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[10px]">
                              Approved
                            </span>
                          )}
                          {p.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase text-[10px]">
                              Pending
                            </span>
                          )}
                          {p.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase text-[10px]">
                              Rejected
                            </span>
                          )}
                          {p.transaction_ref && (
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.transaction_ref}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right space-x-2">
                          {p.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handlePayout(p.id, 'approve')}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-500/20"
                              >
                                Idhinisha Malipo
                              </button>
                              <button
                                onClick={() => handlePayout(p.id, 'reject')}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-red-400 transition-colors"
                              >
                                Kataa
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-500 text-xs">Imekamilika</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Audit Logs */}
        {!loading && activeTab === 'logs' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold text-white">Kumbukumbu za Utawala (Security & Action Audit Logs)</h3>
            <div className={`p-4 rounded-3xl border ${tc.bgSecondary} ${tc.border} space-y-3`}>
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-black/40 border border-gray-800 text-xs flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="text-gray-400 text-xs font-semibold">{log.admin_name} ({log.admin_handle})</span>
                      <span className="text-[11px] text-gray-500">IP: {log.ip}</span>
                    </div>
                    <p className="text-gray-300 mt-1 font-mono text-[11px]">{log.details}</p>
                  </div>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ban / Unban Modal */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${tc.bg} ${tc.border} space-y-4`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-base font-bold text-white">
                  {banModalUser.status === 'banned' ? 'Ondoa Ban kwa Mtumiaji' : 'Thibitisha Kumpiga Ban Mtumiaji'}
                </h3>
                <p className="text-xs text-gray-400">
                  {banModalUser.name} ({banModalUser.handle})
                </p>
              </div>
            </div>

            {banModalUser.status !== 'banned' && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Sababu ya Ban (Itahifadhiwa kwenye Audit Log):
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Eleza sababu ya kumfungia mtumiaji huyu (k.m. Ulaghai, Phishing, au Lugha Chafu)..."
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-xs border outline-none ${tc.bgInput} ${tc.text} ${tc.border} focus:border-red-500 h-24`}
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBanModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Ghairi
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg ${
                  banModalUser.status === 'banned'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                    : 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
                }`}
              >
                {banModalUser.status === 'banned' ? 'Thibitisha Kufungua' : 'Ndio, Piga Ban'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
