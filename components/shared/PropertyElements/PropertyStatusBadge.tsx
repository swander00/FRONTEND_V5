"use client";

import { Badge } from '@/components/ui/badge';

interface PropertyStatusBadgeProps {
  status: string | null | undefined;
  variant?: 'default' | 'header' | 'gallery';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Helper function to get status configuration
const getStatusConfig = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case 'for sale':
      return {
        label: 'For Sale'
      };
    case 'for lease':
      return {
        label: 'For Lease'
      };
    case 'sold':
      return {
        label: 'Sold'
      };
    case 'leased':
      return {
        label: 'Leased'
      };
    case 'terminated':
    case 'expired':
    case 'suspended':
      return {
        label: 'Removed'
      };
    default:
      return {
        label: 'Available'
      };
  }
};

export default function PropertyStatusBadge({ 
  status, 
  variant = 'header',
  size = 'md',
  className = '' 
}: PropertyStatusBadgeProps) {
  const statusConfig = getStatusConfig(status);

  // Map variant to Badge component variant
  const getBadgeVariant = () => {
    switch (variant) {
      case 'header':
        return 'status-header';
      case 'gallery':
        return 'status-gallery';
      default:
        return 'status';
    }
  };

  return (
    <Badge 
      variant={getBadgeVariant()}
      size={size}
      className={className}
    >
      {statusConfig.label}
    </Badge>
  );
}

// Export the gradient function for use in headers (backward compatibility)
export const getStatusGradient = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case 'for sale':
      return 'from-teal-500 to-blue-600';
    case 'for lease':
      return 'from-teal-500 to-purple-600';
    case 'sold':
      return 'from-pink-600 to-red-800';
    case 'leased':
      return 'from-teal-500 to-blue-600';
    case 'terminated':
    case 'expired':
    case 'suspended':
      return 'from-blue-500 to-purple-600';
    default:
      return 'from-teal-500 to-blue-600';
  }
};
