import { Property } from '@/types/property';
import { PropertyFieldRenderer } from '@/components/Property/Fields/PropertyFieldRenderer';
import { Badge } from '@/components/ui/badge';
import { usePropertyFields } from '@/hooks/usePropertyFields';

interface StatusBadgeProps {
  property: Property;
  showNewListingRibbon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'header' | 'gallery';
  className?: string;
}

/**
 * Shared StatusBadge component using the unified Badge component
 * Provides consistent status rendering across the application with consistent sizing
 */
export default function StatusBadge({ 
  property, 
  showNewListingRibbon = true,
  size = 'md',
  variant = 'default',
  className = ''
}: StatusBadgeProps) {
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
    >
      {status.text}
    </Badge>
  );
}

// Legacy interface for backward compatibility
interface LegacyStatusBadgeProps {
  mlsStatus?: string | null;
  hasNewListing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'header' | 'gallery';
  className?: string;
}

/**
 * Legacy StatusBadge component for backward compatibility
 * @deprecated Use the new StatusBadge component with property prop instead
 */
export function LegacyStatusBadge({ 
  mlsStatus,
  hasNewListing = false,
  size = 'md',
  variant = 'default',
  className = ''
}: LegacyStatusBadgeProps) {
  // Create a minimal property object for the new component
  const property: Property = {
    ListingKey: '',
    UnparsedAddress: '',
    MlsStatus: mlsStatus || undefined,
    IsNewListing: hasNewListing
  };
  
  return (
    <StatusBadge 
      property={property} 
      showNewListingRibbon={hasNewListing}
      size={size}
      variant={variant}
      className={className}
    />
  );
}
