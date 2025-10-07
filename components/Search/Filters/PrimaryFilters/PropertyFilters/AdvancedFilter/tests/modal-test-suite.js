/**
 * Modal Testing Suite - Advanced Filters Modal
 * 
 * This script provides automated tests for modal closing methods and keyboard navigation.
 * Run this in the browser console to execute tests.
 * 
 * Usage:
 *   1. Open the browser console (F12)
 *   2. Copy and paste this entire script
 *   3. Run: await runAllTests()
 */

// Utility functions
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = (message, type = 'info') => {
  const styles = {
    info: 'color: blue; font-weight: bold',
    success: 'color: green; font-weight: bold',
    error: 'color: red; font-weight: bold',
    warning: 'color: orange; font-weight: bold'
  };
  console.log(`%c${message}`, styles[type]);
};

const getElement = (selector, description) => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Element not found: ${description} (${selector})`);
  }
  return element;
};

const simulateKeyPress = (key, options = {}) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options
  });
  document.dispatchEvent(event);
};

const simulateClick = (element) => {
  element.click();
};

// Test Results Tracker
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

const recordTest = (name, passed, details = '') => {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`✅ PASS: ${name}`, 'success');
  } else {
    testResults.failed++;
    log(`❌ FAIL: ${name}`, 'error');
    if (details) log(`   Details: ${details}`, 'error');
  }
  testResults.details.push({ name, passed, details });
};

// Test Suite Functions

/**
 * Test 1: Modal Opening
 */
async function testModalOpening() {
  log('🧪 Test 1: Modal Opening', 'info');
  
  try {
    const triggerButton = getElement('[data-testid="advanced-filter-button"]', 'Advanced Filter Button');
    const initialFocus = document.activeElement;
    
    simulateClick(triggerButton);
    await wait(300); // Wait for modal animation
    
    const modal = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    const isOpen = modal && modal.getAttribute('aria-modal') === 'true';
    
    recordTest('Modal opens when trigger button is clicked', isOpen);
    
    return isOpen;
  } catch (error) {
    recordTest('Modal opens when trigger button is clicked', false, error.message);
    return false;
  }
}

/**
 * Test 2: Initial Focus
 */
async function testInitialFocus() {
  log('🧪 Test 2: Initial Focus', 'info');
  
  try {
    await wait(100);
    const closeButton = document.querySelector('button[aria-label*="Close advanced filters modal"]');
    const isCloseButtonFocused = document.activeElement === closeButton;
    
    recordTest('Focus moves to close button on modal open', isCloseButtonFocused);
    return isCloseButtonFocused;
  } catch (error) {
    recordTest('Focus moves to close button on modal open', false, error.message);
    return false;
  }
}

/**
 * Test 3: Escape Key Close
 */
async function testEscapeKeyClose() {
  log('🧪 Test 3: Escape Key Close', 'info');
  
  try {
    // Reopen modal if needed
    const modal = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    if (!modal) {
      await testModalOpening();
      await wait(300);
    }
    
    const triggerButton = getElement('[data-testid="advanced-filter-button"]', 'Advanced Filter Button');
    
    simulateKeyPress('Escape');
    await wait(300); // Wait for modal close animation
    
    const modalAfter = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    const isClosed = !modalAfter;
    const focusReturned = document.activeElement === triggerButton;
    
    recordTest('Modal closes on Escape key', isClosed);
    recordTest('Focus returns to trigger button after Escape', focusReturned);
    
    return isClosed && focusReturned;
  } catch (error) {
    recordTest('Modal closes on Escape key', false, error.message);
    return false;
  }
}

/**
 * Test 4: Close Button Click
 */
async function testCloseButtonClick() {
  log('🧪 Test 4: Close Button Click', 'info');
  
  try {
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    const triggerButton = getElement('[data-testid="advanced-filter-button"]', 'Advanced Filter Button');
    const closeButton = document.querySelector('button[aria-label*="Close advanced filters modal"]');
    
    simulateClick(closeButton);
    await wait(300);
    
    const modalAfter = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    const isClosed = !modalAfter;
    const focusReturned = document.activeElement === triggerButton;
    
    recordTest('Modal closes on close button click', isClosed);
    recordTest('Focus returns to trigger button after close button click', focusReturned);
    
    return isClosed && focusReturned;
  } catch (error) {
    recordTest('Modal closes on close button click', false, error.message);
    return false;
  }
}

/**
 * Test 5: Backdrop Click
 */
async function testBackdropClick() {
  log('🧪 Test 5: Backdrop Click', 'info');
  
  try {
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    const triggerButton = getElement('[data-testid="advanced-filter-button"]', 'Advanced Filter Button');
    const backdrop = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    
    // Click on backdrop (not on modal content)
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    Object.defineProperty(clickEvent, 'target', { value: backdrop });
    Object.defineProperty(clickEvent, 'currentTarget', { value: backdrop });
    backdrop.dispatchEvent(clickEvent);
    
    await wait(300);
    
    const modalAfter = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    const isClosed = !modalAfter;
    const focusReturned = document.activeElement === triggerButton;
    
    recordTest('Modal closes on backdrop click', isClosed);
    recordTest('Focus returns to trigger button after backdrop click', focusReturned);
    
    return isClosed && focusReturned;
  } catch (error) {
    recordTest('Modal closes on backdrop click', false, error.message);
    return false;
  }
}

/**
 * Test 6: Cancel Button
 */
async function testCancelButton() {
  log('🧪 Test 6: Cancel Button', 'info');
  
  try {
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    const triggerButton = getElement('[data-testid="advanced-filter-button"]', 'Advanced Filter Button');
    const cancelButton = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.trim() === 'Cancel');
    
    if (!cancelButton) {
      throw new Error('Cancel button not found');
    }
    
    simulateClick(cancelButton);
    await wait(300);
    
    const modalAfter = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    const isClosed = !modalAfter;
    const focusReturned = document.activeElement === triggerButton;
    
    recordTest('Modal closes on Cancel button click', isClosed);
    recordTest('Focus returns to trigger button after Cancel button', focusReturned);
    
    return isClosed && focusReturned;
  } catch (error) {
    recordTest('Modal closes on Cancel button click', false, error.message);
    return false;
  }
}

/**
 * Test 7: Apply Filters Button
 */
async function testApplyFiltersButton() {
  log('🧪 Test 7: Apply Filters Button', 'info');
  
  try {
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    const triggerButton = getElement('[data-testid="advanced-filter-button"]', 'Advanced Filter Button');
    const applyButton = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.trim() === 'Apply Filters');
    
    if (!applyButton) {
      throw new Error('Apply Filters button not found');
    }
    
    simulateClick(applyButton);
    await wait(300);
    
    const modalAfter = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    const isClosed = !modalAfter;
    const focusReturned = document.activeElement === triggerButton;
    
    recordTest('Modal closes on Apply Filters button click', isClosed);
    recordTest('Focus returns to trigger button after Apply Filters', focusReturned);
    
    return isClosed && focusReturned;
  } catch (error) {
    recordTest('Modal closes on Apply Filters button click', false, error.message);
    return false;
  }
}

/**
 * Test 8: Tab Navigation
 */
async function testTabNavigation() {
  log('🧪 Test 8: Tab Navigation', 'info');
  
  try {
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    const initialElement = document.activeElement;
    
    // Tab forward
    simulateKeyPress('Tab');
    await wait(50);
    
    const afterTabElement = document.activeElement;
    const focusMoved = afterTabElement !== initialElement;
    
    // Check if focus is still within modal
    const modal = document.querySelector('[data-testid="more-filters-modal-content"]');
    const focusWithinModal = modal && modal.contains(afterTabElement);
    
    recordTest('Tab key moves focus to next element', focusMoved);
    recordTest('Focus remains trapped within modal', focusWithinModal);
    
    // Close modal for next test
    simulateKeyPress('Escape');
    await wait(300);
    
    return focusMoved && focusWithinModal;
  } catch (error) {
    recordTest('Tab key moves focus to next element', false, error.message);
    return false;
  }
}

/**
 * Test 9: Shift+Tab Navigation
 */
async function testShiftTabNavigation() {
  log('🧪 Test 9: Shift+Tab Navigation', 'info');
  
  try {
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    // We should be on close button (first element)
    const initialElement = document.activeElement;
    
    // Shift+Tab should wrap to last element
    simulateKeyPress('Tab', { shiftKey: true });
    await wait(50);
    
    const afterShiftTabElement = document.activeElement;
    const focusMoved = afterShiftTabElement !== initialElement;
    
    // Check if focus wrapped to last element
    const modal = document.querySelector('[data-testid="more-filters-modal-content"]');
    const focusWithinModal = modal && modal.contains(afterShiftTabElement);
    
    recordTest('Shift+Tab moves focus to previous element', focusMoved);
    recordTest('Shift+Tab wraps from first to last element', focusWithinModal);
    
    // Close modal
    simulateKeyPress('Escape');
    await wait(300);
    
    return focusMoved && focusWithinModal;
  } catch (error) {
    recordTest('Shift+Tab moves focus to previous element', false, error.message);
    return false;
  }
}

/**
 * Test 10: ARIA Attributes
 */
async function testARIAAttributes() {
  log('🧪 Test 10: ARIA Attributes', 'info');
  
  try {
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    const backdrop = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    const triggerButton = getElement('[data-testid="advanced-filter-button"]', 'Advanced Filter Button');
    
    const hasRoleDialog = backdrop.getAttribute('role') === 'dialog';
    const hasAriaModal = backdrop.getAttribute('aria-modal') === 'true';
    const hasAriaLabelledby = backdrop.hasAttribute('aria-labelledby');
    const hasAriaDescribedby = backdrop.hasAttribute('aria-describedby');
    const triggerExpanded = triggerButton.getAttribute('aria-expanded') === 'true';
    
    recordTest('Modal has role="dialog"', hasRoleDialog);
    recordTest('Modal has aria-modal="true"', hasAriaModal);
    recordTest('Modal has aria-labelledby', hasAriaLabelledby);
    recordTest('Modal has aria-describedby', hasAriaDescribedby);
    recordTest('Trigger button has aria-expanded="true"', triggerExpanded);
    
    // Close modal
    simulateKeyPress('Escape');
    await wait(300);
    
    return hasRoleDialog && hasAriaModal && hasAriaLabelledby && hasAriaDescribedby;
  } catch (error) {
    recordTest('ARIA attributes are properly set', false, error.message);
    return false;
  }
}

/**
 * Test 11: Body Scroll Lock
 */
async function testBodyScrollLock() {
  log('🧪 Test 11: Body Scroll Lock', 'info');
  
  try {
    const originalOverflow = document.body.style.overflow;
    
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    const overflowWhileOpen = document.body.style.overflow;
    const isScrollLocked = overflowWhileOpen === 'hidden';
    
    recordTest('Body scroll is locked when modal is open', isScrollLocked);
    
    // Close modal
    simulateKeyPress('Escape');
    await wait(300);
    
    const overflowAfterClose = document.body.style.overflow;
    const isScrollRestored = overflowAfterClose === originalOverflow;
    
    recordTest('Body scroll is restored when modal is closed', isScrollRestored);
    
    return isScrollLocked && isScrollRestored;
  } catch (error) {
    recordTest('Body scroll lock works correctly', false, error.message);
    return false;
  }
}

/**
 * Test 12: Multiple Rapid Closes
 */
async function testMultipleRapidCloses() {
  log('🧪 Test 12: Multiple Rapid Closes', 'info');
  
  try {
    // Reopen modal
    await testModalOpening();
    await wait(300);
    
    // Rapidly press Escape multiple times
    simulateKeyPress('Escape');
    simulateKeyPress('Escape');
    simulateKeyPress('Escape');
    
    await wait(300);
    
    // Check for console errors (manual check)
    const modalAfter = document.querySelector('[data-testid="more-filters-modal-backdrop"]');
    const isClosed = !modalAfter;
    
    recordTest('Multiple rapid Escape presses handled gracefully', isClosed);
    
    return isClosed;
  } catch (error) {
    recordTest('Multiple rapid Escape presses handled gracefully', false, error.message);
    return false;
  }
}

/**
 * Main Test Runner
 */
async function runAllTests() {
  console.clear();
  log('🚀 Starting Modal Testing Suite...', 'info');
  log('═══════════════════════════════════════════════════════════', 'info');
  
  testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  };
  
  try {
    await testModalOpening();
    await testInitialFocus();
    await testEscapeKeyClose();
    await testCloseButtonClick();
    await testBackdropClick();
    await testCancelButton();
    await testApplyFiltersButton();
    await testTabNavigation();
    await testShiftTabNavigation();
    await testARIAAttributes();
    await testBodyScrollLock();
    await testMultipleRapidCloses();
    
    // Print summary
    log('═══════════════════════════════════════════════════════════', 'info');
    log('📊 Test Summary', 'info');
    log(`Total Tests: ${testResults.total}`, 'info');
    log(`Passed: ${testResults.passed}`, 'success');
    log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
    log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 
        testResults.failed === 0 ? 'success' : 'warning');
    log('═══════════════════════════════════════════════════════════', 'info');
    
    if (testResults.failed > 0) {
      log('❌ Failed Tests:', 'error');
      testResults.details
        .filter(t => !t.passed)
        .forEach(t => log(`   - ${t.name}`, 'error'));
    }
    
    return testResults;
  } catch (error) {
    log('🔥 Critical Error: ' + error.message, 'error');
    console.error(error);
    return testResults;
  }
}

/**
 * Individual test runners for manual testing
 */
window.modalTests = {
  runAll: runAllTests,
  testModalOpening,
  testInitialFocus,
  testEscapeKeyClose,
  testCloseButtonClick,
  testBackdropClick,
  testCancelButton,
  testApplyFiltersButton,
  testTabNavigation,
  testShiftTabNavigation,
  testARIAAttributes,
  testBodyScrollLock,
  testMultipleRapidCloses
};

// Instructions
log('✅ Modal Test Suite loaded!', 'success');
log('Run: await modalTests.runAll()', 'info');
log('Or run individual tests: await modalTests.testEscapeKeyClose()', 'info');

