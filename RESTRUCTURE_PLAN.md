# Complete Frontend-Only App Restructure Plan - Next.js Best Practices

## Overview
This document outlines a comprehensive restructuring plan for converting the current app to follow modern Next.js 13+ App Router best practices with PascalCase naming conventions. **This is a strictly frontend-only architecture with no database integration.**

## 📌 Key Points

### 1. **About Next.js App Router - Pages Directory**

**In Next.js 13+ App Router, there is NO separate `pages/` directory.** The `app/` directory **IS** where all your pages/routes are defined. Each `page.tsx` file inside `app/` becomes a route.

**Route Examples:**
- `app/page.tsx` → `/` (home page)
- `app/search/page.tsx` → `/search`
- `app/property/[id]/page.tsx` → `/property/123`
- `app/map-view/page.tsx` → `/map-view`

This is different from the old **Pages Router** (Next.js 12 and below) where you had a separate `pages/` directory. In App Router, everything is in `app/`.

### 2. **Frontend-Only Architecture**

This plan is designed for a **strictly frontend-only** application:
- ✅ **No database integration** - All data comes from mock data or external APIs
- ✅ **Mock data services** - Services provide mock data for development
- ✅ **Local storage** - Use localStorage/sessionStorage for client-side persistence
- ✅ **Client-side state** - Manage all state in React (Context, Zustand, etc.)
- ❌ **No Supabase/DB queries** - Remove all database client code
- ❌ **No database types** - Define types based on frontend needs only

---

## 🏗️ Proposed Directory Structure

