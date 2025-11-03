// Shared Badge Components
export { default as StatusBadge } from './StatusBadge';
export { default as TypeBadge } from './TypeBadge';
export { default as CommunityBadge } from './CommunityBadge';

// New Property Badge System
export { 
  default as PropertyBadge,
  OpenHouseBadge,
  CommunityBadge as NewCommunityBadge,
  TypeBadge as NewTypeBadge,
  MediaCountBadge
} from './PropertyBadge';

export type { PropertyBadgeVariant } from './PropertyBadge';