// REMOVED: Media system unmapped - imports disabled
// import { MediaRecord, PhotoGallery } from '@/lib/mediaService';

/**
 * REMOVED: Check if a media URL is valid - Media system unmapped
 */
export const isValidMediaUrl = (url: string | null | undefined): boolean => {
  // REMOVED: Media system unmapped - returning false
  return false;
};

/**
 * REMOVED: Get fallback image URL for properties without photos - Media system unmapped
 */
export const getFallbackImageUrl = (): string => {
  // REMOVED: Media system unmapped - returning placeholder
  return '/images/no-photo-placeholder.svg';
};

/**
 * REMOVED: Format media count for display - Media system unmapped
 */
export const formatMediaCount = (count: number): string => {
  // REMOVED: Media system unmapped - returning no photos
  return 'No photos';
};

/**
 * REMOVED: Get image alt text from media record - Media system unmapped
 */
export const getImageAltText = (
  media: any, 
  fallback: string = 'Property photo'
): string => {
  // REMOVED: Media system unmapped - returning fallback
  return fallback;
};

/**
 * REMOVED: Sort media by order - Media system unmapped
 */
export const sortMediaByOrder = <T extends { Order?: number }>(media: T[]): T[] => {
  // REMOVED: Media system unmapped - returning empty array
  return [];
};

/**
 * REMOVED: Filter media by category - Media system unmapped
 */
export const filterMediaByCategory = (
  media: any[], 
  category: string
): any[] => {
  // REMOVED: Media system unmapped - returning empty array
  return [];
};

/**
 * REMOVED: Get main photo from media array - Media system unmapped
 */
export const getMainPhotoFromArray = (media: any[]): any => {
  // REMOVED: Media system unmapped - returning null
  return null;
};

/**
 * REMOVED: Get photos only from media array - Media system unmapped
 */
export const getPhotosFromArray = (media: any[]): any[] => {
  // REMOVED: Media system unmapped - returning empty array
  return [];
};

/**
 * REMOVED: Check if media is public - Media system unmapped
 */
export const isPublicMedia = (media: any): boolean => {
  // REMOVED: Media system unmapped - returning false
  return false;
};

/**
 * REMOVED: Check if media is active - Media system unmapped
 */
export const isActiveMedia = (media: any): boolean => {
  // REMOVED: Media system unmapped - returning false
  return false;
};

/**
 * REMOVED: Get media file extension from URL - Media system unmapped
 */
export const getMediaFileExtension = (url: string): string => {
  // REMOVED: Media system unmapped - returning empty string
  return '';
};

/**
 * REMOVED: Check if media is an image - Media system unmapped
 */
export const isImageMedia = (media: any): boolean => {
  // REMOVED: Media system unmapped - returning false
  return false;
};

/**
 * REMOVED: Check if media is a video - Media system unmapped
 */
export const isVideoMedia = (media: any): boolean => {
  // REMOVED: Media system unmapped - returning false
  return false;
};

/**
 * REMOVED: Check if media is a PDF - Media system unmapped
 */
export const isPdfMedia = (media: any): boolean => {
  // REMOVED: Media system unmapped - returning false
  return false;
};

/**
 * REMOVED: Get media type icon - Media system unmapped
 */
export const getMediaTypeIcon = (media: any): string => {
  // REMOVED: Media system unmapped - returning default icon
  return '📎';
};

/**
 * REMOVED: Generate responsive image sizes - Media system unmapped
 */
export const generateImageSizes = (): string => {
  // REMOVED: Media system unmapped - returning default sizes
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
};

/**
 * REMOVED: Create image srcSet for responsive images - Media system unmapped
 */
export const createImageSrcSet = (baseUrl: string, sizes: number[] = [320, 640, 1024, 1920]): string => {
  // REMOVED: Media system unmapped - returning empty string
  return '';
};

/**
 * Debounce function for search/input
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for scroll/resize events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * REMOVED: Get media loading state - Media system unmapped
 */
export const getMediaLoadingState = (loading: boolean, error: string | null, data: any[]): {
  isLoading: boolean;
  hasError: boolean;
  hasData: boolean;
  isEmpty: boolean;
} => {
  // REMOVED: Media system unmapped - returning empty state
  return {
    isLoading: false,
    hasError: false,
    hasData: false,
    isEmpty: true
  };
};