```
FRONTEND_V5/
├── app/                          # Next.js App Router (lowercase required - THIS IS YOUR PAGES DIRECTORY)
│   ├── (Root)/                   # Route group for root routes
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Home page → Route: /
│   │   ├── loading.tsx          # Root loading UI
│   │   ├── error.tsx            # Root error boundary
│   │   ├── global-error.tsx     # Global error handler
│   │   └── not-found.tsx        # 404 page
│   │
│   ├── (Auth)/                   # Route group for auth-protected routes
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       ├── signup/
│   │       │   └── page.tsx
│   │       └── profile/
│   │           └── page.tsx
│   │
│   ├── search/                  # Search routes
│   │   ├── page.tsx             # Search results page
│   │   ├── loading.tsx          # Search loading state
│   │   └── [filters]/
│   │       └── page.tsx         # Dynamic filter routes
│   │
│   ├── property/                 # Property routes
│   │   ├── [id]/
│   │   │   ├── page.tsx         # Property details
│   │   │   ├── loading.tsx      # Property loading state
│   │   │   └── edit/
│   │   │       └── page.tsx     # Edit property (if needed)
│   │   └── map/
│   │       └── page.tsx         # Map view
│   │
│   ├── map-view/                 # Map-specific routes
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   ├── home-evaluation/          # Home evaluation feature
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   ├── api/                      # API routes (optional - only if you need server-side API endpoints)
│   │   ├── properties/
│   │   │   ├── route.ts          # Property search endpoint - returns mock data
│   │   │   └── [id]/
│   │   │       └── route.ts      # Single property endpoint
│   │   ├── search-suggestions/
│   │   │   └── route.ts          # Search suggestions endpoint - mock data
│   │   └── health/
│   │       └── route.ts          # Health check endpoint
│   │
│   └── globals.css              # Global styles
│
├── Components/                   # React components (PascalCase)
│   ├── Common/                  # Shared/common components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── Badges/              # Shareable badge components
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── TypeBadge.tsx
│   │   │   ├── CommunityBadge.tsx
│   │   │   ├── OpenHouseBadge.tsx
│   │   │   ├── NewListingBadge.tsx
│   │   │   ├── PriceReducedBadge.tsx
│   │   │   └── index.ts
│   │   ├── Icon/
│   │   │   ├── Icon.tsx
│   │   │   └── index.ts
│   │   ├── Loading/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   └── index.ts
│   │   ├── ErrorBoundary/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorFallback.tsx
│   │   │   └── index.ts
│   │   └── index.ts             # Barrel export
│   │
│   ├── Layout/                  # Layout components
│   │   ├── RootLayout/
│   │   │   ├── RootLayout.tsx
│   │   │   └── index.ts
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation/
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── NavItem.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ActionButtons/
│   │   │   │   ├── ActionButtons.tsx
│   │   │   │   ├── UserMenuButton.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   ├── FooterContent.tsx
│   │   │   ├── FooterBottom.tsx
│   │   │   └── index.ts
│   │   ├── Container/
│   │   │   ├── Container.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── Property/                # Property feature components
│   │   ├── PropertyCard.tsx     # Single file - used in listings AND map view
│   │   ├── PropertyDetails.tsx  # Single file - all details (except agent info)
│   │   ├── AgentInfo.tsx        # Modular agent information component
│   │   ├── PropertyListings.tsx # Listings page component
│   │   └── index.ts
│   │
│   ├── Search/                  # Search feature components
│   │   ├── SearchBar.tsx        # Search bar component
│   │   ├── SuggestionCard.tsx  # Single file - suggestion card in search dropdown
│   │   ├── FiltersContainer.tsx # Main filters container
│   │   ├── Filters/             # Folder with shareable filter components
│   │   │   ├── PriceFilter.tsx
│   │   │   ├── BedFilter.tsx
│   │   │   ├── BathFilter.tsx
│   │   │   ├── TypeFilter.tsx
│   │   │   └── index.ts
│   │   ├── StatusFilters.tsx    # Single file - all status filters
│   │   ├── AllTimeButtons.tsx   # Single file - all time filter buttons
│   │   ├── MapView.tsx          # Map view component
│   │   ├── PropertyInfoCard.tsx # Single file - property info card for map popup
│   │   └── index.ts
│   │
│   ├── Auth/                    # Authentication components
│   │   ├── LoginForm/
│   │   │   ├── LoginForm.tsx
│   │   │   └── index.ts
│   │   ├── SignupForm/
│   │   │   ├── SignupForm.tsx
│   │   │   └── index.ts
│   │   ├── ProfileForm/
│   │   │   ├── ProfileForm.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── UI/                      # shadcn/ui components (keep lowercase for compatibility)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   └── Providers/               # Context providers
│       ├── ThemeProvider/
│       │   ├── ThemeProvider.tsx
│       │   └── index.ts
│       ├── FilterProvider/
│       │   ├── FilterProvider.tsx
│       │   └── index.ts
│       ├── AuthProvider/
│       │   ├── AuthProvider.tsx
│       │   └── index.ts
│       └── index.ts
│
├── Hooks/                        # Custom React hooks (PascalCase)
│   ├── Property/
│   │   ├── useProperty.ts           # Fetch single property data
│   │   ├── usePropertyMedia.ts      # Handle property media/images
│   │   ├── usePropertyRooms.ts      # Handle property rooms data
│   │   ├── usePropertyPagination.ts # Handle property listing pagination
│   │   └── index.ts
│   ├── Search/
│   │   ├── useSearchFilters.ts      # Manage search filter state
│   │   ├── useSearchSuggestions.ts   # Handle search autocomplete suggestions
│   │   └── index.ts
│   ├── Auth/
│   │   ├── useAuth.ts               # Authentication state and methods
│   │   ├── useUserData.ts           # User data management
│   │   └── index.ts
│   ├── UI/
│   │   ├── useIsMobile.ts           # Detect mobile viewport
│   │   ├── useFocusTrap.ts          # Trap focus in modals/dialogs
│   │   ├── useToast.ts              # Toast notification hook
│   │   └── index.ts
│   └── index.ts                 # Barrel export
│
├── Services/                     # Frontend data services (PascalCase) - MOCK DATA ONLY
│   ├── Data/                     # Mock data services
│   │   ├── MockDataService.ts    # Main mock data provider/aggregator
│   │   ├── MockPropertyData.ts   # Property mock data generator
│   │   ├── MockUserData.ts       # User mock data generator
│   │   └── index.ts
│   ├── Property/
│   │   ├── PropertyDataService.ts    # Property CRUD operations (mock data)
│   │   ├── PropertySearchService.ts  # Property search and filtering logic
│   │   └── index.ts
│   ├── Auth/                     # Client-side auth state management (no DB)
│   │   ├── AuthService.ts           # Authentication logic, localStorage, session
│   │   ├── AuthHelpers.ts           # Auth utility functions
│   │   └── index.ts
│   ├── Storage/                  # Local storage management
│   │   ├── LocalStorageService.ts    # localStorage wrapper service
│   │   ├── SessionStorageService.ts  # sessionStorage wrapper service
│   │   └── index.ts
│   └── index.ts
│
├── Utils/                        # Utility functions (PascalCase)
│   ├── Formatting/
│   │   ├── generalFormatters.ts     # General formatting utilities
│   │   ├── currencyFormatter.ts     # Currency formatting functions
│   │   ├── dateFormatter.ts         # Date/time formatting functions
│   │   └── index.ts
│   ├── Property/
│   │   ├── propertyFieldUtils.ts       # Property field manipulation utilities
│   │   ├── propertyFieldConstants.ts   # Property field constants and enums
│   │   ├── propertyMediaUtils.ts       # Property media/image utilities
│   │   └── index.ts
│   ├── Network/
│   │   ├── ipAddressHelpers.ts        # IP address utilities
│   │   └── index.ts
│   ├── Validation/
│   │   ├── validationSchemas.ts       # Zod/validation schemas
│   │   ├── formValidation.ts          # Form validation utilities
│   │   └── index.ts
│   └── index.ts                 # Barrel export
│
├── Types/                        # TypeScript type definitions (PascalCase)
│   ├── Property/
│   │   ├── Property.types.ts        # Core Property interface/types
│   │   ├── PropertyCard.types.ts    # Property card display types
│   │   ├── PropertyDetails.types.ts # Property details page types
│   │   ├── PropertyFields.types.ts  # Property field definitions/types
│   │   ├── PropertyFilters.types.ts # Property filter/search types
│   │   └── index.ts
│   ├── Auth/
│   │   ├── User.types.ts            # User types (client-side only)
│   │   ├── Auth.types.ts            # Authentication types
│   │   └── index.ts
│   ├── Api/                      # API request/response types (for external APIs or mock data)
│   │   ├── ApiResponse.types.ts     # API response types
│   │   ├── ApiRequest.types.ts      # API request types
│   │   └── index.ts
│   └── index.ts                 # Barrel export
│
├── Config/                       # Configuration files (PascalCase)
│   ├── App/
│   │   ├── appConstants.ts         # App-wide constants
│   │   ├── seoMetadata.ts          # SEO metadata configuration
│   │   └── index.ts
│   ├── Property/
│   │   ├── propertyFieldConfig.ts  # Property field configuration
│   │   └── index.ts
│   └── index.ts
│
├── Lib/                          # Third-party library utilities (PascalCase)
│   ├── Utils/
│   │   ├── classNameUtils.ts       # className utility (clsx + tailwind-merge)
│   │   ├── sharedConstants.ts      # Shared library constants
│   │   └── index.ts
│   └── index.ts
│
├── Constants/                    # App-wide constants (PascalCase)
│   ├── routePaths.ts             # Application route paths
│   ├── apiEndpoints.ts          # API endpoint URLs
│   ├── validationConstants.ts    # Validation rules and constants
│   └── index.ts
│
├── Stores/                       # State management (PascalCase)
│   ├── filterStore.ts           # Filter state store (Zustand/Jotai)
│   ├── propertyStore.ts         # Property state store
│   └── index.ts
│
├── Styles/                       # Global styles & themes (PascalCase)
│   ├── globals.css               # Global CSS styles
│   ├── cssVariables.css         # CSS custom properties/variables
│   └── theme.css                # Theme-specific styles
│
├── Public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── Scripts/                      # Build & utility scripts
│   ├── build/
│   │   ├── buildScript.ts
│   │   └── index.ts
│   ├── generate/
│   │   ├── generateTypes.ts
│   │   └── index.ts
│   └── migrate/                 # Migration scripts
│       ├── migrateStructure.ts
│       └── index.ts
│
├── Tests/                        # Test files (PascalCase)
│   ├── __mocks__/               # Mock data for tests
│   │   └── index.ts
│   ├── __fixtures__/            # Test fixtures
│   │   └── index.ts
│   ├── utils/                   # Test utility functions
│   │   ├── testUtils.ts
│   │   └── index.ts
│   └── setupTests.ts           # Test setup configuration
│
├── Docs/                         # Documentation
│   ├── Architecture.md
│   ├── API.md
│   └── Contributing.md
│
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example env file
├── .gitignore
├── next.config.js
├── next.config.mjs               # Modern ESM config (preferred)
├── tsconfig.json
├── tsconfig.paths.json           # Path aliases config
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 📋 Detailed Breakdown by Directory

### 1. app/ (Next.js App Router - THIS IS YOUR PAGES DIRECTORY)
**Best Practices:**
- **No separate `pages/` directory**: All routes are defined in `app/`
- Use route groups `(Root)`, `(Auth)` for logical organization
- Co-locate `loading.tsx`, `error.tsx` with routes
- Use dynamic routes `[id]` for parameterized routes
- API routes (if needed) should return mock data or proxy to external APIs

**Key Files:**
- `layout.tsx`: Root layout with all providers, fonts, metadata
- `page.tsx`: Route pages should be minimal, delegate to components
- `loading.tsx`: Loading states for Suspense boundaries
- `error.tsx`: Error boundaries with error recovery

**Route Examples:**
- `app/page.tsx` → `/` route
- `app/search/page.tsx` → `/search` route
- `app/property/[id]/page.tsx` → `/property/123` route

### 2. Components/
**Best Practices:**
- **Feature-based organization**: Group by domain (Property, Search, Auth)
- **Simplified structure**: Use single-file components when appropriate
  - **Single-file components**: For straightforward components like `PropertyCard.tsx`, `SuggestionCard.tsx`
  - **Modular when needed**: Break out reusable pieces (e.g., `AgentInfo.tsx` from `PropertyDetails.tsx`)
  - **Folder structure only for complex components**: Use folders only when you need sub-components or extensive related files
  
**Component Examples:**
```
Components/Property/
  ├── PropertyCard.tsx          # Single file - reused in listings & map
  ├── PropertyDetails.tsx       # Single file - all details in one place
  ├── AgentInfo.tsx            # Modular - extracted from PropertyDetails
  └── index.ts                 # Barrel exports

