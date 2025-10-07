// Shared Components - Centralized exports for all shared UI components
// This provides a single import point for all shared components across the application

// Badge Components
export * from './badges';

// Action Components  
export * from './actions';

// Overlay Components
export * from './overlays';

// Button Components - Renamed to avoid conflicts
export { 
  InteractiveButton,
  VirtualTourButton as SharedVirtualTourButton,
  LikeButton as SharedLikeButton,
  ShareButton as SharedShareButton,
  ContactButton,
  ActionButton,
  ImageActionButtons,
  PropertyLikeButton,
  PropertySaveButton
} from './buttons';

export type { InteractiveButtonVariant } from './buttons';

// Modal Components
export * from './modals';

// Card Components
export * from './cards';

// Form Components
export * from './forms';

// Icon Components
export * from './icons';

// Animation Components
export * from './animations';

// Theme Components
export * from './theme';

// Property Elements - Shared property UI components
export * from './PropertyElements';

// Re-export PropertyFieldRenderer for convenience
export { PropertyFieldRenderer } from '../Property/Fields/PropertyFieldRenderer';
