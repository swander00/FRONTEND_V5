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

