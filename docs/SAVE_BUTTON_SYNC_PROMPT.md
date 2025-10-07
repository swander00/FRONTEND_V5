# Implementation Prompt: Save Button Synchronization

## Objective
Implement synchronized save buttons across all property display components, similar to the like button implementation, ensuring that when a user saves a property from any location in the app, all save buttons for that property update in real-time and the property appears in the saved listings modal.

## Problem Statement
Currently, save functionality is inconsistent across components:
- PropertyCard may have save buttons with local state
- PropertyDetailsHeader has a save button but may not be synced
- PropertyInfoPopup has a save button that may not be properly integrated
- Saving a property in one location doesn't update save buttons in other locations
- The SavedListingsModal may not reflect real-time changes

## Requirements

### 1. Create Shared PropertySaveButton Component
**Location:** `components/shared/buttons/PropertySaveButton.tsx`

**Features Required:**
- Use `useSavedListings` hook from `hooks/useUserData.ts` for global state management
- Support multiple visual variants matching like button:
  - `card`: For property cards (white background with shadow)
  - `header`: For property details headers (transparent with gradient effects)
  - `popup`: For map popups (simple outline style)
  - `minimal`: For minimal UI contexts
- Support three sizes: `sm`, `md`, `lg`
- Provide toast notifications:
  - Success: "Added to saved listings" / "Removed from saved listings"
  - Error: "Failed to add/remove from saved listings"
- Handle loading states during API calls
- Accept optional `onToggle` callback prop
- Accept optional `showLabel` prop to display "Saved"/"Save" text
- Use Bookmark icon from lucide-react (filled when saved)
- Automatically sync state across all instances using `checkIfSaved()` from the hook

**Component Interface:**
```tsx
interface PropertySaveButtonProps {
  property: Property;
  variant?: 'card' | 'header' | 'popup' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  onToggle?: (isSaved: boolean) => void;
}
```

### 2. Update PropertyCard Component
**File:** `components/Property/Listings/PropertyCard/PropertyCard.tsx`

**Changes Needed:**
1. Remove any local `saved` state management
2. Remove `onSave` and `isSaved` props from PropertyCardProps interface
3. Import `PropertySaveButton` from shared buttons
4. Replace existing save button implementation with:
   ```tsx
   <PropertySaveButton 
     property={property}
     variant="card"
     size="md"
   />
   ```
5. Position it appropriately in the card layout (typically near the like button)

### 3. Update PropertyDetailsHeader Component
**File:** `components/Property/Details/PropertyDetailsHeader.tsx`

**Changes Needed:**
1. Remove any `useSavedListings` hook usage (if direct)
2. Remove `isSaved` state
3. Remove `handleSaveClick` function
4. Import `PropertySaveButton` from shared buttons
5. Replace existing save button (the Bookmark button) with:
   ```tsx
   <PropertySaveButton 
     property={property}
     variant="header"
     size="sm"
   />
   ```

### 4. Update PropertyInfoPopup Component
**File:** `components/Search/MapView/PropertyInfoPopup.tsx`

**Current State:** Has an `onSave` prop that passes to a save button

**Changes Needed:**
1. Keep the `onSave` prop for backward compatibility (it may be used for additional logic)
2. Replace the save button icon with `PropertySaveButton`:
   ```tsx
   <div className="flex-1 flex items-center justify-center h-9">
     <PropertySaveButton 
       property={property}
       variant="popup"
       size="sm"
       className="w-full h-full"
       onToggle={(isSaved) => {
         if (isSaved) onSave?.(property);
       }}
     />
   </div>
   ```

### 5. Update Exports
**Files to Update:**

**`components/shared/buttons/index.ts`:**
```tsx
export { default as PropertySaveButton } from './PropertySaveButton';
```

**`components/shared/index.ts`:**
```tsx
export { 
  // ... other exports
  PropertySaveButton
} from './buttons';
```

## Implementation Details

### Data Flow Architecture
```
User clicks save → PropertySaveButton → useSavedListings hook
                                       ↓
                        saveListing() or unsaveListing()
                                       ↓
                        userDataService (mock/real API)
                                       ↓
                        Updates savedListings state
                                       ↓
              All PropertySaveButton instances re-render
                                       ↓
              Property appears/disappears in SavedListingsModal
```

### useSavedListings Hook
**Location:** Already exists in `hooks/useUserData.ts`

**Available Methods:**
- `savedListings`: Array of saved listings
- `loading`: Boolean loading state
- `error`: String error message
- `saveListing(property, notes?, tags?)`: Async function to save
- `updateListing(listingKey, updates)`: Async function to update
- `unsaveListing(listingKey)`: Async function to unsave
- `checkIfSaved(listingKey)`: Boolean check if saved
- `refresh()`: Refresh saved listings

