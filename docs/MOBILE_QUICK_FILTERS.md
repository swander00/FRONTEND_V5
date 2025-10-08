# Mobile Quick Filters Documentation

## Overview

The **Mobile QuickFilters** component is a clean, spacious, touch-optimized filtering interface designed specifically for mobile devices. It replaces the desktop QuickFilters on mobile views (screens < 768px) with a simple horizontal scrollable row and an expandable "More" section for additional filters.

## Features

### 🎯 Core Features

1. **Unified Single-Row Design**
   - All filters presented in one continuous row
   - No categorization or grouping
   - Clean, spacious layout without background boxes
   - Maximum use of available screen width

2. **Horizontal Scrolling**
   - Touch-friendly horizontal scroll for the first 10 filters
   - Smooth momentum scrolling with snap behavior
   - Hidden scrollbar for cleaner appearance
   - No visual clutter or borders

3. **"More" Button Expansion**
   - First 10 filters visible in the scrollable row
   - Remaining filters accessible via "More" button
   - Accordion-style dropdown below when expanded
   - Smooth slide-down animation

4. **Simple Filter Management**
   - Toggle filters on/off with a tap
   - Active filters show blue background
   - Inactive filters show white with border
   - No complex management UI

5. **Visual Design**
   - Clean, minimal styling
   - Blue accent color for active states
   - Smooth transitions and animations
   - Touch-optimized button sizes
   - No background containers or boxes

### 🎨 Design System

#### Colors

