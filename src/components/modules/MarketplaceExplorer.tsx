import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  Sprout, 
  Store, 
  MapPin, 
  CheckCircle2, 
  Search, 
  Tag, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FarmHarvestItem, AgriSupplyProduct } from '../../types';

export const MarketplaceExplorer: React.FC = () => {
  const { farmHarvests, agriProducts, deliveryTasks, setActiveRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'harvest' | 'supplies' | 'logistics'>('harvest');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartSuccess, setCartSuccess] = useState('');

  const filteredHarvests = farmHarvests.filter((h) =>
    h.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSupplies = agriProducts.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrder = (name: string) => {
    setCartSuccess(`Order request for "${name}" submitted! Dispatched for cold courier assignment.`);
    setTimeout(() => setCartSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Search and Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              KisanDirect Unified Agricultural Exchange
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live commerce between Farm Producers, Fruit Cold-Couriers, and Agri Equipment Suppliers
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search produce, seeds, routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('harvest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'harvest'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Fresh Fruits & Crops ({farmHarvests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supplies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'supplies'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Agri Products & Inputs ({agriProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'logistics'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Active Fruit Deliveries ({deliveryTasks.length})</span>
          </button>
        </div>
      </div>

      {cartSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{cartSuccess}</span>
        </div>
      )}

      {/* Tab 1: Fresh Fruits & Crops */}
      {activeTab === 'harvest' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHarvests.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    {item.organicCertified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-700 text-white">
                        Organic
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white">
                      {item.grade}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{item.variety}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{item.cropName}</h4>
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>Farmer: <strong>{item.farmerName}</strong></span>
                    <span>Min Order: {item.minOrderKg} kg</span>
                  </div>

                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900">₹{item.pricePerKg}</span>
                      <span className="text-xs text-slate-500 ml-1">/ kg wholesale</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleOrder(item.cropName)}
                  className="w-full py-2.5 px-3 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Buy Fresh Harvest Batch
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Agri Supplies */}
      {activeTab === 'supplies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSupplies.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                      {prod.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    {prod.brand}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{prod.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>

                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900">₹{prod.price}</span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">₹{prod.originalPrice}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">per {prod.unit}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleOrder(prod.title)}
                  className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Order Agri Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Fruit Logistics Active Tasks */}
      {activeTab === 'logistics' && (
        <div className="space-y-3">
          {deliveryTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {task.orderNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {task.temperatureRequirement}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-0.5">
                    {task.fruitName} ({task.quantityCrates} Crates / {task.weightKg} kg)
                  </h4>
                  <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    <span>From: <strong>{task.farmerName}</strong></span>
                    <span>To: <strong>{task.destinationHub}</strong></span>
                    <span>Distance: {task.distanceKm} km</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="text-left md:text-right">
                  <div className="text-xs text-slate-500">Courier Compensation</div>
                  <div className="text-base font-black text-emerald-800">
                    ₹{task.payoutAmount.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => setActiveRole('delivery')}
                  className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Manage in Module 1
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
