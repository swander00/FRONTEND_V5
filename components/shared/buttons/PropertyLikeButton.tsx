'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLikedListings } from '@/hooks/useUserData';
import { Property } from '@/types';
import { toast } from 'sonner';

interface PropertyLikeButtonProps {
  property: Property;
  variant?: 'card' | 'header' | 'popup' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  onToggle?: (isLiked: boolean) => void;
  borderRadius?: 'full' | 'md' | 'lg';
}

/**
 * Shared PropertyLikeButton component that syncs across all property displays
 * Uses the useLikedListings hook to maintain global state
 */
export const PropertyLikeButton: React.FC<PropertyLikeButtonProps> = ({
  property,
  variant = 'card',
  size = 'md',
  className,
  showLabel = false,
  onToggle,
  borderRadius = 'full'
}) => {
  const { likeListing, unlikeListing, checkIfLiked } = useLikedListings();
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const listingKey = property.ListingKey || property.MLSNumber || '';

  // Check if property is liked on mount and when likedListings changes
  useEffect(() => {
    if (listingKey) {
      setIsLiked(checkIfLiked(listingKey));
    }
  }, [listingKey, checkIfLiked]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!listingKey || isProcessing) return;

    setIsProcessing(true);
    try {
      if (isLiked) {
        const success = await unlikeListing(listingKey);
        if (success) {
          setIsLiked(false);
          toast.success('Removed from liked listings');
          onToggle?.(false);
        } else {
          toast.error('Failed to remove from liked listings');
        }
      } else {
        const success = await likeListing(property);
        if (success) {
          setIsLiked(true);
          toast.success('Added to liked listings');
          onToggle?.(true);
        } else {
          toast.error('Failed to add to liked listings');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return cn(
          "bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg",
          "transform hover:scale-110 active:scale-95"
        );
      case 'header':
        return cn(
          "bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20",
          "backdrop-blur-sm border border-white/30"
        );
      case 'popup':
        return cn(
          "border-gray-300 hover:bg-gray-50 hover:border-gray-400 bg-white"
        );
      case 'minimal':
        return cn(
          "bg-transparent hover:bg-gray-100"
        );
      default:
        return cn(
          "bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg"
        );
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2.5';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const getLikedClasses = () => {
    if (variant === 'header') {
      return isLiked
        ? 'bg-gradient-to-br from-red-400/80 to-pink-500/80 shadow-lg shadow-red-400/30 border-red-300/50'
        : '';
    }
    return '';
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1",
        getVariantClasses(),
        getSizeClasses(),
        getLikedClasses(),
        isProcessing && "opacity-50 cursor-not-allowed",
        // Use borderRadius prop to determine border radius
        borderRadius === 'md' ? 'rounded-md' : borderRadius === 'lg' ? 'rounded-lg' : 'rounded-full',
        className
      )}
      aria-label={isLiked ? 'Unlike property' : 'Like property'}
      title={isLiked ? 'Remove from liked listings' : 'Add to liked listings'}
    >
      <div className="flex items-center gap-1.5">
        <Heart
          className={cn(
            getIconSize(),
            "transition-all duration-200",
            isLiked ? "fill-red-500 text-red-500" : "text-gray-700 hover:text-red-500",
            variant === 'header' && !isLiked && "text-white",
            variant === 'header' && isLiked && "fill-white text-white"
          )}
        />
        {showLabel && (
          <span className={cn(
            "text-sm font-medium",
            isLiked ? "text-red-500" : "text-gray-700",
            variant === 'header' && "text-white"
          )}>
            {isLiked ? 'Liked' : 'Like'}
          </span>
        )}
      </div>
    </button>
  );
};

export default PropertyLikeButton;