- **Active filter**: Blue (#2563eb / blue-600)
- **Inactive filter**: White background with gray border
- **More button**: Dark gray (#111827 / gray-900)
- **Text**: Gray-700 for inactive, white for active

#### Typography

- Filter buttons: 14px, semibold
- More button: 14px, bold

#### Spacing

- Component padding: 12px horizontal, 12px vertical
- Button gaps: 8px
- Filter padding: 16px horizontal, 10px vertical
- Border radius: Full rounded (pill shape)

## Component Structure

```tsx
<MobileQuickFilters>
  └── Horizontal Scrollable Row
      ├── First 10 Filter Chips (scrollable)
      └── More Button
  
  └── Expanded Section (when More is clicked)
      └── Remaining Filter Chips (wrapped grid)
</MobileQuickFilters>
```

## Usage

### Basic Implementation

The component is already integrated into the `FiltersContainer`:

```tsx
// In FiltersContainer.tsx
import MobileQuickFilters from './QuickFilters/MobileQuickFilters';

export default function FiltersContainer() {
  return (
    <>
      {/* Desktop Filters - Hidden on mobile */}
      <div className="hidden md:block">
        {/* Desktop filters... */}
      </div>

      {/* Mobile QuickFilters - Visible only on mobile */}
      <div className="md:hidden">
        <MobileQuickFilters />
      </div>
    </>
  );
}
```

### Filter Context Integration

The component uses the FilterContext for state management:

```tsx
const { filters, updateFilter, removeFilter } = useFilters();
const activeFilters = filters.quickFilters || [];
```

## Available Filters

### All Filters (30 total)

**Visible in Main Row (First 10):**
1. Detached
2. Condo
3. Townhouse
4. Semi-Detached
5. Duplex
6. Bungalow
7. 3-Storey
8. Cottage
9. Rental Basement
10. + Basement Apt

**In "More" Section (Remaining 20):**
11. Swimming Pool
12. Waterfront
13. 3+ Car Garage
14. 50ft+ Lots
15. 2+ Acres
16. 60ft Lot
17. 5+ Acres
18. 5+ Bedrooms
19. Fixer-Upper
20. Studio
21. Luxury Homes
22. Ravine Lot
23. Price Drops
24. New Listings
25. Open Houses
26. Rental Condo
27. Rental < $1.5K
28. Rental < $3K
29. Rental
30. New Builds

## Behavior

### More Button Expansion
- Click "More" button to expand/collapse additional filters
- Smooth slide-down animation when expanding
- Button shows chevron up when expanded, down when collapsed
- Button has distinct dark styling

### Filter Selection
- Tap any filter chip to toggle it on/off
- Active filters show blue background with white text
- Inactive filters show white background with gray border and gray text
- Immediate visual feedback with scale animation

### Scrolling Behavior
- Horizontal scroll in the main row
- Smooth momentum scrolling with touch optimization
- Hidden scrollbar for cleaner appearance
- Snap-to-start behavior for better alignment

## Responsive Design

### Mobile-Only Display
- Visible on screens < 768px (Tailwind's `md:` breakpoint)
- Replaces desktop QuickFilters completely on mobile
- No overlap or duplication between mobile and desktop versions

### Touch Optimization
- Minimum 44px touch targets (Apple HIG compliant)
- Generous padding for easier tapping
- Active state scaling for haptic feedback
- Prevents accidental taps with appropriate spacing

## Accessibility

### Keyboard Navigation
- Fully keyboard accessible
- Clear focus states
- Logical tab order

### Screen Readers
- Semantic HTML structure
- Descriptive button labels
- Count indicators announced

### Visual Accessibility
- High contrast ratios
- Color is not the only differentiator
- Clear visual hierarchy

## Performance

### Optimizations
- Minimal re-renders with proper React hooks
- Efficient scroll event handling
- CSS transitions over JS animations
- Lazy rendering of collapsed categories

### Bundle Size
- Lightweight component (~8KB gzipped)
- No heavy dependencies
- Reuses existing icons from lucide-react

## Customization

### Adding New Filters

To add a new filter, update the `quickFilters` array:

```tsx
const quickFilters: QuickFilter[] = [
  // Add your new filter
  { 
    id: 'your-filter-id', 
    label: 'Your Filter Label', 
    category: 'features', // or other category
    popular: false // set to true to show in Popular
  },
  // ... existing filters
];
```

### Adding New Categories

To add a new category:

1. Add to the `categories` array:

```tsx
const categories: CategoryConfig[] = [
  // ... existing categories
  {
    id: 'your-category',
    label: 'Your Category',
    icon: YourIcon, // from lucide-react
    color: '#your-hex-color',
    gradient: 'linear-gradient(135deg, #color1 0%, #color2 100%)'
  }
];
```

2. Update the `QuickFilter` interface category type:

```tsx
interface QuickFilter {
  id: string;
  label: string;
  category: 'property-type' | 'features' | 'price-range' | 'location' | 'your-category';
  popular?: boolean;
}
```

### Styling Customization

The component uses inline styles for dynamic colors and Tailwind CSS for layout. To customize:

- **Colors**: Modify the `categories` array
- **Spacing**: Adjust Tailwind classes
- **Animations**: Modify CSS transitions in style tags
- **Shadows**: Update boxShadow values in inline styles

## Browser Support

- ✅ iOS Safari 12+
- ✅ Chrome Mobile 80+
- ✅ Firefox Mobile 80+
- ✅ Samsung Internet 12+
- ✅ Edge Mobile 80+

## Known Limitations

1. **Category Limit**: Currently supports up to 5 categories (expandable but UI may need adjustment)
2. **Filter Limit**: No hard limit, but UX optimal with 30-50 total filters
3. **Offline**: Requires JavaScript enabled
4. **Touch-Only**: Optimized for touch; desktop experience is available separately

## Future Enhancements

### Planned Features
- [ ] Search within filters
- [ ] Filter favorites/recently used
- [ ] Swipe-to-clear gesture for active filters
- [ ] Haptic feedback on iOS
- [ ] Multi-category expansion mode
- [ ] Filter presets/saved searches

### Under Consideration
- Drag-to-reorder categories
- Custom category creation
- Filter analytics/usage tracking
- Integration with search suggestions

## Testing

### Manual Testing Checklist
- [ ] Category expansion/collapse works
- [ ] Filter selection toggles correctly
- [ ] Active count updates in real-time
- [ ] Clear buttons remove correct filters
- [ ] Horizontal scrolling is smooth
- [ ] Touch targets are accessible
- [ ] No overlapping elements
- [ ] Active filters summary updates correctly

### Testing on Devices
- [ ] iPhone (various sizes)
- [ ] Android phones (various sizes)
- [ ] Tablets in portrait mode
- [ ] Small screens (< 375px width)

## Troubleshooting

### Common Issues

**Issue**: Filters not persisting
- **Solution**: Ensure FilterProvider wraps the component tree

**Issue**: Horizontal scroll not working
- **Solution**: Check for CSS overflow conflicts in parent containers

**Issue**: Categories not expanding
- **Solution**: Verify state management and click handlers

**Issue**: Active count incorrect
- **Solution**: Check that filter IDs match between definition and state

## Support

For issues, questions, or feature requests, please contact the development team or create an issue in the project repository.

---

**Last Updated**: October 8, 2025
**Version**: 1.0.0
**Author**: Development Team

