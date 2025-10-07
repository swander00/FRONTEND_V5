"use client";

import { RotateCcw } from 'lucide-react';
import { useFilters } from '../../FilterContext/FilterContext';

export default function ResetButton() {
  const { clearAllFilters, getFilterChips } = useFilters();
  
  // Get all filter chips and exclude the status filter
  const allFilterChips = getFilterChips();
  const optionalFilterChips = allFilterChips.filter(chip => chip.category !== 'status');
  const optionalFilterCount = optionalFilterChips.length;
  
  // Only show the button if there are optional filters selected
  const hasOptionalFilters = optionalFilterCount > 0;

  const handleReset = () => {
    // Clear all filters except status (which should remain as 'buy')
    clearAllFilters();
    
    // Announce reset to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `${optionalFilterCount} optional filter${optionalFilterCount !== 1 ? 's' : ''} have been reset`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  // Ghost behavior: only render when optional filters are active
  if (!hasOptionalFilters) {
    return null;
  }

  return (
    <button
      onClick={handleReset}
      type="button"
      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border border-gray-300 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md min-w-[120px] h-[48px] group relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 touch-manipulation bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:border-gray-400"
      title={`Reset ${optionalFilterCount} optional filter${optionalFilterCount !== 1 ? 's' : ''}`}
      aria-label={`Reset ${optionalFilterCount} optional filter${optionalFilterCount !== 1 ? 's' : ''}`}
      data-testid="reset-all-button"
    >
      <RotateCcw 
        className="h-4 w-4 transition-all duration-200 group-hover:rotate-180" 
        aria-hidden="true"
      />
      <span>Reset All</span>
      
      {/* Filter count badge */}
      <span 
        className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-blue-500 rounded-full transition-all duration-200 group-hover:bg-blue-600"
        aria-hidden="true"
      >
        {optionalFilterCount}
      </span>
    </button>
  );
}