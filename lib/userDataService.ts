// User data service for managing liked listings, saved listings, and saved searches
// This service provides mock data and functions that will later be replaced with real API calls

import { Property } from '@/types';
import { LikedListing, SavedListing, SavedSearch, UserDataSummary } from '@/types/userData';

// ============================================================================
// MOCK DATA STORAGE
// ============================================================================

// In-memory storage for development (will be replaced with database)
let likedListings: LikedListing[] = [];
let savedListings: SavedListing[] = [];
let savedSearches: SavedSearch[] = [];

// Initialize with some mock data
const initializeMockData = () => {
  const mockUserId = 'mock-user-123';
  
  // Mock liked listings
  likedListings = [
    {
      id: 'liked-1',
      userId: mockUserId,
      listingKey: 'W1234567',
      likedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      property: {
        listingKey: 'W1234567',
        address: '123 Main Street, Toronto, ON',
        price: 750000,
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: '1800',
        propertyType: 'house',
        primaryImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        status: 'Active'
      }
    },
    {
      id: 'liked-2',
      userId: mockUserId,
      listingKey: 'W2345678',
      likedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      property: {
        listingKey: 'W2345678',
        address: '456 Queen Street West, Toronto, ON',
        price: 550000,
        bedrooms: 2,
        bathrooms: 1,
        squareFootage: '950',
        propertyType: 'condo',
        primaryImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        status: 'Active'
      }
    },
    {
      id: 'liked-3',
      userId: mockUserId,
      listingKey: 'W4567890',
      likedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      property: {
        listingKey: 'W4567890',
        address: '321 Bay Street, Toronto, ON',
        price: 1200000,
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: '2200',
        propertyType: 'house',
        primaryImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        status: 'Active'
      }
    }
  ];

  // Mock saved listings
  savedListings = [
    {
      id: 'saved-1',
      userId: mockUserId,
      listingKey: 'W1234567',
      savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      notes: 'Great location, close to work. Need to check parking situation.',
      tags: ['work-commute', 'downtown'],
      property: {
        listingKey: 'W1234567',
        address: '123 Main Street, Toronto, ON',
        price: 750000,
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: '1800',
        propertyType: 'house',
        primaryImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        status: 'Active'
      }
    },
    {
      id: 'saved-2',
      userId: mockUserId,
      listingKey: 'W6789012',
      savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      notes: 'Perfect for family. Large backyard and good schools nearby.',
      tags: ['family', 'backyard', 'schools'],
      property: {
        listingKey: 'W6789012',
        address: '789 Yonge Street, Toronto, ON',
        price: 950000,
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: '2200',
        propertyType: 'house',
        primaryImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        status: 'Active'
      }
    }
  ];

  // Mock saved searches
  savedSearches = [
    {
      id: 'search-1',
      userId: mockUserId,
      name: 'Downtown Condos Under $600k',
      searchCriteria: {
        location: 'Downtown Toronto',
        propertyType: ['condo'],
        priceRange: { min: 0, max: 600000 },
        bedrooms: { min: 1, max: 3 },
        bathrooms: { min: 1, max: 2 },
        status: 'buy'
      },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      lastRunAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isActive: true,
      notificationSettings: {
        email: true,
        frequency: 'weekly'
      }
    },
    {
      id: 'search-2',
      userId: mockUserId,
      name: 'Family Homes in North York',
      searchCriteria: {
        location: 'North York',
        propertyType: ['house'],
        priceRange: { min: 800000, max: 1200000 },
        bedrooms: { min: 3, max: 5 },
        bathrooms: { min: 2, max: 4 },
        status: 'buy'
      },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      lastRunAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      isActive: true,
      notificationSettings: {
        email: true,
        frequency: 'daily'
      }
    },
    {
      id: 'search-3',
      userId: mockUserId,
      name: 'Rental Properties Near Subway',
      searchCriteria: {
        location: 'Near Subway',
        propertyType: ['condo', 'house'],
        priceRange: { min: 2000, max: 3500 },
        bedrooms: { min: 1, max: 3 },
        status: 'lease'
      },
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      lastRunAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      isActive: false,
      notificationSettings: {
        email: false,
        frequency: 'weekly'
      }
    }
  ];
};

// Initialize mock data
initializeMockData();

// ============================================================================
// LIKED LISTINGS FUNCTIONS
// ============================================================================

export async function getLikedListings(userId: string): Promise<LikedListing[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return likedListings.filter(item => item.userId === userId);
}

export async function addLikedListing(userId: string, listingKey: string, property: Property): Promise<LikedListing> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const likedListing: LikedListing = {
    id: `liked-${Date.now()}`,
    userId,
    listingKey,
    likedAt: new Date().toISOString(),
    property: {
      listingKey: property.ListingKey,
      address: property.UnparsedAddress || property.StreetAddress || '',
      price: property.ListPrice || 0,
      bedrooms: property.Bedrooms || 0,
      bathrooms: property.Bathrooms || 0,
      squareFootage: property.SquareFootage || '',
      propertyType: property.PropertyType || '',
      primaryImageUrl: property.PrimaryImageUrl,
      status: property.MlsStatus || 'Active'
    }
  };
  
  likedListings.push(likedListing);
  return likedListing;
}

