'use client';

import { useState } from 'react';
import { useFilters } from '../FilterContext/FilterContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuickFilter {
  id: string;
  label: string;
  category: 'property-type' | 'features' | 'price-range' | 'location';
}

export default function QuickFiltersBar() {
  const { filters, updateFilter, removeFilter } = useFilters();
  const activeFilters = filters.quickFilters;
  const [isExpanded, setIsExpanded] = useState(false);

  const quickFilters: QuickFilter[] = [
    { id: 'detached', label: 'Detached', category: 'property-type' },
    { id: 'semi-detached', label: 'Semi-Detached', category: 'property-type' },
    { id: 'townhouse', label: 'Townhouse', category: 'property-type' },
    { id: 'condo', label: 'Condo', category: 'property-type' },
    { id: 'duplex', label: 'Duplex', category: 'property-type' },
    { id: 'three-story', label: '3-Storey', category: 'property-type' },
    { id: 'bungalow', label: 'Bungalow', category: 'property-type' },
    { id: 'basement-apt-plus', label: '+ Basement Apt', category: 'features' },
    { id: 'basement-apt', label: 'Rental Basement', category: 'features' },
    { id: 'swimming-pool', label: 'Swimming Pool', category: 'features' },
    { id: 'waterfront', label: 'Waterfront', category: 'location' },
    { id: 'cottage', label: 'Cottage', category: 'property-type' },
    { id: '3-car-garage', label: '3+ Car Garage', category: 'features' },
    { id: '50ft-lots', label: '50ft+ Lots', category: 'features' },
    { id: '2-acres', label: '2+ Acres', category: 'features' },
    { id: 'fixer-upper', label: 'Fixer-Upper', category: 'property-type' },
    { id: 'studio', label: 'Studio', category: 'property-type' },
    { id: 'luxury-homes', label: 'Luxury Homes', category: 'property-type' },
    { id: 'ravine-lot', label: 'Ravine Lot', category: 'location' },
    { id: 'price-drops', label: 'Price Drops', category: 'price-range' },
    { id: 'new-listings', label: 'New Listings', category: 'price-range' },
    { id: 'open-houses', label: 'Open Houses', category: 'price-range' },
    // New quick filter options
    { id: '60ft-lot', label: '60ft Lot', category: 'features' },
    { id: '5-acres', label: '5+ Acres', category: 'features' },
    { id: '5-bedrooms', label: '5+ Bedrooms', category: 'features' },
    { id: 'rental-condo', label: 'Rental Condo', category: 'property-type' },
    { id: 'rental-under-1500', label: 'Rental < 1500', category: 'price-range' },
    { id: 'rental-under-3000', label: 'Rental < 3000', category: 'price-range' },
    { id: 'rental', label: 'Rental', category: 'property-type' },
    { id: 'new-builds', label: 'New Builds', category: 'property-type' }
  ];

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      removeFilter('quickFilters', filterId);
    } else {
      updateFilter('quickFilters', [...activeFilters, filterId]);
    }
  };

  // Calculate how many filters to show in the first row - aim for maximum fit
  // We'll use a more dynamic approach to fit as many as possible
  const calculateFiltersPerRow = () => {
    // Estimate based on typical filter button widths and available space
    // Most filters are 2-4 words, so we estimate 80-120px per button
    // For a typical container width, we can fit around 15-18 filters
    // Use a more generous calculation to better utilize the available space
    // This will show more filters initially, making better use of the full width
    return Math.min(16, Math.floor(quickFilters.length * 0.85));
  };

  const filtersPerRow = calculateFiltersPerRow();
  const visibleFilters = isExpanded ? quickFilters : quickFilters.slice(0, filtersPerRow);
  const hasMoreFilters = quickFilters.length > filtersPerRow;

  return (
    <div className="w-full">
      {/* Container with subtle background for visual grouping */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-2 transition-all duration-200 hover:bg-gray-50/80">
        {/* Filter buttons container - now spans full width */}
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-2 justify-start">
            {visibleFilters.map((filter) => {
              const isActive = activeFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`
                    inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full
                    transition-all duration-200 cursor-pointer whitespace-nowrap
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md' 
                      : 'text-gray-700 hover:bg-blue-600 hover:text-white hover:shadow-sm border border-transparent hover:border-blue-600'
                    }
                    hover:scale-[1.02] active:scale-[0.98]
                  `}
                >
                  {filter.label}
                </button>
              );
            })}
            
            {/* Prominent expand/collapse button with clear visual separation */}
            {hasMoreFilters && (
              <>
                {/* Visual separator */}
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg
                           bg-white border-2 border-blue-200 text-blue-700 hover:text-blue-800
                           hover:bg-blue-50 hover:border-blue-300 hover:shadow-md
                           transition-all duration-200 cursor-pointer whitespace-nowrap
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show More ({quickFilters.length - filtersPerRow})
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}