"use client";

import React from 'react';
import { Property } from '@/types/property';
import { FieldRendererProps } from '@/types/propertyFieldTypes';
import { usePropertyFields } from '@/hooks/usePropertyFields';
import PropertyAddress from '@/components/Property/Address/PropertyAddress';
import { Bed, Bath, Square, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Centralized component for rendering property fields consistently
 * Uses the new property field architecture for standardized display
 */

// Address Renderer
interface AddressRendererProps extends FieldRendererProps {
  format?: 'full' | 'short' | 'street' | 'city-province';
  showUnit?: boolean;
  abbreviateSuffix?: boolean;
}

export const AddressRenderer: React.FC<AddressRendererProps> = ({ 
  property, 
  format = 'full',
  className = '',
  ...props 
}) => {
  const { address } = usePropertyFields(property);
  
  const getAddressDisplay = () => {
    switch (format) {
      case 'short':
        return address.short;
      case 'street':
        return address.street;
      case 'city-province':
        return address.cityProvince;
      default:
        return address.full;
    }
  };
  
  return (
    <div className={className} {...props}>
      <h1 className="text-2xl font-bold mb-1">{getAddressDisplay()}</h1>
    </div>
  );
};

// MetaInfo Renderer
interface MetaInfoRendererProps extends FieldRendererProps {
  showIcons?: boolean;
  compact?: boolean;
}

export const MetaInfoRenderer: React.FC<MetaInfoRendererProps> = ({ 
  property, 
  showIcons = true,
  compact = false,
  className = '',
  ...props 
}) => {
  const { details } = usePropertyFields(property);
  
  const formatNumber = (num: string) => {
    return num !== '?' ? num : '?';
  };
  
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'justify-between'} text-sm text-gray-600 ${className}`} {...props}>
      <div className="flex items-center gap-1.5 meta-info-item">
        {showIcons && <Bed className="h-4 w-4 text-gray-500 transition-colors duration-200" />}
        <span className="font-medium">{formatNumber(details.bedrooms)}</span>
        <span className="text-xs text-gray-500 hidden sm:inline">Bed{details.bedrooms !== '1' ? 's' : ''}</span>
        <span className="text-xs text-gray-500 sm:hidden">B{details.bedrooms !== '1' ? 's' : ''}</span>
      </div>
      
      <div className="flex items-center gap-1.5 meta-info-item">
        {showIcons && <Bath className="h-4 w-4 text-gray-500 transition-colors duration-200" />}
        <span className="font-medium">{formatNumber(details.bathrooms)}</span>
        <span className="text-xs text-gray-500 hidden sm:inline">Bath{details.bathrooms !== '1' ? 's' : ''}</span>
        <span className="text-xs text-gray-500 sm:hidden">Ba{details.bathrooms !== '1' ? 's' : ''}</span>
      </div>
      
      <div className="flex items-center gap-1.5 meta-info-item">
        {showIcons && <Square className="h-4 w-4 text-gray-500 transition-colors duration-200" />}
        <span className="font-medium">{details.squareFootage}</span>
        <span className="text-xs text-gray-500 hidden sm:inline">Sqft</span>
        <span className="text-xs text-gray-500 sm:hidden">Sq</span>
      </div>
      
      <div className="flex items-center gap-1.5 meta-info-item">
        {showIcons && <Car className="h-4 w-4 text-gray-500 transition-colors duration-200" />}
        <span className="font-medium">{details.parking}</span>
        <span className="text-xs text-gray-500 hidden sm:inline">Park</span>
        <span className="text-xs text-gray-500 sm:hidden">P</span>
      </div>
    </div>
  );
};

// Status Renderer
interface StatusRendererProps extends FieldRendererProps {
  showNewListingRibbon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'header' | 'gallery';
}

export const StatusRenderer: React.FC<StatusRendererProps> = ({ 
  property, 
  showNewListingRibbon = true,
  size = 'md',
  variant = 'default',
  className = '',
  ...props 
}) => {
  const { status } = usePropertyFields(property);
  
  // Map variant to Badge component variant
  const getBadgeVariant = () => {
    switch (variant) {
      case 'card':
        return 'status-card';
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
      {...props}
    >
      {status.text}
    </Badge>
  );
};

// Price Renderer
interface PriceRendererProps extends FieldRendererProps {
  showSuffix?: boolean;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
}

export const PriceRenderer: React.FC<PriceRendererProps> = ({ 
  property, 
  showSuffix = true,
  size = 'md',
  align = 'left',
  className = '',
  ...props 
}) => {
  const { price } = usePropertyFields(property);
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-lg sm:text-xl';
      case 'lg':
        return 'text-2xl sm:text-3xl lg:text-4xl';
      default:
        return 'text-xl sm:text-2xl lg:text-3xl';
    }
  };
  
  const getAlignClasses = () => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };
  
  return (
    <div className={`flex items-baseline gap-2 ${getAlignClasses()} ${className}`} {...props}>
      <span className={`${getSizeClasses()} font-bold tracking-tight ${price.textColor} transition-colors duration-200`}>
        {price.display}
      </span>
      {showSuffix && price.suffix && (
        <span className={`text-xs sm:text-sm font-semibold ${price.statusColor} transition-colors duration-200`}>
          {price.suffix}
        </span>
      )}
    </div>
  );
};

// MLS Number Renderer
interface MLSRendererProps extends FieldRendererProps {
  showLabel?: boolean;
  prefix?: string;
}

export const MLSRenderer: React.FC<MLSRendererProps> = ({ 
  property, 
  showLabel = true,
  prefix = 'MLS',
  className = '',
  ...props 
}) => {
  const { listing } = usePropertyFields(property);
  
  const formatMLSNumber = (mlsNumber: string) => {
    if (!mlsNumber) return '?';
    return mlsNumber.startsWith('#') ? mlsNumber : `#${mlsNumber}`;
  };
  
  return (
    <span className={`font-medium ${className}`} {...props}>
      {showLabel ? `${prefix} ` : ''}{formatMLSNumber(listing.mlsNumber)}
    </span>
  );
};

