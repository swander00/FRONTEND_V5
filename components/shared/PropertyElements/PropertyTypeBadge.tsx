"use client";

import { Badge } from '@/components/ui/badge';

interface PropertyTypeBadgeProps {
  propertyType: string | null | undefined;
  variant?: 'default' | 'header' | 'gallery';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PropertyTypeBadge({ 
  propertyType, 
  variant = 'header',
  size = 'md',
  className = '' 
}: PropertyTypeBadgeProps) {
  if (!propertyType) return null;

  // Map variant to Badge component variant
  const getBadgeVariant = () => {
    switch (variant) {
      case 'header':
        return 'type-header';
      case 'gallery':
        return 'type-gallery';
      default:
        return 'type';
    }
  };

  return (
    <Badge 
      variant={getBadgeVariant()}
      size={size}
      className={className}
    >
      {propertyType}
    </Badge>
  );
}
