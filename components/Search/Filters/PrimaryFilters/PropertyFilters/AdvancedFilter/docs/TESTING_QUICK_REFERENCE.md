# Testing Quick Reference Card

## 🎯 Modal Closing Methods - Quick Test

| Method | Action | Expected Result | Key Indicator |
|--------|--------|-----------------|---------------|
| **Escape Key** | Press `Esc` | Modal closes | Console: "Escape key pressed, closing modal" |
| **Close Button** | Click X in header | Modal closes | Focus returns to trigger button |
| **Backdrop Click** | Click outside modal | Modal closes | Click must be on dark area |
| **Cancel Button** | Click "Cancel" | Modal closes | No filters applied |
| **Apply Filters** | Click "Apply Filters" | Modal closes | Filters applied, announcement made |

---

## ⌨️ Keyboard Navigation - Quick Test

| Navigation | Action | Expected Behavior |
|-----------|--------|-------------------|
| **Initial Focus** | Open modal | Focus on X (Close) button |
| **Tab** | Press Tab | Focus moves forward |
| **Shift+Tab** | Press Shift+Tab | Focus moves backward |
| **Forward Wrap** | Tab from last element | Wraps to first element |
| **Backward Wrap** | Shift+Tab from first | Wraps to last element |
| **Focus Return** | Close modal (any way) | Focus back to trigger button |

---

## 🎯 Focus Order (Tab Sequence)

```
1. Close Button (X) [Header]
   ↓
2. Error Dismiss (if error shown)
   ↓
3. TopSection Filters
   ↓
4. BodyLayout Filters
   ↓
5. Cancel Button [Footer]
   ↓
6. Reset All Button [Footer]
   ↓
7. Apply Filters Button [Footer]
   ↓
   [Wraps back to 1]
```

---

## ✅ 5-Minute Smoke Test

Quick test sequence to verify all core functionality:

```bash
1. Click Advanced Filter button          → Modal opens
2. Press Escape                          → Modal closes
3. Click Advanced Filter button          → Modal opens
4. Click X button                        → Modal closes
5. Click Advanced Filter button          → Modal opens
6. Click dark backdrop                   → Modal closes
7. Click Advanced Filter button          → Modal opens
8. Press Tab 3 times                     → Focus moves forward
9. Press Shift+Tab                       → Focus moves backward
10. Click Cancel                         → Modal closes
11. Click Advanced Filter button         → Modal opens
12. Click Apply Filters                  → Modal closes

✅ All tests pass = Core functionality working
```

---

## 🔍 Checklist for Each Closing Method

For every closing method, verify:
- [ ] Modal closes smoothly
- [ ] Focus returns to trigger button
- [ ] No console errors
- [ ] Body scroll restored
- [ ] Modal removed from DOM
- [ ] `aria-expanded` updated on trigger

---

## 🧪 Console Commands for Testing

### Run Automated Tests
```javascript
// Load test suite first (copy modal-test-suite.js)
// Then run:
await modalTests.runAll()
```

### Individual Tests
```javascript
await modalTests.testEscapeKeyClose()
await modalTests.testCloseButtonClick()
await modalTests.testBackdropClick()
await modalTests.testTabNavigation()
await modalTests.testARIAAttributes()
```

### Manual Checks
```javascript
// Check if modal is open
document.querySelector('[data-testid="more-filters-modal-backdrop"]')

// Check body scroll lock
document.body.style.overflow  // Should be 'hidden' when modal open

// Check main content inert
document.getElementById('main-content').getAttribute('aria-hidden')  // Should be 'true'

// Check current focus
document.activeElement

// Get all focusable elements in modal
document.querySelector('[data-testid="more-filters-modal-content"]')
  .querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
```

---

## 🎨 Visual Indicators

### When Modal is Open:
- ✅ Dark backdrop visible (50% opacity)
- ✅ Modal content centered
- ✅ Close button has focus ring
- ✅ Page behind is blurred
- ✅ Scroll bar hidden

### When Modal Closes:
- ✅ Smooth fade-out animation
- ✅ Focus ring appears on trigger button
- ✅ Page scroll bar returns
- ✅ No visual artifacts remain

---

