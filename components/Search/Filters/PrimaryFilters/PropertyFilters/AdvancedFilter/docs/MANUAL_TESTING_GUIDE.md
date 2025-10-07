# Manual Testing Guide - Advanced Filters Modal

## 📖 Overview

This guide provides detailed, step-by-step instructions for manually testing all modal closing methods and keyboard navigation features of the Advanced Filters Modal.

---

## 🎯 Prerequisites

### Required Setup
1. ✅ Application running in development mode
2. ✅ Browser DevTools open (F12)
3. ✅ Console tab visible for debug logs
4. ✅ Navigate to the property search page

### Recommended Testing Environment
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Screen Resolution**: 1920x1080 (also test at mobile sizes)
- **Keyboard**: Physical keyboard for accurate testing
- **Screen Reader** (optional): NVDA, JAWS, or VoiceOver

---

## 🧪 Testing Procedures

### Test Category 1: Modal Closing Methods

---

#### ✅ Test 1.1: Escape Key Close

**Objective**: Verify modal closes when Escape key is pressed

**Steps**:
1. Locate the **Advanced Filter button** (filter icon) in the primary filters area
2. Click the Advanced Filter button to open the modal
3. Verify the modal appears with the dark backdrop
4. Press the **Escape** key on your keyboard
5. Observe the modal behavior

**Expected Results**:
- ✅ Modal smoothly closes with animation
- ✅ Dark backdrop fades out
- ✅ Console shows: "Escape key pressed, closing modal"
- ✅ Focus returns to the Advanced Filter button
- ✅ Modal is completely removed from DOM

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 1.2: Close Button (X) Click

**Objective**: Verify modal closes when X button is clicked

**Steps**:
1. Click the Advanced Filter button to open the modal
2. Locate the **X button** in the top-right corner of the modal header
3. Hover over the X button (should see hover effect)
4. Click the X button
5. Observe the modal behavior

**Expected Results**:
- ✅ X button shows hover effect (lighter background)
- ✅ Modal closes smoothly
- ✅ Console shows: "Modal handleCloseModal called"
- ✅ Focus returns to the Advanced Filter button
- ✅ Modal is completely removed from DOM

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 1.3: Backdrop Click

**Objective**: Verify modal closes when clicking outside modal content

**Steps**:
1. Click the Advanced Filter button to open the modal
2. Identify the dark backdrop area (outside the white modal box)
3. Click on the dark backdrop area
4. **Note**: Make sure NOT to click on the modal content itself
5. Observe the modal behavior

**Expected Results**:
- ✅ Modal closes when backdrop is clicked
- ✅ Modal does NOT close when clicking inside the modal content
- ✅ Console shows: "Modal handleCloseModal called"
- ✅ Focus returns to the Advanced Filter button

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 1.4: Cancel Button Click

**Objective**: Verify modal closes when Cancel button is clicked

**Steps**:
1. Click the Advanced Filter button to open the modal
2. Scroll down to the footer section if necessary
3. Locate the **Cancel** button in the bottom-left of the footer
4. Click the Cancel button
5. Observe the modal behavior

**Expected Results**:
- ✅ Modal closes immediately
- ✅ No filters are applied
- ✅ Console shows: "Modal handleCloseModal called"
- ✅ Focus returns to the Advanced Filter button

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 1.5: Apply Filters Button Click

**Objective**: Verify modal closes when Apply Filters button is clicked

**Steps**:
1. Click the Advanced Filter button to open the modal
2. Optionally change some filter values
3. Scroll down to the footer section
4. Locate the **Apply Filters** button (blue gradient button on the right)
5. Click the Apply Filters button
6. Observe the modal behavior

**Expected Results**:
- ✅ Modal closes after applying filters
- ✅ Console shows: "Modal handleCloseModal called"
- ✅ Screen reader announces: "Filters applied successfully"
- ✅ Focus returns to the Advanced Filter button
- ✅ Filters are applied to the search (if any were changed)

**Pass/Fail**: ___________

**Notes**: _________________________________

---

### Test Category 2: Keyboard Navigation

---

