'use client';

import { PrimaryFilters } from './PrimaryFilters';
import QuickFilters from './QuickFilters';
import MobileQuickFilters from './QuickFilters/MobileQuickFilters';
import FilterChips from './FilterChips/FilterChips';
import MobileFiltersButton from './MobileFiltersButton';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function FiltersContainer() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Desktop Filters - Hidden on mobile */}
      <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm">
        <div className="py-3 space-y-4">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <PrimaryFilters />
          </div>
          <div className="w-full px-4 sm:px-6 lg:px-8 pt-2">
            <QuickFilters />
          </div>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <FilterChips />
          </div>
        </div>
      </div>

      {/* Mobile View - Visible only on mobile */}
      <div className="md:hidden bg-white border-b border-gray-200 shadow-sm">
        {/* Mobile Search Bar */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by location, MLS#, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
            />
          </div>
        </div>
        
        {/* Mobile Quick Filters */}
        <MobileQuickFilters />
      </div>

      {/* Mobile Filters Button */}
      <MobileFiltersButton />
    </>
  );
}