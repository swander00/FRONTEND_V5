'use client';

import React from 'react';
import { Property } from '@/types';
import { Icon } from '@/components/shared/icons';
import { TypeBadge, PropertyBadge } from '@/components/shared/badges/PropertyBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PropertySaveButton } from '@/components/shared/buttons';

interface PropertyInfoPopupProps {
  property: Property;
  onClose?: () => void;
  onViewDetails?: (property: Property) => void;
  className?: string;
}

export const PropertyInfoPopup: React.FC<PropertyInfoPopupProps> = ({
  property,
  onClose,
  onViewDetails,
  className
}) => {
  // Format price with proper currency formatting
  const formatPrice = (price?: number) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format square footage
  const formatSquareFootage = (sqft?: string | number) => {
    if (!sqft) return 'N/A';
    const num = typeof sqft === 'string' ? parseInt(sqft) : sqft;
    if (isNaN(num)) return 'N/A';
    return num.toLocaleString();
  };

  // Get status badge variant
  const getStatusVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default';
      case 'sold':
        return 'destructive';
      case 'pending':
        return 'secondary';
      case 'withdrawn':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Get property image with fallback
  const getPropertyImage = () => {
    return property.PrimaryImageUrl || property.images?.[0] || '/images/no-photo-placeholder.jpg';
  };

  // Format days on market
  const formatDaysOnMarket = (days?: number) => {
    if (days === undefined || days === null) return 'N/A';
    if (days === 0) return 'New Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  // Get full address
  const getFullAddress = () => {
    const street = property.StreetAddress || property.UnparsedAddress || '';
    const cityLine = [property.City, property.StateOrProvince, property.PostalCode]
      .filter(Boolean)
      .join(', ');
    return { street, cityLine };
  };

  const { street, cityLine } = getFullAddress();

  return (
    <div className={cn(
      "relative bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden",
      "w-[320px] transition-all duration-200",
      "animate-in fade-in-0 zoom-in-95 duration-150",
      className
    )}>
      {/* Close button */}
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 z-20 p-1 rounded-full bg-white/95 hover:bg-white shadow-md transition-colors"
          aria-label="Close popup"
        >
          <Icon name="x" size="sm" className="text-gray-600" />
        </button>
      )}

      {/* Property Image */}
      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={getPropertyImage()}
          alt={`${street} - ${property.PropertyType || 'Property'}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/no-photo-placeholder.jpg';
          }}
        />
        
        {/* Image overlay badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {property.IsNewListing && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm text-xs">
              New
            </Badge>
          )}
          <TypeBadge type={property.PropertyType || 'Property'} size="sm" />
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <PropertyBadge variant="status" size="sm">
            {property.MlsStatus || 'Active'}
          </PropertyBadge>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded">
          <div className="text-base font-bold">
            {formatPrice(property.ListPrice)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Address */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5">
            {street || 'Address not available'}
          </h3>
          <div className="flex items-center text-xs text-gray-600">
            <Icon name="map-pin" size="xs" className="mr-1 text-gray-500 flex-shrink-0" />
            <span className="truncate">{cityLine}</span>
          </div>
        </div>

        {/* Key Stats - Compact 3 Column Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Icon name="bed" size="sm" className="text-gray-600 mb-0.5" />
              <span className="text-base font-semibold text-gray-900">
                {property.Bedrooms || '-'}
              </span>
              <div className="text-[10px] text-gray-500 leading-tight">Beds</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Icon name="bath" size="sm" className="text-gray-600 mb-0.5" />
              <span className="text-base font-semibold text-gray-900">
                {property.Bathrooms || '-'}
              </span>
              <div className="text-[10px] text-gray-500 leading-tight">Baths</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Icon name="square" size="sm" className="text-gray-600 mb-0.5" />
              <span className="text-base font-semibold text-gray-900">
                {formatSquareFootage(property.SquareFootage)}
              </span>
              <div className="text-[10px] text-gray-500 leading-tight">Sqft</div>
            </div>
          </div>
        </div>

        {/* Days on Market & MLS Number */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-600">
            <Icon name="clock" size="xs" className="mr-1 text-gray-500" />
            <span>DOM: <span className="font-medium text-gray-900">{formatDaysOnMarket(property.DaysOnMarket)}</span></span>
          </div>
          {property.MLSNumber && (
            <div className="text-gray-500">
              MLS® #{property.MLSNumber}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium transition-all duration-200 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(property);
            }}
          >
            View Details
          </Button>
          
          <PropertySaveButton 
            property={property}
            variant="popup"
            size="sm"
            borderRadius="md"
            className="h-9 px-4"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoPopup;
