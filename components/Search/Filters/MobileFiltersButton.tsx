'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import MobileFiltersModal from '@/components/MobileFilters';
import { useFilters } from './FilterContext/FilterContext';

export default function MobileFiltersButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { countActiveFilters } = useFilters();
  const activeCount = countActiveFilters();

  return (
    <>
      {/* Mobile Filters Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <SlidersHorizontal size={20} />
        <span className="font-semibold">Filters</span>
        {activeCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-white text-purple-600 rounded-full text-xs font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile Filters Modal */}
      <MobileFiltersModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

