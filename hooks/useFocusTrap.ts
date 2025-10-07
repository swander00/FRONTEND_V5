import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  initialFocus?: React.RefObject<HTMLElement | null>;
  returnFocus?: React.RefObject<HTMLElement | null>;
}

export function useFocusTrap({ 
  isActive, 
  initialFocus, 
  returnFocus 
}: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the modal
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Set initial focus
    const elementToFocus = initialFocus?.current || firstFocusableElement;
    if (elementToFocus) {
      elementToFocus.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab: go backwards
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement?.focus();
          }
        } else {
          // Tab: go forwards
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the previously focused element
      const elementToReturnFocus = returnFocus?.current || previousActiveElement.current;
      if (elementToReturnFocus && typeof elementToReturnFocus.focus === 'function') {
        elementToReturnFocus.focus();
      }
    };
  }, [isActive, initialFocus, returnFocus]);

  return containerRef;
}
