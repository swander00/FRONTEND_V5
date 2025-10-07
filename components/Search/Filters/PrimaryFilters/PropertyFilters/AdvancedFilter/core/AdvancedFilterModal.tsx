"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle } from 'lucide-react';
import TopSection from './TopSection';
import BodyLayout from './BodyLayout';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onApply?: () => void;
  onReset?: () => void;
}

export default function AdvancedFilterModal({ 
  isOpen, 
  onClose, 
  triggerRef,
  onApply,
  onReset 
}: AdvancedFilterModalProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Stable IDs for ARIA relationships
  const titleId = useMemo(() => 'more-filters-modal-title', []);
  const descriptionId = useMemo(() => 'more-filters-modal-description', []);
  const errorId = useMemo(() => 'more-filters-modal-error', []);

  // Focus trap hook
  const containerRef = useFocusTrap({
    isActive: isOpen,
    initialFocus: closeButtonRef,
    returnFocus: triggerRef
  });

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key press and body scroll lock
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        console.log('Escape key pressed, closing modal'); // Debug log
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      
      // Save original overflow state
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Properly handle aria-hidden for accessibility
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
        mainContent.setAttribute('inert', '');
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = originalOverflow;
        if (mainContent) {
          mainContent.removeAttribute('aria-hidden');
          mainContent.removeAttribute('inert');
        }
      };
    }
  }, [isOpen, onClose]);

  // Memoized handlers for performance
  const handleCloseModal = useCallback(() => {
    console.log('Modal handleCloseModal called'); // Debug log
    setError(null);
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  const handleApplyFilters = useCallback(() => {
    try {
      setError(null);
      
      // Call external onApply handler if provided
      if (onApply) {
        onApply();
      }
      
      // Announce success to screen readers
      const successMessage = 'Filters applied successfully';
      announceToScreenReader(successMessage);
      
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply filters. Please try again.';
      setError(errorMessage);
      announceToScreenReader(errorMessage);
    }
  }, [onApply, handleCloseModal]);

  const handleResetAll = useCallback(() => {
    try {
      setError(null);
      
      // Call external onReset handler if provided
      if (onReset) {
        onReset();
      }
      
      // Announce to screen readers
      announceToScreenReader('All filters have been reset');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset filters. Please try again.';
      setError(errorMessage);
      announceToScreenReader(errorMessage);
    }
  }, [onReset]);

  // Helper function to announce messages to screen readers
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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div 
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-live="polite"
      data-testid="more-filters-modal-backdrop"
    >
      <div 
        className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-8"
        onClick={handleBackdropClick}
      >
        <div 
          className="flex min-h-full items-start justify-center pt-4 sm:pt-8 pb-8 sm:pb-16"
          onClick={handleBackdropClick}
        >
          <div 
            ref={(el) => {
              if (el) {
                modalRef.current = el;
                containerRef.current = el;
              }
            }}
            className={`relative w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 overflow-hidden focus:outline-none ${
              isOpen 
                ? 'scale-100 opacity-100 translate-y-0' 
                : 'scale-95 opacity-0 translate-y-4'
            }`}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            data-testid="more-filters-modal-content"
          >
            {/* Semantic Header with proper heading hierarchy */}
            <header className="bg-gradient-to-r from-slate-600 via-gray-700 to-slate-800 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 id={titleId} className="text-lg sm:text-xl font-semibold text-white truncate">
                    Advanced Property Filters
                  </h1>
                  <p id={descriptionId} className="text-slate-200 text-xs sm:text-sm mt-0.5">
                    Refine your property search with detailed filter options
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={handleCloseModal}
                  className="flex-shrink-0 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-95"
                  aria-label="Close advanced filters modal"
                  type="button"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" aria-hidden="true" />
                </button>
              </div>
            </header>

            {/* Error Alert */}
            {error && (
              <div 
                role="alert" 
                aria-live="assertive"
                aria-atomic="true"
                id={errorId}
                className="mx-4 sm:mx-6 mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="flex-shrink-0 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                  aria-label="Dismiss error message"
                  type="button"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Main Content with semantic section */}
            <main className="p-4 sm:p-6" role="main">
              {/* Top Section - Full Width */}
              <section aria-label="Basic filter options">
                <TopSection />
              </section>
              
              {/* Body Layout - Two Columns */}
              <section aria-label="Advanced filter options" className="mt-4 sm:mt-0">
                <BodyLayout />
              </section>
            </main>

            {/* Semantic Footer with accessible actions */}
            <footer className="border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50/50" role="contentinfo">
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] touch-manipulation"
                  aria-label="Cancel and close advanced filters modal without applying changes"
                >
                  Cancel
                </button>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={handleResetAll}
                    type="button"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] touch-manipulation"
                    aria-label="Reset all advanced filters to their default values"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    type="button"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] touch-manipulation"
                    aria-label="Apply selected filters and update property search results"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}