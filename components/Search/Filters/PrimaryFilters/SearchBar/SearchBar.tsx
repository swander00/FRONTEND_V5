'use client';

import React, { useState, useEffect, useRef } from 'react';
import SuggestionCard from './SuggestionCard';

// Helper function to parse square footage from LivingAreaRange
const parseSquareFootage = (livingAreaRange: string | null): number => {
  if (!livingAreaRange) return 0;
  
  const parts = livingAreaRange.trim().split(/[-–]/);
  
  if (parts.length === 2) {
    const min = parseInt(parts[0].trim(), 10);
    const max = parseInt(parts[1].trim(), 10);
    
    if (!isNaN(min) && !isNaN(max)) {
      return min; // Use the minimum value for display
    }
  }
  
  const singleValue = parseInt(livingAreaRange.trim(), 10);
  if (!isNaN(singleValue)) {
    return singleValue;
  }
  
  return 0;
};

interface SearchResponse {
  properties: any[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface ListingSuggestion {
  id: string;
  type: 'listing';
  MlsNumber: string;
  address: string;
  Community: string;
  ListPrice: number;
  Bedrooms: number;
  Bathrooms: number;
  SquareFootage: number;
  ThumbnailUrl: string;
  TransactionType?: string;
  OriginalEntryTimestamp?: string;
  LivingAreaRange?: string;
}

interface FilterSuggestion {
  id: string;
  type: 'city' | 'community';
  name: string;
}

type Suggestion = ListingSuggestion | FilterSuggestion;

interface UseSearchSuggestionsReturn {
  suggestions: Suggestion[];
  isLoading: boolean;
  error: string | null;
}

const formatAddress = (property: any): string => {
  const parts: string[] = [];
  
  // Debug logging to see what data we're getting
  console.log('Formatting address for property:', {
    UnitNumber: property.UnitNumber,
    StreetNumber: property.StreetNumber, 
    StreetName: property.StreetName,
    StreetSuffix: property.StreetSuffix,
    City: property.City
  });
  
  // Add unit number if present
  if (property.UnitNumber && property.UnitNumber.trim()) {
    parts.push(property.UnitNumber.trim());
  }
  
  // Add street number
  if (property.StreetNumber && property.StreetNumber.trim()) {
    parts.push(property.StreetNumber.trim());
  }
  
  // Add street name
  if (property.StreetName && property.StreetName.trim()) {
    parts.push(property.StreetName.trim());
  }
  
  // Add street suffix
  if (property.StreetSuffix && property.StreetSuffix.trim()) {
    parts.push(property.StreetSuffix.trim());
  }
  
  // Join the street parts
  const streetAddress = parts.join(' ');
  
  // Add city if present
  if (property.City && property.City.trim()) {
    return `${streetAddress}, ${property.City.trim()}`;
  }
  
  return streetAddress;
};

const transformApiResponse = (properties: any[]): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const cities = new Set<string>();
  const communities = new Set<string>();

  // First pass: collect unique cities and communities, and create listing suggestions
  const listingSuggestions: ListingSuggestion[] = [];
  
  properties.forEach((property, index) => {
    // Debug logging to see what data we're getting
    console.log('Processing property for suggestion:', {
      ListingKey: property.ListingKey,
      LivingAreaRange: property.LivingAreaRange,
      parsedSquareFootage: parseSquareFootage(property.LivingAreaRange)
    });
    
    // Create listing suggestion
    const listingSuggestion: ListingSuggestion = {
      id: property.id || `listing-${index}`,
      type: 'listing',
      MlsNumber: property.MlsNumber || property.ListingKey || '',
      address: formatAddress(property),
      Community: property.Community || property.CityRegion || '',
      ListPrice: property.ListPrice || 0,
      Bedrooms: property.BedroomsAboveGrade || property.Bedrooms || 0,
      Bathrooms: property.Bathrooms || 0,
      SquareFootage: parseSquareFootage(property.LivingAreaRange) || 1500, // Fallback to mock data for testing
      ThumbnailUrl: property.ThumbnailUrl || '',
      TransactionType: property.TransactionType || 'For Sale',
      OriginalEntryTimestamp: property.OriginalEntryTimestamp || property.ModificationTimestamp,
      LivingAreaRange: property.LivingAreaRange || '1500-2000', // Fallback to mock data for testing
    };
    
    listingSuggestions.push(listingSuggestion);

    // Collect unique cities and communities
    if (property.City && property.City.trim()) {
      cities.add(property.City.trim());
    }
    if (property.CityRegion && property.CityRegion.trim()) {
      communities.add(property.CityRegion.trim());
    }
  });

  // Helper function to check if search term matches city/community name
  const matchesSearchTerm = (name: string, searchTerm: string): boolean => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Get the current search term from the global context or pass it as parameter
  // For now, we'll determine relevance by checking if we're in a city/community priority search
  const searchTerm = getCurrentSearchTerm(); // We need to pass this from the hook
  
  // Only add city/community filters if they actually match the search term
  const cityArray = Array.from(cities);
  const matchingCities = cityArray.filter(city => matchesSearchTerm(city, searchTerm));
  if (matchingCities.length > 0) {
    suggestions.push({
      id: `city-${matchingCities[0].toLowerCase().replace(/\s+/g, '-')}`,
      type: 'city',
      name: matchingCities[0],
    });
  }

  const communityArray = Array.from(communities);
  const matchingCommunities = communityArray.filter(community => matchesSearchTerm(community, searchTerm));
  matchingCommunities.slice(0, 3).forEach(community => {
    suggestions.push({
      id: `community-${community.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'community',
      name: community,
    });
  });

  // Add individual property listings
  const remainingSlots = 15 - suggestions.length;
  if (remainingSlots > 0) {
    suggestions.push(...listingSuggestions.slice(0, remainingSlots));
  }

  return suggestions;
};

// Helper function to get current search term - we need to modify the hook to pass this
let currentSearchTerm = '';
const getCurrentSearchTerm = () => currentSearchTerm;

const useSearchSuggestions = (query: string): UseSearchSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessfulResults, setLastSuccessfulResults] = useState<Suggestion[]>([]);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset error state
    setError(null);

    // Don't search for empty queries or queries less than 2 characters
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Set up debounced search
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        
        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        
        // Simple API call with just the query parameter
        const apiUrl = `/api/search?q=${encodeURIComponent(query)}&pageSize=12&page=1`;
        console.log('Making API call to:', apiUrl);
        
        const response = await fetch(apiUrl, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data: SearchResponse = await response.json();
        
        // Debug logging to see what we're getting from the API
        console.log('API Response data:', {
          propertiesCount: data.properties?.length || 0,
          sampleProperty: data.properties?.[0] || null,
          sampleLivingAreaRange: data.properties?.[0]?.LivingAreaRange || 'undefined'
        });
        
        // Transform properties into structured suggestions
        currentSearchTerm = query; // Set the current search term for the transformation
        const transformedSuggestions = transformApiResponse(data.properties || []);
        
        // Only update state if this request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          if (transformedSuggestions.length > 0) {
            // Found results - update both current and last successful
            setSuggestions(transformedSuggestions);
            setLastSuccessfulResults(transformedSuggestions);
          } else if (lastSuccessfulResults.length > 0 && query.length > 2) {
            // No results but we had successful results before - keep showing them
            setSuggestions(lastSuccessfulResults);
          } else {
            // No results and no previous results to fall back to
            setSuggestions([]);
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        // Only handle error if request wasn't intentionally aborted
        if (err.name !== 'AbortError') {
          setError(err.message || 'Search failed');
          setSuggestions([]);
        }
        setIsLoading(false);
      }
    }, 300);

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    error,
  };
};

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search by MLS, address, city, or community...", 
  className = "" 
}) => {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  const { suggestions, isLoading, error } = useSearchSuggestions(query);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const shouldShowDropdown = isFocused && query.length >= 2;
  
  // Debug logging to see what's happening
  console.log('SearchBar state:', { query, isFocused, shouldShowDropdown, suggestionsCount: suggestions.length, isLoading, error });

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-gray-50 hover:border-gray-400 h-[48px]"
      />
      
      {shouldShowDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-gray-500">
              Loading suggestions...
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">
              Error: {error}
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <div className="text-gray-500 text-sm mb-2 px-3 py-2 border-b border-gray-100">
                Found {suggestions.length} suggestions:
              </div>
                             {suggestions.map((suggestion) => {
                 // Debug logging to see what's being passed to SuggestionCard
                 if (suggestion.type === 'listing') {
                   console.log('Passing listing suggestion to SuggestionCard:', {
                     SquareFootage: suggestion.SquareFootage,
                     LivingAreaRange: suggestion.LivingAreaRange,
                     Bedrooms: suggestion.Bedrooms,
                     Bathrooms: suggestion.Bathrooms
                   });
                 }
                 
                 return (
                   <SuggestionCard
                     key={suggestion.id}
                     suggestion={suggestion}
                     onClick={(suggestion) => {
                       console.log('Clicked suggestion:', suggestion);
                       // Handle suggestion click here - you can add navigation logic
                     }}
                   />
                 );
               })}
            </div>
          ) : (
            <div className="p-4 text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;