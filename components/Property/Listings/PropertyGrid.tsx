"use client";

import { useState } from 'react';
import { PropertyCard } from '@/components/Property';
import { PropertyDetailsModal } from '@/components/Property';
import { Property } from '@/types';
import Pagination from '@/components/ui/pagination';

interface PropertyGridProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export default function PropertyGrid({ 
  properties, 
  currentPage, 
  totalPages, 
  totalCount, 
  onPageChange 
}: PropertyGridProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing selected property to allow modal close animation
    setTimeout(() => setSelectedProperty(null), 300);
  };

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Enhanced Property Grid with improved responsive design */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {properties.map((property) => (
                <PropertyCard 
                  key={property.MLSNumber} 
                  property={property}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria to find more properties.</p>
            </div>
          )}
          
          {/* Pagination - only show if there are properties */}
          {properties.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={12}
              onPageChange={onPageChange}
              showQuickNavigation={true}
              showResultsSummary={true}
            />
          )}
        </div>
      </div>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={isModalOpen}
        property={selectedProperty || undefined}
        onClose={handleCloseModal}
      />
    </>
  );
}