#### ✅ Test 2.1: Initial Focus

**Objective**: Verify focus automatically moves to close button when modal opens

**Steps**:
1. **Before opening**: Note where your focus currently is
2. Click the Advanced Filter button
3. **Immediately** observe where the focus is
4. Look for the focus ring (blue outline) on an element

**Expected Results**:
- ✅ Focus automatically moves to the **X (Close) button** in the header
- ✅ Close button has a visible focus ring
- ✅ No need to tab to reach interactive elements

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 2.2: Tab Navigation - Forward

**Objective**: Verify Tab key moves focus forward through all elements

**Steps**:
1. Open the modal (focus should be on Close button)
2. Press **Tab** key repeatedly
3. Count the number of focusable elements
4. Observe the focus order
5. Note which elements receive focus

**Expected Focus Order**:
1. Close button (X) in header
2. All interactive elements in TopSection
3. All interactive elements in BodyLayout (filters)
4. Cancel button in footer
5. Reset All button in footer
6. Apply Filters button in footer
7. *[Should wrap back to Close button]*

**Expected Results**:
- ✅ Each Tab press moves focus to the next element
- ✅ Focus order is logical and follows visual order
- ✅ All interactive elements receive focus
- ✅ Focus ring is clearly visible on each element
- ✅ No elements are skipped

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 2.3: Shift+Tab Navigation - Backward

**Objective**: Verify Shift+Tab moves focus backward through all elements

**Steps**:
1. Open the modal (focus on Close button)
2. Press **Shift + Tab** (hold Shift, press Tab)
3. Observe where focus moves
4. Continue pressing Shift+Tab
5. Verify reverse order

**Expected Results**:
- ✅ Focus moves backward through elements
- ✅ Focus order is reverse of Tab navigation
- ✅ All elements are accessible in reverse
- ✅ Focus ring remains visible

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 2.4: Focus Trap - Forward Wrap

**Objective**: Verify focus wraps from last to first element

**Steps**:
1. Open the modal (focus on Close button)
2. Press **Tab** repeatedly until you reach the **Apply Filters** button (last element)
3. Confirm you're on Apply Filters button (blue gradient button)
4. Press **Tab** one more time
5. Observe where focus moves

**Expected Results**:
- ✅ Focus wraps back to the **Close button** (first element)
- ✅ Focus does NOT escape to page elements behind modal
- ✅ Smooth transition without visual glitch

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 2.5: Focus Trap - Backward Wrap

**Objective**: Verify focus wraps from first to last element

**Steps**:
1. Open the modal (focus on Close button - first element)
2. Immediately press **Shift + Tab**
3. Observe where focus moves

**Expected Results**:
- ✅ Focus wraps to the **Apply Filters** button (last element)
- ✅ Focus does NOT escape to page elements
- ✅ Focus trap works in both directions

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 2.6: Focus Escape Prevention

**Objective**: Verify focus cannot escape the modal

**Steps**:
1. Open the modal
2. Try to Tab to elements on the page behind the modal
3. Try clicking on page elements behind the modal
4. Verify focus stays within modal

**Expected Results**:
- ✅ Cannot tab to page elements while modal is open
- ✅ Clicking on blurred background elements does not work
- ✅ Main content has `aria-hidden="true"` and `inert` attributes
- ✅ Focus is completely trapped within modal

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 2.7: Focus Return After Close

**Objective**: Verify focus returns to trigger button after modal closes

**Steps**:
1. Note the Advanced Filter button location
2. Click the Advanced Filter button to open modal
3. Close the modal using **any method** (test each separately):
   - Press Escape
   - Click X button
   - Click backdrop
   - Click Cancel button
   - Click Apply Filters button
4. After each close, observe where focus is

**Expected Results** (for each closing method):
- ✅ Focus returns to the **Advanced Filter button**
- ✅ Advanced Filter button has visible focus ring
- ✅ User can immediately press Space/Enter to reopen modal

**Pass/Fail**: ___________

**Notes**: _________________________________

---

### Test Category 3: Accessibility Features

---

#### ✅ Test 3.1: Screen Reader Announcements