### Visual States

**Icon States:**
- Not Saved: Outline bookmark icon, gray color
- Saved: Filled bookmark icon, blue/yellow color (match design system)
- Loading: Disabled state with opacity
- Error: Show toast, maintain previous state

**Variant Styling:**
- `card`: Similar to PropertyLikeButton card variant
- `header`: Similar to PropertyLikeButton header variant with gradient
- `popup`: Simple outline style like PropertyLikeButton popup
- `minimal`: Transparent background

### Color Scheme
**Choose one:**
- Option A: Blue theme (matches UI) - `text-blue-500`, `fill-blue-500`
- Option B: Yellow theme (bookmark visual) - `text-yellow-500`, `fill-yellow-500`
- Recommendation: Blue to maintain consistency with UI

### Error Handling
- Handle API failures gracefully
- Show error toast notifications
- Don't change UI state on error
- Log errors to console for debugging

## Testing Checklist

### Manual Testing Steps
1. ✅ Click save on a property card
2. ✅ Open the property details modal for the same property
3. ✅ Verify the save button in the modal shows the saved state (filled bookmark)
4. ✅ Navigate to the map view and hover over the same property
5. ✅ Verify the save button in the popup shows the saved state
6. ✅ Unsave the property from any location
7. ✅ Verify all buttons update to show the unsaved state
8. ✅ Open the saved listings modal
9. ✅ Verify the property appears when saved
10. ✅ Verify the property disappears when unsaved
11. ✅ Test toast notifications appear correctly
12. ✅ Test with multiple properties simultaneously
13. ✅ Test error states (if possible to simulate)

### Expected Behavior
- All save buttons show the same state for a given property
- Saving from any location updates all buttons instantly
- Unsaving from any location updates all buttons instantly
- Toast notifications appear on save/unsave actions
- Saved properties appear in the saved listings modal
- Unsaved properties disappear from the saved listings modal
- No console errors or warnings
- Smooth animations and transitions

## Additional Considerations

### SavedListingsModal Integration
- Verify the modal refreshes when properties are saved/unsaved
- Ensure the modal displays the updated list correctly
- Test the "Remove" button in the modal updates all save buttons

### Notes and Tags Feature
The `saveListing` function supports optional `notes` and `tags`:
```tsx
saveListing(property, notes?, tags?)
```
- For now, just implement basic save functionality
- Notes and tags can be added later through the SavedListingsModal
- Document this capability for future enhancement

### Performance Optimization
- Use React.memo on PropertySaveButton if needed
- Ensure useEffect dependencies are correct
- Avoid unnecessary re-renders
- Test with multiple properties on screen

### Accessibility
- Proper ARIA labels: "Save property" / "Unsave property"
- Keyboard accessible (button element with proper handlers)
- Screen reader friendly state changes
- Clear focus indicators

## Deliverables

1. **New File:** `components/shared/buttons/PropertySaveButton.tsx`
2. **Updated:** `components/Property/Listings/PropertyCard/PropertyCard.tsx`
3. **Updated:** `components/Property/Details/PropertyDetailsHeader.tsx`
4. **Updated:** `components/Search/MapView/PropertyInfoPopup.tsx`
5. **Updated:** `components/shared/buttons/index.ts`
6. **Updated:** `components/shared/index.ts`
7. **Documentation:** `docs/SAVE_BUTTON_SYNC_IMPLEMENTATION.md` (similar to like button doc)

## Success Criteria

✅ All save buttons use the shared PropertySaveButton component
✅ Save state is synchronized across all components
✅ Toast notifications work correctly
✅ SavedListingsModal reflects changes in real-time
✅ No TypeScript errors
✅ No console warnings
✅ Build succeeds without errors
✅ Manual testing passes all checkpoints
✅ Code follows the same patterns as PropertyLikeButton
✅ Documentation is complete and clear

## Reference Implementation
Use `components/shared/buttons/PropertyLikeButton.tsx` as a template:
- Copy the structure and adapt for save functionality
- Replace Heart icon with Bookmark icon
- Replace "like" terminology with "save" terminology
- Replace red color scheme with blue color scheme
- Use `useSavedListings` instead of `useLikedListings`
- Use `saveListing`/`unsaveListing` instead of `likeListing`/`unlikeListing`
- Update toast messages accordingly

## Notes
- The `userDataService.ts` already has save functionality implemented
- The `useSavedListings` hook already exists and is fully functional
- The `SavedListingsModal` already exists and should work with this implementation
- Focus on consistency with the like button implementation
- Prioritize code reusability and maintainability
- Ensure type safety throughout