// Date Renderer
interface DateRendererProps extends FieldRendererProps {
  format?: 'relative' | 'absolute';
  showPrefix?: boolean;
}

export const DateRenderer: React.FC<DateRendererProps> = ({ 
  property, 
  format = 'relative',
  showPrefix = true,
  className = '',
  ...props 
}) => {
  const { listing } = usePropertyFields(property);
  
  const getDateDisplay = () => {
    switch (format) {
      case 'absolute':
        return listing.listDate;
      default:
        return listing.listDateRelative;
    }
  };
  
  const getPrefix = () => {
    if (!showPrefix) return '';
    return format === 'absolute' ? 'Listed ' : '';
  };
  
  return (
    <span className={className} {...props}>
      {getPrefix()}{getDateDisplay()}
    </span>
  );
};

// Community Badge Renderer
interface CommunityRendererProps extends FieldRendererProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'card' | 'header' | 'gallery';
}

export const CommunityRenderer: React.FC<CommunityRendererProps> = ({ 
  property, 
  size = 'md',
  variant = 'default',
  className = '',
  ...props 
}) => {
  const { address } = usePropertyFields(property);
  
  if (!address.community) return null;

  // Map variant to Badge component variant
  const getBadgeVariant = () => {
    switch (variant) {
      case 'outlined':
        return 'community-outlined';
      case 'filled':
        return 'community-filled';
      case 'card':
        return 'community-card';
      case 'header':
        return 'community-header';
      case 'gallery':
        return 'community-gallery';
      default:
        return 'community';
    }
  };
  
  return (
    <Badge 
      variant={getBadgeVariant()}
      size={size}
      className={className}
      {...props}
    >
      {address.community}
    </Badge>
  );
};

