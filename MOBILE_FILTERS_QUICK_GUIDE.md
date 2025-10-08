# Mobile Advanced Filters - Quick Reference Guide

## 🎯 What Changed

The mobile Advanced Filters now use a **categorized, collapsible layout** instead of reusing the desktop two-column design. This makes it much easier to navigate through filters on smaller screens.

## 📱 New Mobile Layout

### Structure
```
Mobile Filters Modal
  ├── 🔍 Quick Search (Always visible)
  ├── 🏷️  Transaction Type (Always visible)
  ├── 🏠 Essential Filters (Accordion)
  │   └── City, Type, Price, Beds, Baths
  └── ⚙️  Advanced Filters (Accordion)
      └── 8 Collapsible Categories
```

### Advanced Filter Categories

| # | Category | What's Inside | Icon |
|---|----------|---------------|------|
| 1 | **Keyword Search** | Search for specific features | ✅ CheckSquare |
| 2 | **Property Class** | Residential/Commercial selection | 🏢 Building |
| 3 | **Size & Dimensions** | Square footage, lot frontage, lot depth | 📐 Square |
| 4 | **House Style** | Bungalow, 2-storey, apartment, etc. | 🏠 Home |
| 5 | **Financial & Market** | Maintenance fees, days on market | 💰 DollarSign |
| 6 | **Parking Options** | Garage parking, total parking spots | 🚗 Car |
| 7 | **Basement Features** | Basement amenities & kitchen | 📦 Layers |
| 8 | **Open House** | Open house schedule filters | 📅 Calendar |

## 🎨 Design Features

### Visual Hierarchy
- **Gradient Icons**: Each category has a unique color gradient
- **Collapsible Cards**: Tap header to expand/collapse
- **One-at-a-Time**: Only one category expands at a time for clarity
- **Touch-Friendly**: All buttons are at least 48px tall
- **Smooth Animations**: 300ms transitions for expand/collapse

### Color Coding
- 🔵 Keyword: Blue → Cyan
- 🟢 Property Class: Emerald → Teal  
- 🟠 Size: Orange → Red
- 🟣 Style: Indigo → Purple
- 🟢 Financial: Green → Emerald
- 🟣 Parking: Violet → Purple
- 🟡 Basement: Amber → Orange
- 🔴 Open House: Pink → Rose

## 💡 User Experience

### How to Use
1. **Tap "All Filters"** on mobile to open the modal
2. **Scroll to "Advanced Filters"** section and tap to expand
3. **Tap any category** (e.g., "Size & Dimensions") to view its filters
4. **Select your preferences** using the filter controls
5. **Tap another category** - the previous one auto-collapses
6. **Tap "Apply Filters"** at the bottom when done

### Benefits
- ✅ **Less Cluttered** - Only see filters you're actively using
- ✅ **Easier Navigation** - Logical categories instead of random order
- ✅ **More Space** - Collapsible sections save vertical space
- ✅ **Better Touch** - Larger tap targets, easier to use with thumbs
- ✅ **Same Features** - All desktop filters are still available

## 🔧 Technical Details

### Component Location
```
components/Search/Filters/PrimaryFilters/MobileFilters/
├── MobileFiltersModal.tsx (Updated)
├── MobileAdvancedFilters.tsx (New)
├── MobileFiltersButton.tsx
└── index.ts
```

### Key Props
```tsx
// MobileAdvancedFilters doesn't take any props
<MobileAdvancedFilters />

// All filter state is managed via FilterContext
```

### State Management
- Uses `useState` for expand/collapse behavior
- Filter selections managed by `FilterContext` (unchanged)
- Only UI organization changed, not data management

## 📊 All Filters Included

### Keyword Search
- Free-form keyword search with tags
- Search for features like "pool", "corner lot", etc.

### Property Class  
- Residential Freehold
- Residential Condo
- Commercial

### Size & Dimensions
- **Square Footage**: <500 to 5000+ sq ft (10 ranges)
- **Lot Frontage**: Custom ranges in feet
- **Lot Depth**: Custom ranges in feet

### House Style
- 6 categories with 30+ styles:
  - Bungalows (Bungalow, Raised, Bungaloft)
  - Storey Homes (1.5, 2, 2.5, 3-storey)
  - Split-Level (Sidesplit, Backsplit)
  - Apartments (Apartment, 1-storey, Studio)
  - Modern (Contemporary, Chalet, Log, Garden)
  - Multilevel (Duplex, Triplex, Fourplex, Multiplex)

### Financial & Market
- **Maintenance Fee**: Custom ranges
- **Days on Market**: Filter by listing age

### Parking Options
- **Garage Parking**: Number of garage spots
- **Total Parking**: Total parking spaces

### Basement Features
- **Basement Features**: Various basement options
- **Basement Kitchen**: Kitchen in basement filter

### Open House
- Open house schedule and timing filters

## 🐛 Troubleshooting

### Filter Not Appearing?
- Make sure you're in mobile view (< 768px width)
- Check that you've tapped to expand the Advanced Filters accordion
- Try refreshing the page

### Can't See All Filters?
- Scroll within the modal (95vh height, scrollable)
- Close other categories to save space
- Only one advanced filter category can be open at a time

### Filters Not Applying?
- Tap "Apply Filters" button at bottom
- Check that you've actually selected filter options
- Filters with 0 selections won't show active badges

## 🚀 Performance

### Optimizations
- ✅ Memoized callbacks with `useCallback`
- ✅ Conditional rendering (collapsed sections don't render content)
- ✅ CSS transitions instead of JS animations
- ✅ Minimal re-renders with proper state management

## ✨ Accessibility

- ✅ ARIA labels and descriptions
- ✅ `aria-expanded` states
- ✅ `aria-controls` relationships
- ✅ `aria-hidden` for collapsed content
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader announcements

## 📝 Summary

The redesigned mobile advanced filters provide the **same powerful filtering capabilities** as desktop, but in a **mobile-optimized layout** that's:
- More organized (8 logical categories)
- More compact (collapsible sections)
- More intuitive (color-coded with icons)
- More touch-friendly (larger tap targets)
- More efficient (one category at a time)

All 11 advanced filters are still available, just better organized for mobile users! 🎉

