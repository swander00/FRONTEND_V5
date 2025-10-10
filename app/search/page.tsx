"use client";

import { Header } from '@/components/Layout';
import { PropertyListingsSection } from '@/components/Property';
import { Footer } from '@/components/Layout';
import { FiltersContainer, FilterProvider, useFilters } from '@/components/Search';

import { PropertyDetailsModal, PropertyDetailsModalMobile } from '@/components/Property';
import { usePropertyPagination, useIsMobile } from '@/hooks';
import { useRouter } from 'next/navigation';
import { getPropertyByMLS } from '@/lib/propertyDataService';
import { useEffect, useState } from 'react';
import { Property } from '@/types';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: {
    page?: string;
    modal?: string;
    id?: string;
  };
}

function SearchPageContent({ searchParams }: SearchPageProps) {
  const router = useRouter();
  const { filters } = useFilters();
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const showModal = searchParams.modal === 'property' && searchParams.id;
  const [modalProperty, setModalProperty] = useState<Property | undefined>(undefined);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const isMobile = useIsMobile();

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
    // Navigate back to search page without modal
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FiltersContainer />
      <PropertyListingsSection 
        initialPage={currentPage} 
      />
      <Footer />
      
      {/* Property Details Modal - Responsive */}
      {showModal && (
        isMobile ? (
          <PropertyDetailsModalMobile
            isOpen={true}
            property={modalProperty}
            onClose={handleClose}
          />
        ) : (
          <PropertyDetailsModal
            isOpen={true}
            propertyId={searchParams.id!}
            onClose={handleClose}
            property={modalProperty}
          />
        )
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <FilterProvider>
      <SearchPageContent searchParams={searchParams} />
    </FilterProvider>
  );
}