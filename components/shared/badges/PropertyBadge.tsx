'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type PropertyBadgeVariant = 'open-house' | 'open-house-header' | 'community' | 'type' | 'media-count' | 'status';

interface PropertyBadgeProps {
  variant: PropertyBadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const iconStyles = {
  'open-house': 'text-white',
  'open-house-header': 'text-white',
  'community': 'text-amber-600',
  'type': 'text-white',
  'media-count': 'text-secondary-foreground',
  'status': 'text-white'
};

const variantMap = {
  'open-house': 'open-house',
  'open-house-header': 'open-house-header',
  'community': 'community',
  'type': 'type',
  'media-count': 'secondary',
  'status': 'status'
};

export const PropertyBadge: React.FC<PropertyBadgeProps> = ({ 
  variant, 
  children, 
  className,
  size = 'md',
  icon
}) => {
  const defaultIcon = {
    'open-house': <Calendar className="h-3.5 w-3.5" />,
    'open-house-header': <Calendar className="h-3.5 w-3.5" />,
    'community': <MapPin className="h-3.5 w-3.5" />,
    'media-count': <Camera className="h-3.5 w-3.5" />,
    'type': null,
    'status': null
  }[variant];
  
  const displayIcon = icon === null ? null : (icon || defaultIcon);
  
  return (
    <Badge 
      variant={variantMap[variant] as any}
      size={size}
      className={cn('flex items-center justify-center leading-none', className)}
    >
      {displayIcon && (
        <span className={cn('mr-1.5 flex-shrink-0 flex items-center', iconStyles[variant])}>
          {displayIcon}
        </span>
      )}
      <span className="flex items-center leading-none">{children}</span>
    </Badge>
  );
};

// Specialized badge components for common use cases
export const OpenHouseBadge: React.FC<{ 
  dateTime: string; 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'header';
}> = ({ dateTime, className, size = 'sm', variant = 'default' }) => {
  const badgeVariant = variant === 'header' ? 'open-house-header' : 'open-house';
  const textColorClass = variant === 'header' ? 'text-white' : 'text-blue-800';
  
  return (
    <PropertyBadge variant={badgeVariant as any} size={size} className={cn('py-0.5', className)} icon={null}>
      <span className={cn('text-xs font-medium leading-none', textColorClass)}>Open House - {dateTime}</span>
    </PropertyBadge>
  );
};

export const CommunityBadge: React.FC<{ 
  community: string; 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ community, className, size = 'md' }) => (
  <PropertyBadge variant="community" size={size} className={className}>
    {community}
  </PropertyBadge>
);

export const TypeBadge: React.FC<{ 
  type: string; 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ type, className, size = 'md' }) => (
  <PropertyBadge variant="type" size={size} className={className}>
    {type}
  </PropertyBadge>
);

export const MediaCountBadge: React.FC<{ 
  count: number; 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}> = ({ count, className, size = 'md', showIcon = true }) => {
  const formatCount = (num: number): string => {
    if (num === 0) return 'No photos';
    if (num === 1) return '1 photo';
    return `${num} photos`;
  };
  
  return (
    <PropertyBadge 
      variant="media-count" 
      size={size} 
      className={className}
      icon={showIcon ? undefined : null}
    >
      {formatCount(count)}
    </PropertyBadge>
  );
};

export default PropertyBadge;
