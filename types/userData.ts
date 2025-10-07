// User data types for liked listings, saved listings, and saved searches

export interface LikedListing {
  id: string;
  userId: string;
  listingKey: string;
  likedAt: string;
  property: {
    listingKey: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: string;
    propertyType: string;
    primaryImageUrl?: string;
    status: string;
  };
}

export interface SavedListing {
  id: string;
  userId: string;
  listingKey: string;
  savedAt: string;
  notes?: string;
  tags?: string[];
  property: {
    listingKey: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: string;
    propertyType: string;
    primaryImageUrl?: string;
    status: string;
  };
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  searchCriteria: {
    location?: string;
    propertyType?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    bedrooms?: {
      min: number;
      max: number;
    };
    bathrooms?: {
      min: number;
      max: number;
    };
    status?: string;
    features?: string[];
  };
  createdAt: string;
  lastRunAt?: string;
  isActive: boolean;
  isAutoSaved?: boolean;
  notificationSettings?: {
    email: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

export interface UserDataSummary {
  likedListingsCount: number;
  savedListingsCount: number;
  savedSearchesCount: number;
  recentActivity: {
    type: 'liked' | 'saved' | 'search';
    itemId: string;
    itemName: string;
    timestamp: string;
  }[];
}
