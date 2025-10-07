# Component Inventory & Dependency Analysis

## Overview
This document provides a comprehensive inventory of all components in the `components/` folder, their current locations, dependencies, and usage patterns across the application. This analysis was conducted to support the component reorganization effort.

## Directory Structure Summary

```
components/
├── Auth/                           # Authentication components
├── AuthProvider.tsx               # Main auth context provider
├── ClientLayout.tsx               # Client-side layout wrapper
├── FiltersContainer/              # Filter system components
├── Footer/                        # Footer components
├── Header/                        # Header components
├── Layout/                        # Layout components (mostly empty)
├── Property/                      # Property-related components
├── PropertyAddress/               # Property address display
├── PropertyCountBar/              # Property count and controls
├── PropertyDetailsContainer/      # Property details modal/page
├── PropertyFieldConfigProvider/   # Property field configuration
├── PropertyFieldRenderer/         # Property field rendering system
├── PropertyListingsSection/       # Main property listings
└── ui/                           # UI component library (shadcn/ui)
```

## Detailed Component Inventory

### 1. Authentication Components (`Auth/`)

#### Files:
- `Auth/index.ts` - Exports: UserProfileModal, UserSettingsModal, BuyerProfileModal
- `Auth/UserProfileModal.tsx` - User profile modal component
- `Auth/UserSettingsModal.tsx` - User settings modal component
- `Auth/BuyerProfile/BuyerProfileModal.tsx` - Buyer profile modal

#### Dependencies:
- Uses UI components from `@/components/ui/`
- Imported by: AuthProvider.tsx

#### Usage:
- Used in AuthProvider context
- Referenced in main app layout

### 2. Auth Provider (`AuthProvider.tsx`)

#### Dependencies:
- `@/components/Auth/BuyerProfile/BuyerProfileModal`
- React hooks (createContext, useContext, useEffect, useState)

#### Usage:
- Imported by: ClientLayout.tsx
- Used in app layout for authentication state management

### 3. Client Layout (`ClientLayout.tsx`)

#### Dependencies:
- `@/components/AuthProvider`

#### Usage:
- Wrapper component for client-side authentication

### 4. Filters Container (`FiltersContainer/`)

#### Structure:
```
FiltersContainer/
├── index.tsx                      # Main container component
├── FilterChips/
│   ├── index.tsx
│   └── FilterChips.tsx
├── FilterContext/
│   └── FilterContext.tsx          # Filter state management
├── PrimaryFilters/
│   ├── index.tsx
│   ├── PropertyFilters/           # Property-specific filters
│   ├── ResetButton/
│   ├── SaveSearch/
│   ├── SearchBar/
│   └── StatusFilters/
└── QuickFilters/
    ├── index.tsx
    └── QuickFiltersBar.tsx
```

#### Dependencies:
- Uses UI components extensively
- FilterContext provides state management

#### Usage:
- Imported by: app/page.tsx, app/search/page.tsx
- Wrapped with FilterProvider in main pages

### 5. Footer Components (`Footer/`)

#### Structure:
```
Footer/
├── index.tsx                      # Main footer component
├── FooterBottom/
│   └── index.tsx
└── FooterContent/
    ├── index.tsx
    ├── CompanyInfo/
    ├── ContactDetails/
    └── QuickLinks/
```

#### Dependencies:
- `@/components/ui/Container`

#### Usage:
- Imported by: app/page.tsx, app/search/page.tsx
- Used in main app layout

### 6. Header Components (`Header/`)

#### Structure:
```
Header/
├── index.tsx                      # Main header component
├── MainHeader/
│   ├── index.tsx
│   ├── ActionButtons/
│   │   ├── index.tsx
│   │   ├── AppButton/
│   │   ├── CallButton/
│   │   ├── GetStartedButton/
│   │   └── UserMenu/
│   ├── Logo/
│   │   └── index.tsx
│   └── Navigation/
│       ├── index.tsx
│       └── NavigationButton/
└── TopBanner/
    ├── index.tsx
    └── BannerText/
        └── index.tsx
```

#### Dependencies:
- Uses UI components
- Auth context for user menu

#### Usage:
- Imported by: app/page.tsx, app/search/page.tsx
- Used in main app layout

### 7. Property Address (`PropertyAddress/`)

