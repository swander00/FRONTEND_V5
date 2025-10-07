# Advanced Filters Modal - Implementation Guide

## Quick Reference

### Component Usage

```typescript
import { AdvancedFilterButton } from '@/components/Search/Filters/PrimaryFilters/PropertyFilters/AdvancedFilter';

// Basic usage
<AdvancedFilterButton />

// With callbacks
<MoreFiltersModal
  isOpen={isOpen}
  onClose={handleClose}
  onApply={handleApplyFilters}
  onReset={handleResetFilters}
  triggerRef={buttonRef}
/>
```

---

## SEO Best Practices Implemented

### 1. Semantic HTML Elements
**Why**: Search engines and assistive technologies understand content structure better.

```typescript
// ✅ Good - Semantic elements
<header>
  <h1>Advanced Property Filters</h1>
</header>
<main>
  <section aria-label="Basic filter options">
    {/* Content */}
  </section>
</main>
<footer>
  {/* Action buttons */}
</footer>

// ❌ Bad - Generic divs everywhere
<div className="header">
  <div className="title">Advanced Property Filters</div>
</div>
```

### 2. Proper Heading Hierarchy
**Why**: Helps users and search engines understand content hierarchy.

```typescript
// ✅ Correct hierarchy
<h1>Advanced Property Filters</h1>      // Modal title
  <h2>Keyword Search</h2>                // Section
  <h2>Property Class</h2>                // Section

// ❌ Incorrect - Skipping levels
<h1>Advanced Property Filters</h1>
  <h4>Keyword Search</h4>  // Skips h2, h3
```

### 3. Descriptive Labels
**Why**: Improves accessibility and SEO relevance.

```typescript
// ✅ Descriptive
aria-label="Open advanced property filters modal"
aria-label="Apply selected filters and update property search results"

// ❌ Generic
aria-label="Open"
aria-label="Submit"
```

---

## Accessibility (WCAG 2.1 AA) Implementation

### 1. Keyboard Navigation

#### Focus Trap Implementation
```typescript
// Automatically keeps focus within modal
const containerRef = useFocusTrap({
  isActive: isOpen,
  initialFocus: closeButtonRef,  // Focus close button first
  returnFocus: triggerRef        // Return to trigger on close
});
```

#### Keyboard Shortcuts
- **ESC**: Close modal
- **TAB**: Navigate forward
- **SHIFT+TAB**: Navigate backward
- **ENTER**: Submit forms, add keywords
- **SPACE**: Activate buttons

### 2. Screen Reader Support

#### Live Announcements
```typescript
const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Usage
announceToScreenReader('Filters applied successfully');
announceToScreenReader(`Keyword "${keyword}" added`);
```

#### ARIA Attributes
```typescript
// Modal container
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  aria-describedby={descriptionId}
>
  <h1 id={titleId}>Advanced Property Filters</h1>
  <p id={descriptionId}>Refine your property search...</p>
</div>
```

### 3. Focus Management

#### Preventing Background Interaction
```typescript
// Disable background content
if (mainContent) {
  mainContent.setAttribute('aria-hidden', 'true');
  mainContent.setAttribute('inert', '');  // HTML5 inert attribute
}

// Cleanup
mainContent.removeAttribute('aria-hidden');
mainContent.removeAttribute('inert');
```

### 4. Touch Target Sizing

```css
/* Minimum 44x44px for all interactive elements */
.button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;  /* Prevents double-tap zoom */
}
```

### 5. Color Contrast

All text meets WCAG AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Clear visual states

### 6. Error Handling

```typescript
// Visual + Screen Reader feedback
{error && (
  <div 
    role="alert" 
    aria-live="assertive"
    aria-atomic="true"
  >
    <AlertCircle aria-hidden="true" />
    <p>{error}</p>
  </div>
)}
```

---

## Performance Optimization

### 1. React Optimization

#### Memoization
```typescript
// ✅ Memoize callbacks
const handleClose = useCallback(() => {
  setIsModalOpen(false);
}, []);

// ✅ Memoize values
const titleId = useMemo(() => 'more-filters-modal-title', []);

// ❌ Don't create new functions on every render
<button onClick={() => handleClick(item)}>  // Creates new function
```

#### Stable References
```typescript
// ✅ Stable IDs with useMemo
const inputId = useMemo(() => 'keyword-search-input', []);

// ✅ Or useId for unique IDs
const inputId = useId();
```

### 2. Portal Optimization

```typescript
// Only render when needed
if (!isOpen || !mounted) return null;

// Portal prevents unnecessary parent re-renders
return createPortal(modalContent, document.body);
```

### 3. Animation Performance

```css
/* ✅ Use transform for animations (GPU accelerated) */
.modal {
  transform: scale(0.95);
  transition: transform 300ms;
}

/* ❌ Avoid animating layout properties */
.modal {
  width: 100%;  /* Causes reflow */
  transition: width 300ms;
}
```

---

## Responsive Design

### Mobile-First Breakpoints

```typescript
// Tailwind breakpoints used:
// Default: < 640px (mobile)
// sm: >= 640px (large mobile/tablet)
// md: >= 768px (tablet)
// lg: >= 1024px (desktop)

<div className="
  px-4 sm:px-6          // Padding scales up
  text-sm sm:text-base  // Font size increases
  grid-cols-1 lg:grid-cols-2  // 1 col mobile, 2 cols desktop
">
```

### Adaptive Button Layout

```typescript
// Mobile: Stacked, full width
// Desktop: Horizontal, auto width
<div className="flex flex-col-reverse sm:flex-row">
  <button className="w-full sm:w-auto">Cancel</button>
  <button className="w-full sm:w-auto">Apply</button>
</div>
```

