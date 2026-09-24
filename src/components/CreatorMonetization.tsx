import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeClasses } from '../themeUtils';

interface Subscription {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  benefits: string[];
  subscribers: number;
  revenue: number;
}

interface Tip {
  id: string;
  fromUser: string;
  fromAvatar: string;
  amount: number;
  message: string;
  timestamp: Date;
}

export default function CreatorMonetization() {
  const { user } = useAuth();
  const tc = useThemeClasses();
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'tips' | 'settings'>('overview');
  const [showCreateTier, setShowCreateTier] = useState(false);

  // Sample data
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Supporter',
      price: 2.99,
      interval: 'monthly',
      benefits: ['Exclusive content', 'Early access', 'Supporter badge'],
      subscribers: 234,
      revenue: 700.66,
    },
    {
      id: '2',
      name: 'Pro',
      price: 9.99,
      interval: 'monthly',
      benefits: ['All Supporter benefits', '1-on-1 chat', 'Custom emojis', 'Behind the scenes'],
      subscribers: 89,
      revenue: 889.11,
    },
    {
      id: '3',
      name: 'VIP',
      price: 24.99,
      interval: 'monthly',
      benefits: ['All Pro benefits', 'Monthly call', 'Name in credits', 'Exclusive merch'],
      subscribers: 23,
      revenue: 574.77,
    },
  ]);

  const [tips, setTips] = useState<Tip[]>([
    {
      id: '1',
      fromUser: 'Zawadi Innovation',
      fromAvatar: '👩‍🔬',
      amount: 10.00,
      message: 'Great content! Keep it up! 🚀',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      fromUser: 'Baraka Digital',
      fromAvatar: '🎨',
      amount: 5.00,
      message: 'Love your work!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: '3',
      fromUser: 'Neema AI',
      fromAvatar: '🤖',
      amount: 20.00,
      message: 'This is amazing! Thank you for sharing.',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
    },
  ]);

  const [liveBalance, setLiveBalance] = useState<number | null>(null);

  useEffect(() => {
    import('../api/phpAdapter').then(({ getApiUrl }) => {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const authHeader: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
      fetch(`${getApiUrl()}/payments/earnings`, { headers: authHeader })
        .then(r => r.json())
        .then(data => {
          if (data && typeof data.balance === 'number') {
            setLiveBalance(data.balance);
          }
        })
        .catch(() => {});
    });
  }, []);

  const totalRevenue = (liveBalance !== null ? liveBalance : subscriptions.reduce((sum, sub) => sum + sub.revenue, 0)) + 
                       tips.reduce((sum, tip) => sum + tip.amount, 0);
  const totalSubscribers = subscriptions.reduce((sum, sub) => sum + sub.subscribers, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text} mb-1`}>Creator Studio</h1>
          <p className={`text-sm ${tc.textSecondary}`}>Monetize your content and grow your audience</p>
        </div>

        {/* Tabs */}
        <div className="flex">
          {(['overview', 'subscriptions', 'tips', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab ? `${tc.text} font-bold` : `text-gray-500 ${tc.bgHover}`
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <p className={`text-sm ${tc.textSecondary} mb-1`}>Total Revenue</p>
                <p className={`text-2xl font-bold ${tc.text}`}>{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
              </div>
              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <p className={`text-sm ${tc.textSecondary} mb-1`}>Subscribers</p>
                <p className={`text-2xl font-bold ${tc.text}`}>{totalSubscribers}</p>
                <p className="text-xs text-green-500 mt-1">↑ 8% from last month</p>
              </div>
              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <p className={`text-sm ${tc.textSecondary} mb-1`}>Tips Received</p>
                <p className={`text-2xl font-bold ${tc.text}`}>
                  {formatCurrency(tips.reduce((sum, tip) => sum + tip.amount, 0))}
                </p>
                <p className="text-xs text-green-500 mt-1">↑ 23% from last month</p>
              </div>
              <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <p className={`text-sm ${tc.textSecondary} mb-1`}>Avg. Revenue/User</p>
                <p className={`text-2xl font-bold ${tc.text}`}>
                  {formatCurrency(totalRevenue / Math.max(totalSubscribers, 1))}
                </p>
                <p className="text-xs text-green-500 mt-1">↑ 5% from last month</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-3`}>Recent Activity</h3>
              <div className="space-y-3">
                {tips.slice(0, 3).map(tip => (
                  <div key={tip.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                      {tip.fromAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-bold text-sm ${tc.text}`}>{tip.fromUser}</p>
                        <p className="text-sm font-bold text-green-500">+{formatCurrency(tip.amount)}</p>
                      </div>
                      <p className={`text-xs ${tc.textSecondary}`}>{tip.message}</p>
                      <p className={`text-xs ${tc.textSecondary} mt-1`}>
                        {tip.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`${tc.bgCard} rounded-xl p-4 border ${tc.border} hover:border-blue-500 transition-colors text-left`}
              >
                <div className="text-3xl mb-2">💎</div>
                <p className={`font-bold ${tc.text} mb-1`}>Manage Subscriptions</p>
                <p className={`text-xs ${tc.textSecondary}`}>Create and edit subscription tiers</p>
              </button>
              <button
                onClick={() => setActiveTab('tips')}
                className={`${tc.bgCard} rounded-xl p-4 border ${tc.border} hover:border-blue-500 transition-colors text-left`}
              >
                <div className="text-3xl mb-2">💰</div>
                <p className={`font-bold ${tc.text} mb-1`}>View Tips</p>
                <p className={`text-xs ${tc.textSecondary}`}>See all tips and donations</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {/* Create Tier Button */}
            <button
              onClick={() => setShowCreateTier(true)}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Subscription Tier
            </button>

            {/* Subscription Tiers */}
            {subscriptions.map(sub => (
              <div key={sub.id} className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`text-lg font-bold ${tc.text}`}>{sub.name}</h3>
                    <p className={`text-2xl font-bold ${tc.text}`}>
                      {formatCurrency(sub.price)}
                      <span className={`text-sm font-normal ${tc.textSecondary}`}>/{sub.interval === 'monthly' ? 'mo' : 'yr'}</span>
                    </p>
                  </div>
                  <button className={`p-2 rounded-full ${tc.bgHoverSecondary}`}>
                    <svg className={`w-5 h-5 ${tc.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>

                <div className="mb-3">
                  <p className={`text-sm font-medium ${tc.textSecondary} mb-2`}>Benefits:</p>
                  <ul className="space-y-1">
                    {sub.benefits.map((benefit, index) => (
                      <li key={index} className={`text-sm ${tc.text} flex items-center gap-2`}>
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`flex items-center justify-between pt-3 border-t ${tc.border}`}>
                  <div>
                    <p className={`text-sm ${tc.textSecondary}`}>Subscribers</p>
                    <p className={`text-lg font-bold ${tc.text}`}>{sub.subscribers}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${tc.textSecondary}`}>Revenue</p>
                    <p className="text-lg font-bold text-green-500">{formatCurrency(sub.revenue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-3">
            {tips.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💰</div>
                <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No tips yet</h3>
                <p className={tc.textSecondary}>When fans send you tips, they'll appear here</p>
              </div>
            ) : (
              tips.map(tip => (
                <div key={tip.id} className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
                      {tip.fromAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-bold ${tc.text}`}>{tip.fromUser}</p>
                        <p className="text-lg font-bold text-green-500">+{formatCurrency(tip.amount)}</p>
                      </div>
                      <p className={`text-sm ${tc.textSecondary} mb-2`}>{tip.message}</p>
                      <p className={`text-xs ${tc.textSecondary}`}>
                        {tip.timestamp.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-3`}>Payment Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Payout Method
                  </label>
                  <select className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}>
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Stripe</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Minimum Payout
                  </label>
                  <input
                    type="number"
                    defaultValue={50}
                    className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Payout Schedule
                  </label>
                  <select className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}>
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
              <h3 className={`text-lg font-bold ${tc.text} mb-3`}>Notification Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${tc.text}`}>New subscription</p>
                    <p className={`text-xs ${tc.textSecondary}`}>Get notified when someone subscribes</p>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${tc.text}`}>New tip</p>
                    <p className={`text-xs ${tc.textSecondary}`}>Get notified when someone sends a tip</p>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${tc.text}`}>Payout processed</p>
                    <p className={`text-xs ${tc.textSecondary}`}>Get notified when payout is sent</p>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-blue-500 relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl">
              Save Settings
            </button>
          </div>
        )}
      </div>

      {/* Create Tier Modal */}
      {showCreateTier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateTier(false)} />
          <div className={`relative w-full max-w-lg mx-4 ${tc.bgModal} rounded-2xl border ${tc.border} p-6`}>
            <h2 className={`text-xl font-bold ${tc.text} mb-4`}>Create Subscription Tier</h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Tier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Supporter, Pro, VIP"
                  className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="9.99"
                    className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                    Interval
                  </label>
                  <select className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500`}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                  Benefits (one per line)
                </label>
                <textarea
                  placeholder="Exclusive content&#10;Early access&#10;Supporter badge"
                  className={`w-full px-4 py-2.5 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 resize-none`}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCreateTier(false)}
                className={`flex-1 py-2.5 rounded-full border ${tc.border} ${tc.text} font-bold hover:bg-gray-500/10`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Create new tier
                  setShowCreateTier(false);
                }}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
              >
                Create Tier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