#### Files:
- `PropertyAddress/PropertyAddress.tsx`

#### Dependencies:
- `@/types/property`
- `@/components/PropertyFieldRenderer/PropertyFieldRenderer`

#### Usage:
- Used by PropertyFieldRenderer for address display
- Referenced in property cards and details

### 8. Property Count Bar (`PropertyCountBar/`)

#### Structure:
```
PropertyCountBar/
├── index.tsx                      # Main component
├── MarketInsights/
│   ├── index.tsx
│   └── MarketInsights.tsx
├── SortByControl/
│   ├── index.tsx
│   └── SortByControl.tsx
└── ViewToggle/
    ├── index.tsx
    └── ViewToggle.tsx
```

#### Usage:
- Used in PropertyListingsSection
- Provides count display and view controls

### 9. Property Details Container (`PropertyDetailsContainer/`)

#### Structure:
```
PropertyDetailsContainer/
├── index.tsx                      # Main container
├── PropertyDetailsModal.tsx       # Modal wrapper
├── PD-HighlightsCard/
├── PropertyDetailsContent/
│   ├── index.tsx
│   ├── Property Details Left/
│   │   ├── PD-DescriptionCard/
│   │   ├── PD-ListingHistoryCard/
│   │   ├── PD-PropertyInformationCard/
│   │   │   └── Subsections/
│   │   │       ├── BasementSection/
│   │   │       ├── FeaturesSection/
│   │   │       ├── LeaseTermsSection/
│   │   │       ├── MaintenanceSection/
│   │   │       ├── ParkingSection/
│   │   │       ├── PoolWaterfrontSection/
│   │   │       ├── PotlSection/
│   │   │       └── UtilitiesSection/
│   │   └── PD-RoomDetailsCard/
│   └── Property Details Right/
│       └── ContactAgentCard/
├── PropertyDetailsGallery/
│   ├── index.tsx
│   ├── PropertyDetailsGallery.tsx
│   ├── ImageLightbox.tsx
│   ├── BottomRightVirtualTourButton/
│   ├── ImageGridSection/
│   ├── MainImageSection/
│   ├── SeeAllPhotosButton/
│   ├── StatusBadges/
│   └── VirtualTourButton/
├── PropertyDetailsHeader/
│   ├── index.tsx
│   ├── PropertyDetailsHeader.tsx
│   ├── OpenHouseInfo.tsx
│   └── PropertyEngagementStats.tsx
└── PropertyGallery/
    ├── index.tsx
    └── PropertyGallery.tsx
```

#### Dependencies:
- Extensive use of UI components
- Property types and hooks

#### Usage:
- Imported by: app/search/page.tsx (PropertyDetailsModal)
- Used for property detail views

### 10. Property Field Config Provider (`PropertyFieldConfigProvider/`)

#### Files:
- `PropertyFieldConfigProvider/PropertyFieldConfigProvider.tsx`

#### Dependencies:
- `@/types/property`
- `@/config/propertyFieldConfig`
- `@/types/propertyFieldTypes`

#### Usage:
- Provides context for property field configuration
- Used by PropertyFieldRenderer system

### 11. Property Field Renderer (`PropertyFieldRenderer/`)

#### Files:
- `PropertyFieldRenderer/PropertyFieldRenderer.tsx`

#### Dependencies:
- `@/types/property`
- `@/types/propertyFieldTypes`
- `@/hooks/usePropertyFields`
- `@/components/PropertyAddress/PropertyAddress`
- Lucide React icons

#### Usage:
- Central system for rendering property fields consistently
- Used extensively in PropertyCard and other property components

### 12. Property Listings Section (`PropertyListingsSection/`)

#### Structure:
```
PropertyListingsSection/
├── index.ts                       # Main export
├── PropertyListingsSection.tsx    # Main component
├── PropertyGrid.tsx               # Grid layout
├── MapView/
│   ├── index.tsx
│   └── MapView.tsx
└── PropertyCard/
    ├── index.ts                   # Exports PropertyCard
    ├── PropertyCard.tsx           # Main card component
    ├── BottomInfo.tsx
    ├── Community/
    │   ├── index.tsx
    │   └── Community.tsx
    ├── Image.tsx
    ├── MediaCountBadge.tsx
    ├── MetaInfo.tsx
    ├── OpenHouseBadge.tsx
    ├── Price.tsx
    ├── PropertyCardOverlays/
    │   ├── index.tsx
    │   ├── LeasedOverlay.tsx
    │   ├── RemovedOverlay.tsx
    │   ├── SoldOverlay.tsx
    │   └── UnavailableOverlay.tsx
    ├── PropertyCardOverlays.tsx
    ├── StatusBadge.tsx
    ├── TypeBadge.tsx
    └── VirtualTourButton.tsx
```