export async function removeLikedListing(userId: string, listingKey: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const index = likedListings.findIndex(
    item => item.userId === userId && item.listingKey === listingKey
  );
  
  if (index !== -1) {
    likedListings.splice(index, 1);
    return true;
  }
  
  return false;
}

export async function isListingLiked(userId: string, listingKey: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return likedListings.some(item => item.userId === userId && item.listingKey === listingKey);
}

// ============================================================================
// SAVED LISTINGS FUNCTIONS
// ============================================================================

export async function getSavedListings(userId: string): Promise<SavedListing[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const userListings = savedListings.filter(item => item.userId === userId);
  console.log('📦 getSavedListings called', {
    userId,
    totalSavedListings: savedListings.length,
    userSavedListings: userListings.length,
    allUserIds: savedListings.map(l => l.userId),
    userListings: userListings.map(l => ({ id: l.id, listingKey: l.listingKey, address: l.property.address }))
  });
  return userListings;
}

export async function addSavedListing(
  userId: string, 
  listingKey: string, 
  property: Property, 
  notes?: string, 
  tags?: string[]
): Promise<SavedListing> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  console.log('userDataService: Adding saved listing', {
    userId,
    listingKey,
    propertyListingKey: property.ListingKey,
    propertyMLSNumber: property.MLSNumber,
    address: property.UnparsedAddress || property.StreetAddress
  });
  
  const savedListing: SavedListing = {
    id: `saved-${Date.now()}`,
    userId,
    listingKey,
    savedAt: new Date().toISOString(),
    notes,
    tags,
    property: {
      listingKey: property.ListingKey || property.MLSNumber || listingKey,
      address: property.UnparsedAddress || property.StreetAddress || '',
      price: property.ListPrice || 0,
      bedrooms: property.Bedrooms || 0,
      bathrooms: property.Bathrooms || 0,
      squareFootage: property.SquareFootage || '',
      propertyType: property.PropertyType || '',
      primaryImageUrl: property.PrimaryImageUrl,
      status: property.MlsStatus || 'Active'
    }
  };
  
  savedListings.push(savedListing);
  console.log('userDataService: Saved listing added. Total saved listings:', savedListings.length);
  return savedListing;
}

export async function updateSavedListing(
  userId: string, 
  listingKey: string, 
  updates: { notes?: string; tags?: string[] }
): Promise<SavedListing | null> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const index = savedListings.findIndex(
    item => item.userId === userId && item.listingKey === listingKey
  );
  
  if (index !== -1) {
    savedListings[index] = {
      ...savedListings[index],
      ...updates
    };
    return savedListings[index];
  }
  
  return null;
}

export async function removeSavedListing(userId: string, listingKey: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const index = savedListings.findIndex(
    item => item.userId === userId && item.listingKey === listingKey
  );
  
  if (index !== -1) {
    savedListings.splice(index, 1);
    return true;
  }
  
  return false;
}

export async function isListingSaved(userId: string, listingKey: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return savedListings.some(item => item.userId === userId && item.listingKey === listingKey);
}

// ============================================================================
// SAVED SEARCHES FUNCTIONS
// ============================================================================

export async function getSavedSearches(userId: string): Promise<SavedSearch[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return savedSearches.filter(item => item.userId === userId);
}

export async function addSavedSearch(
  userId: string, 
  name: string, 
  searchCriteria: SavedSearch['searchCriteria'],
  notificationSettings?: SavedSearch['notificationSettings'],
  isAutoSaved?: boolean
): Promise<SavedSearch> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // If this is a manual save, check for and remove any auto-saved search with matching criteria
  if (!isAutoSaved) {
    const existingAutoSaved = savedSearches.find(
      search => search.userId === userId && search.isAutoSaved && searchCriteriaMatch(search.searchCriteria, searchCriteria)
    );
    
    if (existingAutoSaved) {
      // Remove the auto-saved search since the user is manually saving it
      await removeSavedSearch(userId, existingAutoSaved.id);
    }
  }
  
  const savedSearch: SavedSearch = {
    id: `search-${Date.now()}`,
    userId,
    name,
    searchCriteria,
    createdAt: new Date().toISOString(),
    isActive: true,
    isAutoSaved: isAutoSaved || false,
    notificationSettings: notificationSettings || {
      email: false,
      frequency: 'weekly'
    }
  };
  
  savedSearches.push(savedSearch);
  return savedSearch;
}

// Helper function to check if two search criteria match
function searchCriteriaMatch(a: SavedSearch['searchCriteria'], b: SavedSearch['searchCriteria']): boolean {
  return (
    JSON.stringify(a.location) === JSON.stringify(b.location) &&
    JSON.stringify(a.propertyType) === JSON.stringify(b.propertyType) &&
    JSON.stringify(a.priceRange) === JSON.stringify(b.priceRange) &&
    JSON.stringify(a.bedrooms) === JSON.stringify(b.bedrooms) &&
    JSON.stringify(a.bathrooms) === JSON.stringify(b.bathrooms) &&
    JSON.stringify(a.status) === JSON.stringify(b.status) &&
    JSON.stringify(a.features) === JSON.stringify(b.features)
  );
}