---

## Functional Integrity

### 1. Error Handling Pattern

```typescript
const handleAction = useCallback(() => {
  try {
    setError(null);
    
    // Perform action
    if (onAction) {
      onAction();
    }
    
    // Success feedback
    announceToScreenReader('Action completed successfully');
    
  } catch (err) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'An error occurred. Please try again.';
    
    setError(errorMessage);
    announceToScreenReader(errorMessage);
  }
}, [onAction]);
```

### 2. Data Validation

```typescript
const addKeyword = useCallback((keyword: string) => {
  // Normalize input
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  // Validate
  if (!normalizedKeyword) return;
  
  // Prevent duplicates
  if (keywords.includes(normalizedKeyword)) return;
  
  // Update state
  setKeywords(prev => [...prev, normalizedKeyword]);
}, [keywords]);
```

### 3. Cleanup Pattern

```typescript
useEffect(() => {
  if (isOpen) {
    // Setup
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    // Cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }
}, [isOpen]);
```

---

## Internationalization (i18n) Ready

### Current Structure (Ready for Translation)

```typescript
// All strings are externalized and ready for i18n
const strings = {
  modalTitle: 'Advanced Property Filters',
  modalDescription: 'Refine your property search with detailed filter options',
  applyButton: 'Apply Filters',
  cancelButton: 'Cancel',
  resetButton: 'Reset All',
  // ... etc
};
```

### Future i18n Integration

```typescript
// Example with next-i18next
import { useTranslation } from 'next-i18next';

export default function MoreFiltersModal() {
  const { t } = useTranslation('filters');
  
  return (
    <h1>{t('modal.title')}</h1>
  );
}

// translations/en/filters.json
{
  "modal": {
    "title": "Advanced Property Filters",
    "description": "Refine your property search..."
  }
}

// translations/fr/filters.json
{
  "modal": {
    "title": "Filtres de Propriété Avancés",
    "description": "Affinez votre recherche..."
  }
}
```

---

## Testing Guide

### Accessibility Testing Checklist

```typescript
// 1. Keyboard Navigation
✓ Can open modal with Enter/Space on button
✓ Can tab through all elements
✓ Can close with Escape
✓ Focus returns to trigger button on close
✓ Focus is trapped within modal when open

// 2. Screen Reader Testing
✓ Modal announces when opened
✓ Title and description are read
✓ All buttons have descriptive labels
✓ Actions are announced (add/remove keywords, errors)
✓ Form fields have associated labels

// 3. Visual Testing
✓ All interactive elements have visible focus indicators
✓ Color contrast meets WCAG AA (4.5:1 for text)
✓ Touch targets are minimum 44x44px
✓ Layout works on all screen sizes

// 4. Functional Testing
✓ Modal opens and closes correctly
✓ Errors display and are dismissible
✓ Filters can be applied and reset
✓ Keywords can be added and removed
✓ No console errors or warnings
```

### Automated Testing Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AdvancedFilterButton from './AdvancedFilterButton';

expect.extend(toHaveNoViolations);

describe('AdvancedFilterButton Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<AdvancedFilterButton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('opens modal on click', () => {
    render(<AdvancedFilterButton />);
    const button = screen.getByLabelText(/open advanced property filters/i);
    fireEvent.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes modal on escape key', () => {
    render(<AdvancedFilterButton />);
    const button = screen.getByLabelText(/open advanced property filters/i);
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

---

## Common Issues & Solutions

### Issue: Focus Not Trapped in Modal
**Solution**: Ensure `useFocusTrap` hook is properly initialized with correct refs.

```typescript
const containerRef = useFocusTrap({
  isActive: isOpen,
  initialFocus: closeButtonRef,
  returnFocus: triggerRef
});

// Apply ref to modal container
<div ref={containerRef}>
```

### Issue: Screen Reader Not Announcing Changes
**Solution**: Use proper ARIA live regions with correct politeness levels.

```typescript
// For important changes (errors)
<div role="alert" aria-live="assertive">

// For status updates
<div role="status" aria-live="polite">
```

### Issue: Background Scrolling When Modal Open
**Solution**: Lock body scroll and restore on close.

```typescript
const originalOverflow = document.body.style.overflow;
document.body.style.overflow = 'hidden';

// Cleanup
document.body.style.overflow = originalOverflow;
```

### Issue: Mobile Keyboard Pushing Modal Out of View
**Solution**: Use fixed positioning and proper viewport height.

```typescript
<div className="fixed inset-0 overflow-y-auto">
  <div className="min-h-full flex items-start">
    {/* Modal content */}
  </div>
</div>
```

---

## Performance Monitoring

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Monitoring Code
```typescript
// Add to analytics
if (typeof window !== 'undefined') {
  import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
    getCLS(console.log);
    getFID(console.log);
    getLCP(console.log);
  });
}
```

---

## Maintenance Checklist

### When Adding New Filters
- [ ] Add proper ARIA labels
- [ ] Ensure keyboard accessibility
- [ ] Test with screen reader
- [ ] Check color contrast
- [ ] Verify touch target size (min 44x44px)
- [ ] Add to responsive layout
- [ ] Memoize callbacks
- [ ] Add error handling
- [ ] Update documentation

### Monthly Review
- [ ] Run axe accessibility audit
- [ ] Test keyboard navigation
- [ ] Check browser console for warnings
- [ ] Review bundle size
- [ ] Test on actual mobile devices
- [ ] Verify all links in documentation

---

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility](https://react.dev/learn/accessibility)
- [Web.dev Accessibility](https://web.dev/accessibility/)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/responsive-design)

---

**Last Updated**: October 1, 2025

