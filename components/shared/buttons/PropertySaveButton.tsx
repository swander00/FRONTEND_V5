'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSavedListings } from '@/hooks/useUserData';
import { useAuth } from '@/components/Auth';
import { Property } from '@/types';
import { toast } from 'sonner';

interface PropertySaveButtonProps {
  property: Property;
  variant?: 'card' | 'header' | 'popup' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  onToggle?: (isSaved: boolean) => void;
  borderRadius?: 'full' | 'md' | 'lg';
}

/**
 * Shared PropertySaveButton component that syncs across all property displays
 * Uses the useSavedListings hook to maintain global state
 */
export const PropertySaveButton: React.FC<PropertySaveButtonProps> = ({
  property,
  variant = 'card',
  size = 'md',
  className,
  showLabel = false,
  onToggle,
  borderRadius = 'full'
}) => {
  const { user } = useAuth();
  const { saveListing, unsaveListing, savedListings } = useSavedListings();
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const listingKey = property.ListingKey || property.MLSNumber || '';

  // Log component mount and user state
  useEffect(() => {
    console.log('🔵 PropertySaveButton mounted', {
      user: user ? { id: user.id, email: user.email } : 'NO USER',
      listingKey,
      propertyAddress: property.UnparsedAddress || property.StreetAddress,
      variant
    });
  }, []);

  // Check if property is saved on mount and when savedListings changes
  useEffect(() => {
    if (listingKey) {
      const saved = savedListings.some(item => item.listingKey === listingKey);
      console.log('PropertySaveButton: Checking saved status', {
        listingKey,
        saved,
        savedListingsCount: savedListings.length,
        savedListingKeys: savedListings.map(item => item.listingKey)
      });
      setIsSaved(saved);
    }
  }, [listingKey, savedListings]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!listingKey || isProcessing) {
      console.log('Save button clicked but blocked:', { listingKey, isProcessing });
      return;
    }

    console.log('Save button clicked:', { 
      listingKey, 
      isSaved, 
      propertyAddress: property.UnparsedAddress || property.StreetAddress 
    });

    setIsProcessing(true);
    try {
      if (isSaved) {
        console.log('Attempting to unsave listing:', listingKey);
        const success = await unsaveListing(listingKey);
        if (success) {
          console.log('Successfully unsaved listing');
          setIsSaved(false);
          toast.success('Removed from saved listings');
          onToggle?.(false);
        } else {
          console.error('Failed to unsave listing');
          toast.error('Failed to remove from saved listings');
        }
      } else {
        console.log('Attempting to save listing:', listingKey);
        const success = await saveListing(property);
        if (success) {
          console.log('Successfully saved listing');
          setIsSaved(true);
          toast.success('Added to saved listings');
          onToggle?.(true);
        } else {
          console.error('Failed to save listing');
          toast.error('Failed to add to saved listings');
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
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
          "border border-gray-300 hover:bg-gray-50 hover:border-gray-400 bg-white"
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

  const getSavedClasses = () => {
    if (variant === 'header') {
      return isSaved
        ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/50'
        : '';
    }
    // For other variants, add a subtle saved state background
    if (isSaved) {
      return 'bg-blue-50 border-blue-200 shadow-sm';
    }
    return '';
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        getVariantClasses(),
        getSizeClasses(),
        getSavedClasses(),
        isProcessing && "opacity-50 cursor-not-allowed",
        // Use borderRadius prop to determine border radius
        borderRadius === 'md' ? 'rounded-md' : borderRadius === 'lg' ? 'rounded-lg' : 'rounded-full',
        className
      )}
      aria-label={isSaved ? 'Unsave property' : 'Save property'}
      title={isSaved ? 'Remove from saved listings' : 'Add to saved listings'}
    >
      <div className="flex items-center gap-1.5">
        <Bookmark
          className={cn(
            getIconSize(),
            "transition-all duration-200",
            // Improved contrast for saved state
            isSaved 
              ? variant === 'header' 
                ? "fill-white text-white" // White icon on blue header background
                : "fill-blue-600 text-blue-600" // Darker blue for better contrast on light background
              : "text-gray-700 hover:text-blue-500",
            variant === 'header' && !isSaved && "text-white"
          )}
        />
        {showLabel && (
          <span className={cn(
            "text-sm font-medium",
            isSaved 
              ? variant === 'header' 
                ? "text-white" // White text on blue header background
                : "text-blue-600" // Darker blue for better contrast
              : "text-gray-700",
            variant === 'header' && !isSaved && "text-white"
          )}>
            {isSaved ? 'Saved' : 'Save'}
          </span>
        )}
      </div>
    </button>
  );
};

export default PropertySaveButton;

