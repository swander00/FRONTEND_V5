# Save Search Feature Implementation

## Overview

The Save Search feature allows users to save their current search criteria for future use. It includes automatic saving when users apply 3+ filters and manual saving with custom names and notification preferences.

## Key Features

### 1. Manual Save Search
- **Save Search Button**: Appears in the filter chips area when filters are active
- **Dialog Interface**: Prompts for search name and notification preferences
- **Immediate Feedback**: Saved searches appear instantly in the Saved Searches Modal
- **Custom Naming**: Users can name their searches for easy identification

### 2. Auto-Save (3+ Filters)
- **Automatic Detection**: When a user applies 3 or more filters, the search is automatically saved
- **Special Naming**: Auto-saved searches are prefixed with `[Auto-Saved]` and include key criteria
- **Visual Indicator**: Auto-saved searches show an "Auto-Saved" badge in the modal
- **Smart Updates**: Updates the existing auto-saved search instead of creating duplicates

### 3. Overwrite Logic
- **Manual Override**: When a user manually saves a search that matches auto-saved criteria, the auto-saved search is deleted
- **No Duplicates**: Ensures only one version of a search exists (either auto-saved or manually saved)
- **Seamless Transition**: Auto-saved searches are replaced when users provide custom names

### 4. Run Saved Searches
- **One-Click Execution**: Users can run any saved search from the modal
- **Criteria Application**: Navigates to the search page with all saved criteria applied
- **Last Run Tracking**: Tracks when each search was last executed

## Components

### SaveSearchDialog
**Location**: `components/Auth/Modals/SaveSearchDialog.tsx`

Dialog component for manually saving searches with:
- Search name input
- Search criteria summary
- Email notification toggle
- Notification frequency selector (daily, weekly, monthly)

### FilterChips (Enhanced)
**Location**: `components/Search/Filters/FilterChips/FilterChips.tsx`

Enhanced with:
- "Save Search" button (visible when filters are active)
- Auto-save logic with 2-second debounce
- Automatic trigger when 3+ filters are applied

### SavedSearchesModal (Enhanced)
**Location**: `components/Auth/Modals/SavedSearchesModal.tsx`

Enhanced with:
- Auto-refresh on modal open
- "Auto-Saved" badge for auto-saved searches
- "Run Search" functionality
- Full CRUD operations (Create, Read, Update, Delete)

## Data Flow

### Manual Save
```
User applies filters → Clicks "Save Search" → Opens SaveSearchDialog 
→ Enters name & preferences → Saves to backend → Updates state 
→ Checks for matching auto-saved search → Deletes auto-saved if found
```

### Auto-Save
```
User applies 3+ filters → 2-second debounce → Checks authentication 
→ Checks for existing auto-saved search → Updates or creates auto-saved search
→ Checks for matching manual search → Skips if manual search exists
```

### Run Search
```
User clicks "Run Search" → Builds URL parameters from criteria 
→ Navigates to /search with parameters → Updates last run timestamp
```

## Backend Functions

### userDataService.ts Functions

#### `addSavedSearch(userId, name, criteria, notifications, isAutoSaved)`
Creates a new saved search and removes matching auto-saved search if manual save.

#### `upsertAutoSavedSearch(userId, criteria)`
Creates or updates an auto-saved search. Removes auto-saved search if manual version exists.

#### `searchCriteriaMatch(criteriaA, criteriaB)`
Helper function to compare two search criteria for matching.

## Types

### SavedSearch Interface
```typescript
interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  searchCriteria: {
    location?: string;
    propertyType?: string[];
    priceRange?: { min: number; max: number };
    bedrooms?: { min: number; max: number };
    bathrooms?: { min: number; max: number };
    status?: string;
    features?: string[];
  };
  createdAt: string;
  lastRunAt?: string;
  isActive: boolean;
  isAutoSaved?: boolean; // NEW: Identifies auto-saved searches
  notificationSettings?: {
    email: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}
```

## Hooks

### useSavedSearches (Enhanced)
**Location**: `hooks/useUserData.ts`

New methods:
- `autoSaveSearch(criteria)`: Auto-saves a search with smart update logic
- Enhanced `createSavedSearch` with `isAutoSaved` parameter

## Filter Context Updates

### FilterContext (Enhanced)
**Location**: `components/Search/Filters/FilterContext/FilterContext.tsx`

New method:
- `countActiveFilters()`: Returns the number of active filters (excluding status)

## User Experience

### Auto-Save Behavior
1. User selects 3 filters (e.g., City: Toronto, Type: Condo, Price: $500k-$1M)
2. After 2 seconds of no changes, search is automatically saved as:
   - Name: `[Auto-Saved] Toronto • Condo • $500,000-$1,000,000`
   - Badge: "Auto-Saved" visible in modal
3. If user adds more filters, the auto-saved search updates with new criteria

### Manual Save Overwrite
1. User has auto-saved search: `[Auto-Saved] Toronto • Condo • $500k-$1M`
2. User clicks "Save Search" and names it: "My Downtown Condos"
3. Auto-saved search is deleted
4. New manually saved search appears: "My Downtown Condos" (no badge)

### Running Searches
1. User opens Saved Searches Modal
2. Clicks "Run Search" on any saved search
3. Redirected to /search with all criteria pre-applied
4. Results immediately reflect the saved criteria

## Benefits

1. **Convenience**: Users don't lose their search criteria
2. **Smart Automation**: Auto-save prevents accidental loss of search work
3. **No Clutter**: Overwrite logic prevents duplicate searches
4. **Quick Access**: One-click execution of favorite searches
5. **Personalization**: Custom names make searches easy to identify
6. **Notifications**: Optional email alerts for new matching listings

## Future Enhancements

Potential additions:
- Share saved searches with other users
- Search templates/presets
- Advanced notification settings (e.g., price drop alerts)
- Search performance analytics (click-through rates)
- Folder/category organization for searches

