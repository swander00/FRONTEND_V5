import { Property } from '@/types/property';
import { PropertyFieldRenderer } from '@/components/Property/Fields/PropertyFieldRenderer';
import { Badge } from '@/components/ui/badge';
import { usePropertyFields } from '@/hooks/usePropertyFields';

interface CommunityBadgeProps {
  property: Property;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'card' | 'header' | 'gallery';
  className?: string;
}

/**
 * Shared CommunityBadge component using the unified Badge component
 * Provides consistent community rendering across the application with consistent sizing
 */
export default function CommunityBadge({ 
  property,
  size = 'md',
  variant = 'default',
  className = ''
}: CommunityBadgeProps) {
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
    >
      {address.community}
    </Badge>
  );
}

