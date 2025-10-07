'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  city: string[];
  propertyType: string[];
  priceRange: { min: number; max: number } | null;
  bedrooms: { min: number; max: number } | null;
  bathrooms: { min: number; max: number } | null;
  quickFilters: string[];
  status: string | null;
}

interface FilterContextType {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  removeFilter: (key: keyof FilterState, value?: any) => void;
  clearAllFilters: () => void;
  hasActiveFilters: () => boolean;
  countActiveFilters: () => number;
  getFilterChips: () => FilterChip[];
}

export interface FilterChip {
  id: string;
  label: string;
  category: keyof FilterState;
  value: any;
}

const initialState: FilterState = {
  city: [],
  propertyType: [],
  priceRange: null,
  bedrooms: null,
  bathrooms: null,
  quickFilters: [],
  status: 'buy', // Buy is selected by default
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialState);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeFilter = (key: keyof FilterState, value?: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      if (key === 'city' || key === 'propertyType' || key === 'quickFilters') {
        if (value) {
          newFilters[key] = (prev[key] as string[]).filter(item => item !== value);
        } else {
          newFilters[key] = [];
        }
      } else if (
        key === 'priceRange' ||
        key === 'bedrooms' ||
        key === 'bathrooms'
      ) {
        newFilters[key] = null;
      }
      // status is _never_ cleared here—'buy' remains unless overwritten by updateFilter

      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters(initialState);
  };

  const hasActiveFilters = () => {
    return (
      filters.city.length > 0 ||
      filters.propertyType.length > 0 ||
      filters.priceRange !== null ||
      filters.bedrooms !== null ||
      filters.bathrooms !== null ||
      filters.quickFilters.length > 0 ||
      filters.status !== null
    );
  };

  const countActiveFilters = (): number => {
    let count = 0;
    if (filters.city.length > 0) count++;
    if (filters.propertyType.length > 0) count++;
    if (filters.priceRange !== null) count++;
    if (filters.bedrooms !== null) count++;
    if (filters.bathrooms !== null) count++;
    if (filters.quickFilters.length > 0) count += filters.quickFilters.length;
    // Don't count status since it's always set to 'buy' by default
    return count;
  };

  const getFilterChips = (): FilterChip[] => {
    const chips: FilterChip[] = [];

    filters.city.forEach(city => {
      chips.push({
        id: `city-${city}`,
        label: city,
        category: 'city',
        value: city,
      });
    });

    filters.propertyType.forEach(type => {
      chips.push({
        id: `propertyType-${type}`,
        label: type,
        category: 'propertyType',
        value: type,
      });
    });

    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      const formatPrice = (price: number) => {
        if (price >= 1_000_000) {
          return `$${(price / 1_000_000).toFixed(1)}M`;
        } else if (price >= 1_000) {
          return `$${(price / 1_000).toFixed(0)}K`;
        }
        return `$${price.toLocaleString()}`;
      };
      chips.push({
        id: 'priceRange',
        label: `${formatPrice(min)} - ${formatPrice(max)}`,
        category: 'priceRange',
        value: filters.priceRange,
      });
    }

    if (filters.bedrooms) {
      const { min, max } = filters.bedrooms;
      const label =
        min === max ? `${min} bed${min !== 1 ? 's' : ''}` : `${min}-${max} beds`;
      chips.push({
        id: 'bedrooms',
        label,
        category: 'bedrooms',
        value: filters.bedrooms,
      });
    }

    if (filters.bathrooms) {
      const { min, max } = filters.bathrooms;
      const label =
        min === max ? `${min} bath${min !== 1 ? 's' : ''}` : `${min}-${max} baths`;
      chips.push({
        id: 'bathrooms',
        label,
        category: 'bathrooms',
        value: filters.bathrooms,
      });
    }

    // Quick filter label mapping
    const quickFilterLabels: Record<string, string> = {
      'detached': 'Detached',
      'semi-detached': 'Semi-Detached',
      'townhouse': 'Townhouse',
      'bungalow': 'Bungalow',
      'condo': 'Condo',
      'apartment': 'Apartment',
      'duplex': 'Duplex',
      'loft': 'Loft',
      'studio': 'Studio',
      'villa': 'Villa',
      'cottage': 'Cottage',
      'commercial': 'Commercial',
      'pool': 'Pool',
      'garage': 'Garage',
      'garden': 'Garden',
      'balcony': 'Balcony',
      'fireplace': 'Fireplace',
      'basement': 'Basement',
      'parking': 'Parking',
      'elevator': 'Elevator',
      'gym': 'Gym',
      'concierge': 'Concierge',
      'under-500k': 'Under $500K',
      '500k-1m': '$500K - $1M',
      '1m-2m': '$1M - $2M',
      'over-2m': 'Over $2M',
      'waterfront': 'Waterfront',
      'downtown': 'Downtown',
      'suburbs': 'Suburbs'
    };

    filters.quickFilters.forEach(filter => {
      chips.push({
        id: `quickFilter-${filter}`,
        label: quickFilterLabels[filter] || filter,
        category: 'quickFilters',
        value: filter,
      });
    });

    if (filters.status) {
      const statusLabel =
        filters.status === 'buy'
          ? 'Buy'
          : filters.status === 'lease'
          ? 'Lease'
          : filters.status === 'sold'
          ? 'Sold'
          : filters.status === 'leased'
          ? 'Leased'
          : filters.status === 'removed'
          ? 'Removed'
          : filters.status;
      chips.push({
        id: 'status',
        label: statusLabel,
        category: 'status',
        value: filters.status,
      });
    }

    return chips;
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        removeFilter,
        clearAllFilters,
        hasActiveFilters,
        countActiveFilters,
        getFilterChips,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
