"use client";

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  visualVariant?: 'default' | 'card' | 'header' | 'minimal';
  isActive?: boolean;
  activeColor?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Shared ActionButton component for consistent button styling across Like and Share actions
 * Ensures uniform sizing and visual appearance
 */
export default function ActionButton({
  icon: Icon,
  label,
  size = 'sm',
  visualVariant = 'header',
  isActive = false,
  activeColor = 'text-red-500',
  className = '',
  onClick,
  disabled = false
}: ActionButtonProps) {
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
        return 'px-3 py-1.5 text-xs min-w-[80px]';
      case 'lg':
        return 'px-4 py-2 text-base min-w-[100px]';
      default:
        return 'px-3 py-1.5 text-sm min-w-[90px]';
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
      size={size === 'md' ? 'default' : size}
      className={`${getVisualVariantClasses()} ${getSizeClasses()} rounded-lg font-semibold transition-all duration-200 ${isActive ? activeColor : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className={`${getIconSize()} mr-1 ${isActive ? 'fill-current' : ''}`} />
      {label}
    </Button>
  );
}