Components/Search/
  ├── SuggestionCard.tsx        # Single file
  ├── StatusFilters.tsx        # Single file - all status filters
  ├── AllTimeButtons.tsx        # Single file - all time buttons
  ├── PropertyInfoCard.tsx     # Single file - map popup card
  ├── Filters/                 # Folder - shareable filter components
  │   ├── PriceFilter.tsx
  │   ├── BedFilter.tsx
  │   └── index.ts
  └── index.ts
```

- **Common vs Feature**: Shared components in `Common/`, domain-specific in feature folders
- **Shareable Badges**: Common badges (Status, Type, Community, OpenHouse, NewListing, PriceReduced) in `Common/Badges/`
- **UI folder**: Keep shadcn/ui components lowercase for compatibility
- **Reusability**: Design components to be reused (e.g., `PropertyCard` works in both listings and map view)

**Practical Example - Reusable PropertyCard:**
```typescript
// Components/Property/PropertyCard.tsx
interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'compact'; // Optional: different styles for map vs listings
}

export function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  // Single component used in both:
  // - Components/Property/PropertyListings.tsx (listings grid)
  // - Components/Search/MapView.tsx (map popup/info card)
  return (
    <div className={variant === 'compact' ? 'compact-styles' : 'default-styles'}>
      {/* Card content */}
    </div>
  );
}
```

**Practical Example - PropertyDetails with modular AgentInfo:**
```typescript
// Components/Property/PropertyDetails.tsx
import { AgentInfo } from './AgentInfo';

