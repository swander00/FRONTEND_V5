"use client";

import { useState, useRef, useCallback } from 'react';
import { Filter } from 'lucide-react';
import { AdvancedFilterModal } from './index';

export default function AdvancedFilterButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    
    // Announce modal opening to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Advanced filters modal opened';
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log('Closing modal...'); // Debug log
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpenModal}
        type="button"
        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-blue-700 bg-blue-50/50 border border-blue-200 rounded-xl hover:bg-blue-100/70 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md font-semibold min-w-[48px] h-[48px] group relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 touch-manipulation"
        title="Open advanced property filters"
        aria-label="Open advanced property filters modal"
        aria-expanded={isModalOpen}
        aria-haspopup="dialog"
        aria-controls="more-filters-modal-title"
        data-testid="advanced-filter-button"
      >
        <Filter 
          className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" 
          aria-hidden="true" 
        />
        <span className="hidden sm:inline text-sm font-medium">
          Advanced
        </span>
        
        {/* Subtle indicator dot for enhanced visual appeal */}
        <span 
          className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
          aria-hidden="true"
        />
      </button>
      
      <AdvancedFilterModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        triggerRef={triggerRef}
      />
    </>
  );
}
