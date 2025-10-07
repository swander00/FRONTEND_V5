// Custom hooks for managing user data (liked listings, saved listings, saved searches)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/Auth';
import { Property } from '@/types';
import { LikedListing, SavedListing, SavedSearch, UserDataSummary } from '@/types/userData';
import {
  getLikedListings,
  addLikedListing,
  removeLikedListing,
  isListingLiked,
  getSavedListings,
  addSavedListing,
  updateSavedListing,
  removeSavedListing,
  isListingSaved,
  getSavedSearches,
  addSavedSearch,
  updateSavedSearch,
  removeSavedSearch,
  runSavedSearch,
  getUserDataSummary,
  upsertAutoSavedSearch
} from '@/lib/userDataService';

// ============================================================================
// LIKED LISTINGS HOOK
// ============================================================================

export function useLikedListings() {
  const { user } = useAuth();
  const [likedListings, setLikedListings] = useState<LikedListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLikedListings = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const listings = await getLikedListings(user.id);
      setLikedListings(listings);
    } catch (err) {
      setError('Failed to load liked listings');
      console.error('Error loading liked listings:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const likeListing = useCallback(async (property: Property) => {
    if (!user?.id) return false;
    
    try {
      setError(null);
      const likedListing = await addLikedListing(user.id, property.ListingKey, property);
      setLikedListings(prev => [...prev, likedListing]);
      return true;
    } catch (err) {
      setError('Failed to like listing');
      console.error('Error liking listing:', err);
      return false;
    }
  }, [user?.id]);

  const unlikeListing = useCallback(async (listingKey: string) => {
    if (!user?.id) return false;
    
    try {
      setError(null);
      const success = await removeLikedListing(user.id, listingKey);
      if (success) {
        setLikedListings(prev => prev.filter(item => item.listingKey !== listingKey));
      }
      return success;
    } catch (err) {
      setError('Failed to unlike listing');
      console.error('Error unliking listing:', err);
      return false;
    }
  }, [user?.id]);

  const checkIfLiked = useCallback((listingKey: string) => {
    // Check against the local state first for immediate feedback
    return likedListings.some(item => item.listingKey === listingKey);
  }, [likedListings]);

  const checkIfLikedAsync = useCallback(async (listingKey: string) => {
    if (!user?.id) return false;
    
    try {
      return await isListingLiked(user.id, listingKey);
    } catch (err) {
      console.error('Error checking if listing is liked:', err);
      return false;
    }
  }, [user?.id]);

  useEffect(() => {
    loadLikedListings();
  }, [loadLikedListings]);

  return {
    likedListings,
    loading,
    error,
    likeListing,
    unlikeListing,
    checkIfLiked,
    checkIfLikedAsync,
    refresh: loadLikedListings
  };
}

// ============================================================================
// SAVED LISTINGS HOOK
// ============================================================================

