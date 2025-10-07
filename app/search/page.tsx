"use client";

import { Header } from '@/components/Layout';
import { PropertyListingsSection } from '@/components/Property';
import { Footer } from '@/components/Layout';
import { FiltersContainer, FilterProvider, useFilters } from '@/components/Search';

import { PropertyDetailsModal } from '@/components/Property';
import { usePropertyPagination } from '@/hooks';
import { useRouter } from 'next/navigation';
import { getRealPropertyData } from '@/lib';
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

  // Fetch specific property data when modal is opened
  useEffect(() => {
    if (showModal && searchParams.id) {
      console.log('Fetching property data for:', searchParams.id);
      setIsLoadingModal(true);
      getRealPropertyData(searchParams.id)
        .then((propertyData) => {
          console.log('Property data received:', propertyData);
          if (propertyData) {
            // Transform the data to match Property interface
            const transformedProperty: Property = {
              // Property Card Fields
              ListingKey: propertyData.listingKey || propertyData.mlsNumber || 'unknown',
              UnparsedAddress: `${propertyData.streetNumber || ''} ${propertyData.streetName || ''} ${propertyData.streetSuffix || ''}`.trim(),
              MLSNumber: propertyData.mlsNumber || 'unknown',
              StreetAddress: `${propertyData.streetNumber || ''} ${propertyData.streetName || ''} ${propertyData.streetSuffix || ''}`.trim(),
              Community: propertyData.community || '',
              Region: propertyData.city || '',
              City: propertyData.city || '',
              StateOrProvince: 'ON',
              ListPrice: propertyData.listPrice || 0,
              ClosePrice: undefined, // Not available in current data
              MlsStatus: propertyData.mlsStatus || 'Active',
              IsNewListing: false, // Not available in current data
              Bedrooms: propertyData.bedrooms || 0,
              Bathrooms: propertyData.bathrooms || 0,
              SquareFootage: propertyData.squareFootage || '0',
              PrimaryImageUrl: propertyData.imageUrls?.[0] || undefined,
              images: propertyData.imageUrls || [],
              OpenHouseDetails: undefined, // Not available in current data
              DaysOnMarket: 0, // Not available in current data
              ListDate: new Date().toISOString(), // Not available in current data
              PropertyType: propertyData.propertyType || 'Unknown',
              
              // Property Details Page Fields (minimal for Property Card)
              SubType: propertyData.subType || undefined,
              LotSize: propertyData.lotSize || undefined,
              Basement: undefined,
              GarageSpaces: propertyData.garages || undefined,
              PropertyAge: propertyData.propertyAge || undefined,
              Description: propertyData.publicRemarks || undefined,
              ListingEnd: undefined,
              OriginalPrice: propertyData.listPrice || undefined,
              Possession: undefined,
              PropertyClass: propertyData.propertyClass || undefined,
              Kitchens: propertyData.kitchens || undefined,
              HasFamilyRoom: false,
              HasFireplace: false,
              DriveParking: propertyData.driveParking || undefined,
              GarageParking: propertyData.garageParking || undefined,
              TotalParking: propertyData.totalParking || undefined,
              RentIncludes: undefined,
              Furnished: undefined,
              MaintenanceFee: undefined,
              FeeIncludes: undefined,
              CondoAmenities: undefined,
              Pets: undefined,
              Locker: undefined,
              Balcony: undefined,
              POTLFee: undefined,
              SwimmingPool: undefined,
              Waterfront: undefined,
              InteriorFeatures: undefined,
              ExteriorFeatures: undefined,
              OtherFeatures: undefined
            };
            setModalProperty(transformedProperty);
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
      
      {/* Property Details Modal */}
      {showModal && (
        <PropertyDetailsModal
          isOpen={true}
          propertyId={searchParams.id!}
          onClose={handleClose}
          property={modalProperty}
        />
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