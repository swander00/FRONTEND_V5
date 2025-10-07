'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyGrid from './PropertyGrid';
import { MapView } from '@/components/Search';
import { PropertyCountBar } from '@/components/Property';
import { useFilters } from '@/components/Search';
import { usePropertyPagination } from '@/hooks';
import { Container } from '@/components/ui/Layout';


// Context for sharing pagination data
interface PaginationContextType {
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const PaginationContext = createContext<PaginationContextType>({
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
});

export const usePagination = () => useContext(PaginationContext);

interface PropertyListingsSectionProps {
  initialPage?: number;
}

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading properties...</p>
    </div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2"
        >
          Try Again
        </button>
      )}
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Reload Page
      </button>
    </div>
  </div>
);

export default function PropertyListingsSection({ 
  initialPage = 1
}: PropertyListingsSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('view') || 'gallery';
  const searchTerm = searchParams.get('search');
  const { filters } = useFilters();
  const [retryCount, setRetryCount] = useState(0);
  
  // Transform FilterState to FilterCriteria - memoized to prevent unnecessary re-renders
  const transformedFilters = useMemo(() => ({
    city: filters.city.length > 0 ? filters.city : undefined,
    propertyType: filters.propertyType.length > 0 ? filters.propertyType : undefined,
    priceRange: filters.priceRange,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    status: filters.status,
    searchTerm: searchTerm || undefined
  }), [filters.city, filters.propertyType, filters.priceRange, filters.bedrooms, filters.bathrooms, filters.status, searchTerm]);
  
  const {
    properties,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    isPageChanging,
    error,
    goToPage,
    refresh
  } = usePropertyPagination({
    initialPage,
    pageSize: 12,
    filters: transformedFilters
  });



  // Add a timeout for loading state - only show after initial load
  const [showTimeoutError, setShowTimeoutError] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true);
    }
    
    if (isLoading && hasInitiallyLoaded) {
      const timeout = setTimeout(() => {
        setShowTimeoutError(true);
      }, 15000); // 15 seconds timeout

      return () => clearTimeout(timeout);
    } else {
      setShowTimeoutError(false);
    }
  }, [isLoading, hasInitiallyLoaded]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setShowTimeoutError(false);
    refresh();
  };

  if (showTimeoutError) {
    return (
      <ErrorMessage 
        message="Loading is taking too long. This might be due to database connection issues." 
        onRetry={handleRetry}
      />
    );
  }

  if (isLoading && !hasInitiallyLoaded) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={`Failed to load properties: ${error}`} 
        onRetry={handleRetry}
      />
    );
  }

  return (
    <>
      <PaginationContext.Provider value={{ totalCount, currentPage, totalPages }}>
        <PropertyCountBar />
        
        {/* Search Results Header */}
        {searchTerm && (
          <div className="bg-blue-50 border-b border-blue-200">
            <Container className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Search Results for "{searchTerm}"
                    </h2>
                    <p className="text-sm text-gray-600">
                      {totalCount} {totalCount === 1 ? 'property' : 'properties'} found
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('search');
                    router.push(`/?${params.toString()}`, { scroll: false });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Search
                </button>
              </div>
            </Container>
          </div>
        )}
        
        <section className="py-8 bg-white">
          {/* Loading overlay for page changes */}
          {isPageChanging && (
            <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading page {currentPage}...</p>
              </div>
            </div>
          )}
          
          {/* Property Listings */}
          {view === 'map' ? (
            <MapView 
              properties={properties}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          ) : (
            <PropertyGrid 
              properties={properties}
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={goToPage}
            />
          )}
        </section>
      </PaginationContext.Provider>


    </>
  );
}