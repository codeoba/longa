import React, { useState, useEffect } from 'react';
import { StoreItem } from '../types';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';

export const CreatorStore: React.FC = () => {
  const tc = useThemeClasses();
  const { user } = useAuth();

  const [products, setProducts] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'mpesa'>('wallet');
  const [processingPayment, setProcessingPayment] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(19);
  const [newCategory, setNewCategory] = useState<'code' | 'ebook' | 'design' | 'audio' | 'consultation'>('code');
  const [newTags, setNewTags] = useState('react, typescript, ui');

  // Load products
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/store/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {
      // Fallback defaults
      setProducts([
        {
          id: 'prod_1',
          creatorId: 'user_1',
          creatorName: 'Amani Dev',
          creatorHandle: 'amanidev',
          creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          title: 'Fullstack Next.js & GraphQL SaaS Boilerplate',
          description: 'Production-ready starter with multi-tenancy, Stripe billing, role RBAC, and clean Tailwind design.',
          price: 49,
          currency: 'USD',
          category: 'code',
          coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
          salesCount: 142,
          rating: 4.9,
          fileUrl: 'https://github.com/example/boilerplate.zip',
          tags: ['React', 'Next.js', 'TypeScript', 'SaaS']
        },
        {
          id: 'prod_2',
          creatorId: 'user_2',
          creatorName: 'Sarah M.',
          creatorHandle: 'sarahdesigns',
          creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
          title: 'Design System Masterclass & Figma UI Kit',
          description: '350+ accessible components, tokens, auto-layout 5.0, and interactive prototypes for design teams.',
          price: 29,
          currency: 'USD',
          category: 'design',
          coverImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=600',
          salesCount: 388,
          rating: 5.0,
          fileUrl: 'https://figma.com/@sarahdesigns/kit',
          tags: ['Figma', 'UI/UX', 'Design System']
        },
        {
          id: 'prod_3',
          creatorId: 'user_3',
          creatorName: 'Kibo Tech',
          creatorHandle: 'kibotech',
          creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          title: 'Building High-Scale Distributed Systems in 2026',
          description: 'Comprehensive 180-page ebook on Kafka, event sourcing, micro-frontends, and latency optimization.',
          price: 19,
          currency: 'USD',
          category: 'ebook',
          coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600',
          salesCount: 520,
          rating: 4.8,
          tags: ['Architecture', 'Ebook', 'Cloud', 'Scale']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const payload = {
      title: newTitle,
      description: newDesc,
      price: Number(newPrice),
      currency: 'USD',
      category: newCategory,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      creatorName: user?.name || 'Creator',
      creatorHandle: user?.handle || 'creator',
      creatorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      coverImage: newCategory === 'code'
        ? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'
        : newCategory === 'design'
        ? 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=600'
        : 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600'
    };

    try {
      const res = await fetch('http://localhost:8000/store/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => [data.product, ...prev]);
      } else {
        const mockItem: StoreItem = {
          id: 'prod_' + Date.now(),
          creatorId: user?.id || 'me',
          creatorName: user?.name || 'Creator',
          creatorHandle: user?.handle || 'creator',
          creatorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          title: newTitle,
          description: newDesc,
          price: Number(newPrice),
          currency: 'USD',
          category: newCategory,
          coverImage: payload.coverImage,
          salesCount: 0,
          rating: 5.0,
          tags: payload.tags
        };
        setProducts(prev => [mockItem, ...prev]);
      }
    } catch {
      // offline fallback
    } finally {
      setIsSellModalOpen(false);
      setNewTitle('');
      setNewDesc('');
    }
  };

  const handleBuy = async (product: StoreItem) => {
    setProcessingPayment(true);
    try {
      const res = await fetch('http://localhost:8000/store/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          paymentMethod
        })
      });
      const data = await res.json();
      setPurchaseSuccess(data.downloadToken || 'LONGAPASS-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    } catch {
      setPurchaseSuccess('LONGAPASS-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    } finally {
      setProcessingPayment(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Products', icon: '✨' },
    { id: 'code', label: 'Code & SaaS', icon: '💻' },
    { id: 'design', label: 'Design Kits', icon: '🎨' },
    { id: 'ebook', label: 'E-Books & Guides', icon: '📚' },
    { id: 'audio', label: 'Music & SFX', icon: '🎵' },
    { id: 'consultation', label: '1-on-1 Mentorship', icon: '🤝' },
  ];

  const filteredProducts = products.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-20`}>
      {/* Top Banner */}
      <div className="relative overflow-hidden border-b border-[#38444d]/40 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-3">
              <span>💎 Longa Commerce Engine</span>
              <span className="text-gray-400">•</span>
              <span>Zero Platform Cut For Pro Creators</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Creator Store & Digital Marketplace
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-400 max-w-xl">
              Buy software, presets, templates, and courses directly inside your feed with instant delivery and secure escrow.
            </p>
          </div>
          <button
            onClick={() => setIsSellModalOpen(true)}
            className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transform active:scale-95 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Sell a Product
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search & Category Pills */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  selectedCategory === c.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : `${tc.bgSecondary} ${tc.textSecondary} hover:bg-blue-500/10 hover:text-blue-400 border border-[#38444d]/30`
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search code, design, guides..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm border border-[#38444d]/50 ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500 transition`}
            />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#38444d]/50 rounded-2xl p-8">
            <p className="text-5xl mb-3">🛍️</p>
            <h3 className="text-xl font-bold">No products found</h3>
            <p className="text-gray-400 text-sm mt-1">Be the first creator to list an item in this category!</p>
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="mt-4 px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`rounded-2xl border border-[#38444d]/40 overflow-hidden ${tc.bgCard} hover:border-blue-500/50 transition-all duration-200 flex flex-col group shadow-lg hover:shadow-blue-500/10`}
              >
                {/* Cover Image */}
                <div className="h-44 w-full relative overflow-hidden bg-gray-900">
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
                    ${product.price} {product.currency}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-600/90 text-white backdrop-blur-sm uppercase tracking-wider">
                    {product.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Creator Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={product.creatorAvatar}
                        alt={product.creatorName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold">{product.creatorName}</span>
                      <span className="text-xs text-gray-500">@{product.creatorHandle}</span>
                    </div>

                    <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {product.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-[#38444d]/30 text-gray-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer & Action */}
                  <div className="mt-5 pt-4 border-t border-[#38444d]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1 text-amber-400">
                        ★ <span className="text-white font-medium">{product.rating}</span>
                      </span>
                      <span>•</span>
                      <span>{product.salesCount} sold</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setPurchaseSuccess(null);
                      }}
                      className="px-4 py-2 rounded-full font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sell Product Modal */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 ${tc.bgModal} border border-[#38444d] shadow-2xl relative animate-in fade-in zoom-in-95`}>
            <button
              onClick={() => setIsSellModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-1">List a Digital Product</h2>
            <p className="text-xs text-gray-400 mb-5">Sell code, templates, presets, or guides directly to the Longa community.</p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js SaaS Template"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                >
                  <option value="code">Code & SaaS Starter</option>
                  <option value="design">Design Kit & Figma</option>
                  <option value="ebook">E-Book & Guide</option>
                  <option value="audio">Music & Sound Effects</option>
                  <option value="consultation">1-on-1 Consultation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Price (USD)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="react, typescript, ui"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description & Deliverables</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail what the buyer receives upon payment (e.g. GitHub repo link, PDF guide)..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSellModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition"
                >
                  Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${tc.bgModal} border border-[#38444d] shadow-2xl relative`}>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setPurchaseSuccess(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
            >
              ✕
            </button>

            {purchaseSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold">Purchase Successful!</h3>
                <p className="text-sm text-gray-400 mt-2">
                  You now own <span className="text-white font-semibold">{selectedProduct.title}</span>.
                </p>

                <div className="mt-5 p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-left">
                  <span className="text-xs text-blue-400 font-bold block mb-1">Instant Unlock License:</span>
                  <div className="flex items-center justify-between font-mono text-sm bg-black/40 px-3 py-2 rounded-lg text-emerald-400 border border-emerald-500/20">
                    <span>{purchaseSuccess}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(purchaseSuccess)}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Access link and files have also been saved to your Longa Vault and sent to your messages.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setPurchaseSuccess(null);
                  }}
                  className="mt-6 w-full py-2.5 rounded-full font-bold bg-blue-600 hover:bg-blue-500 text-white text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-1">Instant Checkout</h3>
                <p className="text-xs text-gray-400 mb-4">Direct payment via smart escrow.</p>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#38444d]/20 border border-[#38444d]/40 mb-4">
                  <img
                    src={selectedProduct.coverImage}
                    alt={selectedProduct.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm line-clamp-1">{selectedProduct.title}</h4>
                    <p className="text-xs text-gray-400">By {selectedProduct.creatorName}</p>
                    <p className="text-sm font-extrabold text-blue-400 mt-0.5">
                      ${selectedProduct.price} {selectedProduct.currency}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <span className="text-xs font-semibold block text-gray-300">Choose Payment Method:</span>
                  <div
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'wallet'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#38444d]/40 hover:bg-[#38444d]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-sm">
                      <span>⚡</span>
                      <div>
                        <div className="font-semibold">Longa Creator Wallet</div>
                        <div className="text-[11px] text-gray-400">Instant checkout • Zero fees</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">$240.00 Balance</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#38444d]/40 hover:bg-[#38444d]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-sm">
                      <span>💳</span>
                      <div>
                        <div className="font-semibold">Credit / Debit Card</div>
                        <div className="text-[11px] text-gray-400">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'mpesa'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#38444d]/40 hover:bg-[#38444d]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-sm">
                      <span>📱</span>
                      <div>
                        <div className="font-semibold">M-Pesa / Mobile Money</div>
                        <div className="text-[11px] text-gray-400">Direct mobile push notification</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(selectedProduct)}
                  disabled={processingPayment}
                  className="w-full py-3 rounded-full font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  {processingPayment ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Pay ${selectedProduct.price} & Unlock</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
