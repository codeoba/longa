import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from './Icons';
import { useThemeClasses } from '../themeUtils';

interface PremiumPageProps {
  selectedPlan: string | null;
  onSelectPlan: (plan: string | null) => void;
}

export default function PremiumPage({ selectedPlan, onSelectPlan }: PremiumPageProps) {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(selectedPlan);
  const tc = useThemeClasses();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$3',
      period: '/month',
      features: ['Blue checkmark', 'Edit posts', 'Bookmark folders', 'Longer posts (up to 25,000 characters)'],
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$8',
      period: '/month',
      features: ['Everything in Basic', 'Half the ads', 'Monetization (ads revenue sharing)', 'Creator subscriptions', 'Groks in the app'],
      color: 'from-purple-500 to-purple-700',
      popular: true,
    },
    {
      id: 'premium-plus',
      name: 'Premium+',
      price: '$16',
      period: '/month',
      features: ['Everything in Premium', 'No ads', 'Rank in replies and mentions', 'Premium+ badge', 'Priority support'],
      color: 'from-yellow-500 to-amber-700',
    },
  ];

  const handleSubscribe = (planId: string) => {
    setSubscribedPlan(planId);
    onSelectPlan(planId);
    setShowSubscribeModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="flex items-center gap-6 px-4 py-2">
          <button className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary}`}>
            <ArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${tc.text}`}>Premium</h1>
        </div>
      </div>

      {/* Already subscribed banner */}
      {subscribedPlan && (
        <div className="mx-4 mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-400" fill="currentColor">
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/>
            </svg>
            <span className="text-green-400 font-bold text-sm">You're subscribed to {plans.find(p => p.id === subscribedPlan)?.name}</span>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-purple-900/20 to-transparent" />
        <div className="relative px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Sparkles />
          </div>
          <h2 className={`text-3xl font-extrabold ${tc.text} mb-2`}>Unlock Premium</h2>
          <p className={`${tc.textSecondary} text-[15px] max-w-[400px] mx-auto`}>
            Get a blue checkmark, exclusive features, and more with X Premium
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="px-4 pb-8 space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border ${plan.popular ? 'border-blue-500/50 bg-blue-500/5' : `${tc.border} ${tc.bgCard}`} p-5 transition-all hover:border-gray-700`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-xl font-bold ${tc.text}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-3xl font-extrabold ${tc.text}`}>{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/>
                </svg>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, i) => (
                <li key={i} className={`flex items-center gap-2 text-[15px] ${tc.textSecondary}`}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor">
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-2.5 rounded-full font-bold text-[15px] transition-all ${
                subscribedPlan === plan.id
                  ? 'bg-green-500 text-white cursor-default'
                  : plan.popular
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-white text-black hover:bg-gray-200'
              }`}
              disabled={subscribedPlan === plan.id}
            >
              {subscribedPlan === plan.id ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="px-4 pb-8">
        <h3 className={`text-xl font-extrabold ${tc.text} mb-4`}>Why Premium?</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '✓', title: 'Blue Checkmark', desc: 'Stand out with verification' },
            { icon: '✏️', title: 'Edit Posts', desc: 'Fix typos after posting' },
            { icon: '📁', title: 'Bookmark Folders', desc: 'Organize saved posts' },
            { icon: '💰', title: 'Revenue Share', desc: 'Earn from your content' },
            { icon: '📝', title: 'Long Posts', desc: 'Up to 25K characters' },
            { icon: '🤖', title: 'Grok AI', desc: 'Access AI assistant' },
          ].map((feature, i) => (
            <div key={i} className={`p-4 rounded-xl border ${tc.border} ${tc.bgCard}`}>
              <span className="text-2xl">{feature.icon}</span>
              <h4 className={`font-bold ${tc.text} text-sm mt-2`}>{feature.title}</h4>
              <p className="text-[13px] text-gray-500 mt-0.5">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubscribeModal(false)} />
          <div className={`relative ${tc.bgModal} rounded-2xl border ${tc.border} p-6 max-w-[400px] mx-4 text-center`}>
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-400" fill="currentColor">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/>
              </svg>
            </div>
            <h3 className={`text-xl font-extrabold ${tc.text} mb-2`}>Welcome to Premium!</h3>
            <p className={`${tc.textSecondary} text-[15px] mb-4`}>
              You're now subscribed to {plans.find(p => p.id === subscribedPlan)?.name}. Enjoy all the exclusive features!
            </p>
            <button
              onClick={() => setShowSubscribeModal(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-full transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
