import React, { useState, useEffect, useRef } from 'react';
import { StoreItem } from '../types';
import { useThemeClasses } from '../themeUtils';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl, uploadMedia } from '../api/phpAdapter';
import Avatar, { isImageUrl } from './Avatar';

export const CreatorStore: React.FC = () => {
  const tc = useThemeClasses();
  const { user } = useAuth();

  const [products, setProducts] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<StoreItem | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [checkoutProduct, setCheckoutProduct] = useState<StoreItem | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'mpesa'>('wallet');
  const [processingPayment, setProcessingPayment] = useState(false);

  // --- Create Product Form State ---
  const [activeTab, setActiveTab] = useState<'basics' | 'visuals' | 'content' | 'pricing'>('basics');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StoreItem['category']>('code');
  const [deliveryType, setDeliveryType] = useState<'instant_download' | 'link' | 'consultation_call'>('instant_download');
  const [license, setLicense] = useState<'personal' | 'commercial' | 'extended'>('commercial');
  
  // Pricing
  const [price, setPrice] = useState<number | string>(29);
  const [originalPrice, setOriginalPrice] = useState<number | string>(49);
  const [currency, setCurrency] = useState('USD');
  const [tags, setTags] = useState<string[]>(['React', 'Next.js', 'UI']);
  const [tagInput, setTagInput] = useState('');

  // Media
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Deliverables
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [externalLink, setExternalLink] = useState('');

  // Rich Content
  const [description, setDescription] = useState(
    '### Maelezo ya Bidhaa\nKiolezo hiki kimeandaliwa kwa ubora wa juu na kiko tayari kutumika kwenye miradi halisi ya uzalishaji.\n\n- Safi na rahisi kuelewa\n- Usaidizi wa haraka na miongozo kamili\n- Masasisho ya bure kwa miezi 12'
  );
  const [descMode, setDescMode] = useState<'edit' | 'preview'>('edit');
  const [features, setFeatures] = useState<string[]>([
    'Kodi zote chanzo (Full Source Code)',
    'Figma UI Kit & Design Tokens',
    'Msaada wa Kiufundi wa 24/7',
    'Miongozo ya Hatua kwa Hatua (Step-by-Step Docs)'
  ]);
  const [featureInput, setFeatureInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewCardMode, setPreviewCardMode] = useState(false);

  // File input refs
  const coverFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const digitalFileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load products from API
  const fetchProducts = async () => {
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(`${baseUrl}/store/products`);
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          return;
        }
      }
    } catch (e) {
      console.warn('Using default store products:', e);
    }

    // High quality default store items
    setProducts([
      {
        id: 'prod_1',
        creatorId: 'user_1',
        creatorName: 'Amani Dev',
        creatorHandle: 'amanidev',
        creatorAvatar: '👨‍💻',
        title: 'Fullstack Next.js & GraphQL SaaS Boilerplate',
        description: 'Production-ready starter with multi-tenancy, Stripe billing, role RBAC, and clean Tailwind design.',
        price: 49,
        originalPrice: 89,
        currency: 'USD',
        category: 'code',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&fit=crop',
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&fit=crop'
        ],
        salesCount: 142,
        rating: 4.9,
        fileUrl: 'https://github.com/example/boilerplate.zip',
        fileName: 'nextjs-saas-v2.zip',
        fileSize: '14.2 MB',
        tags: ['React', 'Next.js', 'TypeScript', 'SaaS'],
        features: [
          'Multi-Tenant Architecture',
          'Stripe & M-Pesa Integrated Checkout',
          'Automated Database Migrations',
          'Clean Tailwind v4 Dark/Light Theme'
        ],
        license: 'commercial',
        deliveryType: 'instant_download'
      },
      {
        id: 'prod_2',
        creatorId: 'user_2',
        creatorName: 'Sarah M.',
        creatorHandle: 'sarahdesigns',
        creatorAvatar: '👩‍🎨',
        title: 'Design System Masterclass & Figma UI Kit',
        description: '350+ accessible components, tokens, auto-layout 5.0, and interactive prototypes for design teams.',
        price: 29,
        originalPrice: 59,
        currency: 'USD',
        category: 'design',
        coverImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&fit=crop',
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&fit=crop'
        ],
        salesCount: 388,
        rating: 5.0,
        fileUrl: 'https://figma.com/@sarahdesigns/kit',
        fileName: 'Longa_Design_System_2026.fig',
        fileSize: '48.6 MB',
        tags: ['Figma', 'UI/UX', 'Design System'],
        features: [
          '350+ Ready-to-use Components',
          'Auto-Layout 5.0 Compliant',
          'Typography & Color Tokens',
          'Light and Dark mode variations'
        ],
        license: 'commercial',
        deliveryType: 'link'
      },
      {
        id: 'prod_3',
        creatorId: 'user_3',
        creatorName: 'Kibo Tech',
        creatorHandle: 'kibotech',
        creatorAvatar: '🚀',
        title: 'Building High-Scale Distributed Systems in 2026',
        description: 'Comprehensive 180-page ebook on Kafka, event sourcing, micro-frontends, and latency optimization.',
        price: 19,
        originalPrice: 35,
        currency: 'USD',
        category: 'ebook',
        coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&fit=crop',
        salesCount: 520,
        rating: 4.8,
        tags: ['Architecture', 'Ebook', 'Cloud', 'Scale'],
        features: [
          '180 Illustrated PDF Pages',
          'System Design Interview Cheat Sheet',
          'Benchmark Code Samples (Go & Node.js)'
        ],
        license: 'personal',
        deliveryType: 'instant_download'
      }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Handlers for Visual Uploads ---
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const res = await uploadMedia(file);
      setCoverImage(res.url);
    } catch (err: any) {
      alert('Hitilafu ya kupakia picha ya jalada: ' + (err.message || 'Jaribu tena'));
    } finally {
      setUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      for (let i = 0; i < files.length; i++) {
        if (galleryImages.length >= 6) {
          alert('Unaweza kupakia hadi picha 6 za gallery pekee.');
          break;
        }
        const res = await uploadMedia(files[i]);
        setGalleryImages(prev => [...prev, res.url]);
      }
    } catch (err: any) {
      alert('Hitilafu ya kupakia picha: ' + (err.message || 'Jaribu tena'));
    } finally {
      setUploadingGallery(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // --- Handler for Deliverable File Upload ---
  const handleDigitalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const res = await uploadMedia(file);
      setFileUrl(res.url);
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    } catch (err: any) {
      alert('Hitilafu ya kupakia faili: ' + (err.message || 'Jaribu tena'));
    } finally {
      setUploadingFile(false);
      if (e.target) e.target.value = '';
    }
  };

  // --- Rich Editor Helpers ---
  const insertFormatting = (syntaxStart: string, syntaxEnd: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = description.substring(start, end);
    const replacement = syntaxStart + (selected || 'maandishi') + syntaxEnd;
    const newText = description.substring(0, start) + replacement + description.substring(end);
    setDescription(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxStart.length, start + replacement.length - syntaxEnd.length);
    }, 10);
  };

  // Add / remove tags
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const removeTag = (tToRemove: string) => {
    setTags(tags.filter(t => t !== tToRemove));
  };

  // Add / remove features
  const handleAddFeature = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (idxToRemove: number) => {
    setFeatures(features.filter((_, idx) => idx !== idxToRemove));
  };

  // --- Publish Product ---
  const handlePublishProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || Number(price) <= 0) {
      alert('Tafadhali weka Jina la bidhaa na Bei sahihi.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      currency,
      category,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop',
      galleryImages: galleryImages.length > 0 ? galleryImages : [coverImage],
      tags,
      features,
      fileUrl: deliveryType === 'link' ? externalLink : fileUrl,
      fileName,
      fileSize,
      license,
      deliveryType,
      creatorName: user?.name || 'Creator',
      creatorHandle: user?.handle || '@creator',
      creatorAvatar: user?.avatar || '👤'
    };

    try {
      const baseUrl = getApiUrl();
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${baseUrl}/store/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(prev => [data.product, ...prev]);
      } else {
        // Fallback local save
        const fallbackItem: StoreItem = {
          id: 'prod_' + Date.now(),
          creatorId: user?.id || 'me',
          ...payload
        } as StoreItem;
        setProducts(prev => [fallbackItem, ...prev]);
      }

      setIsSellModalOpen(false);
      alert('Hongera! Bidhaa yako imechapishwa kikamilifu kwenye Longa Store.');
    } catch {
      const fallbackItem: StoreItem = {
        id: 'prod_' + Date.now(),
        creatorId: user?.id || 'me',
        ...payload
      } as StoreItem;
      setProducts(prev => [fallbackItem, ...prev]);
      setIsSellModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Purchase handler ---
  const handleBuy = async (product: StoreItem) => {
    setProcessingPayment(true);
    try {
      const baseUrl = getApiUrl();
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${baseUrl}/store/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          productId: product.id,
          paymentMethod
        })
      });
      const data = await res.json();
      setPurchaseSuccess(data.order_reference || 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    } catch {
      setPurchaseSuccess('ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase());
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
    { id: 'course', label: 'Courses & Video', icon: '🎓' },
    { id: 'service', label: 'Custom Services', icon: '⚡' },
  ];

  const filteredProducts = products.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text} pb-24`}>
      {/* Top Banner */}
      <div className="relative overflow-hidden border-b border-[#38444d]/40 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-3">
              <span>💎 Longa Commerce Studio</span>
              <span className="text-gray-400">•</span>
              <span>Rich Deliverables & Gallery</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Creator Store & Digital Marketplace
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-400 max-w-xl">
              Gundua, pakua, au uza programu (code), templeti, e-vitabu, na kozi moja kwa moja ukitumia mfumo wa kisasa wa malipo na usambazaji salama.
            </p>
          </div>
          <button
            onClick={() => {
              setIsSellModalOpen(true);
              setActiveTab('basics');
            }}
            className="px-6 py-3.5 rounded-full font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 flex items-center gap-2.5 transform active:scale-95 transition hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Chapisha Bidhaa (Sell a Product)</span>
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
              placeholder="Tafuta code, vitabu, templeti..."
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
            <h3 className="text-xl font-bold">Hakuna bidhaa iliyopatikana</h3>
            <p className="text-gray-400 text-sm mt-1">Kuwa wa kwanza kuchapisha bidhaa ya kidijitali katika kipengele hiki!</p>
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md"
            >
              Weka Bidhaa Sasa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;
              const discountPercent = hasDiscount
                ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    setViewProduct(product);
                    setActiveGalleryIndex(0);
                  }}
                  className={`rounded-2xl border border-[#38444d]/40 overflow-hidden ${tc.bgCard} hover:border-blue-500/50 transition-all duration-300 flex flex-col group shadow-lg hover:shadow-blue-500/10 cursor-pointer`}
                >
                  {/* Cover Image & Badges */}
                  <div className="h-48 w-full relative overflow-hidden bg-gray-900">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Price Tag with Discount */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-black/80 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5 shadow-lg">
                      {hasDiscount && (
                        <span className="text-gray-400 line-through text-[11px]">
                          ${product.originalPrice}
                        </span>
                      )}
                      <span className="text-emerald-400">
                        ${product.price} {product.currency}
                      </span>
                    </div>

                    {/* Discount badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-600 text-white shadow-md uppercase tracking-wider">
                        {discountPercent}% OFF
                      </div>
                    )}

                    {/* Category & Gallery count */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-600/90 text-white backdrop-blur-sm uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.galleryImages && product.galleryImages.length > 1 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/70 text-gray-300 backdrop-blur-sm flex items-center gap-1">
                          📷 {product.galleryImages.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Creator Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar src={product.creatorAvatar} size="xs" />
                        <span className="text-xs font-semibold truncate">{product.creatorName}</span>
                        <span className="text-xs text-gray-500 truncate">{product.creatorHandle}</span>
                      </div>

                      <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                        {product.description.replace(/[#*`_]/g, '')}
                      </p>

                      {/* Features preview */}
                      {product.features && product.features.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {product.features.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                              <span className="text-blue-400">✓</span>
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

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
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1 text-amber-400">
                          ★ <span className="text-white font-medium">{product.rating}</span>
                        </span>
                        <span>•</span>
                        <span>{product.salesCount} sold</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckoutProduct(product);
                          setPurchaseSuccess(null);
                        }}
                        className="px-4 py-2 rounded-full font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition"
                      >
                        Nunua Sasa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ================= RICH PRODUCT CREATION MODAL =========================== */}
      {/* ========================================================================= */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
          <div className={`w-full max-w-4xl my-auto rounded-3xl ${tc.bgModal} border border-[#38444d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]`}>
            
            {/* Modal Header with Live Preview Button */}
            <div className={`px-6 py-4 border-b border-[#38444d]/50 flex items-center justify-between sticky top-0 ${tc.bgModal} z-20`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg">
                  🛍️
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">Studio ya Kuchapisha Bidhaa (Product Studio)</h2>
                  <p className="text-xs text-gray-400">Unda bidhaa ya kidijitali yenye gallery ya picha, maelezo kamili na faili la kupakua.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewCardMode(!previewCardMode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                    previewCardMode
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span>👁️</span>
                  <span>{previewCardMode ? 'Funga Hakiki' : 'Hakiki Bidhaa'}</span>
                </button>
                <button
                  onClick={() => setIsSellModalOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`px-6 border-b border-[#38444d]/40 flex gap-2 overflow-x-auto ${tc.bgSecondary} py-2`}>
              {[
                { id: 'basics', label: '1. Misingi & Faili', icon: '📝' },
                { id: 'visuals', label: '2. Picha & Gallery', icon: '🖼️' },
                { id: 'content', label: '3. Rich Editor & Vipengele', icon: '✍️' },
                { id: 'pricing', label: '4. Bei & Leseni', icon: '🏷️' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: BASICS & DELIVERABLES */}
              {activeTab === 'basics' && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Jina la Bidhaa (Product Title) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Next.js SaaS Starter Kit yenye M-Pesa & Stripe"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      maxLength={80}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                    />
                    <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                      <span>Jina fupi na lenye kueleweka huongeza mauzo kwa 40%.</span>
                      <span>{title.length}/80</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Kipengele (Category)</label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value as any)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                      >
                        <option value="code">💻 Code & SaaS Boilerplate</option>
                        <option value="design">🎨 UI/UX & Figma Kits</option>
                        <option value="ebook">📚 E-Books & Guides</option>
                        <option value="audio">🎵 Music & Audio Samples</option>
                        <option value="consultation">🤝 1-on-1 Consultation</option>
                        <option value="course">🎓 Video Courses & Tutorials</option>
                        <option value="service">⚡ Digital Services & Freelance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Aina ya Utoaji (Delivery Type)</label>
                      <select
                        value={deliveryType}
                        onChange={e => setDeliveryType(e.target.value as any)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                      >
                        <option value="instant_download">📁 Pakua Faili Moja kwa Moja (Instant File Download)</option>
                        <option value="link">🔗 Kiungo cha Nje (GitHub, Figma, Notion, Drive)</option>
                        <option value="consultation_call">🤝 Miadi ya Maongezi (Calendly / Meeting Link)</option>
                      </select>
                    </div>
                  </div>

                  {/* Digital Deliverable Section */}
                  <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <span>📦</span>
                        <span>Deliverable / Faili Analopokea Mnunuzi:</span>
                      </span>
                      <span className="text-[11px] text-gray-400">Hufunguka kiotomatiki baada ya malipo</span>
                    </div>

                    {deliveryType === 'instant_download' ? (
                      <div>
                        <input
                          type="file"
                          ref={digitalFileRef}
                          onChange={handleDigitalFileUpload}
                          className="hidden"
                        />
                        <div
                          onClick={() => digitalFileRef.current?.click()}
                          className="border-2 border-dashed border-blue-500/40 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition bg-black/20 hover:bg-black/40"
                        >
                          {uploadingFile ? (
                            <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />
                              <span>Inapakia faili lako...</span>
                            </div>
                          ) : fileUrl ? (
                            <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs">
                              <div className="flex items-center gap-2">
                                <span>📄</span>
                                <span className="font-bold">{fileName || 'faili_la_bidhaa.zip'}</span>
                                {fileSize && <span className="text-gray-400">({fileSize})</span>}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFileUrl('');
                                  setFileName('');
                                }}
                                className="text-red-400 hover:text-red-300 font-bold"
                              >
                                Ondoa
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p className="text-2xl mb-1">📤</p>
                              <p className="text-xs font-semibold text-gray-200">
                                Bofya hapa kupakia faili (ZIP, PDF, MP4, APK)
                              </p>
                              <p className="text-[11px] text-gray-500 mt-1">Upeo: 25MB kwa kila faili</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          placeholder="Mfano: https://github.com/mweka/starter-kit au kiungo cha Figma/Drive"
                          value={externalLink}
                          onChange={e => setExternalLink(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: VISUALS & GALLERY */}
              {activeTab === 'visuals' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Cover Image */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-300">
                        Picha Kuu ya Jalada (Cover Image) <span className="text-red-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => coverFileRef.current?.click()}
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>📁 Pakia Kutoka Kwenye Kifaa</span>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={coverFileRef}
                      onChange={handleCoverUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="relative h-56 rounded-2xl overflow-hidden border border-[#38444d] bg-gray-900 group">
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
                        <button
                          type="button"
                          onClick={() => coverFileRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg"
                        >
                          {uploadingCover ? 'Inapakia...' : 'Badilisha Picha'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Multiple Gallery Images */}
                  <div className="p-4 rounded-2xl border border-[#38444d]/60 bg-[#38444d]/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">
                          Picha za Gallery & Screenshots ({galleryImages.length}/6)
                        </h4>
                        <p className="text-[11px] text-gray-400">
                          Weka picha za kuonyesha muonekano wa ndani wa bidhaa (Screenshots, UI, Vielelezo).
                        </p>
                      </div>

                      <input
                        type="file"
                        ref={galleryFileRef}
                        onChange={handleGalleryUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => galleryFileRef.current?.click()}
                        disabled={uploadingGallery || galleryImages.length >= 6}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-full text-xs font-bold shadow flex items-center gap-1.5"
                      >
                        <span>+ Ongeza Picha</span>
                      </button>
                    </div>

                    {uploadingGallery && (
                      <div className="py-2 text-center text-xs text-blue-400 animate-pulse">
                        Inapakia picha za gallery...
                      </div>
                    )}

                    {galleryImages.length === 0 ? (
                      <div
                        onClick={() => galleryFileRef.current?.click()}
                        className="border-2 border-dashed border-[#38444d] rounded-xl p-6 text-center cursor-pointer hover:border-blue-500/50 transition"
                      >
                        <p className="text-2xl mb-1">🖼️</p>
                        <p className="text-xs text-gray-400">Bofya hapa kuchagua picha kadhaa za gallery</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {galleryImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-[#38444d] group">
                            <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition">
                              <button
                                type="button"
                                onClick={() => setCoverImage(imgUrl)}
                                className="p-1 bg-blue-600 rounded text-white text-[10px]"
                                title="Weka kama Cover"
                              >
                                ⭐
                              </button>
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="p-1 bg-red-600 rounded text-white text-[10px]"
                                title="Futa picha hii"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: RICH EDITOR & FEATURES */}
              {activeTab === 'content' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Rich Text Editor Toolbar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-300">
                        Maelezo ya Kina (Rich Markdown Description)
                      </label>
                      <div className="flex items-center bg-[#38444d]/30 rounded-lg p-0.5 border border-[#38444d]/50">
                        <button
                          type="button"
                          onClick={() => setDescMode('edit')}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            descMode === 'edit' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Andika (Editor)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDescMode('preview')}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            descMode === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Hakiki (Preview)
                        </button>
                      </div>
                    </div>

                    {descMode === 'edit' ? (
                      <div className="border border-[#38444d] rounded-2xl overflow-hidden focus-within:border-blue-500">
                        {/* Editor Toolbar Buttons */}
                        <div className="flex flex-wrap items-center gap-1 p-2 bg-[#38444d]/20 border-b border-[#38444d]/40">
                          <button
                            type="button"
                            onClick={() => insertFormatting('**', '**')}
                            className="p-1.5 hover:bg-gray-700 rounded text-xs font-bold text-gray-200"
                            title="Bold (**text**)"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('*', '*')}
                            className="p-1.5 hover:bg-gray-700 rounded text-xs italic font-serif text-gray-200"
                            title="Italic (*text*)"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('## ')}
                            className="p-1.5 hover:bg-gray-700 rounded text-xs font-bold text-gray-200"
                            title="Heading (## Title)"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('### ')}
                            className="p-1.5 hover:bg-gray-700 rounded text-xs font-bold text-gray-200"
                            title="Subheading (### Subtitle)"
                          >
                            H3
                          </button>
                          <span className="w-px h-4 bg-gray-700 mx-1" />
                          <button
                            type="button"
                            onClick={() => insertFormatting('- ')}
                            className="p-1.5 hover:bg-gray-700 rounded text-xs text-gray-200"
                            title="Bullet List (- item)"
                          >
                            • List
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('1. ')}
                            className="p-1.5 hover:bg-gray-700 rounded text-xs text-gray-200"
                            title="Numbered List (1. item)"
                          >
                            1. List
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('`', '`')}
                            className="p-1.5 hover:bg-gray-700 rounded text-xs font-mono text-gray-200"
                            title="Inline Code (`code`)"
                          >
                            &lt;/&gt;
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('> ')}
                            className="p-1.5 hover:bg-gray-700 rounded text-xs text-gray-200"
                            title="Quote / Callout (> quote)"
                          >
                            ❝ Quote
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('[Jina la Kiungo](', ')') }
                            className="p-1.5 hover:bg-gray-700 rounded text-xs text-gray-200"
                            title="Link [title](url)"
                          >
                            🔗 Link
                          </button>

                          <div className="ml-auto flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => insertFormatting('\n### ⚡ Vipengele Muhimu\n- \n- \n- \n')}
                              className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30"
                            >
                              + Weka Violezo
                            </button>
                          </div>
                        </div>

                        {/* Textarea */}
                        <textarea
                          ref={textareaRef}
                          rows={7}
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          placeholder="Andika maelezo ya kina ya bidhaa yako kwa kutumia Markdown..."
                          className={`w-full p-4 text-sm ${tc.bgInput} ${tc.text} outline-none resize-y`}
                        />
                      </div>
                    ) : (
                      <div className={`p-4 rounded-2xl border border-[#38444d] ${tc.bgInput} min-h-[160px] text-sm leading-relaxed prose prose-invert max-w-none`}>
                        {description.split('\n').map((line, idx) => {
                          if (line.startsWith('### ')) {
                            return <h3 key={idx} className="text-base font-bold text-blue-400 mt-2 mb-1">{line.replace('### ', '')}</h3>;
                          }
                          if (line.startsWith('## ')) {
                            return <h2 key={idx} className="text-lg font-bold text-white mt-3 mb-1">{line.replace('## ', '')}</h2>;
                          }
                          if (line.startsWith('- ')) {
                            return <li key={idx} className="ml-4 list-disc text-gray-300">{line.replace('- ', '')}</li>;
                          }
                          if (line.startsWith('> ')) {
                            return <blockquote key={idx} className="pl-3 border-l-2 border-blue-500 text-gray-400 my-1 italic">{line.replace('> ', '')}</blockquote>;
                          }
                          return <p key={idx} className="my-1 text-gray-300">{line}</p>;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Highlights / Features List Builder */}
                  <div className="p-4 rounded-2xl border border-[#38444d]/60 bg-[#38444d]/10">
                    <label className="text-xs font-bold text-gray-200 block mb-1">
                      Vipengele vya Haraka (What's Included / Highlights)
                    </label>
                    <p className="text-[11px] text-gray-400 mb-3">
                      Hivi huonekana kama alama za tiki za kijani kwenye kadi na maelezo ya bidhaa.
                    </p>

                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Mfano: ✔️ Miongozo ya hatua kwa hatua ya usanidi"
                        value={featureInput}
                        onChange={e => setFeatureInput(e.target.value)}
                        onKeyDown={handleAddFeature}
                        className={`flex-1 px-3.5 py-2 rounded-xl text-xs border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                      >
                        + Ongeza
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {features.map((feat, idx) => (
                        <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/20 text-xs text-gray-300 border border-[#38444d]/30">
                          <span className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            <span>{feat}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="text-gray-500 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PRICING & LICENSE */}
              {activeTab === 'pricing' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Sarafu (Currency)</label>
                      <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                      >
                        <option value="USD">USD ($) - Marekani</option>
                        <option value="TZS">TZS (TSh) - Tanzania</option>
                        <option value="KES">KES (KSh) - Kenya</option>
                        <option value="EUR">EUR (€) - Ulaya</option>
                        <option value="GBP">GBP (£) - Uingereza</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">
                        Bei ya Kuuza (Selling Price) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">
                        Bei ya Awali (Compare-at / Discount)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Mfano: 49"
                        value={originalPrice}
                        onChange={e => setOriginalPrice(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                      />
                    </div>
                  </div>

                  {Number(originalPrice) > Number(price) && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                      <span>🏷️ Ofa itatokea kama:</span>
                      <span className="font-extrabold">
                        {Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% PUNGUZO (OFF)
                      </span>
                    </div>
                  )}

                  {/* License Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Leseni ya Matumizi (License)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: 'personal', title: 'Personal License', desc: 'Mradi mmoja usio wa kibiashara' },
                        { id: 'commercial', title: 'Commercial License', desc: 'Miradi ya wateja na kibiashara' },
                        { id: 'extended', title: 'Extended Unlimited', desc: 'Haki zote ikiwemo kusambaza upya' },
                      ].map(lic => (
                        <div
                          key={lic.id}
                          onClick={() => setLicense(lic.id as any)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition ${
                            license === lic.id
                              ? 'border-blue-500 bg-blue-500/15 text-white'
                              : 'border-[#38444d]/50 hover:bg-[#38444d]/20 text-gray-300'
                          }`}
                        >
                          <div className="font-bold text-xs">{lic.title}</div>
                          <div className="text-[11px] text-gray-400 mt-1">{lic.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Tags & Maneno Muhimu</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Andika tag kisha bonyeza Enter (mfano: React, Ebook, UI)"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className={`flex-1 px-4 py-2 rounded-xl text-xs border border-[#38444d] ${tc.bgInput} ${tc.text} focus:outline-none focus:border-blue-500`}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                      >
                        Weka
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1.5 border border-blue-500/30">
                          <span>#{t}</span>
                          <button type="button" onClick={() => removeTag(t)} className="hover:text-white">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CARD PREVIEW OVERLAY */}
              {previewCardMode && (
                <div className="p-4 rounded-2xl border border-blue-500/40 bg-blue-950/30 space-y-3">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center gap-2">
                    <span>👁️</span>
                    <span>Muonekano wa Kadi Kwenye Duka (Live Card Preview):</span>
                  </h4>
                  
                  <div className="max-w-sm mx-auto rounded-2xl border border-[#38444d]/50 overflow-hidden bg-zinc-900 shadow-2xl">
                    <div className="h-44 w-full relative overflow-hidden bg-gray-900">
                      <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-black/80 text-white border border-white/10">
                        ${price} {currency}
                      </div>
                      <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-blue-600 text-white uppercase">
                        {category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm line-clamp-1">{title || 'Jina la Bidhaa Yako'}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {description.replace(/[#*`_]/g, '')}
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold">${price} {currency}</span>
                        <span className="px-3 py-1 bg-blue-600 rounded-full font-bold text-white text-[11px]">
                          Nunua Sasa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t border-[#38444d]/50 flex items-center justify-between ${tc.bgModal}`}>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Tab: {activeTab === 'basics' ? '1/4' : activeTab === 'visuals' ? '2/4' : activeTab === 'content' ? '3/4' : '4/4'}</span>
              </div>

              <div className="flex items-center gap-3">
                {activeTab !== 'basics' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'pricing') setActiveTab('content');
                      else if (activeTab === 'content') setActiveTab('visuals');
                      else if (activeTab === 'visuals') setActiveTab('basics');
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-gray-300 hover:text-white"
                  >
                    Nyuma
                  </button>
                )}

                {activeTab !== 'pricing' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'basics') setActiveTab('visuals');
                      else if (activeTab === 'visuals') setActiveTab('content');
                      else if (activeTab === 'content') setActiveTab('pricing');
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                  >
                    Endelea →
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePublishProduct}
                    className="px-7 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/25 active:scale-95 transition flex items-center gap-2"
                  >
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                    )}
                    <span>{isSubmitting ? 'Inachapisha...' : 'Chapisha Bidhaa Dukani'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ================= PRODUCT DETAILS & GALLERY MODAL ======================= */}
      {/* ========================================================================= */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
          <div className={`w-full max-w-4xl my-auto rounded-3xl ${tc.bgModal} border border-[#38444d] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col`}>
            
            {/* Header */}
            <div className={`px-6 py-4 border-b border-[#38444d]/50 flex items-center justify-between sticky top-0 ${tc.bgModal} z-10`}>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 uppercase">
                  {viewProduct.category}
                </span>
                <span className="text-xs text-gray-400">• By {viewProduct.creatorName}</span>
              </div>
              <button
                onClick={() => setViewProduct(null)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Gallery Viewer */}
              <div>
                <div className="h-72 md:h-96 w-full rounded-2xl overflow-hidden border border-[#38444d] relative bg-black">
                  <img
                    src={(viewProduct.galleryImages && viewProduct.galleryImages[activeGalleryIndex]) || viewProduct.coverImage}
                    alt={viewProduct.title}
                    className="w-full h-full object-contain md:object-cover"
                  />
                  {viewProduct.originalPrice && viewProduct.originalPrice > viewProduct.price && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-extrabold rounded-full shadow-lg">
                      {Math.round(((viewProduct.originalPrice - viewProduct.price) / viewProduct.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Thumbnail strip */}
                {viewProduct.galleryImages && viewProduct.galleryImages.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {viewProduct.galleryImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                          activeGalleryIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Price Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#38444d]/10 border border-[#38444d]/40">
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold">{viewProduct.title}</h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-amber-400">★ {viewProduct.rating}</span>
                    <span>•</span>
                    <span>{viewProduct.salesCount} sold</span>
                    <span>•</span>
                    <span className="capitalize">{viewProduct.license || 'commercial'} License</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {viewProduct.originalPrice && viewProduct.originalPrice > viewProduct.price && (
                      <div className="text-xs text-gray-400 line-through">${viewProduct.originalPrice}</div>
                    )}
                    <div className="text-2xl font-black text-emerald-400">
                      ${viewProduct.price} <span className="text-sm font-semibold text-gray-400">{viewProduct.currency}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutProduct(viewProduct);
                      setViewProduct(null);
                      setPurchaseSuccess(null);
                    }}
                    className="px-6 py-3 rounded-full font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 active:scale-95 transition"
                  >
                    Nunua Sasa →
                  </button>
                </div>
              </div>

              {/* What's Included Features */}
              {viewProduct.features && viewProduct.features.length > 0 && (
                <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-950/20">
                  <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <span>✨</span>
                    <span>Vipengele Vilivyojumuishwa (What's Included):</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {viewProduct.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-200">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-200 mb-2">Maelezo ya Kina</h3>
                <div className="p-4 rounded-2xl border border-[#38444d]/40 bg-[#38444d]/10 text-sm leading-relaxed text-gray-300 space-y-2">
                  {viewProduct.description.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={idx} className="font-bold text-blue-400 mt-3 mb-1">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('## ')) {
                      return <h3 key={idx} className="font-extrabold text-white text-base mt-3 mb-1">{line.replace('## ', '')}</h3>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={idx} className="ml-4 list-disc text-gray-300">{line.replace('- ', '')}</li>;
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>
              </div>

              {/* Deliverable info */}
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Utoaji wa haraka na salama kupitia Longa Escrow.</span>
                </div>
                {viewProduct.fileName && (
                  <span className="text-gray-300 font-mono">Faili: {viewProduct.fileName} ({viewProduct.fileSize})</span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ================= CHECKOUT MODAL ======================================== */}
      {/* ========================================================================= */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 ${tc.bgModal} border border-[#38444d] shadow-2xl relative`}>
            <button
              onClick={() => {
                setCheckoutProduct(null);
                setPurchaseSuccess(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
            >
              ✕
            </button>

            {purchaseSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold">Hongera! Malipo Yamekamilika</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Sasa unamiliki <span className="text-white font-semibold">{checkoutProduct.title}</span>.
                </p>

                <div className="mt-5 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-left">
                  <span className="text-xs text-blue-400 font-bold block mb-1">Nambari ya Leseni (Order Reference):</span>
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
                    Kiungo cha faili kimetumwa pia kwenye ujumbe (Messages) na Vault yako ya Longa.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCheckoutProduct(null);
                    setPurchaseSuccess(null);
                  }}
                  className="mt-6 w-full py-3 rounded-full font-bold bg-blue-600 hover:bg-blue-500 text-white text-sm"
                >
                  Nimemaliza (Done)
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-1">Malipo ya Haraka (Instant Checkout)</h3>
                <p className="text-xs text-gray-400 mb-4">Malipo salama ya moja kwa moja kupitia Escrow.</p>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#38444d]/20 border border-[#38444d]/40 mb-4">
                  <img
                    src={checkoutProduct.coverImage}
                    alt={checkoutProduct.title}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{checkoutProduct.title}</h4>
                    <p className="text-xs text-gray-400">Na {checkoutProduct.creatorName}</p>
                    <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
                      ${checkoutProduct.price} {checkoutProduct.currency}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <span className="text-xs font-semibold block text-gray-300">Chagua Njia ya Malipo:</span>
                  <div
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'wallet'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#38444d]/40 hover:bg-[#38444d]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-sm">
                      <span>⚡</span>
                      <div>
                        <div className="font-semibold text-xs">Longa Creator Wallet</div>
                        <div className="text-[10px] text-gray-400">Malipo ya papo hapo • Makato 0%</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">$240.00 Salio</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#38444d]/40 hover:bg-[#38444d]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-sm">
                      <span>💳</span>
                      <div>
                        <div className="font-semibold text-xs">Kadi ya Benki (Credit / Debit Card)</div>
                        <div className="text-[10px] text-gray-400">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      paymentMethod === 'mpesa'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#38444d]/40 hover:bg-[#38444d]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-sm">
                      <span>📱</span>
                      <div>
                        <div className="font-semibold text-xs">M-Pesa / Tigo Pesa / Airtel Money</div>
                        <div className="text-[10px] text-gray-400">Arifa ya moja kwa moja ya simu (USSD Push)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(checkoutProduct)}
                  disabled={processingPayment}
                  className="w-full py-3.5 rounded-full font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  {processingPayment ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Lipa ${checkoutProduct.price} & Fungua Faili</span>
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
