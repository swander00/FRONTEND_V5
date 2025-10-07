'use client';

import React from 'react';
import { Camera, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageActionButtonsProps {
  /**
   * Total number of images for the property
   * Button only shows if count > 0
   */
  imageCount?: number;
  
  /**
   * Whether the property has a virtual tour
   * Button only shows if true
   */
  hasVirtualTour?: boolean;
  
  /**
   * Callback when image count button is clicked
   * Use to open gallery, lightbox, or navigate to images page
   */
  onImageClick?: (e: React.MouseEvent) => void;
  
  /**
   * Callback when virtual tour button is clicked
   * Use to open tour in new tab or modal
   */
  onVirtualTourClick?: (e: React.MouseEvent) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ImageActionButtons Component
 * 
 * Displays action buttons for viewing images and virtual tours on property cards.
 * Buttons are positioned at the bottom-right of the image container.
 * 
 * Features:
 * - Image gallery button (shows only if imageCount > 1)
 * - Virtual tour button (shows only if hasVirtualTour is true)
 * - Smooth hover animations
 * - Backdrop blur effect for better visibility
 * - Prevents event bubbling to parent elements
 */
export const ImageActionButtons: React.FC<ImageActionButtonsProps> = ({
  imageCount = 0,
  hasVirtualTour = false,
  onImageClick,
  onVirtualTourClick,
  className
}) => {
  // Don't render anything if no buttons should be shown
  const showImageButton = imageCount > 0; // Changed from > 1 to > 0 to show even for single images
  const showTourButton = hasVirtualTour;
  
  if (!showImageButton && !showTourButton) {
    return null;
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageClick?.(e);
  };

  const handleTourClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onVirtualTourClick?.(e);
  };

  return (
    <div 
      className={cn(
        "absolute bottom-3 right-3 z-10 flex items-center gap-2",
        className
      )}
    >
      {/* Image Gallery Button */}
      {showImageButton && (
        <button
          onClick={handleImageClick}
          className={cn(
            "group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md",
            "bg-white/90 backdrop-blur-sm hover:bg-white",
            "shadow-md hover:shadow-lg",
            "transition-all duration-200",
            "transform hover:scale-105 active:scale-95"
          )}
          aria-label={`View ${imageCount} images`}
        >
          <Camera className="w-3.5 h-3.5 text-gray-700 group-hover/btn:text-blue-600 transition-colors" />
          <span className="text-xs font-semibold text-gray-800 group-hover/btn:text-blue-600 transition-colors">
            {imageCount}
          </span>
        </button>
      )}

      {/* Virtual Tour Button */}
      {showTourButton && (
        <button
          onClick={handleTourClick}
          className={cn(
            "group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md",
            "bg-gradient-to-r from-blue-500 to-blue-600",
            "hover:from-blue-600 hover:to-blue-700",
            "text-white shadow-md hover:shadow-lg",
            "transition-all duration-200",
            "transform hover:scale-105 active:scale-95"
          )}
          aria-label="View virtual tour"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">
            Tour
          </span>
        </button>
      )}
    </div>
  );
};

export default ImageActionButtons;

