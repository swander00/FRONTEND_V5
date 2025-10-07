import { Property } from '@/types/property';
import { PropertyFieldRenderer } from '@/components/Property/Fields/PropertyFieldRenderer';
import { Badge } from '@/components/ui/badge';
import { usePropertyFields } from '@/hooks/usePropertyFields';

interface TypeBadgeProps {
  property: Property;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'card' | 'header' | 'gallery';
  className?: string;
}

/**
 * Shared TypeBadge component using the unified Badge component
 * Provides consistent property type rendering across the application with consistent sizing
 */
export default function TypeBadge({ 
  property,
  size = 'md',
  variant = 'default',
  className = ''
}: TypeBadgeProps) {
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
    >
      {details.propertyType}
    </Badge>
  );
}

// Legacy interface for backward compatibility
interface LegacyTypeBadgeProps {
  propertyType: string;
  hasNewListing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'card' | 'header' | 'gallery';
  className?: string;
}

/**
 * Legacy TypeBadge component for backward compatibility
 * @deprecated Use the new TypeBadge component with property prop instead
 */
export function LegacyTypeBadge({ 
  propertyType,
  hasNewListing = false,
  size = 'md',
  variant = 'default',
  className = ''
}: LegacyTypeBadgeProps) {
  // Create a minimal property object for the new component
  const property: Property = {
    ListingKey: '',
    UnparsedAddress: '',
    PropertyType: propertyType,
    IsNewListing: hasNewListing
  };
  
  return (
    <TypeBadge 
      property={property}
      size={size}
      variant={variant}
      className={className}
    />
  );
}
