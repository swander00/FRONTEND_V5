# PropertyDetailsModalMobile - Usage Guide

## Overview

`PropertyDetailsModalMobile` is a dedicated mobile-optimized version of the property details modal. It provides a clean, full-width, content-focused experience designed specifically for mobile devices.

## Key Features

### ✅ Design Principles
- **No Box Components**: Flat, full-width layout without nested containers
- **Minimal Padding**: Maximum use of horizontal space for data density
- **Mobile-First**: Responsive design optimized for touch interfaces
- **Content-Focused**: Clean, uncluttered presentation

### 🖼️ Media Gallery
- Large main image with left/right carousel navigation
- Click to open full-screen gallery view
- **Badges displayed inside gallery view only** (MlsStatus, PropertyType)
- Like button (synced with user data)
- Virtual tour button (conditionally shown)
- Image counter in fullscreen view

### 🏷️ Header Section
- Street address, city, province
- List price, property taxes, tax year
- Engagement metrics: ViewCount, SaveCount, TodayViews, TodaySaves
- **No badges** (moved to gallery)
- Action buttons: Share, Save, Like (fully functional)

### ⚡ Highlights Grid
- Dense 2-3 column layout
- Displays: Bedrooms, Bathrooms, SquareFootage, PropertyType, SubType, Basement, GarageSpaces, LotSize, PropertyAge, DaysOnMarket
- No boxed background, structured spacing only
- Icon-based visual indicators

### 📝 Description Section
- Tabbed interface:
  - **Tab 1**: "About This Property" → Property Description
  - **Tab 2**: "AI Summary" → AI-generated summary (placeholder)
- Clean, readable typography

### 📊 Listing History
- Displayed as mobile-friendly cards
- Shows: ListDate, ListPrice, ClosePrice, MlsStatus, MLSNumber
- Color-coded status badges

### 📑 Property Information Sections
- **Collapsible categories** with no wrapping containers:
  - Listing Info
  - Property Details
  - Basement
  - Parking
  - Utilities
  - Lease Info
  - Condo Info
  - POTL Info
  - Pool & Waterfront
  - Features
- Each section uses existing section components
- Clean styling without cards or shadows

### 🛏️ Room Details
- Collapsible section
- Summary stats: bedrooms, bathrooms, total sqft
- Detailed room list with:
  - Room type, level, dimensions
  - Features as tags
  - Icon-based categorization

### 📞 Contact Agent
- Placed at the end of the scroll (full-width)
- Agent profile with avatar
- Stats: ratings, reviews, properties sold
- Action buttons: Call, Email, Message, Schedule Viewing
- Bold, clean design

## Usage Example

```tsx
import { PropertyDetailsModalMobile } from '@/components/Property/Details';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Property Details
      </button>

      <PropertyDetailsModalMobile
        isOpen={isOpen}
        property={selectedProperty}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

## Props Interface

```tsx
interface PropertyDetailsModalMobileProps {
  isOpen: boolean;           // Controls modal visibility
  property?: Property;       // Property data object
  onClose?: () => void;     // Callback when modal closes
}
```

## Component Architecture

### State Management
- `currentImageIndex`: Tracks carousel position
- `isFullscreenGallery`: Controls fullscreen gallery view
- `isLiked`: Synced with user's liked listings
- `descriptionTab`: Controls active description tab
- `expandedRooms`: Controls room details visibility

### Hooks Used
- `useLikedListings`: Manages like/unlike functionality
- `usePropertyRooms`: Fetches room details from database
- `toast`: User feedback for actions

### Key Functions
- `handleLikeClick()`: Toggles like status
- `goToNext()`: Navigate to next image
- `goToPrevious()`: Navigate to previous image
- `handleShare()`: Web Share API or clipboard fallback

## Styling Approach

### Tailwind Utilities
- Mobile-first responsive classes
- Minimal padding: `px-3` for content sections
- Clean borders: `border-gray-200`
- Subtle backgrounds: `bg-white`, `bg-gray-50`

### Color System
- Status badges: Green (Active), Blue (Sold), Gray (Other)
- Highlights: Unique color per category (blue, purple, orange, etc.)
- Action buttons: Semantic colors (green for call, blue for email, etc.)

## Differences from Desktop Version

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Layout | 2-column (75/25 split) | Single column, full-width |
| Badges | In header | Inside fullscreen gallery only |
| Gallery | Grid + lightbox | Carousel + fullscreen |
| Sections | Card-based | Flat, borderless |
| Contact | Right sidebar | Bottom of scroll |
| Padding | Generous (6-8px) | Minimal (3px) |
| Navigation | Modal overlay | Full-screen takeover |

## Best Practices

1. **Always pass a valid Property object** - The modal won't render without one
2. **Handle loading states** - Show a loading indicator while fetching property data
3. **Responsive testing** - Test on various mobile screen sizes (320px - 768px)
4. **Performance** - Modal is optimized for mobile but test with real devices
5. **Accessibility** - All interactive elements have proper aria labels

## Future Enhancements

- [ ] Swipe gesture support for gallery navigation
- [ ] Pull-to-refresh for data updates
- [ ] Lazy loading for images
- [ ] Share sheet integration for native platforms
- [ ] Offline support for cached properties
- [ ] Deep linking for direct property access

## Maintenance Notes

- **Self-contained**: All logic and UI within single file
- **No desktop dependencies**: Completely separate from desktop modal
- **Easy to maintain**: Clear section separation and comments
- **Tested**: No linting errors, production-ready

## Support

For issues or feature requests related to the mobile modal, please refer to the main project documentation or contact the development team.

---

**Created**: 2025-10-09  
**Version**: 1.0.0  
**Status**: Production Ready

