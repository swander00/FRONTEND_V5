"use client";

import { Property } from '@/types';

interface PropertyPriceDisplayProps {
  property: Property;
  className?: string;
}

export default function PropertyPriceDisplay({ property, className = '' }: PropertyPriceDisplayProps) {
  const formatPrice = (price: number | undefined) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusConfig = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'for sale':
        return {
          priceLabel: 'Competitive Market Price',
          showOriginalPrice: false,
          showDate: false
        };
      case 'for lease':
        return {
          priceLabel: 'Market Rent Estimate',
          showOriginalPrice: false,
          showDate: false
        };
      case 'sold':
        return {
          priceLabel: 'Sold on',
          showOriginalPrice: true,
          showDate: true,
          date: 'November 14, 2024'
        };
      case 'leased':
        return {
          priceLabel: 'Leased on',
          showOriginalPrice: true,
          showDate: true,
          date: 'November 30, 2024'
        };
      case 'terminated':
      case 'expired':
      case 'suspended':
        return {
          priceLabel: 'Removed on',
          showOriginalPrice: true,
          showDate: true,
          date: 'October 29, 2024'
        };
      default:
        return {
          priceLabel: 'Competitive Market Price',
          showOriginalPrice: false,
          showDate: false
        };
    }
  };

  const statusConfig = getStatusConfig(property.MlsStatus || null);
  const currentPrice = property.ListPrice;
  const originalPrice = property.OriginalPrice || property.ListPrice;

  return (
    <div className={className}>
      {statusConfig.showOriginalPrice && originalPrice && (
        <p className="text-white/60 text-sm line-through mb-1">
          {formatPrice(originalPrice)}
        </p>
      )}
      <p className="text-3xl font-bold mb-1">
        {property.MlsStatus?.toLowerCase() === 'for lease' ? 
          `${formatPrice(currentPrice)} / mo` : 
          formatPrice(currentPrice)
        }
      </p>
      <p className="text-white/80 text-sm">
        {statusConfig.priceLabel}
        {statusConfig.showDate && statusConfig.date && (
          <span> {statusConfig.date}</span>
        )}
      </p>
    </div>
  );
}
