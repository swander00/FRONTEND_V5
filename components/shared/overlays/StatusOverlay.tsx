'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type StatusOverlayType = 'sold' | 'leased' | 'removed' | 'unavailable';

interface StatusOverlayProps {
  status: StatusOverlayType;
  data?: {
    price?: number;
    date?: string;
  };
  className?: string;
  showDetails?: boolean;
}

const statusConfig = {
  sold: {
    bg: 'bg-green-600',
    text: 'SOLD',
    icon: '✓'
  },
  leased: {
    bg: 'bg-blue-600', 
    text: 'LEASED',
    icon: '🏠'
  },
  removed: {
    bg: 'bg-gray-600',
    text: 'REMOVED', 
    icon: '❌'
  },
  unavailable: {
    bg: 'bg-red-600',
    text: 'UNAVAILABLE',
    icon: '🔒'
  }
};

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const StatusOverlay: React.FC<StatusOverlayProps> = ({ 
  status, 
  data, 
  className,
  showDetails = false 
}) => {
  const config = statusConfig[status];
  
  return (
    <div className={cn(
      'absolute top-0 right-0 m-4 text-white px-3 py-1 rounded-full text-sm font-semibold',
      config.bg,
      className
    )}>
      <div className="flex items-center gap-1">
        <span className="text-xs">{config.icon}</span>
        <span>{config.text}</span>
      </div>
      {showDetails && data && (
        <div className="text-xs mt-1 opacity-90">
          {data.price && <div>Sold: {formatPrice(data.price)}</div>}
          {data.date && <div>{formatDate(data.date)}</div>}
        </div>
      )}
    </div>
  );
};

// Legacy components for backward compatibility
export const SoldOverlay: React.FC<{ salePrice?: number; saleDate?: string }> = ({ 
  salePrice, 
  saleDate 
}) => (
  <StatusOverlay 
    status="sold" 
    data={{ price: salePrice, date: saleDate }}
    showDetails={!!(salePrice || saleDate)}
  />
);

export const LeasedOverlay: React.FC<{ leasePrice?: number; leaseStartDate?: string }> = ({ 
  leasePrice, 
  leaseStartDate 
}) => (
  <StatusOverlay 
    status="leased" 
    data={{ price: leasePrice, date: leaseStartDate }}
    showDetails={!!(leasePrice || leaseStartDate)}
  />
);

export const RemovedOverlay: React.FC<{ removalDate?: string }> = ({ removalDate }) => (
  <StatusOverlay 
    status="removed" 
    data={{ date: removalDate }}
    showDetails={!!removalDate}
  />
);

export const UnavailableOverlay: React.FC = () => (
  <StatusOverlay status="unavailable" />
);

export default StatusOverlay;
