'use client';

import React, { useState } from 'react';
// import { getFallbackImageUrl } from '@/utils/mediaUtils'; // REMOVED: Media association unmapped

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: () => void;
  loading?: 'lazy' | 'eager';
  [key: string]: any; // Allow other img props
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  onError,
  onLoad,
  loading = 'lazy',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const imageSrc = imageError 
    ? (fallbackSrc || '/images/no-photo-placeholder.svg') // REMOVED: Media system unmapped - using direct fallback
    : src;

  if (!src && !fallbackSrc) {
    return (
      <div className={`no-image-placeholder ${className}`}>
        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
          <span>No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-container relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      <img
        src={imageSrc || undefined}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
