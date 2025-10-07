// Shared Badge Components
export { default as StatusBadge, LegacyStatusBadge } from './StatusBadge';
export { default as TypeBadge, LegacyTypeBadge } from './TypeBadge';
export { default as CommunityBadge, LegacyCommunityBadge } from './CommunityBadge';

// New Property Badge System
export { 
  default as PropertyBadge,
  OpenHouseBadge,
  CommunityBadge as NewCommunityBadge,
  TypeBadge as NewTypeBadge,
  MediaCountBadge
} from './PropertyBadge';

export type { PropertyBadgeVariant } from './PropertyBadge';