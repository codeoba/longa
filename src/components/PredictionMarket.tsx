import React, { useState } from 'react';
import { PredictionItem } from '../types';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';

export const PredictionMarket: React.FC = () => {
  const tc = useThemeClasses();
  const { user } = useAuth();

  const initialMarkets: PredictionItem[] = [
    {
      id: 'pred_1',
      creatorName: 'Longa Tech Labs',
      creatorHandle: 'longalabs',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      question: 'Will decentralized social protocols overtake centralized ad-based platforms by Q4 2026?',
      category: 'tech',
      yesPercentage: 74,
      noPercentage: 26,
      totalVolumeUsd: 142500,
      endsAt: 'In 18 days'
    },
    {
      id: 'pred_2',
      creatorName: 'DevRel Daily',
      creatorHandle: 'devreldaily',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      question: 'Will OpenAI or Google release a fully self-improving coding agent before July 2026?',
      category: 'tech',
      yesPercentage: 88,
      noPercentage: 12,
      totalVolumeUsd: 289000,
      endsAt: 'In 32 days'
    },
    {
      id: 'pred_3',
      creatorName: 'CryptoPulse',
      creatorHandle: 'cryptopulse',
      creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      question: 'Will Bitcoin surpass $120,000 following the global liquidity cycle?',
      category: 'crypto',
      yesPercentage: 62,
      noPercentage: 38,
      totalVolumeUsd: 512000,
      endsAt: 'In 14 days'
    },
    {
      id: 'pred_4',
      creatorName: 'Global Sports Pulse',
      creatorHandle: 'sportspulse',
      creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      question: 'Will Real Madrid claim the European Champions League title this season?',
      category: 'sports',
      yesPercentage: 55,
      noPercentage: 45,
      totalVolumeUsd: 98000,
      endsAt: 'In 45 days'
    }
  ];

  const [markets, setMarkets] = useState<PredictionItem[]>(initialMarkets);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMarket, setSelectedMarket] = useState<PredictionItem | null>(null);
  const [voteChoice, setVoteChoice] = useState<'yes' | 'no'>('yes');
  const [wagerAmount, setWagerAmount] = useState(20);
  const [userBalance, setUserBalance] = useState(500);
  const [wagerSuccess, setWagerSuccess] = useState(false);

  // New market form
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<'tech' | 'crypto' | 'sports' | 'world'>('tech');
  const [newEndsAt, setNewEndsAt] = useState('In 14 days');

  const handleVote = (market: PredictionItem, choice: 'yes' | 'no') => {
    setSelectedMarket(market);
    setVoteChoice(choice);
    setWagerSuccess(false);
  };

  const handleConfirmWager = () => {
    if (!selectedMarket || userBalance < wagerAmount) return;
    setUserBalance(prev => prev - wagerAmount);
    setWagerSuccess(true);
    setMarkets(prev =>
      prev.map(m => {
        if (m.id === selectedMarket.id) {
          const yesDelta = voteChoice === 'yes' ? 1 : -1;
          const newYes = Math.min(99, Math.max(1, m.yesPercentage + yesDelta));
          return {
            ...m,
            yesPercentage: newYes,
            noPercentage: 100 - newYes,
            totalVolumeUsd: m.totalVolumeUsd + wagerAmount,
            userVote: voteChoice
          };
        }
        return m;
      })
    );

    setTimeout(() => {
      setWagerSuccess(false);
      setSelectedMarket(null);
    }, 1800);
  };

  const handleCreateMarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newMarket: PredictionItem = {
      id: 'pred_' + Date.now(),
      creatorName: user?.name || 'Creator',
      creatorHandle: user?.handle || 'creator',
      creatorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      question: newQuestion,
      category: newCategory,
      yesPercentage: 50,
      noPercentage: 50,
      totalVolumeUsd: 1000,
      endsAt: newEndsAt
    };

    setMarkets(prev => [newMarket, ...prev]);
    setIsCreateModalOpen(false);
    setNewQuestion('');
  };

  const filteredMarkets = markets.filter(m =>
    selectedCategory === 'all' ? true : m.category === selectedCategory
  );

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-[#38444d]/40 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-blue-950/40 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
              <span>🎯 Longa Prediction Markets</span>
              <span className="text-gray-400">•</span>
              <span>Predict Outcomes & Win</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Decentralized Community Predictions
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-400 max-w-xl">
              Stake your conviction on AI, tech breakthroughs, global markets, and cultural milestones with live dynamic odds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-[#38444d]/50 text-right">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Your Balance</span>
              <span className="text-lg font-black text-emerald-400">{userBalance} LP</span>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-full font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-black shadow-lg shadow-emerald-500/20 flex items-center gap-2 transform active:scale-95 transition"
            >
              <span>+</span>
              <span>Create Market</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#38444d]/30">
          {[
            { id: 'all', label: 'All Markets', icon: '🌐' },
            { id: 'tech', label: 'Tech & AI', icon: '💻' },
            { id: 'crypto', label: 'Crypto & Web3', icon: '⚡' },
            { id: 'sports', label: 'Sports', icon: '⚽' },
            { id: 'world', label: 'World Events', icon: '🌍' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : `${tc.bgSecondary} ${tc.textSecondary} hover:bg-emerald-500/10 hover:text-emerald-400 border border-[#38444d]/30`
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Prediction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMarkets.map(market => (
            <div
              key={market.id}
              className={`p-5 rounded-3xl border border-[#38444d]/40 ${tc.bgCard} hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-emerald-500/10`}
            >
              <div>
                {/* Creator header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <img src={market.creatorAvatar} alt={market.creatorName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-semibold">{market.creatorName}</span>
                    <span className="text-xs text-gray-500">@{market.creatorHandle}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                    {market.category}
                  </span>
                </div>

                <h3 className="font-bold text-base leading-snug mb-4 hover:text-emerald-400 transition-colors">
                  {market.question}
                </h3>

                {/* Probability Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span>YES</span>
                      <span className="text-sm font-extrabold">{market.yesPercentage}%</span>
                    </span>
                    <span className="text-rose-400 flex items-center gap-1">
                      <span className="text-sm font-extrabold">{market.noPercentage}%</span>
                      <span>NO</span>
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${market.yesPercentage}%` }}
                    />
                    <div
                      className="bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${market.noPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons & Volume */}
              <div className="pt-3 border-t border-[#38444d]/30 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <span className="block font-semibold text-white">${market.totalVolumeUsd.toLocaleString()} Vol</span>
                  <span className="text-[11px]">⏳ {market.endsAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(market, 'yes')}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                      market.userVote === 'yes'
                        ? 'bg-emerald-500 text-black ring-2 ring-emerald-300'
                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                    }`}
                  >
                    Buy YES (${(market.yesPercentage / 100).toFixed(2)})
                  </button>

                  <button
                    onClick={() => handleVote(market, 'no')}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                      market.userVote === 'no'
                        ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                        : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                    }`}
                  >
                    Buy NO (${(market.noPercentage / 100).toFixed(2)})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wager Modal */}
      {selectedMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 ${tc.bgModal} border border-[#38444d] shadow-2xl relative text-white`}>
            <button
              onClick={() => setSelectedMarket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {wagerSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                  ✓
                </div>
                <h3 className="text-xl font-bold">Wager Placed!</h3>
                <p className="text-xs text-gray-300 mt-1">
                  You staked {wagerAmount} LP on <span className="font-bold uppercase text-emerald-400">{voteChoice}</span>.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-1">Place Conviction Wager</h3>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{selectedMarket.question}</p>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-[#38444d]/50 mb-4 flex items-center justify-between">
                  <span className="text-xs text-gray-300">Your Selection:</span>
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                    voteChoice === 'yes' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {voteChoice === 'yes' ? 'YES (' + selectedMarket.yesPercentage + '%)' : 'NO (' + selectedMarket.noPercentage + '%)'}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Stake Amount (Points)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 50, 100].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setWagerAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          wagerAmount === amt
                            ? 'bg-emerald-500 text-black border-emerald-500'
                            : 'bg-[#253341] text-gray-300 border-[#38444d] hover:border-emerald-400'
                        }`}
                      >
                        {amt} LP
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 mb-5 text-xs text-emerald-300 flex items-center justify-between">
                  <span>Potential Win Payout:</span>
                  <span className="font-extrabold text-sm text-emerald-400">
                    +{(wagerAmount * (voteChoice === 'yes' ? (100 / selectedMarket.yesPercentage) : (100 / selectedMarket.noPercentage))).toFixed(1)} LP
                  </span>
                </div>

                <button
                  onClick={handleConfirmWager}
                  className="w-full py-3 rounded-full font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-black shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                >
                  Confirm {wagerAmount} LP Wager
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Market Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-3xl p-6 ${tc.bgModal} border border-[#38444d] shadow-2xl relative text-white`}>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-1">Create a Prediction Market</h2>
            <p className="text-xs text-gray-400 mb-5">Launch an outcome question for the global Longa community to wager on.</p>

            <form onSubmit={handleCreateMarket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Question / Statement</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Will Ethereum transition to single-slot finality by 2027?"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-emerald-500`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-emerald-500`}
                  >
                    <option value="tech">Tech & AI</option>
                    <option value="crypto">Crypto & Web3</option>
                    <option value="sports">Sports</option>
                    <option value="world">World Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Resolution Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. In 20 days"
                    value={newEndsAt}
                    onChange={e => setNewEndsAt(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-emerald-500`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 active:scale-95 transition"
                >
                  Deploy Market
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