**Objective**: Verify screen reader announces modal state

**Requirements**: Screen reader enabled (NVDA/JAWS/VoiceOver)

**Steps**:
1. Enable your screen reader
2. Click the Advanced Filter button
3. Listen for announcements
4. Navigate through modal
5. Apply or close the modal

**Expected Announcements**:
- ✅ "Advanced filters modal opened" when opening
- ✅ "Advanced Property Filters, dialog" when focus enters
- ✅ "Refine your property search with detailed filter options"
- ✅ "Filters applied successfully" when applying filters
- ✅ Proper labels for all interactive elements

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 3.2: ARIA Attributes Inspection

**Objective**: Verify all required ARIA attributes are present

**Steps**:
1. Open browser DevTools (F12)
2. Open the modal
3. In Elements/Inspector tab, find the modal backdrop element
4. Inspect the following attributes

**Check These Attributes**:

**Modal Backdrop**:
```html
<div 
  role="dialog"                    ✅ Present? _____
  aria-modal="true"                ✅ Present? _____
  aria-labelledby="..."            ✅ Present? _____
  aria-describedby="..."           ✅ Present? _____
  aria-live="polite"               ✅ Present? _____
  data-testid="more-filters-modal-backdrop"
>
```

**Trigger Button**:
```html
<button
  aria-label="Open advanced property filters modal"  ✅ Present? _____
  aria-expanded="true/false"       ✅ Present? _____ (changes with state)
  aria-haspopup="dialog"           ✅ Present? _____
  aria-controls="..."              ✅ Present? _____
>
```

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 3.3: Body Scroll Lock

**Objective**: Verify page scroll is disabled when modal is open

**Steps**:
1. Make sure the page has enough content to scroll
2. Scroll the page a bit (note scroll position)
3. Open the modal
4. Try to scroll the page using:
   - Mouse wheel
   - Trackpad gestures
   - Scroll bar
   - Arrow keys (on page, not in modal)
5. Close the modal
6. Try scrolling again

**Expected Results**:
- ✅ Cannot scroll page while modal is open
- ✅ `document.body.style.overflow` is "hidden" when modal open
- ✅ Page scrolling works normally after modal closes
- ✅ Modal content can still scroll if needed
- ✅ Scroll position is maintained

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 3.4: Main Content Inert State

**Objective**: Verify main content is properly hidden from assistive tech

**Steps**:
1. Open browser DevTools
2. Open the modal
3. Find the main content element (id="main-content")
4. Inspect its attributes
5. Close modal and check again

**Expected Results**:
- ✅ When modal open: `aria-hidden="true"` on main content
- ✅ When modal open: `inert` attribute on main content
- ✅ When modal closed: Both attributes removed
- ✅ Screen reader cannot access main content when modal open

**Pass/Fail**: ___________

**Notes**: _________________________________

---

### Test Category 4: Edge Cases

---

#### ✅ Test 4.1: Rapid Escape Key Presses

**Objective**: Verify handling of multiple Escape presses

**Steps**:
1. Open the modal
2. Rapidly press **Escape** key 5-10 times
3. Check browser console for errors
4. Verify modal state

**Expected Results**:
- ✅ Modal closes on first Escape press
- ✅ No JavaScript errors in console
- ✅ No duplicate close calls
- ✅ Subsequent Escape presses are ignored gracefully

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 4.2: Rapid Button Clicks

**Objective**: Verify handling of multiple close button clicks

**Steps**:
1. Open the modal
2. Rapidly click the Close button (X) 5-10 times
3. Check browser console
4. Verify state

**Expected Results**:
- ✅ Modal closes smoothly
- ✅ No JavaScript errors
- ✅ No visual glitches
- ✅ No duplicate animations

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 4.3: Modal Reopening

**Objective**: Verify modal can be reopened after closing

**Steps**:
1. Open the modal
2. Close the modal (any method)
3. Wait 1 second
4. Open the modal again
5. Verify state is fresh

**Expected Results**:
- ✅ Modal opens successfully again
- ✅ Focus returns to Close button
- ✅ No residual state from previous session
- ✅ All animations work correctly

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 4.4: Error State Handling