export function PropertyDetails({ property }: { property: Property }) {
  return (
    <div>
      {/* All property details in one file */}
      <PropertyOverview />
      <PropertyMedia />
      <PropertyRooms />
      <PropertyFeatures />
      
      {/* Agent info is modular/separate */}
      <AgentInfo agent={property.agent} />
    </div>
  );
}
```

**Practical Example - Using Shareable Badges:**
```typescript
// Components/Property/PropertyCard.tsx
import { 
  StatusBadge, 
  TypeBadge, 
  CommunityBadge, 
  OpenHouseBadge,
  NewListingBadge,
  PriceReducedBadge 
} from '@/Components/Common/Badges';

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div>
      <div className="badges">
        <StatusBadge status={property.status} />
        <TypeBadge type={property.type} />
        <CommunityBadge community={property.community} />
        {property.openHouse && <OpenHouseBadge date={property.openHouse} />}
        {property.isNewListing && <NewListingBadge />}
        {property.isPriceReduced && <PriceReducedBadge amount={property.priceReduction} />}
      </div>
      {/* Rest of card content */}
    </div>
  );
}
```

### 3. Hooks/
**Best Practices:**
- Organize by domain (Property, Search, Auth, UI)
- Co-locate related hooks
- Use `use` prefix consistently
- Export via barrel files

### 4. Services/ (Frontend-Only, Mock Data)
**Best Practices:**
- **No Database Integration**: All services work with mock data or client-side storage
- **Single Responsibility**: Each service handles one domain
- **Mock Data**: Services provide mock data for development/demo
- **Local Storage**: Use localStorage/sessionStorage for client-side persistence
- **Type safety**: Strongly typed with TypeScript

**Structure:**
```typescript
// Services/Property/PropertyDataService.ts
import { mockProperties } from '@/Services/Data/MockPropertyData';
import type { Property, PropertyFilters } from '@/Types/Property';

