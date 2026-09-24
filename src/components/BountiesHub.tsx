import React, { useState, useEffect } from 'react';
import { Bounty, BountySubmission } from '../types';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';

export const BountiesHub: React.FC = () => {
  const tc = useThemeClasses();
  const { user } = useAuth();

  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'awarded'>('all');
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);

  // Post bounty modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newReward, setNewReward] = useState(150);
  const [newCategory, setNewCategory] = useState('Code & Tech');
  const [newDeadline, setNewDeadline] = useState('7 days');
  const [newTags, setNewTags] = useState('React, Tailwind, Optimization');

  // Submit solution modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [solutionContent, setSolutionContent] = useState('');
  const [solutionLink, setSolutionLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Submissions list modal
  const [activeSubmissions, setActiveSubmissions] = useState<BountySubmission[]>([]);
  const [isViewingSubmissions, setIsViewingSubmissions] = useState(false);

  const fetchBounties = async () => {
    try {
      const res = await fetch('http://localhost:8000/bounties');
      if (res.ok) {
        const data = await res.json();
        setBounties(data.bounties || []);
      }
    } catch {
      // Fallback sample data
      setBounties([
        {
          id: 'bounty_1',
          creatorId: 'user_dev',
          creatorName: 'Longa Engineering',
          creatorHandle: 'longadev',
          creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          title: 'Build a High-Performance WebGL Sound Waveform Visualizer for Spaces',
          description: 'We need an ultra-smooth 60fps canvas visualizer that reacts to WebRTC audio streams in real-time with neon cyberpunk gradients.',
          rewardAmount: 350,
          currency: 'USD',
          category: 'Code & Tech',
          deadline: 'In 5 days',
          status: 'open',
          submissionsCount: 6,
          tags: ['WebGL', 'AudioContext', 'React']
        },
        {
          id: 'bounty_2',
          creatorId: 'user_design',
          creatorName: 'Elena Rostova',
          creatorHandle: 'elenadesigns',
          creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          title: '3D Isometric Badge Pack for Longa Verified Creators',
          description: 'Design 5 custom 3D glassmorphic achievement badges: Top Writer, Audio Host, Bounty Hunter, Code Architect, and Founding Patron.',
          rewardAmount: 200,
          currency: 'USD',
          category: 'Design & 3D',
          deadline: 'In 2 days',
          status: 'open',
          submissionsCount: 12,
          tags: ['Figma', 'Blender', '3D Badges']
        },
        {
          id: 'bounty_3',
          creatorId: 'user_growth',
          creatorName: 'DevRel Daily',
          creatorHandle: 'devreldaily',
          creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
          title: 'Comprehensive Guide & Thread: Why Longa Outclasses Legacy Twitter for Builders',
          description: 'Write an in-depth, viral analytical thread comparing Longa features (Audio Spaces 2.0, Longa AI, Escrow Bounties, Creator Store) to legacy platforms.',
          rewardAmount: 150,
          currency: 'USD',
          category: 'Content & Threads',
          deadline: 'In 4 days',
          status: 'open',
          submissionsCount: 9,
          tags: ['TwitterX', 'Thread', 'DeepDive']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, []);

  const handlePostBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const payload = {
      title: newTitle,
      description: newDesc,
      rewardAmount: Number(newReward),
      currency: 'USD',
      category: newCategory,
      deadline: newDeadline,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      creatorName: user?.name || 'Bounty Host',
      creatorHandle: user?.handle || 'bountyhost',
      creatorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };

    try {
      const res = await fetch('http://localhost:8000/bounties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setBounties(prev => [data.bounty, ...prev]);
      } else {
        const mock: Bounty = {
          id: 'bounty_' + Date.now(),
          creatorId: user?.id || 'me',
          creatorName: payload.creatorName,
          creatorHandle: payload.creatorHandle,
          creatorAvatar: payload.creatorAvatar,
          title: newTitle,
          description: newDesc,
          rewardAmount: Number(newReward),
          currency: 'USD',
          category: newCategory,
          deadline: newDeadline,
          status: 'open',
          submissionsCount: 0,
          tags: payload.tags
        };
        setBounties(prev => [mock, ...prev]);
      }
    } catch {
      // offline fallback
    } finally {
      setIsPostModalOpen(false);
      setNewTitle('');
      setNewDesc('');
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBounty || !solutionContent.trim()) return;

    setSubmitting(true);
    const payload = {
      content: solutionContent,
      links: solutionLink ? [solutionLink] : [],
      userName: user?.name || 'Builder',
      userHandle: user?.handle || 'builder',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };

    try {
      await fetch(`http://localhost:8000/bounties/${selectedBounty.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSubmitSuccess(true);
      setBounties(prev =>
        prev.map(b => b.id === selectedBounty.id ? { ...b, submissionsCount: b.submissionsCount + 1 } : b)
      );
    } catch {
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAwardWinner = async (bountyId: string, submissionId: string) => {
    try {
      await fetch(`http://localhost:8000/bounties/${bountyId}/award`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId })
      });
      setBounties(prev =>
        prev.map(b => b.id === bountyId ? { ...b, status: 'awarded', winnerSubmissionId: submissionId } : b)
      );
      setIsViewingSubmissions(false);
    } catch {
      setBounties(prev =>
        prev.map(b => b.id === bountyId ? { ...b, status: 'awarded', winnerSubmissionId: submissionId } : b)
      );
      setIsViewingSubmissions(false);
    }
  };

  const openSubmissionsForBounty = (bounty: Bounty) => {
    setSelectedBounty(bounty);
    // Populate sample submissions
    setActiveSubmissions([
      {
        id: 'sub_1',
        bountyId: bounty.id,
        userId: 'user_sub1',
        userName: 'Alex Chen',
        userHandle: 'alexchen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        content: 'Completed the full implementation with 60fps performance profiling and responsive touch handlers. Repo tested and live on Vercel.',
        links: ['https://github.com/alexchen/longa-audio-viz', 'https://audio-viz-demo.vercel.app'],
        isWinner: bounty.winnerSubmissionId === 'sub_1',
        submittedAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        id: 'sub_2',
        bountyId: bounty.id,
        userId: 'user_sub2',
        userName: 'Zainab Juma',
        userHandle: 'zainabj',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        content: 'Alternative lightweight CSS Canvas shader approach with zero external dependencies and automatic dark mode adaptation.',
        links: ['https://codesandbox.io/s/longa-viz-pure-js'],
        isWinner: bounty.winnerSubmissionId === 'sub_2',
        submittedAt: new Date(Date.now() - 3600000 * 12)
      }
    ]);
    setIsViewingSubmissions(true);
  };

  const filteredBounties = bounties.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-[#38444d]/40 bg-gradient-to-r from-amber-900/30 via-orange-900/20 to-indigo-900/30 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
              <span>🏆 Longa Quests & Bounties</span>
              <span className="text-gray-400">•</span>
              <span>Earn Cash & Recognition</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Community Bounties & Challenges
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-400 max-w-xl">
              Solve engineering tasks, design assets, and write viral content to win instant escrow payouts.
            </p>
          </div>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 flex items-center gap-2 transform active:scale-95 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Fund a Bounty
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-[#38444d]/30 pb-4">
          <div className="flex items-center gap-2">
            {(['all', 'open', 'awarded'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  filterStatus === tab
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : `${tc.bgSecondary} ${tc.textSecondary} hover:bg-amber-500/10 hover:text-amber-400`
                }`}
              >
                {tab === 'all' ? 'All Bounties' : tab}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400">
            {filteredBounties.length} {filteredBounties.length === 1 ? 'quest' : 'quests'} available
          </span>
        </div>

        {/* Bounty Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredBounties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#38444d]/50 rounded-2xl p-8">
            <p className="text-5xl mb-3">🎯</p>
            <h3 className="text-xl font-bold">No active bounties in this filter</h3>
            <p className="text-gray-400 text-sm mt-1">Be the first to launch a community challenge!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBounties.map(bounty => (
              <div
                key={bounty.id}
                className={`p-6 rounded-2xl border border-[#38444d]/40 ${tc.bgCard} hover:border-amber-500/50 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md hover:shadow-amber-500/10`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={bounty.creatorAvatar}
                      alt={bounty.creatorName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold">{bounty.creatorName}</span>
                    <span className="text-xs text-gray-500">@{bounty.creatorHandle}</span>
                    <span className="text-gray-500">•</span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      bounty.status === 'open'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {bounty.status}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto md:ml-0">⏳ {bounty.deadline}</span>
                  </div>

                  <h3 className="text-lg font-bold hover:text-amber-400 transition-colors">
                    {bounty.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {bounty.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {bounty.category}
                    </span>
                    {bounty.tags.map((tag, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-[#38444d]/30 text-gray-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#38444d]/30 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-gray-400 block">Reward Pool</span>
                    <span className="text-2xl font-black text-amber-400">
                      ${bounty.rewardAmount} <span className="text-xs text-gray-300">{bounty.currency}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openSubmissionsForBounty(bounty)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold ${tc.bgSecondary} hover:bg-[#38444d]/40 border border-[#38444d]/40 transition`}
                    >
                      {bounty.submissionsCount} Submissions
                    </button>

                    {bounty.status === 'open' && (
                      <button
                        onClick={() => {
                          setSelectedBounty(bounty);
                          setIsSubmitModalOpen(true);
                          setSubmitSuccess(false);
                          setSolutionContent('');
                          setSolutionLink('');
                        }}
                        className="px-4 py-2 rounded-full font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 active:scale-95 transition"
                      >
                        Submit Work
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Bounty Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 ${tc.bgModal} border border-[#38444d] shadow-2xl relative`}>
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-1">Fund a Community Quest</h2>
            <p className="text-xs text-gray-400 mb-5">Funds are held in secure Longa escrow until you approve the winner.</p>

            <form onSubmit={handlePostBounty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Quest Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build an open-source Rust SDK for Longa API"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-amber-500`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Reward Pool (USD)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newReward}
                    onChange={e => setNewReward(Number(e.target.value))}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-amber-500`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-amber-500`}
                  >
                    <option value="Code & Tech">Code & Tech</option>
                    <option value="Design & 3D">Design & 3D</option>
                    <option value="Content & Threads">Content & Threads</option>
                    <option value="AI & Prompts">AI & Prompts</option>
                    <option value="Security & Audit">Security & Audit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Submission Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 days"
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-amber-500`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Rust, API, OpenSource"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-amber-500`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Specification & Deliverables</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Clearly describe the objective, acceptance criteria, and what the final deliverable must contain..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-amber-500`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 active:scale-95 transition"
                >
                  Deposit & Launch Bounty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Solution Modal */}
      {isSubmitModalOpen && selectedBounty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 ${tc.bgModal} border border-[#38444d] shadow-2xl relative`}>
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
            >
              ✕
            </button>

            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold">Solution Submitted!</h3>
                <p className="text-sm text-gray-400 mt-2">
                  The host has been notified. If your submission is selected, ${selectedBounty.rewardAmount} will be deposited to your wallet.
                </p>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-full font-bold bg-amber-500 text-black text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-1">Submit Quest Solution</h2>
                <p className="text-xs text-gray-400 mb-4">
                  Submitting for: <span className="text-amber-400 font-semibold">{selectedBounty.title}</span> (${selectedBounty.rewardAmount})
                </p>

                <form onSubmit={handleSubmitSolution} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Live URL, GitHub Repo, or Demo Link</label>
                    <input
                      type="url"
                      placeholder="https://github.com/yourname/project"
                      value={solutionLink}
                      onChange={e => setSolutionLink(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-amber-500`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Solution Summary & Notes</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Explain how you built it, key architectural highlights, benchmark results, or proof of execution..."
                      value={solutionContent}
                      onChange={e => setSolutionContent(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-amber-500`}
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 active:scale-95 transition"
                    >
                      {submitting ? 'Submitting...' : 'Submit Entry'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {isViewingSubmissions && selectedBounty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-2xl rounded-2xl p-6 ${tc.bgModal} border border-[#38444d] shadow-2xl relative max-h-[85vh] flex flex-col`}>
            <button
              onClick={() => setIsViewingSubmissions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
            >
              ✕
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold">Submissions for Quest</h3>
              <p className="text-xs text-gray-400">{selectedBounty.title}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {activeSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className={`p-4 rounded-xl border ${
                    sub.isWinner
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-[#38444d]/50 bg-[#38444d]/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <img src={sub.userAvatar} alt={sub.userName} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-bold">{sub.userName}</span>
                      <span className="text-xs text-gray-400">@{sub.userHandle}</span>
                    </div>
                    {sub.isWinner && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        🏆 Winner
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-3">{sub.content}</p>

                  {sub.links && sub.links.length > 0 && (
                    <div className="space-y-1 mb-3">
                      {sub.links.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-400 hover:underline block truncate"
                        >
                          🔗 {link}
                        </a>
                      ))}
                    </div>
                  )}

                  {selectedBounty.status === 'open' && !sub.isWinner && (
                    <button
                      onClick={() => handleAwardWinner(selectedBounty.id, sub.id)}
                      className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md transition"
                    >
                      Award ${selectedBounty.rewardAmount} & Mark Winner
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
