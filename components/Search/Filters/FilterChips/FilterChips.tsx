'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';
import { useFilters } from '../FilterContext/FilterContext';
import { useAuth } from '@/components/Auth';
import { useSavedSearches } from '@/hooks/useUserData';
import { SaveSearchDialog } from '@/components/Auth';
import { toast } from 'sonner';

export default function FilterChips() {
  const { filters, getFilterChips, removeFilter, clearAllFilters, hasActiveFilters, countActiveFilters } = useFilters();
  const { user } = useAuth();
  const { createSavedSearch, autoSaveSearch } = useSavedSearches();
  const chips = getFilterChips();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (chips.length === 0) {
    return null;
  }

  const handleRemoveChip = (chip: any) => {
    if (chip.category === 'city' || chip.category === 'propertyType' || chip.category === 'quickFilters') {
      removeFilter(chip.category, chip.value);
    } else {
      removeFilter(chip.category);
    }
  };

  const handleSaveSearch = async (
    name: string,
    notificationSettings: { email: boolean; frequency: 'daily' | 'weekly' | 'monthly' }
  ) => {
    // Convert FilterState to SavedSearch format
    const searchCriteria = {
      location: filters.city.length > 0 ? filters.city.join(', ') : undefined,
      propertyType: filters.propertyType.length > 0 ? filters.propertyType : undefined,
      priceRange: filters.priceRange || undefined,
      bedrooms: filters.bedrooms || undefined,
      bathrooms: filters.bathrooms || undefined,
      status: filters.status || undefined,
      features: filters.quickFilters.length > 0 ? filters.quickFilters : undefined,
    };

    const result = await createSavedSearch(name, searchCriteria, notificationSettings);
    return result !== null;
  };

  const handleOpenSaveDialog = () => {
    if (!user) {
      toast.error('Please sign in to save searches');
      return;
    }
    setShowSaveDialog(true);
  };

  // Auto-save logic: when user has 3+ filters, auto-save the search
  useEffect(() => {
    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Only auto-save if user is authenticated and has 3+ filters
    if (user && countActiveFilters() >= 3) {
      // Debounce the auto-save by 2 seconds
      autoSaveTimeoutRef.current = setTimeout(() => {
        const searchCriteria = {
          location: filters.city.length > 0 ? filters.city.join(', ') : undefined,
          propertyType: filters.propertyType.length > 0 ? filters.propertyType : undefined,
          priceRange: filters.priceRange || undefined,
          bedrooms: filters.bedrooms || undefined,
          bathrooms: filters.bathrooms || undefined,
          status: filters.status || undefined,
          features: filters.quickFilters.length > 0 ? filters.quickFilters : undefined,
        };

        autoSaveSearch(searchCriteria);
      }, 2000); // 2 second debounce
    }

    // Cleanup timeout on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [user, filters, countActiveFilters, autoSaveSearch]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 py-1">
        <span className="text-sm font-medium text-gray-600 mr-2">Active filters:</span>
        
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full 
                       bg-blue-600 text-white 
                       hover:bg-blue-700 
                       transition-all duration-200"
          >
            <span>{chip.label}</span>
            <button
              onClick={() => handleRemoveChip(chip)}
              className="p-0.5 hover:bg-blue-700 rounded-full transition-colors duration-200"
              aria-label={`Remove ${chip.label} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {hasActiveFilters() && (
          <>
            <button
              onClick={handleOpenSaveDialog}
              className="ml-3 px-4 py-2 text-sm font-semibold text-white 
                         bg-gradient-to-r from-emerald-500 to-green-600 
                         hover:from-emerald-600 hover:to-green-700 
                         rounded-full shadow-md hover:shadow-lg
                         transition-all duration-300 ease-in-out 
                         border border-emerald-600 hover:border-emerald-700
                         flex items-center gap-2 group relative overflow-hidden
                         transform hover:scale-105 active:scale-95"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon with subtle animation */}
              <Save className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
              
              {/* Text with slight glow effect */}
              <span className="relative drop-shadow-sm">Save Search</span>
              
              {/* Subtle pulse effect for extra attention */}
              <div className="absolute inset-0 rounded-full bg-white/20 
                             animate-pulse opacity-30" />
            </button>
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 
                         hover:text-white hover:bg-gray-600 rounded-full 
                         transition-all duration-200"
            >
              Clear all
            </button>
          </>
        )}
      </div>

      <SaveSearchDialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        filters={filters}
        onSave={handleSaveSearch}
      />
    </>
  );
}