export class PropertyDataService {
  // Get property by ID (from mock data)
  static getPropertyById(id: string): Property | null {
    return mockProperties.find(p => p.id === id) || null;
  }
  
  // Search/filter properties (client-side filtering)
  static searchProperties(filters: PropertyFilters): Property[] {
    return mockProperties.filter(property => {
      // Apply filters logic
      if (filters.priceMin && property.price < filters.priceMin) return false;
      if (filters.priceMax && property.price > filters.priceMax) return false;
      // ... more filters
      return true;
    });
  }
  
  // Save property to favorites (localStorage)
  static saveFavorite(propertyId: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }
  
  static getFavorites(): string[] {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  }
}
```

### 5. Utils/
**Best Practices:**
- **Pure functions**: Utils should be pure, testable functions
- **Organization**: Group by purpose (Formatting, Validation, Property)
- **No side effects**: Avoid business logic in utils
- **Type safety**: Generic, reusable utilities

### 6. Types/
**Best Practices:**
- **Domain types**: Business logic types by feature (Property, Auth, etc.)
- **API types**: Request/Response types (for mock data or external API calls)
- **No database types**: Since this is frontend-only, no database schema types
- **Shared types**: Common types used across features

### 7. Config/
**Best Practices:**
- **Environment-aware**: Different configs for dev/prod
- **Type-safe**: Export typed configuration objects
- **Centralized**: All configuration in one place

---

## 🔧 Configuration Improvements

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"],
      "@/Components/*": ["./Components/*"],
      "@/Services/*": ["./Services/*"],
      "@/Utils/*": ["./Utils/*"],
      "@/Types/*": ["./Types/*"],
      "@/Hooks/*": ["./Hooks/*"],
      "@/Config/*": ["./Config/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "Tests/**/*"]
}
```

### Next.js Configuration (Modern ESM)
```typescript
// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin'; // If using i18n

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      // Add any external image domains here if needed
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: true,
    // Optimize package imports
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  
  // TypeScript & ESLint
  typescript: {
    ignoreBuildErrors: false, // Remove in production
  },
  eslint: {
    ignoreDuringBuilds: false, // Remove in production
  },
  
  // Output configuration
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add custom webpack config if needed
    return config;
  },
};

export default nextConfig;
```

### Environment Variables (Frontend-Only)
```bash
# .env.local (gitignored)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=                    # If connecting to external API
NODE_ENV=development
```

```bash
# .env.example (committed)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://api.example.com
NODE_ENV=development
```

---

## 📦 Package.json Improvements

### Recommended Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "format": "prettier --write \"**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,css,md}\"",
    "analyze": "ANALYZE=true next build",
    "prepare": "husky install"
  }
}
```

### Recommended Dev Dependencies
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-config-prettier": "^9.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^14.0.0"
  }
}
```

---

## 🎯 Key Improvements & Best Practices

### 1. **Path Aliases**
Update `tsconfig.json` with comprehensive path aliases:
```json
{
  "paths": {
    "@/*": ["./*"],
    "@/Components/*": ["./Components/*"],
    "@/Services/*": ["./Services/*"],
    "@/Utils/*": ["./Utils/*"],
    "@/Types/*": ["./Types/*"],
    "@/Hooks/*": ["./Hooks/*"],
    "@/Config/*": ["./Config/*"],
      "@/app/*": ["./app/*"]
  }
}
```

### 2. **Barrel Exports**
Use index.ts files for clean imports:
```typescript
// Components/Property/index.ts
export { PropertyCard } from './PropertyCard';
export { PropertyDetails } from './PropertyDetails';
export { PropertyListings } from './PropertyListings';

// Components/Common/Badges/index.ts
export { StatusBadge } from './StatusBadge';
export { TypeBadge } from './TypeBadge';
export { CommunityBadge } from './CommunityBadge';
export { OpenHouseBadge } from './OpenHouseBadge';
export { NewListingBadge } from './NewListingBadge';
export { PriceReducedBadge } from './PriceReducedBadge';

// Usage:
import { PropertyCard, PropertyDetails } from '@/Components/Property';
import { StatusBadge, TypeBadge, CommunityBadge } from '@/Components/Common/Badges';
```