## 🚨 Common Issues to Watch For

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Focus stuck** | Can't tab through elements | Check focus trap implementation |
| **No focus return** | Focus lost after close | Verify triggerRef is passed correctly |
| **Escape not working** | Modal stays open | Check event listener registration |
| **Backdrop fails** | Click doesn't close | Verify click target matches currentTarget |
| **Body still scrolls** | Can scroll behind modal | Check overflow: hidden on body |
| **Double animations** | Jerky close animation | Multiple close calls - add debounce |

---

## 📱 Mobile Testing Quick Checks

| Check | How to Test | Expected |
|-------|-------------|----------|
| **Touch Targets** | Tap buttons | Buttons ≥ 44x44px |
| **Layout** | Resize to 375px | Modal fits viewport |
| **Backdrop Tap** | Tap outside | Modal closes |
| **Scroll** | Swipe up/down | Modal scrolls, page doesn't |
| **Keyboard** | Connect Bluetooth keyboard | Same as desktop |

---

## 🎯 Critical Accessibility Checks

```html
<!-- Modal Backdrop -->
<div 
  role="dialog"                    ✓
  aria-modal="true"                ✓
  aria-labelledby="[id]"           ✓
  aria-describedby="[id]"          ✓
>

<!-- Trigger Button -->
<button
  aria-expanded="[true/false]"     ✓
  aria-haspopup="dialog"           ✓
  aria-controls="[id]"             ✓
>

<!-- Main Content (when modal open) -->
<div id="main-content"
  aria-hidden="true"               ✓
  inert                            ✓
>
```

---

## 📊 Expected Console Output

### Normal Operation:
```
Escape key pressed, closing modal
Modal handleCloseModal called
Closing modal...
```

### No Errors:
- ❌ No "Cannot read property of undefined"
- ❌ No "Focus trap failed"
- ❌ No React warnings
- ❌ No memory leaks

---

## 🔧 Debug Mode

Enable detailed logging:
```javascript
// Add to MoreFiltersModal.tsx temporarily
console.log('Modal state:', { isOpen, mounted });
console.log('Focus trap active:', containerRef.current);
console.log('Trigger ref:', triggerRef?.current);
```

---

## ⚡ Performance Checks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Open Speed** | < 300ms | Time from click to visible |
| **Close Speed** | < 300ms | Time from action to removed |
| **Focus Time** | < 100ms | Time to focus close button |
| **Tab Response** | < 50ms | Time from Tab to focus move |

---

## 📝 Quick Test Report Template

```
Date: __________
Browser: __________
OS: __________

Closing Methods:
[✓] Escape Key
[✓] Close Button
[✓] Backdrop Click
[✓] Cancel Button
[✓] Apply Filters

Keyboard Navigation:
[✓] Initial Focus
[✓] Tab Navigation
[✓] Shift+Tab Navigation
[✓] Focus Trap
[✓] Focus Return

Accessibility:
[✓] ARIA Attributes
[✓] Screen Reader
[✓] Body Scroll Lock
[✓] Main Content Inert

Issues Found: __________
Overall: PASS / FAIL
```

---

## 🚀 Deployment Checklist

Before pushing to production:
- [ ] All closing methods tested
- [ ] All keyboard navigation tested
- [ ] ARIA attributes verified
- [ ] Screen reader tested
- [ ] Mobile tested
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Documentation updated

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `MODAL_TESTING_CHECKLIST.md` | Detailed test checklist |
| `MANUAL_TESTING_GUIDE.md` | Step-by-step guide |
| `modal-test-suite.js` | Automated tests |
| `test-runner.html` | Visual test runner |
| `MoreFiltersModal.tsx` | Modal component |
| `useFocusTrap.ts` | Focus trap hook |

---

## 💡 Pro Tips

1. **Use Browser DevTools** - Elements tab shows focus and ARIA
2. **Test with Keyboard Only** - Unplug mouse to verify full keyboard access
3. **Use Screen Reader** - Best way to verify accessibility
4. **Check Console Always** - Errors might be silent otherwise
5. **Test Edge Cases** - Rapid clicks, multiple opens, errors
6. **Mobile First** - Test responsive before desktop
7. **Document Issues** - Screenshot or record any problems
8. **Cross-Browser** - Test in Chrome, Firefox, Safari, Edge

---

**Last Updated**: October 1, 2025
**Version**: 1.0.0

