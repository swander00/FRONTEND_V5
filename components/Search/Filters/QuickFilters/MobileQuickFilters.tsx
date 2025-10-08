'use client';

import { useState, useRef } from 'react';
import { useFilters } from '../FilterContext/FilterContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuickFilter {
  id: string;
  label: string;
}

export default function MobileQuickFilters() {
  const { filters, updateFilter, removeFilter } = useFilters();
  const activeFilters = filters.quickFilters || [];
  const [showMore, setShowMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickFilters: QuickFilter[] = [
    { id: 'detached', label: 'Detached' },
    { id: 'condo', label: 'Condo' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'semi-detached', label: 'Semi-Detached' },
    { id: 'duplex', label: 'Duplex' },
    { id: 'bungalow', label: 'Bungalow' },
    { id: 'three-story', label: '3-Storey' },
    { id: 'cottage', label: 'Cottage' },
    { id: 'basement-apt', label: 'Rental Basement' },
    { id: 'basement-apt-plus', label: '+ Basement Apt' },
    { id: 'swimming-pool', label: 'Swimming Pool' },
    { id: 'waterfront', label: 'Waterfront' },
    { id: '3-car-garage', label: '3+ Car Garage' },
    { id: '50ft-lots', label: '50ft+ Lots' },
    { id: '2-acres', label: '2+ Acres' },
    { id: '60ft-lot', label: '60ft Lot' },
    { id: '5-acres', label: '5+ Acres' },
    { id: '5-bedrooms', label: '5+ Bedrooms' },
    { id: 'fixer-upper', label: 'Fixer-Upper' },
    { id: 'studio', label: 'Studio' },
    { id: 'luxury-homes', label: 'Luxury Homes' },
    { id: 'ravine-lot', label: 'Ravine Lot' },
    { id: 'price-drops', label: 'Price Drops' },
    { id: 'new-listings', label: 'New Listings' },
    { id: 'open-houses', label: 'Open Houses' },
    { id: 'rental-condo', label: 'Rental Condo' },
    { id: 'rental-under-1500', label: 'Rental < $1.5K' },
    { id: 'rental-under-3000', label: 'Rental < $3K' },
    { id: 'rental', label: 'Rental' },
    { id: 'new-builds', label: 'New Builds' },
  ];

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      removeFilter('quickFilters', filterId);
    } else {
      updateFilter('quickFilters', [...activeFilters, filterId]);
    }
  };

  // Show first 8-10 filters in the horizontal row, rest in "More"
  const visibleInRow = 10;
  const mainFilters = quickFilters.slice(0, visibleInRow);
  const moreFilters = quickFilters.slice(visibleInRow);

  return (
    <div className="w-full py-3">
      {/* Main horizontal scrollable row */}
      <div className="px-3">
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          style={{
            scrollSnapType: 'x proximity',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {mainFilters.map((filter) => {
            const isActive = activeFilters.includes(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`
                  flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold
                  transition-all duration-200 shadow-sm active:scale-95
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 border border-gray-300'
                  }
                `}
                style={{
                  scrollSnapAlign: 'start',
                }}
              >
                {filter.label}
              </button>
            );
          })}
          
          {/* More button */}
          {moreFilters.length > 0 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className={`
                flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold
                transition-all duration-200 shadow-sm active:scale-95
                flex items-center gap-2 border-2
                ${showMore 
                  ? 'bg-gray-900 text-white border-gray-900' 
                  : 'bg-white text-gray-900 border-gray-900'
                }
              `}
            >
              More
              {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded "More" filters dropdown */}
      {showMore && moreFilters.length > 0 && (
        <div className="px-3 pt-2 animate-slideDown">
          <div className="flex flex-wrap gap-2">
            {moreFilters.map((filter) => {
              const isActive = activeFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`
                    px-4 py-2.5 rounded-full text-sm font-semibold
                    transition-all duration-200 shadow-sm active:scale-95
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-300'
                    }
                  `}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hide scrollbar styling */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

