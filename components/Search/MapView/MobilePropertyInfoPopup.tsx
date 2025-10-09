'use client';

import React from 'react';
import { Property } from '@/types';
import { Icon } from '@/components/shared/icons';
import { TypeBadge, PropertyBadge } from '@/components/shared/badges/PropertyBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PropertySaveButton } from '@/components/shared/buttons';

interface MobilePropertyInfoPopupProps {
  property: Property;
  onClose?: (e?: React.MouseEvent) => void;
  onViewDetails?: (property: Property) => void;
  className?: string;
}

export const MobilePropertyInfoPopup: React.FC<MobilePropertyInfoPopupProps> = ({
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

  // Get property image with fallback
  const getPropertyImage = () => {
    return property.PrimaryImageUrl || property.images?.[0] || '/images/no-photo-placeholder.jpg';
  };

  // Format days on market
  const formatDaysOnMarket = (days?: number) => {
    if (days === undefined || days === null) return 'N/A';
    if (days === 0) return 'New';
    if (days === 1) return '1d';
    return `${days}d`;
  };

  // Get full address
  const getFullAddress = () => {
    const street = property.StreetAddress || property.UnparsedAddress || '';
    const cityLine = [property.City, property.StateOrProvince]
      .filter(Boolean)
      .join(', ');
    return { street, cityLine };
  };

  const { street, cityLine } = getFullAddress();

  return (
    <div 
      className={cn(
        "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3",
        "bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden",
        "w-[280px] max-w-[90vw]",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-200",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Arrow pointing down to marker */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45"></div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-1.5 right-1.5 z-20 p-1.5 rounded-full bg-white/95 hover:bg-white shadow-md transition-colors active:scale-95"
          aria-label="Close popup"
        >
          <Icon name="x" size="xs" className="text-gray-600" />
        </button>
      )}

      {/* Property Image - Compact */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={getPropertyImage()}
          alt={`${street} - ${property.PropertyType || 'Property'}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/no-photo-placeholder.jpg';
          }}
        />
        
        {/* Image overlay badges - Compact */}
        <div className="absolute top-1.5 left-1.5 flex gap-1">
          {property.IsNewListing && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm text-[10px] px-1.5 py-0 h-4">
              New
            </Badge>
          )}
          <TypeBadge type={property.PropertyType || 'Property'} size="sm" className="text-[10px] px-1.5 py-0 h-4" />
        </div>

        {/* Price overlay - Bottom left */}
        <div className="absolute bottom-1.5 left-1.5 bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-bold">
          {formatPrice(property.ListPrice)}
        </div>

        {/* Status badge - Top right */}
        <div className="absolute top-1.5 right-1.5">
          <Badge className="text-[10px] px-1.5 py-0 h-4 bg-green-500 text-white border-0">
            {property.MlsStatus || 'Active'}
          </Badge>
        </div>
      </div>

      {/* Content - Compact */}
      <div className="p-2.5 space-y-2">
        {/* Address - Compact */}
        <div>
          <h3 className="font-semibold text-gray-900 text-xs leading-tight mb-0.5 line-clamp-1">
            {street || 'Address not available'}
          </h3>
          <div className="flex items-center text-[10px] text-gray-600">
            <Icon name="map-pin" size="xs" className="mr-0.5 text-gray-500 flex-shrink-0" />
            <span className="truncate">{cityLine}</span>
          </div>
        </div>

        {/* Key Stats - Compact 3 Column Grid */}
        <div className="grid grid-cols-3 gap-1.5 py-1.5 border-y border-gray-100">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Icon name="bed" size="xs" className="text-gray-600 mb-0.5" />
              <span className="text-sm font-semibold text-gray-900">
                {property.Bedrooms || '-'}
              </span>
              <div className="text-[9px] text-gray-500 leading-tight">Beds</div>
            </div>
          </div>
          
          <div className="text-center border-x border-gray-100">
            <div className="flex flex-col items-center">
              <Icon name="bath" size="xs" className="text-gray-600 mb-0.5" />
              <span className="text-sm font-semibold text-gray-900">
                {property.Bathrooms || '-'}
              </span>
              <div className="text-[9px] text-gray-500 leading-tight">Baths</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Icon name="square" size="xs" className="text-gray-600 mb-0.5" />
              <span className="text-sm font-semibold text-gray-900">
                {formatSquareFootage(property.SquareFootage)}
              </span>
              <div className="text-[9px] text-gray-500 leading-tight">Sqft</div>
            </div>
          </div>
        </div>

        {/* Days on Market & MLS Number - Compact */}
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center text-gray-600">
            <Icon name="clock" size="xs" className="mr-0.5 text-gray-500" />
            <span>DOM: <span className="font-medium text-gray-900">{formatDaysOnMarket(property.DaysOnMarket)}</span></span>
          </div>
          {property.MLSNumber && (
            <div className="text-gray-500 truncate max-w-[120px]">
              MLS® #{property.MLSNumber}
            </div>
          )}
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex gap-1.5 pt-0.5">
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white h-8 text-xs font-medium transition-all duration-200 rounded-lg active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(property);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
          >
            <Icon name="eye" size="xs" className="mr-1" />
            View
          </Button>
          
          <PropertySaveButton 
            property={property}
            variant="popup"
            size="sm"
            borderRadius="lg"
            className="h-8 px-3 active:scale-95 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};

export default MobilePropertyInfoPopup;

