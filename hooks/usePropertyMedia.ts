// REMOVED: Media system unmapped - all imports and functionality disabled
// import { useState, useEffect } from 'react';
// import { 
//   getMainPhoto, 
//   getAllPhotos, 
//   getMediaCount, 
//   getBulkMainPhotos,
//   PhotoGallery,
//   MediaRecord 
// } from '@/lib/mediaService';

/**
 * REMOVED: Hook to get the main photo for a single property - Media system unmapped
 */
export const useMainPhoto = (listingKey: string | null) => {
  // REMOVED: Media system unmapped - returning empty state
  return { mainPhoto: null, loading: false, error: null };
};

/**
 * REMOVED: Hook to get all photos for a property gallery - Media system unmapped
 */
export const usePropertyPhotos = (listingKey: string | null) => {
  // REMOVED: Media system unmapped - returning empty state
  return { photos: [], loading: false, error: null };
};

/**
 * REMOVED: Hook to get media count for a property - Media system unmapped
 */
export const useMediaCount = (listingKey: string | null) => {
  // REMOVED: Media system unmapped - returning empty state
  return { count: 0, loading: false, error: null };
};

/**
 * REMOVED: Hook to get main photos for multiple properties (bulk loading) - Media system unmapped
 */
export const useBulkMainPhotos = (listingKeys: string[]) => {
  // REMOVED: Media system unmapped - returning empty state
  return { mediaData: {}, loading: false, error: null };
};

/**
 * REMOVED: Hook to get main photo with caching - Media system unmapped
 */
export const useCachedMainPhoto = (listingKey: string | null) => {
  // REMOVED: Media system unmapped - returning empty state
  return { mainPhoto: null, loading: false, error: null };
};
