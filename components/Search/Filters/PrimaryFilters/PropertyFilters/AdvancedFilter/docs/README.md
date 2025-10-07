# Advanced Filters Modal

A fully accessible, SEO-optimized, and performant modal component for advanced property filtering.

## ✨ Features

- ✅ **WCAG 2.1 AA Compliant** - Full accessibility support
- ✅ **SEO Optimized** - Semantic HTML and proper heading hierarchy
- ✅ **Mobile-First Responsive** - Works seamlessly on all devices
- ✅ **Performance Optimized** - Memoized callbacks and efficient rendering
- ✅ **Keyboard Accessible** - Complete keyboard navigation support
- ✅ **Screen Reader Friendly** - ARIA labels and live announcements
- ✅ **Error Handling** - Robust error management with user feedback
- ✅ **TypeScript** - Full type safety
- ✅ **i18n Ready** - Prepared for internationalization

## 🚀 Quick Start

```typescript
import { AdvancedFilterButton } from '@/components/Search/Filters/PrimaryFilters/PropertyFilters/AdvancedFilter';

// Basic usage - just drop it in
<AdvancedFilterButton />
```

## 📦 Components

### Main Components
- **`AdvancedFilterButton`** - Trigger button with modal
- **`MoreFiltersModal`** - Main modal component
- **`TopSection`** - Keyword search and property class selector
- **`BodyLayout`** - Grid layout for advanced filters
- **`KeywordSearchBar`** - Accessible keyword input

### Filter Components
- `SquareFootageFilter`
- `HouseStyleFilter`
- `LotFrontageFilter`
- `LotDepthFilter`
- `MaintenanceFeeFilter`
- `DaysOnMarketFilter`
- `GarageParkingFilter`
- `TotalParkingFilter`
- `BasementFeaturesFilter`
- `BasementKitchenFilter`
- `OpenHouseFilter`

## 🎯 Key Implementations

### 1. Accessibility (WCAG 2.1 AA)

#### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate through elements
- **Escape**: Close modal
- **Enter**: Submit forms, add keywords
- **Space**: Activate buttons

#### Screen Reader Support
- All interactive elements have descriptive ARIA labels
- Live announcements for dynamic changes
- Proper heading hierarchy (H1 → H2)
- Focus management and trapping

#### Touch Accessibility
- Minimum 44x44px touch targets
- `touch-manipulation` CSS for better mobile interaction
- Adequate spacing between interactive elements

### 2. SEO Best Practices

#### Semantic HTML
```typescript
<header>       // Modal header
<main>         // Main content
<footer>       // Action buttons
<section>      // Logical sections
```

#### Proper Headings
```
H1: "Advanced Property Filters"
  ├─ H2: "Keyword Search"
  └─ H2: "Property Class"
```

### 3. Performance Optimization

- **Memoization**: All callbacks use `useCallback`
- **Portal Rendering**: Renders outside DOM hierarchy
- **Conditional Rendering**: Only renders when open
- **GPU Acceleration**: CSS transforms for animations
- **Code Splitting Ready**: Can be lazy-loaded

### 4. Responsive Design

#### Breakpoints
```typescript
// Mobile-first approach
<div className="
  px-4 sm:px-6              // Padding
  text-sm sm:text-base      // Font size
  grid-cols-1 lg:grid-cols-2  // Layout
">
```

#### Adaptive Layouts
- Mobile: Single column, stacked buttons, full width
- Tablet: Larger spacing, medium sizing
- Desktop: Two columns, horizontal buttons, max-width container

## 🧪 Testing

### Accessibility Testing
```bash
# Run axe-core tests
npm run test:a11y

# Manual keyboard navigation test
# 1. Tab through all elements
# 2. Press Escape to close
# 3. Verify focus returns to trigger button
```

### Browser Testing
- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Edge (latest 2 versions)

### Device Testing
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Mobile (320px - 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (1024px+)

## 📚 Documentation

- **[BEST_PRACTICES.md](./BEST_PRACTICES.md)** - Comprehensive best practices guide
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed implementation examples

## 🔧 Advanced Usage

### With Custom Handlers

```typescript
import { MoreFiltersModal } from '@/components/Search/Filters/PrimaryFilters/PropertyFilters/AdvancedFilter';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const handleApply = () => {
    // Custom filter application logic
    console.log('Applying filters...');
  };

  const handleReset = () => {
    // Custom reset logic
    console.log('Resetting filters...');
  };

  return (
    <>
      <button ref={triggerRef} onClick={() => setIsOpen(true)}>
        Open Filters
      </button>
      
      <MoreFiltersModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={handleApply}
        onReset={handleReset}
        triggerRef={triggerRef}
      />
    </>
  );
}
```

## 🌐 Internationalization

The component is ready for i18n. All user-facing strings can be easily extracted:

```typescript
// Future implementation with next-i18next
import { useTranslation } from 'next-i18next';

const { t } = useTranslation('filters');

<h1>{t('modal.title')}</h1>
<p>{t('modal.description')}</p>
```

## ⚡ Performance Metrics

### Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms  
- **CLS**: < 0.1

### Lighthouse Scores (Target)
- **Accessibility**: 100
- **Performance**: > 90
- **Best Practices**: > 90
- **SEO**: 100

## 🐛 Common Issues

### Focus Not Trapped
**Solution**: Ensure `useFocusTrap` is properly initialized with the modal container ref.

### Screen Reader Not Announcing
**Solution**: Check that ARIA live regions are properly configured and messages are being sent.

### Background Scrolling
**Solution**: Modal automatically locks body scroll when open and restores on close.

### Mobile Keyboard Issues
**Solution**: Uses fixed positioning with proper viewport handling.

## 📋 Maintenance Checklist

### When Adding New Filters
- [ ] Add ARIA labels
- [ ] Test keyboard navigation
- [ ] Verify screen reader announcements
- [ ] Check color contrast (min 4.5:1)
- [ ] Ensure touch targets are 44x44px minimum
- [ ] Test on mobile devices
- [ ] Memoize event handlers
- [ ] Add error handling

### Regular Audits
- **Weekly**: Automated accessibility tests
- **Monthly**: Manual keyboard navigation
- **Quarterly**: Full WCAG audit
- **Annually**: Third-party accessibility review

## 🤝 Contributing

When contributing to this component:

1. **Maintain accessibility** - Run axe tests before committing
2. **Keep performance** - Memoize callbacks, avoid unnecessary renders
3. **Follow patterns** - Use existing patterns for consistency
4. **Update docs** - Keep documentation in sync with changes
5. **Test thoroughly** - Test on multiple browsers and devices

## 📞 Support

For questions or issues:
1. Check the [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
2. Review [BEST_PRACTICES.md](./BEST_PRACTICES.md)
3. Contact the development team

## 📄 License

This component is part of the property search application.

---

## Version History

### v1.0.0 (October 1, 2025)
- ✅ Initial implementation
- ✅ Full WCAG 2.1 AA compliance
- ✅ SEO optimization
- ✅ Performance optimization
- ✅ Responsive design
- ✅ Comprehensive documentation

---

**Maintained by**: Development Team  
**Last Updated**: October 1, 2025

