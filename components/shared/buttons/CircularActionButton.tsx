"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CircularActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  visualVariant?: 'default' | 'card' | 'header' | 'minimal' | 'popup';
  isActive?: boolean;
  activeColor?: string;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
  title?: string;
}

/**
 * Shared CircularActionButton component for consistent circular button styling
 * Used for Like, Save, and Share buttons to ensure uniform appearance
 */
export default function CircularActionButton({
  icon: Icon,
  onClick,
  size = 'md',
  visualVariant = 'default',
  isActive = false,
  activeColor = 'text-red-500',
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
  title
}: CircularActionButtonProps) {
  const getVisualVariantClasses = () => {
    switch (visualVariant) {
      case 'card':
        return 'bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 border border-gray-200 shadow-sm hover:shadow-md backdrop-blur-sm';
      case 'header':
        return 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-blue-300 backdrop-blur-sm';
      case 'minimal':
        return 'bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-500';
      case 'popup':
        return 'bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 border border-gray-200 shadow-sm hover:shadow-md backdrop-blur-sm';
      default:
        return 'bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 border border-gray-200 shadow-sm hover:shadow-md backdrop-blur-sm';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 p-1.5';
      case 'lg':
        return 'w-12 h-12 p-3';
      default:
        return 'w-10 h-10 p-2';
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

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        getVisualVariantClasses(),
        getSizeClasses(),
        'rounded-full font-semibold transition-all duration-200',
        isActive ? activeColor : '',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
    >
      <Icon className={cn(getIconSize(), isActive ? 'fill-current' : '')} />
    </Button>
  );
}