#### Dependencies:
- `@/components/ui/pagination`
- `@/hooks/usePropertyPagination`
- `@/components/FiltersContainer/FilterContext/FilterContext`
- `@/hooks/usePropertyFields`
- `@/components/PropertyFieldRenderer/PropertyFieldRenderer`

#### Usage:
- Imported by: app/page.tsx, app/search/page.tsx
- Main component for displaying property listings

### 13. UI Components (`ui/`)

#### Files (54 total):
Standard shadcn/ui components plus custom components:
- `Container.tsx` - Custom container component
- `ImageWithFallback.tsx` - Image component with fallback
- `RangeSliderWithInputs.tsx` - Range slider with input controls
- `SignInModal.tsx` - Sign-in modal
- `SignUpModal.tsx` - Sign-up modal

#### Usage:
- Used extensively throughout the application
- Foundation for all UI components

## Index Files Analysis

### 1. `Auth/index.ts`
```typescript
export { UserProfileModal } from './UserProfileModal';
export { UserSettingsModal } from './UserSettingsModal';
export { BuyerProfileModal } from './BuyerProfile/BuyerProfileModal';
```

### 2. `PropertyListingsSection/index.ts`
```typescript
export { default } from './PropertyListingsSection';
```

### 3. `PropertyListingsSection/PropertyCard/index.ts`
```typescript
export { default } from './PropertyCard';
```

## Import Usage Analysis

### Most Imported Components:
1. **Header** - Used in app/page.tsx, app/search/page.tsx
2. **Footer** - Used in app/page.tsx, app/search/page.tsx
3. **PropertyListingsSection** - Used in app/page.tsx, app/search/page.tsx
4. **FiltersContainer** - Used in app/page.tsx, app/search/page.tsx
5. **PropertyDetailsModal** - Used in app/search/page.tsx
6. **UI Components** - Used extensively throughout (52+ files)

### Cross-Component Dependencies:
- **PropertyFieldRenderer** is used by PropertyCard and PropertyAddress
- **FilterContext** is used by PropertyListingsSection and FiltersContainer
- **AuthProvider** wraps the entire application
- **UI Components** are the foundation for most other components

## Key Findings for Reorganization

### 1. Component Categories:
- **Layout Components**: Header, Footer, ClientLayout
- **Feature Components**: PropertyListingsSection, PropertyDetailsContainer
- **Utility Components**: PropertyFieldRenderer, PropertyFieldConfigProvider
- **UI Components**: ui/ folder (shadcn/ui + custom)
- **Auth Components**: Auth/ folder + AuthProvider
- **Filter Components**: FiltersContainer/

### 2. Dependency Patterns:
- **High-level components** (Header, Footer, PropertyListingsSection) have minimal dependencies
- **Utility components** (PropertyFieldRenderer, PropertyFieldConfigProvider) are used by many others
- **UI components** are foundational and used everywhere
- **Feature components** have moderate dependencies on utilities and UI

### 3. Index File Strategy:
- Currently minimal use of index files
- Only 3 index files found in the entire components directory
- Most components are imported directly by their file paths

### 4. Naming Conventions:
- Mixed naming patterns (PascalCase vs kebab-case)
- Some inconsistencies in directory naming (e.g., "Property Details Left" vs "PropertyDetailsLeft")
- Component files generally follow PascalCase

## Recommendations for Reorganization

1. **Group by Feature**: Organize components by functional areas
2. **Standardize Naming**: Use consistent PascalCase for all directories
3. **Add Index Files**: Create index files for better import management
4. **Separate Concerns**: Keep UI components separate from business logic
5. **Reduce Nesting**: Flatten deeply nested directory structures
6. **Create Shared**: Group commonly used utilities and providers

This inventory provides the foundation for creating a more organized and maintainable component structure.