// Get or create auto-saved search (updates existing auto-saved search if criteria match)
export async function upsertAutoSavedSearch(
  userId: string,
  searchCriteria: SavedSearch['searchCriteria']
): Promise<SavedSearch | null> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Find existing auto-saved search for this user
  const existingAutoSaved = savedSearches.find(
    search => search.userId === userId && search.isAutoSaved
  );
  
  // Check if there's a manually saved search with the same criteria
  const manualSearchWithSameCriteria = savedSearches.find(
    search => search.userId === userId && !search.isAutoSaved && searchCriteriaMatch(search.searchCriteria, searchCriteria)
  );
  
  // If a manually saved search exists with same criteria, don't auto-save
  if (manualSearchWithSameCriteria) {
    // If there's an auto-saved search, delete it since the user manually saved one
    if (existingAutoSaved) {
      await removeSavedSearch(userId, existingAutoSaved.id);
    }
    return null;
  }
  
  // Generate a name for the auto-saved search
  const generateAutoSaveName = (criteria: SavedSearch['searchCriteria']): string => {
    const parts = [];
    
    if (criteria.location) {
      parts.push(criteria.location);
    }
    if (criteria.propertyType && criteria.propertyType.length > 0) {
      parts.push(criteria.propertyType.slice(0, 2).join(', '));
    }
    if (criteria.priceRange) {
      parts.push(`$${criteria.priceRange.min.toLocaleString()}-$${criteria.priceRange.max.toLocaleString()}`);
    }
    
    if (parts.length === 0) {
      return '[Auto-Saved] Search';
    }
    
    return `[Auto-Saved] ${parts.join(' • ')}`;
  };
  
  const autoSaveName = generateAutoSaveName(searchCriteria);
  
  // Update existing auto-saved search or create new one
  if (existingAutoSaved) {
    const index = savedSearches.findIndex(s => s.id === existingAutoSaved.id);
    if (index !== -1) {
      savedSearches[index] = {
        ...existingAutoSaved,
        name: autoSaveName,
        searchCriteria,
        createdAt: new Date().toISOString(), // Update timestamp
      };
      return savedSearches[index];
    }
  }
  
  // Create new auto-saved search
  const newAutoSaved: SavedSearch = {
    id: `search-auto-${Date.now()}`,
    userId,
    name: autoSaveName,
    searchCriteria,
    createdAt: new Date().toISOString(),
    isActive: true,
    isAutoSaved: true,
    notificationSettings: {
      email: false,
      frequency: 'weekly'
    }
  };
  
  savedSearches.push(newAutoSaved);
  return newAutoSaved;
}

export async function updateSavedSearch(
  userId: string, 
  searchId: string, 
  updates: Partial<SavedSearch>
): Promise<SavedSearch | null> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const index = savedSearches.findIndex(
    item => item.userId === userId && item.id === searchId
  );
  
  if (index !== -1) {
    savedSearches[index] = {
      ...savedSearches[index],
      ...updates
    };
    return savedSearches[index];
  }
  
  return null;
}

export async function removeSavedSearch(userId: string, searchId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const index = savedSearches.findIndex(
    item => item.userId === userId && item.id === searchId
  );
  
  if (index !== -1) {
    savedSearches.splice(index, 1);
    return true;
  }
  
  return false;
}

export async function runSavedSearch(userId: string, searchId: string): Promise<SavedSearch | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = savedSearches.findIndex(
    item => item.userId === userId && item.id === searchId
  );
  
  if (index !== -1) {
    savedSearches[index].lastRunAt = new Date().toISOString();
    return savedSearches[index];
  }
  
  return null;
}

// ============================================================================
// USER DATA SUMMARY FUNCTIONS
// ============================================================================

export async function getUserDataSummary(userId: string): Promise<UserDataSummary> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const userLikedListings = likedListings.filter(item => item.userId === userId);
  const userSavedListings = savedListings.filter(item => item.userId === userId);
  const userSavedSearches = savedSearches.filter(item => item.userId === userId);
  
  // Create recent activity from all user data
  const recentActivity = [
    ...userLikedListings.map(item => ({
      type: 'liked' as const,
      itemId: item.id,
      itemName: item.property.address,
      timestamp: item.likedAt
    })),
    ...userSavedListings.map(item => ({
      type: 'saved' as const,
      itemId: item.id,
      itemName: item.property.address,
      timestamp: item.savedAt
    })),
    ...userSavedSearches.map(item => ({
      type: 'search' as const,
      itemId: item.id,
      itemName: item.name,
      timestamp: item.createdAt
    }))
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10); // Get 10 most recent activities
  
  return {
    likedListingsCount: userLikedListings.length,
    savedListingsCount: userSavedListings.length,
    savedSearchesCount: userSavedSearches.length,
    recentActivity
  };
}
