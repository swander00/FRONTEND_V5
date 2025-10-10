"use client";

import { Header } from '@/components/Layout';
import { Footer } from '@/components/Layout';
import { FiltersContainer, FilterProvider, useFilters } from '@/components/Search';
import { PropertyDetailsModalMobile } from '@/components/Property';
import { usePropertyPagination, useIsMobile } from '@/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPropertyByMLS } from '@/lib/propertyDataService';
import { useEffect, useState, useMemo } from 'react';
import { Property } from '@/types';
import { MobileMapView } from '@/components/Search/MapView/MobileMapView';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icons';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

interface MapViewPageProps {
  searchParams: {
    page?: string;
    modal?: string;
    id?: string;
  };
}

function MapViewPageContent({ searchParams }: MapViewPageProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const { filters } = useFilters();
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const showModal = searchParams.modal === 'property' && searchParams.id;
  const [modalProperty, setModalProperty] = useState<Property | undefined>(undefined);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const isMobile = useIsMobile();
  const searchTerm = urlSearchParams?.get('search');

  // Transform FilterState to FilterCriteria
  const transformedFilters = useMemo(() => ({
    city: filters.city.length > 0 ? filters.city : undefined,
    propertyType: filters.propertyType.length > 0 ? filters.propertyType : undefined,
    priceRange: filters.priceRange,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    status: filters.status ? [filters.status] : undefined,
    searchTerm: searchTerm || undefined
  }), [filters.city, filters.propertyType, filters.priceRange, filters.bedrooms, filters.bathrooms, filters.status, searchTerm]);

  // Fetch properties with pagination
  const {
    properties,
    totalCount,
    totalPages,
    isLoading,
    error,
    goToPage
  } = usePropertyPagination({
    initialPage: currentPage,
    pageSize: 100, // Load more properties for map view
    filters: transformedFilters
  });

  // Fetch specific property data when modal is opened
  useEffect(() => {
    if (showModal && searchParams.id) {
      console.log('Fetching property data for:', searchParams.id);
      setIsLoadingModal(true);
      getPropertyByMLS(searchParams.id)
        .then((propertyData) => {
          console.log('Property data received:', propertyData);
          if (propertyData) {
            // Property data is already in the correct Property interface format
            setModalProperty(propertyData);
          } else {
            setModalProperty(undefined);
          }
        })
        .catch((error) => {
          console.error('Error fetching property data:', error);
          setModalProperty(undefined);
        })
        .finally(() => {
          setIsLoadingModal(false);
        });
    } else {
      setModalProperty(undefined);
    }
  }, [showModal, searchParams.id]);

  const handleClose = () => {
    // Navigate back to map view without modal
    router.back();
  };

  // Back to search button handler
  const handleBackToSearch = () => {
    const params = new URLSearchParams(urlSearchParams?.toString() || '');
    router.push(`/search?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">Failed to load properties: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />
      <FiltersContainer />
      
      {/* Back to Search Button - Mobile Only */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <Button
          onClick={handleBackToSearch}
          variant="ghost"
          size="sm"
          className="w-full justify-start"
        >
          <Icon name="arrow-left" size="sm" className="mr-2" />
          Back to Search Results
        </Button>
      </div>

      {/* Property Count */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="text-sm text-blue-900">
          Showing <span className="font-semibold">{properties.length}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> properties
        </div>
      </div>

      {/* Map View - Full Height */}
      <div className="flex-1 relative overflow-hidden">
        {properties.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center p-4">
              <Icon name="map-pin" size="lg" className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">No properties found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <MobileMapView 
            properties={properties}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={goToPage}
          />
        )}
      </div>

      {/* Property Details Modal */}
      {showModal && (
        <PropertyDetailsModalMobile
          isOpen={true}
          property={modalProperty}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default function MapViewPage({ searchParams }: MapViewPageProps) {
  return (
    <FilterProvider>
      <MapViewPageContent searchParams={searchParams} />
    </FilterProvider>
  );
}

