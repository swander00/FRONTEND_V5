"use client";

import { Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VirtualTourButtonProps {
  hasVirtualTour?: boolean;
  variant?: 'default' | 'card' | 'header' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Shared VirtualTourButton component for use across Property Card and Property Details
 * Supports multiple visual variants and sizes for different contexts
 */
export default function VirtualTourButton({ 
  hasVirtualTour = false,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  disabled = false
}: VirtualTourButtonProps) {
  // For now, this is a placeholder since we don't have a backend field yet
  // In the future, this would check for actual virtual tour data
  const showVirtualTour = hasVirtualTour || Math.random() > 0.7; // Random placeholder logic

  if (!showVirtualTour) {
    return null;
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md border-0';
      case 'header':
        return 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm';
      case 'minimal':
        return 'bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md border-0';
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

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else {
      e.preventDefault();
      e.stopPropagation();
      // Handle virtual tour logic here
      console.log('Virtual tour clicked');
    }
  };

  if (variant === 'minimal') {
    return (
      <button 
        className={`flex items-center gap-1.5 ${getVariantClasses()} ${getSizeClasses()} rounded-lg font-semibold transition-all duration-200 ${className}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <Play className={getIconSize()} />
        Virtual Tour
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size === 'md' ? 'default' : size}
      className={`${getVariantClasses()} ${getSizeClasses()} rounded-lg font-semibold transition-all duration-200 ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <Play className={`${getIconSize()} mr-1`} />
      Virtual Tour
    </Button>
  );
}

/**
 * Enhanced VirtualTourButton with external link icon for header contexts
 */
export function VirtualTourButtonWithExternal({ 
  hasVirtualTour = false,
  size = 'md',
  className = '',
  onClick,
  disabled = false
}: Omit<VirtualTourButtonProps, 'variant'>) {
  const showVirtualTour = hasVirtualTour || Math.random() > 0.7;

  if (!showVirtualTour) {
    return null;
  }

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

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else {
      e.preventDefault();
      e.stopPropagation();
      console.log('Virtual tour clicked');
    }
  };

  return (
    <Button
      variant="outline"
      size={size === 'md' ? 'default' : size}
      className={`bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm ${getSizeClasses()} rounded-lg font-semibold transition-all duration-200 ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <ExternalLink className={`${getIconSize()} mr-1`} />
      Virtual Tour
    </Button>
  );
}