export function useSavedListings() {
  const { user } = useAuth();
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug: Log user state when hook is used
  useEffect(() => {
    console.log('🟢 useSavedListings hook initialized', {
      userId: user?.id || 'NO USER',
      userEmail: user?.email || 'NO EMAIL'
    });
  }, [user]);

  const loadSavedListings = useCallback(async () => {
    console.log('🔄 loadSavedListings called', { userId: user?.id });
    if (!user?.id) {
      console.log('⚠️ No user ID, skipping load');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const listings = await getSavedListings(user.id);
      console.log('✅ Loaded saved listings:', listings.length);
      setSavedListings(listings);
    } catch (err) {
      setError('Failed to load saved listings');
      console.error('❌ Error loading saved listings:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const saveListing = useCallback(async (
    property: Property, 
    notes?: string, 
    tags?: string[]
  ) => {
    if (!user?.id) return false;
    
    try {
      setError(null);
      // Use the same fallback logic as PropertySaveButton for consistency
      const listingKey = property.ListingKey || property.MLSNumber || '';
      if (!listingKey) {
        console.error('Cannot save listing: No ListingKey or MLSNumber found', property);
        setError('Cannot save listing: Invalid property identifier');
        return false;
      }
      const savedListing = await addSavedListing(user.id, listingKey, property, notes, tags);
      setSavedListings(prev => [...prev, savedListing]);
      return true;
    } catch (err) {
      setError('Failed to save listing');
      console.error('Error saving listing:', err);
      return false;
    }
  }, [user?.id]);

  const updateListing = useCallback(async (
    listingKey: string, 
    updates: { notes?: string; tags?: string[] }
  ) => {
    if (!user?.id) return false;
    
    try {
      setError(null);
      const updatedListing = await updateSavedListing(user.id, listingKey, updates);
      if (updatedListing) {
        setSavedListings(prev => 
          prev.map(item => 
            item.listingKey === listingKey ? updatedListing : item
          )
        );
      }
      return !!updatedListing;
    } catch (err) {
      setError('Failed to update saved listing');
      console.error('Error updating saved listing:', err);
      return false;
    }
  }, [user?.id]);

  const unsaveListing = useCallback(async (listingKey: string) => {
    if (!user?.id) return false;
    
    try {
      setError(null);
      const success = await removeSavedListing(user.id, listingKey);
      if (success) {
        setSavedListings(prev => prev.filter(item => item.listingKey !== listingKey));
      }
      return success;
    } catch (err) {
      setError('Failed to unsave listing');
      console.error('Error unsaving listing:', err);
      return false;
    }
  }, [user?.id]);

  const checkIfSaved = useCallback(async (listingKey: string) => {
    if (!user?.id) return false;
    
    try {
      return await isListingSaved(user.id, listingKey);
    } catch (err) {
      console.error('Error checking if listing is saved:', err);
      return false;
    }
  }, [user?.id]);

  useEffect(() => {
    loadSavedListings();
  }, [loadSavedListings]);

  return {
    savedListings,
    loading,
    error,
    saveListing,
    updateListing,
    unsaveListing,
    checkIfSaved,
    refresh: loadSavedListings
  };
}

// ============================================================================
// SAVED SEARCHES HOOK
// ============================================================================

export function useSavedSearches() {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSavedSearches = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const searches = await getSavedSearches(user.id);
      setSavedSearches(searches);
    } catch (err) {
      setError('Failed to load saved searches');
      console.error('Error loading saved searches:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createSavedSearch = useCallback(async (
    name: string,
    searchCriteria: SavedSearch['searchCriteria'],
    notificationSettings?: SavedSearch['notificationSettings'],
    isAutoSaved?: boolean
  ) => {
    if (!user?.id) return null;
    
    try {
      setError(null);
      const savedSearch = await addSavedSearch(user.id, name, searchCriteria, notificationSettings, isAutoSaved);
      setSavedSearches(prev => [...prev, savedSearch]);
      return savedSearch;
    } catch (err) {
      setError('Failed to create saved search');
      console.error('Error creating saved search:', err);
      return null;
    }
  }, [user?.id]);

  const autoSaveSearch = useCallback(async (
    searchCriteria: SavedSearch['searchCriteria']
  ) => {
    if (!user?.id) return null;
    
    try {
      setError(null);
      const savedSearch = await upsertAutoSavedSearch(user.id, searchCriteria);
      if (savedSearch) {
        // Refresh the list to show the updated auto-saved search
        await loadSavedSearches();
      }
      return savedSearch;
    } catch (err) {
      console.error('Error auto-saving search:', err);
      return null;
    }
  }, [user?.id, loadSavedSearches]);

  const updateUserSavedSearch = useCallback(async (
    searchId: string,
    updates: Partial<SavedSearch>
  ): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      setError(null);
      const updatedSearch = await updateSavedSearch(user.id, searchId, updates);
      if (updatedSearch) {
        setSavedSearches(prev => 
          prev.map(item => 
            item.id === searchId ? updatedSearch : item
          )
        );
      }
      return !!updatedSearch;
    } catch (err) {
      setError('Failed to update saved search');
      console.error('Error updating saved search:', err);
      return false;
    }
  }, [user?.id]);

  const deleteSavedSearch = useCallback(async (searchId: string) => {
    if (!user?.id) return false;
    
    try {
      setError(null);
      const success = await removeSavedSearch(user.id, searchId);
      if (success) {
        setSavedSearches(prev => prev.filter(item => item.id !== searchId));
      }
      return success;
    } catch (err) {
      setError('Failed to delete saved search');
      console.error('Error deleting saved search:', err);
      return false;
    }
  }, [user?.id]);

  const executeSavedSearch = useCallback(async (searchId: string) => {
    if (!user?.id) return null;
    
    try {
      setError(null);
      const search = await runSavedSearch(user.id, searchId);
      return search;
    } catch (err) {
      setError('Failed to execute saved search');
      console.error('Error executing saved search:', err);
      return null;
    }
  }, [user?.id]);

  useEffect(() => {
    loadSavedSearches();
  }, [loadSavedSearches]);

  return {
    savedSearches,
    loading,
    error,
    createSavedSearch,
    autoSaveSearch,
    updateSavedSearch: updateUserSavedSearch,
    deleteSavedSearch,
    executeSavedSearch,
    refresh: loadSavedSearches
  };
}

// ============================================================================
// USER DATA SUMMARY HOOK
// ============================================================================

export function useUserDataSummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UserDataSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const userSummary = await getUserDataSummary(user.id);
      setSummary(userSummary);
    } catch (err) {
      setError('Failed to load user data summary');
      console.error('Error loading user data summary:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return {
    summary,
    loading,
    error,
    refresh: loadSummary
  };
}
