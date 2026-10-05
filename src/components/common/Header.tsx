import React from 'react';
import { 
  Sprout, 
  Truck, 
  Store, 
  LogOut, 
  CheckCircle2, 
  ChevronDown, 
  Bell, 
  ShieldCheck,
  Package,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface Props {
  currentTab: 'dashboard' | 'marketplace' | 'analytics';
  setCurrentTab: (tab: 'dashboard' | 'marketplace' | 'analytics') => void;
}

export const Header: React.FC<Props> = ({ currentTab, setCurrentTab }) => {
  const { currentUser, activeRole, setActiveRole, logout, deliveryTasks } = useAuth();

  const pendingDeliveryCount = deliveryTasks.filter((t) => t.status === 'pending' || t.status === 'accepted').length;

  const roleInfo: Record<UserRole, { title: string; moduleLabel: string; icon: React.ElementType; color: string }> = {
    delivery: {
      title: 'Fruit Delivery Logistics',
      moduleLabel: 'Module 1 · Delivery Partner',
      icon: Truck,
      color: 'bg-emerald-700 text-white',
    },
    farmer: {
      title: 'Farmer & Harvest Producer',
      moduleLabel: 'Module 2 · Farmer',
      icon: Sprout,
      color: 'bg-amber-800 text-white',
    },
    seller: {
      title: 'Agri Products & Supplies',
      moduleLabel: 'Module 3 · Agri Seller',
      icon: Store,
      color: 'bg-slate-800 text-white',
    },
  };

  const active = roleInfo[activeRole];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* Top tier brand and profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Kisan<span className="text-emerald-700">Direct</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {active.moduleLabel}
            </p>
          </div>
        </div>

        {/* Center: Module Switcher (Allows seamless testing of all 3 modules) */}
        <div className="hidden lg:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setActiveRole('delivery')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'delivery'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>1. Fruit Delivery</span>
            {pendingDeliveryCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-mono">
                {pendingDeliveryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveRole('farmer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'farmer'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>2. Farmer</span>
          </button>

          <button
            onClick={() => setActiveRole('seller')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'seller'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>3. Agri Seller</span>
          </button>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-3">
          {/* Marketplace toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Workspace
            </button>
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                currentTab === 'marketplace'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Live Market</span>
            </button>
          </div>

          {/* User pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-600/30"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span className="truncate max-w-[120px]">{currentUser?.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <div className="text-[11px] text-slate-500 capitalize">
                {currentUser?.role === 'delivery' ? 'Fruit Deliverer' : currentUser?.role}
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out / Clear Session"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation for Module Switching */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-slate-100 bg-slate-50 text-xs">
        <button
          onClick={() => setActiveRole('delivery')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
            activeRole === 'delivery' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-600'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>1. Deliver Fruits</span>
        </button>

        <button
          onClick={() => setActiveRole('farmer')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
            activeRole === 'farmer' ? 'bg-amber-900 text-white font-bold' : 'text-slate-600'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>2. Farmer</span>
        </button>

        <button
          onClick={() => setActiveRole('seller')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
            activeRole === 'seller' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>3. Agri Seller</span>
        </button>
      </div>
    </header>
  );
};
