"use client";

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  size?: 'sm' | 'md' | 'lg';
  visualVariant?: 'default' | 'card' | 'header' | 'minimal';
  showLabel?: boolean;
  className?: string;
  onShare?: () => void;
  disabled?: boolean;
}

/**
 * Shared ShareButton component for use across Property Card and Property Details
 * Supports multiple visual variants and sizes for different contexts
 */
export default function ShareButton({ 
  size = 'md',
  visualVariant = 'default',
  showLabel = true,
  className = '',
  onShare,
  disabled = false
}: ShareButtonProps) {
  const getVisualVariantClasses = () => {
    switch (visualVariant) {
      case 'card':
        return 'bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 border border-gray-200 shadow-sm hover:shadow-md backdrop-blur-sm';
      case 'header':
        return 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-blue-300 backdrop-blur-sm';
      case 'minimal':
        return 'bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-500';
      default:
        return 'bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 border border-gray-200 shadow-sm hover:shadow-md backdrop-blur-sm';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  const handleClick = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href
        });
      } else {
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        console.log('URL copied to clipboard');
      }
    }
  };

  return (
    <Button
      variant="outline"
      size={size === 'md' ? 'default' : size}
      className={`${getVisualVariantClasses()} ${getSizeClasses()} rounded-lg font-semibold transition-all duration-200 ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <Share2 className={`${getIconSize()} ${showLabel ? 'mr-1' : ''}`} />
      {showLabel && 'Share'}
    </Button>
  );
}

/**
 * Compact ShareButton for card contexts
 */
export function CompactShareButton({ 
  size = 'sm',
  className = '',
  onShare,
  disabled = false
}: Pick<ShareButtonProps, 'size' | 'className' | 'onShare' | 'disabled'>) {
  return (
    <ShareButton
      size={size}
      visualVariant="card"
      showLabel={false}
      className={className}
      onShare={onShare}
      disabled={disabled}
    />
  );
}

/**
 * Header ShareButton for property details header
 */
export function HeaderShareButton({ 
  size = 'sm',
  className = '',
  onShare,
  disabled = false
}: Pick<ShareButtonProps, 'size' | 'className' | 'onShare' | 'disabled'>) {
  return (
    <ShareButton
      size={size}
      visualVariant="header"
      showLabel={true}
      className={className}
      onShare={onShare}
      disabled={disabled}
    />
  );
}
