import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Truck, 
  TrendingUp, 
  Scale, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  X, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Send,
  Layers,
  Clock,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FarmHarvestItem } from '../../types';
import { LIVE_MANDI_RATES } from '../../data/mockData';

export const FarmerModule: React.FC = () => {
  const { currentUser, farmHarvests, addFarmHarvest, requestFruitDelivery } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [dispatchModalItem, setDispatchModalItem] = useState<FarmHarvestItem | null>(null);
  const [dispatchCrates, setDispatchCrates] = useState(40);
  const [destinationHub, setDestinationHub] = useState('Vashi APMC Cold Storage Terminal B');
  const [dispatchSuccess, setDispatchSuccess] = useState('');

  // Add form fields
  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState<FarmHarvestItem['category']>('Fresh Fruits');
  const [variety, setVariety] = useState('');
  const [quantityKg, setQuantityKg] = useState(1500);
  const [priceKg, setPriceKg] = useState(120);
  const [organic, setOrganic] = useState(true);
  const [grade, setGrade] = useState<FarmHarvestItem['grade']>('Grade A (Export)');
  const [location, setLocation] = useState(currentUser?.location || 'Ratnagiri, MH');

  const totalHarvestVolume = farmHarvests.reduce((sum, h) => sum + h.quantityAvailableKg, 0);
  const totalEstimatedValue = farmHarvests.reduce((sum, h) => sum + h.quantityAvailableKg * h.pricePerKg, 0);

  const handleCreateHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !variety) return;

    addFarmHarvest({
      cropName,
      category,
      variety,
      quantityAvailableKg: quantityKg,
      pricePerKg: priceKg,
      minOrderKg: 50,
      harvestDate: 'Fresh Plucked Today',
      shelfLifeDays: 14,
      organicCertified: organic,
      grade,
      location,
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
      status: 'Ready for Pickup',
    });

    setShowAddModal(false);
    setCropName('');
    setVariety('');
  };

  const handleTriggerDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalItem) return;

    requestFruitDelivery(dispatchModalItem, dispatchCrates, destinationHub);
    setDispatchSuccess(`Dispatched ${dispatchCrates} crates of ${dispatchModalItem.cropName} to Fruit Delivery Partner! Check Module 1.`);
    setDispatchModalItem(null);
    setTimeout(() => setDispatchSuccess(''), 5000);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner styled with Sellora-inspired Royal Blue gradient */}
      <div className="bg-gradient-to-r from-[#2D5BFF] via-[#2452F5] to-[#1A3ED0] rounded-2xl text-white p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(45,91,255,0.3)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold tracking-wide backdrop-blur-xs mb-2">
              <Sprout className="w-3.5 h-3.5 text-blue-200" />
              <span>Module 2 · Farmer Direct Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Farm Harvest & Operations Command
            </h1>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
              List fresh orchard harvests, monitor wholesale APMC market rates, and dispatch fruit batches to cold-chain delivery couriers.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
              <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15">
                Farm: <strong>{currentUser?.farmName || 'Sahyadri Organic Orchards'}</strong>
              </div>
              <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15">
                Acreage: <strong>{currentUser?.farmSizeAcres || 18.5} Acres Under Cultivation</strong>
              </div>
              <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15">
                Location: <strong>{currentUser?.location || 'Ratnagiri, Maharashtra'}</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="py-3 px-5 rounded-xl bg-white hover:bg-slate-100 text-[#2552FE] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List New Fruit / Crop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row matching the Sellora cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Harvest Value
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{totalEstimatedValue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+7.4% from last month</span>
          </div>
        </div>

        {/* Total Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Harvest Volume
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalHarvestVolume.toLocaleString()} <span className="text-sm font-semibold text-slate-500">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>{farmHarvests.length} Active crop varieties</span>
          </div>
        </div>

        {/* Courier Dispatch Speed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Fruit Courier Response
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            00:01:30
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <Clock className="w-3.5 h-3.5" />
            <span>Cold-van dispatch average</span>
          </div>
        </div>

        {/* Organic Certification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quality Grade
          </div>
          <div className="text-2xl font-black text-[#2552FE] mt-1">
            Export Grade A
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>APEDA Organic Verified</span>
          </div>
        </div>
      </div>

      {/* Mandi Benchmark Price Ticker */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2552FE]" />
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Live APMC Mandi Benchmark Rates
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Government APMC Daily Wholesale Benchmarks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {LIVE_MANDI_RATES.map((mandi, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="font-bold text-slate-900 truncate">{mandi.crop}</div>
              <div className="text-[10px] text-slate-400 truncate">{mandi.mandi}</div>
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="font-black text-slate-900 text-sm">₹{mandi.modalPrice}</span>
                <span className={`text-[10px] font-bold flex items-center ${mandi.trend === 'up' ? 'text-emerald-600' : mandi.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                  {mandi.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                  {mandi.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                  {mandi.change24h > 0 ? `+${mandi.change24h}%` : `${mandi.change24h}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatched notification */}
      {dispatchSuccess && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-[#1A3ED0] text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <Truck className="w-4 h-4 text-[#2552FE]" />
            <span>{dispatchSuccess}</span>
          </div>
          <button onClick={() => setDispatchSuccess('')} className="text-[#2552FE] hover:text-[#1A3ED0]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Harvest Catalog */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Active Orchard Harvests & Produce</h3>
            <p className="text-xs text-slate-500">
              Live inventory available for buyer orders and fruit courier dispatch
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2552FE] hover:text-[#1A3ED0] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Produce</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farmHarvests.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/90 overflow-hidden hover:border-[#2552FE]/50 hover:shadow-md transition-all flex flex-col justify-between bg-white"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {item.organicCertified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2552FE] text-white shadow-xs">
                        Certified Organic
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                      {item.grade}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-xs font-black text-slate-900 shadow-xs">
                    ₹{item.pricePerKg} <span className="font-normal text-[10px] text-slate-500">/ kg</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.variety}</span>
                    <span>{item.location}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {item.cropName}
                  </h4>
                  <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                    <span>Available Stock:</span>
                    <strong className="text-slate-900 font-bold">{item.quantityAvailableKg.toLocaleString()} kg</strong>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Harvest Date:</span>
                    <span>{item.harvestDate}</span>
                  </div>
                </div>
              </div>

              {/* Action: Request Fruit Logistics Delivery */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setDispatchModalItem(item)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#2F5AFF] hover:bg-[#2149F0] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Dispatch via Fruit Delivery (Module 1)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FCFDFC]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-[#2552FE]">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">List Fresh Harvest Produce</h3>
                  <p className="text-xs text-slate-400">Direct-to-Buyer & Logistics Listing</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHarvest} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Crop / Fruit Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alphonso Mango"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Variety / Cultivar *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ratnagiri GI Premium"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Produce Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FarmHarvestItem['category'])}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                  >
                    <option>Fresh Fruits</option>
                    <option>Vegetables</option>
                    <option>Grains</option>
                    <option>Exotic Produce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quality Grading</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as FarmHarvestItem['grade'])}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                  >
                    <option>Grade A (Export)</option>
                    <option>Grade B (Premium)</option>
                    <option>Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Available Quantity (Kg)</label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Wholesale Price (₹ / Kg)</label>
                  <input
                    type="number"
                    value={priceKg}
                    onChange={(e) => setPriceKg(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Farm Location / Orchard</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="organic-check"
                  checked={organic}
                  onChange={(e) => setOrganic(e.target.checked)}
                  className="rounded text-[#2552FE] focus:ring-[#2552FE]"
                />
                <label htmlFor="organic-check" className="text-xs text-slate-700 font-medium">
                  Produce is Certified Organic / Zero Residue
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#2F5AFF] hover:bg-[#2149F0] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Publish Harvest to KisanDirect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch to Fruit Courier Modal */}
      {dispatchModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-blue-50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2552FE]" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Request Fruit Delivery Courier</h3>
                  <p className="text-xs text-slate-600">Dispatches directly to Module 1 Logistics</p>
                </div>
              </div>
              <button onClick={() => setDispatchModalItem(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTriggerDispatch} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">{dispatchModalItem.cropName}</div>
                <div className="text-slate-500">{dispatchModalItem.variety} · {dispatchModalItem.location}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity of Fruit Crates to Dispatch (approx 10 kg / crate)
                </label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={dispatchCrates}
                  onChange={(e) => setDispatchCrates(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination APMC / Cold Storage Terminal
                </label>
                <select
                  value={destinationHub}
                  onChange={(e) => setDestinationHub(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#2552FE]"
                >
                  <option>Vashi APMC Cold Storage Terminal B, Navi Mumbai</option>
                  <option>Azadpur Wholesale Fruit Terminal, Delhi</option>
                  <option>Pune City Gourmet Market & Organic Hub</option>
                  <option>Surat Central Mega Food Park, Gujarat</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#2F5AFF] hover:bg-[#2149F0] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Confirm Dispatch & Notify Fruit Delivery Partner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
