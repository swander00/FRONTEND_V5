'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type PropertyCardVariant = 'listing' | 'suggestion' | 'highlight' | 'contact' | 'compact';

interface PropertyCardProps {
  variant: PropertyCardVariant;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const variantStyles = {
  listing: {
    base: 'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
    hover: 'transition-all duration-300 group-hover:shadow-xl group-hover:shadow-gray-200/50 group-hover:border-gray-200 group-hover:-translate-y-1',
    minHeight: 'min-h-[400px]'
  },
  suggestion: {
    base: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
    hover: 'transition-all duration-200 hover:shadow-md hover:border-gray-300',
    minHeight: 'min-h-[120px]'
  },
  highlight: {
    base: 'bg-gradient-to-br from-white via-gray-50/30 to-white rounded-2xl shadow-lg border border-gray-100/80 backdrop-blur-sm',
    hover: 'transition-all duration-200 hover:shadow-xl hover:scale-[1.02]',
    minHeight: 'min-h-[300px]'
  },
  contact: {
    base: 'bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden',
    hover: 'transition-all duration-200 hover:shadow-lg hover:border-blue-200',
    minHeight: 'min-h-[200px]'
  },
  compact: {
    base: 'bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden',
    hover: 'transition-all duration-200 hover:shadow-md',
    minHeight: 'min-h-[100px]'
  }
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  variant, 
  children, 
  className,
  hover = true,
  loading = false,
  disabled = false,
  onClick
}) => {
  const variantConfig = variantStyles[variant];
  
  const baseClasses = cn(
    'flex flex-col',
    variantConfig.base,
    hover && !disabled && !loading && variantConfig.hover,
    variantConfig.minHeight,
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'animate-pulse',
    onClick && !disabled && !loading && 'cursor-pointer',
    className
  );
  
  return (
    <div 
      className={baseClasses}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Specialized card components for common use cases
export const ListingCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ children, className, hover = true, loading, disabled, onClick }) => (
  <PropertyCard
    variant="listing"
    className={className}
    hover={hover}
    loading={loading}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </PropertyCard>
);

export const SuggestionCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ children, className, hover = true, loading, disabled, onClick }) => (
  <PropertyCard
    variant="suggestion"
    className={className}
    hover={hover}
    loading={loading}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </PropertyCard>
);

export const HighlightCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ children, className, hover = true, loading, disabled, onClick }) => (
  <PropertyCard
    variant="highlight"
    className={className}
    hover={hover}
    loading={loading}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </PropertyCard>
);

export const ContactCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ children, className, hover = true, loading, disabled, onClick }) => (
  <PropertyCard
    variant="contact"
    className={className}
    hover={hover}
    loading={loading}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </PropertyCard>
);

export const CompactCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ children, className, hover = true, loading, disabled, onClick }) => (
  <PropertyCard
    variant="compact"
    className={className}
    hover={hover}
    loading={loading}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </PropertyCard>
);

export default PropertyCard;
