import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Package, 
  Tag, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ShoppingBag,
  Percent,
  Search,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AgriSupplyProduct } from '../../types';

export const AgriSellerModule: React.FC = () => {
  const { currentUser, agriProducts, addAgriProduct } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');

  // Add Product Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AgriSupplyProduct['category']>('Seeds & Hybrids');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState(750);
  const [originalPrice, setOriginalPrice] = useState(900);
  const [unit, setUnit] = useState('1 kg Pack');
  const [stockCount, setStockCount] = useState(50);
  const [description, setDescription] = useState('');
  const [farmerBulkDiscount, setFarmerBulkDiscount] = useState('10% off for verified farmers');

  const filteredProducts = agriProducts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !brand) return;

    addAgriProduct({
      title,
      category,
      brand,
      price,
      originalPrice,
      unit,
      stockCount,
      rating: 4.9,
      reviewsCount: 1,
      description: description || 'Certified high-performance agricultural supply product.',
      farmerBulkDiscount,
      govtApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop&q=80',
    });

    setShowAddModal(false);
    setTitle('');
    setBrand('');
    setDescription('');
    setNotification('New agricultural product added to catalog successfully!');
    setTimeout(() => setNotification(''), 4000);
  };

  const categories = [
    'All',
    'Seeds & Hybrids',
    'Organic Fertilizers',
    'Tools & Sprayers',
    'Irrigation Equipment',
    'Crop Protection',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Store className="w-4 h-4" />
              Module 3 · Agri Products Seller & Inputs Merchant
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Agricultural Supplies & Farm Inputs Store
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Equip farmers with certified hybrid seeds, organic fertilizers, precision irrigation fittings, and battery sprayers with government-approved subsidies.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                Store: <strong>{currentUser?.storeName || 'Kisan Krishi Seva Kendra'}</strong>
              </div>
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                Agri License: <span className="font-mono text-emerald-300">{currentUser?.licenseNumberAgri || 'AGRI-LIC-PUN-84912'}</span>
              </div>
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                GSTIN: <span className="font-mono text-slate-300">{currentUser?.gstNumber || '27AABCK9182L1Z4'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Farm Product</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search seeds, sprayers, fertilizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-400 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                    {prod.category}
                  </span>
                  {prod.govtApproved && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-700 text-white">
                      Govt Certified
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  {prod.brand}
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {prod.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                <div className="pt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-900">₹{prod.price}</span>
                    <span className="text-xs text-slate-400 line-through ml-1.5">₹{prod.originalPrice}</span>
                    <span className="text-[11px] text-slate-500 block">per {prod.unit}</span>
                  </div>

                  <div className="text-right">
                    <span className={`text-[11px] font-semibold ${prod.stockCount > 10 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {prod.stockCount} In Stock
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 text-[11px] flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{prod.farmerBulkDiscount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FCFDFC]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Add Agricultural Product</h3>
                  <p className="text-xs text-slate-500">KisanDirect Certified Supplier Catalog</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified F1 Hybrid Tomato Seed Pack"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AgriSupplyProduct['category'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option>Seeds & Hybrids</option>
                    <option>Organic Fertilizers</option>
                    <option>Tools & Sprayers</option>
                    <option>Irrigation Equipment</option>
                    <option>Crop Protection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bharat BioAgro"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 50 kg Bag"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key features, crop usage, recommended dosage..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farmer Bulk Discount Offer</label>
                <input
                  type="text"
                  value={farmerBulkDiscount}
                  onChange={(e) => setFarmerBulkDiscount(e.target.value)}
                  placeholder="e.g. 10% off for verified farmers on 5+ units"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Publish Product to KisanDirect Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
