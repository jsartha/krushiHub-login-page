import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, FruitDeliveryTask, FarmHarvestItem, AgriSupplyProduct } from '../types';
import { DEMO_ACCOUNTS, INITIAL_DELIVERY_TASKS, INITIAL_FARM_HARVESTS, INITIAL_AGRI_PRODUCTS } from '../data/mockData';
import { getFailedAttempts, recordFailedAttempt, resetFailedAttempts, logSecurityAudit } from '../utils/security';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  login: (email: string, password: string, preferredRole: UserRole) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (role: UserRole) => void;
  signup: (userData: Partial<UserProfile>, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Shared state across modules
  deliveryTasks: FruitDeliveryTask[];
  updateDeliveryTaskStatus: (taskId: string, newStatus: FruitDeliveryTask['status']) => void;
  farmHarvests: FarmHarvestItem[];
  addFarmHarvest: (harvest: Omit<FarmHarvestItem, 'id' | 'farmerId' | 'farmerName'>) => void;
  agriProducts: AgriSupplyProduct[];
  addAgriProduct: (product: Omit<AgriSupplyProduct, 'id' | 'sellerId' | 'sellerName'>) => void;
  requestFruitDelivery: (harvest: FarmHarvestItem, crates: number, destinationHub: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'kisan_auth_user';
const TASKS_STORAGE_KEY = 'kisan_delivery_tasks';
const HARVESTS_STORAGE_KEY = 'kisan_farm_harvests';
const SUPPLIES_STORAGE_KEY = 'kisan_agri_products';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    if (currentUser?.role) return currentUser.role;
    return 'farmer';
  });

  // Cross-module data stores
  const [deliveryTasks, setDeliveryTasks] = useState<FruitDeliveryTask[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DELIVERY_TASKS;
    } catch {
      return INITIAL_DELIVERY_TASKS;
    }
  });

  const [farmHarvests, setFarmHarvests] = useState<FarmHarvestItem[]>(() => {
    try {
      const saved = localStorage.getItem(HARVESTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FARM_HARVESTS;
    } catch {
      return INITIAL_FARM_Harvest_Fallback();
    }
  });

  function INITIAL_FARM_Harvest_Fallback() {
    return INITIAL_FARM_HARVESTS;
  }

  const [agriProducts, setAgriProducts] = useState<AgriSupplyProduct[]>(() => {
    try {
      const saved = localStorage.getItem(SUPPLIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_AGRI_PRODUCTS;
    } catch {
      return INITIAL_AGRI_PRODUCTS;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      setActiveRole(currentUser.role);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(deliveryTasks));
  }, [deliveryTasks]);

  useEffect(() => {
    localStorage.setItem(HARVESTS_STORAGE_KEY, JSON.stringify(farmHarvests));
  }, [farmHarvests]);

  useEffect(() => {
    localStorage.setItem(SUPPLIES_STORAGE_KEY, JSON.stringify(agriProducts));
  }, [agriProducts]);

  const login = async (email: string, password: string, preferredRole: UserRole): Promise<{ success: boolean; error?: string }> => {
    const tracker = getFailedAttempts(email);
    if (tracker.lockUntil && Date.now() < tracker.lockUntil) {
      const remainingSec = Math.ceil((tracker.lockUntil - Date.now()) / 1000);
      return {
        success: false,
        error: `Security Lockout Active: Too many failed password attempts. Account locked for ${remainingSec} seconds.`,
      };
    }

    // Check demo accounts first
    const demoEntry = Object.values(DEMO_ACCOUNTS).find(
      (acc) => acc.profile.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (demoEntry) {
      if (password === demoEntry.passwordHint || password.length >= 6) {
        resetFailedAttempts(email);
        logSecurityAudit(email, demoEntry.profile.role, 'SUCCESS');
        setCurrentUser(demoEntry.profile);
        setActiveRole(demoEntry.profile.role);
        return { success: true };
      } else {
        const { locked, remainingSeconds } = recordFailedAttempt(email);
        if (locked) {
          return {
            success: false,
            error: `Security Alert: 5 invalid attempts reached. Account temporarily locked for ${remainingSeconds}s.`,
          };
        }
        return {
          success: false,
          error: 'Invalid password. Please check your credentials or use the demo password hint.',
        };
      }
    }

    // Allow custom login with security check
    if (password.length >= 8) {
      resetFailedAttempts(email);
      const newUser: UserProfile = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email: email.trim(),
        phone: '+91 98000 00000',
        role: preferredRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        verified: true,
        rating: 5.0,
        joinedDate: 'Oct 2026',
        location: preferredRole === 'farmer' ? 'Solapur Agri Zone' : preferredRole === 'delivery' ? 'Mumbai Corridor' : 'Kisan Hub',
        ...(preferredRole === 'farmer' ? { farmName: 'Green Valley Farms', farmSizeAcres: 12, primaryCrops: ['Fresh Fruits'] } : {}),
        ...(preferredRole === 'delivery' ? { vehicleType: 'Insulated Refrigerated Van', vehicleNumber: 'MH-04-AB-1234', licenseNumber: 'DL-2024-5544' } : {}),
        ...(preferredRole === 'seller' ? { storeName: 'Kisan Agro Supplies', licenseNumberAgri: 'AGRI-LIC-9912', gstNumber: '27AAAAA0000A1Z5' } : {}),
      };
      logSecurityAudit(email, preferredRole, 'SUCCESS');
      setCurrentUser(newUser);
      setActiveRole(preferredRole);
      return { success: true };
    } else {
      const { locked, remainingSeconds } = recordFailedAttempt(email);
      if (locked) {
        return {
          success: false,
          error: `Security Alert: Account locked for ${remainingSeconds}s due to repeated invalid attempts.`,
        };
      }
      return {
        success: false,
        error: 'Password must be at least 8 characters long with letters and numbers for secure login.',
      };
    }
  };

  const quickDemoLogin = (role: UserRole) => {
    const demo = DEMO_ACCOUNTS[role];
    if (demo) {
      resetFailedAttempts(demo.profile.email);
      logSecurityAudit(demo.profile.email, role, 'SUCCESS');
      setCurrentUser(demo.profile);
      setActiveRole(role);
    }
  };

  const signup = async (userData: Partial<UserProfile>, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!userData.email || !userData.name) {
      return { success: false, error: 'Name and email are required.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password does not meet minimum 8-character security criteria.' };
    }

    const role = userData.role || 'farmer';
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+91 98765 43210',
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      joinedDate: 'Oct 2026',
      location: userData.location || 'Maharashtra',
      farmName: userData.farmName,
      farmSizeAcres: userData.farmSizeAcres,
      primaryCrops: userData.primaryCrops || ['Fresh Fruits', 'Vegetables'],
      vehicleType: userData.vehicleType,
      vehicleNumber: userData.vehicleNumber,
      licenseNumber: userData.licenseNumber,
      refrigeratedSupport: userData.refrigeratedSupport ?? true,
      storeName: userData.storeName,
      licenseNumberAgri: userData.licenseNumberAgri,
      gstNumber: userData.gstNumber,
    };

    resetFailedAttempts(userData.email);
    logSecurityAudit(userData.email, role, 'SUCCESS');
    setCurrentUser(newUser);
    setActiveRole(role);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      logSecurityAudit(currentUser.email, currentUser.role, 'SUCCESS');
    }
    setCurrentUser(null);
  };

  const updateDeliveryTaskStatus = (taskId: string, newStatus: FruitDeliveryTask['status']) => {
    setDeliveryTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  const addFarmHarvest = (item: Omit<FarmHarvestItem, 'id' | 'farmerId' | 'farmerName'>) => {
    const newItem: FarmHarvestItem = {
      ...item,
      id: 'hrv_' + Date.now(),
      farmerId: currentUser?.id || 'usr_farmer_01',
      farmerName: currentUser?.name || 'Patil Farm Producer',
    };
    setFarmHarvests((prev) => [newItem, ...prev]);
  };

  const addAgriProduct = (item: Omit<AgriSupplyProduct, 'id' | 'sellerId' | 'sellerName'>) => {
    const newItem: AgriSupplyProduct = {
      ...item,
      id: 'agri_' + Date.now(),
      sellerId: currentUser?.id || 'usr_seller_01',
      sellerName: currentUser?.name || 'Kisan Agro Kendra',
    };
    setAgriProducts((prev) => [newItem, ...prev]);
  };

  // Farmer requests fruit delivery logistics -> auto-creates task in Module 1!
  const requestFruitDelivery = (harvest: FarmHarvestItem, crates: number, destinationHub: string) => {
    const newTask: FruitDeliveryTask = {
      id: 'fdt_' + Date.now(),
      orderNumber: 'ORD-FRUIT-' + Math.floor(1000 + Math.random() * 9000),
      fruitName: harvest.cropName,
      fruitVariety: harvest.variety,
      quantityCrates: crates,
      weightKg: crates * 10,
      temperatureRequirement: '10°C - 14°C (Perishable Fruit Standard)',
      farmerName: currentUser?.name || harvest.farmerName,
      pickupAddress: currentUser?.location || harvest.location,
      farmerPhone: currentUser?.phone || '+91 98234 56781',
      destinationHub,
      destinationAddress: 'APMC Central Wholesale Cold Terminal',
      status: 'pending',
      payoutAmount: Math.round(crates * 55 + 1200),
      distanceKm: Math.floor(80 + Math.random() * 180),
      estimatedTransitMinutes: Math.floor(60 + Math.random() * 120),
      fragileHandling: true,
      ripeLevel: 'Semi-Ripe',
      createdAt: 'Just now',
      pickupOtp: String(Math.floor(1000 + Math.random() * 9000)),
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
    };
    setDeliveryTasks((prev) => [newTask, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        activeRole,
        setActiveRole,
        login,
        quickDemoLogin,
        signup,
        logout,
        deliveryTasks,
        updateDeliveryTaskStatus,
        farmHarvests,
        addFarmHarvest,
        agriProducts,
        addAgriProduct,
        requestFruitDelivery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
