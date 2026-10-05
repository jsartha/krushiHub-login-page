export type UserRole = 'delivery' | 'farmer' | 'seller';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  verified: boolean;
  rating: number;
  joinedDate: string;
  location: string;
  
  // Role specific fields
  // Farmer
  farmName?: string;
  farmSizeAcres?: number;
  primaryCrops?: string[];
  
  // Delivery Partner (User to deliver fruits)
  vehicleType?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  refrigeratedSupport?: boolean;
  maxPayloadKg?: number;
  
  // Agri Seller
  storeName?: string;
  licenseNumberAgri?: string;
  gstNumber?: string;
  categoriesSupplied?: string[];
}

export interface PasswordSecurityCheck {
  score: number; // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface FruitDeliveryTask {
  id: string;
  orderNumber: string;
  fruitName: string;
  fruitVariety: string;
  quantityCrates: number;
  weightKg: number;
  temperatureRequirement: string;
  farmerName: string;
  pickupAddress: string;
  farmerPhone: string;
  destinationHub: string;
  destinationAddress: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered';
  payoutAmount: number;
  distanceKm: number;
  estimatedTransitMinutes: number;
  fragileHandling: boolean;
  ripeLevel: 'Firm / Raw' | 'Semi-Ripe' | 'Ripe (High Priority)';
  createdAt: string;
  pickupOtp: string;
  deliveryOtp: string;
}

export interface FarmHarvestItem {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  category: 'Fresh Fruits' | 'Vegetables' | 'Grains' | 'Exotic Produce';
  variety: string;
  quantityAvailableKg: number;
  pricePerKg: number;
  minOrderKg: number;
  harvestDate: string;
  shelfLifeDays: number;
  organicCertified: boolean;
  grade: 'Grade A (Export)' | 'Grade B (Premium)' | 'Standard';
  location: string;
  imageUrl: string;
  status: 'In Stock' | 'Low Stock' | 'Ready for Pickup' | 'Sold Out';
}

export interface AgriSupplyProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  category: 'Seeds & Hybrids' | 'Organic Fertilizers' | 'Tools & Sprayers' | 'Irrigation Equipment' | 'Crop Protection';
  brand: string;
  price: number;
  originalPrice: number;
  unit: string;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  description: string;
  farmerBulkDiscount: string;
  govtApproved: boolean;
  imageUrl: string;
}

export interface MandiRate {
  crop: string;
  mandi: string;
  modalPrice: number;
  unit: string;
  change24h: number;
  trend: 'up' | 'down' | 'steady';
}