### 3. **Type Safety**
- Define types for all data structures
- Use discriminated unions for state management
- Strict TypeScript configuration
- No database schema - define types based on your frontend needs

### 4. **Error Handling (Frontend-Only)**
```typescript
// Services/Property/PropertyDataService.ts
import { mockProperties } from '@/Services/Data/MockPropertyData';
import type { Property } from '@/Types/Property';

export class PropertyDataService {
  static getPropertyById(id: string): Property | null {
    try {
      const property = mockProperties.find(p => p.id === id);
      return property || null;
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  }
  
  static searchProperties(filters: PropertyFilters): Property[] {
    try {
      // Client-side filtering logic
      return mockProperties.filter(/* filter logic */);
    } catch (error) {
      console.error('Error searching properties:', error);
      return [];
    }
  }
}
```

### 5. **Loading States**
```typescript
// app/(Root)/property/[id]/loading.tsx
export default function PropertyLoading() {
  return <PropertyDetailsSkeleton />;
}
```

### 6. **Error Boundaries**
```typescript
// app/(Root)/property/[id]/error.tsx
'use client';

export default function PropertyError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 7. **Server Components First**
- Default to Server Components
- Use 'use client' only when necessary
- Keep data fetching in Server Components

### 8. **Code Organization Rules**
- **Simplified structure**: Use single-file components for straightforward components
- **One component per file**: Each component in its own file
- **Co-location**: Related files stay together
- **Feature folders**: Group by feature, not by type
- **Clear naming**: Descriptive, consistent names
- **Reusability first**: Design components to be reused across different contexts (e.g., `PropertyCard` in listings and map view)

---

## 🔄 Migration Strategy

### Phase 1: Structure Setup
1. Create new directory structure
2. Update path aliases in tsconfig.json
3. Update imports gradually

### Phase 2: Component Migration
1. Move components to new structure
2. Update import paths
3. Test each component

### Phase 3: Services & Utils
1. Refactor API calls into services
2. Reorganize utils by purpose
3. Update all references

### Phase 4: Types & Config
1. Organize types by domain (remove database-related types)
2. Centralize configuration
3. Define types based on frontend data structures

### Phase 5: Testing & Validation
1. Add tests for critical paths
2. Validate all imports
3. Ensure build passes

---

## 📝 Naming Conventions

### Files & Folders
- **Components**: PascalCase (`PropertyCard/`, `SearchBar/`)
- **Hooks**: camelCase with `use` prefix (`useProperty.ts`, `useAuth.ts`)
- **Services**: PascalCase (`PropertyDataService.ts`)
- **Utils**: camelCase (`formatters.ts`, `currency.ts`)
- **Types**: PascalCase (`Property.ts`, `User.ts`)
- **Constants**: PascalCase (`Routes.ts`, `ApiEndpoints.ts`)

### Code
- **Components**: PascalCase (`PropertyCard`, `SearchBar`)
- **Functions**: camelCase (`getPropertyById`, `formatPrice`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RESULTS`)
- **Types/Interfaces**: PascalCase (`Property`, `PropertyDetails`, `SearchFilters`)

---

## ✅ Benefits of This Structure

1. **Scalability**: Easy to add new features
2. **Maintainability**: Clear organization, easy to find code
3. **Type Safety**: Comprehensive TypeScript coverage
4. **Performance**: Optimized imports, code splitting
5. **Developer Experience**: Clear conventions, better tooling
6. **Testing**: Co-located tests, easy test setup
7. **Collaboration**: Consistent structure, easier onboarding

---

## 🚀 Additional Modern Next.js Features to Consider

1. **Server Actions**: Replace API routes where possible
2. **Parallel Routes**: For complex UIs
3. **Intercepting Routes**: For modals
4. **Middleware**: For auth, redirects, i18n
5. **Metadata API**: Dynamic SEO metadata
6. **Streaming SSR**: For better performance
7. **React Server Components**: Maximize server-side rendering

---

## 📚 Recommended Tools

- **Linting**: ESLint with TypeScript, React, Next.js configs
- **Formatting**: Prettier with Tailwind plugin
- **Testing**: Jest + React Testing Library
- **Mock Data**: Create mock data services for development
- **Git Hooks**: Husky + lint-staged
- **Monitoring**: Sentry for error tracking
- **Analytics**: Vercel Analytics or similar

---

This structure follows modern Next.js 13+ App Router best practices and provides a robust foundation for scaling your application.