**Objective**: Verify error display and dismissal

**Steps**:
1. Open the modal
2. Trigger an error (this may require specific filter combinations)
3. Observe error display
4. Test error dismissal

**Expected Results**:
- ✅ Error appears with red alert styling
- ✅ Error has AlertCircle icon
- ✅ Error has dismiss button (X)
- ✅ Error can be dismissed
- ✅ `aria-live="assertive"` on error alert
- ✅ Screen reader announces error

**Pass/Fail**: ___________

**Notes**: _________________________________

---

### Test Category 5: Responsive/Mobile Testing

---

#### ✅ Test 5.1: Mobile Touch Targets

**Objective**: Verify buttons meet minimum touch target size

**Steps**:
1. Open browser DevTools
2. Switch to mobile view (toggle device toolbar)
3. Set viewport to iPhone SE (375x667)
4. Open the modal
5. Inspect button sizes

**Expected Results**:
- ✅ All buttons are at least 44x44 pixels
- ✅ Buttons have `touch-manipulation` CSS class
- ✅ Adequate spacing between touch targets
- ✅ Easy to tap without mistakes

**Pass/Fail**: ___________

**Notes**: _________________________________

---

#### ✅ Test 5.2: Mobile Layout

**Objective**: Verify modal displays correctly on mobile

**Steps**:
1. Set viewport to mobile (375px width)
2. Open the modal
3. Check layout and spacing
4. Test scrolling

**Expected Results**:
- ✅ Modal fits viewport width
- ✅ Text is readable (not too small)
- ✅ Buttons stack vertically on mobile
- ✅ Padding is appropriate for touch
- ✅ Modal content scrolls if needed

**Pass/Fail**: ___________

**Notes**: _________________________________

---

## 📊 Test Results Summary

### Overall Statistics

- **Total Tests Completed**: _____ / 25
- **Tests Passed**: _____
- **Tests Failed**: _____
- **Success Rate**: _____%

### Critical Issues Found

1. _________________________________
2. _________________________________
3. _________________________________

### Minor Issues Found

1. _________________________________
2. _________________________________
3. _________________________________

### Recommendations

1. _________________________________
2. _________________________________
3. _________________________________

---

## 🚀 Quick Test Execution

For rapid testing, run this sequence:

1. **Open modal** → Click Advanced Filter button
2. **Test Escape** → Press Escape
3. **Reopen** → Click button again
4. **Test X button** → Click X
5. **Reopen** → Click button again
6. **Test backdrop** → Click outside modal
7. **Reopen** → Click button again
8. **Test Tab** → Press Tab 3-4 times
9. **Test Shift+Tab** → Press Shift+Tab
10. **Test Cancel** → Click Cancel button
11. **Reopen** → Click button again
12. **Test Apply** → Click Apply Filters
13. **Check console** → Verify no errors

**Expected Time**: 5-10 minutes for complete run

---

## 🔧 Automated Testing

For automated testing, use the provided test suite:

1. Open browser console (F12)
2. Load the test suite:
   ```javascript
   // Copy contents of modal-test-suite.js and paste in console
   ```
3. Run all tests:
   ```javascript
   await modalTests.runAll()
   ```
4. Review results in console

---

## 📝 Sign-Off

**Tester Name**: _________________________________

**Date**: _________________________________

**Browser**: _________________________________

**OS**: _________________________________

**Overall Assessment**: 
- ✅ PASS - Ready for production
- ⚠️ PASS WITH ISSUES - Minor issues noted
- ❌ FAIL - Critical issues found

**Additional Notes**: 

_________________________________
_________________________________
_________________________________

---

## 📚 Related Documentation

- `MODAL_TESTING_CHECKLIST.md` - Detailed checklist
- `modal-test-suite.js` - Automated test suite
- `ACCESSIBILITY_IMPROVEMENTS_2025.md` - Accessibility specs
- `MODAL_FIX_SUMMARY.md` - Implementation details
- `BEST_PRACTICES.md` - Development guidelines