// Property Type Badge Renderer
interface TypeRendererProps extends FieldRendererProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'card' | 'header' | 'gallery';
}

export const TypeRenderer: React.FC<TypeRendererProps> = ({ 
  property, 
  size = 'md',
  variant = 'default',
  className = '',
  ...props 
}) => {
  const { details } = usePropertyFields(property);
  
  if (!details.propertyType) return null;

  // Map variant to Badge component variant
  const getBadgeVariant = () => {
    switch (variant) {
      case 'outlined':
        return 'type-outlined';
      case 'filled':
        return 'type-filled';
      case 'card':
        return 'type-card';
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
      {...props}
    >
      {details.propertyType}
    </Badge>
  );
};

// Unified Badge Group Renderer - NEW
interface BadgeGroupRendererProps extends FieldRendererProps {
  showStatus?: boolean;
  showType?: boolean;
  showCommunity?: boolean;
  layout?: 'horizontal' | 'vertical' | 'stacked';
  variant?: 'card' | 'header' | 'gallery';
  gap?: 'sm' | 'md' | 'lg';
}

export const BadgeGroupRenderer: React.FC<BadgeGroupRendererProps> = ({
  property,
  showStatus = true,
  showType = true,
  showCommunity = false,
  layout = 'horizontal',
  variant = 'default',
  gap = 'md',
  className = '',
  ...props
}) => {
  const { address, details } = usePropertyFields(property);
  
  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col';
      case 'stacked':
        return 'flex flex-col';
      default:
        return 'flex flex-row flex-wrap';
    }
  };

  const getGapClasses = () => {
    switch (gap) {
      case 'sm':
        return 'gap-1';
      case 'lg':
        return 'gap-3';
      default:
        return 'gap-2';
    }
  };

  const badges = [];

  if (showType && details.propertyType) {
    badges.push(
      <TypeRenderer 
        key="type" 
        property={property} 
        variant={variant as 'default' | 'outlined' | 'filled' | 'card' | 'header' | 'gallery'}
        size={variant === 'gallery' ? 'sm' : 'md'}
      />
    );
  }

  if (showStatus) {
    badges.push(
      <StatusRenderer 
        key="status" 
        property={property} 
        variant={variant as 'default' | 'card' | 'header' | 'gallery'}
        size={variant === 'gallery' ? 'sm' : 'md'}
      />
    );
  }

  if (showCommunity && address.community) {
    badges.push(
      <CommunityRenderer 
        key="community" 
        property={property} 
        variant={variant === 'header' ? 'outlined' : 'default'}
        size={variant === 'gallery' ? 'sm' : 'md'}
      />
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className={`${getLayoutClasses()} ${getGapClasses()} ${className}`} {...props}>
      {badges}
    </div>
  );
};

// Bottom Info Renderer (MLS + Date)
interface BottomInfoRendererProps extends FieldRendererProps {
  showMLS?: boolean;
  showDate?: boolean;
  dateFormat?: 'relative' | 'absolute';
}

export const BottomInfoRenderer: React.FC<BottomInfoRendererProps> = ({ 
  property, 
  showMLS = true,
  showDate = true,
  dateFormat = 'relative',
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex items-center justify-between text-xs text-gray-500 ${className}`} {...props}>
      {showMLS && <MLSRenderer property={property} />}
      {showDate && <DateRenderer property={property} format={dateFormat} showPrefix={false} />}
    </div>
  );
};

// Main PropertyFieldRenderer object with all renderers
export const PropertyFieldRenderer = {
  Address: AddressRenderer,
  MetaInfo: MetaInfoRenderer,
  Status: StatusRenderer,
  Price: PriceRenderer,
  MLS: MLSRenderer,
  Date: DateRenderer,
  Community: CommunityRenderer,
  Type: TypeRenderer,
  BadgeGroup: BadgeGroupRenderer,
  BottomInfo: BottomInfoRenderer
};

export default PropertyFieldRenderer;