"use client";

import { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { PropertyDetailsModal as SharedModal } from '@/components/shared';
import PropertyDetailsHeader from './PropertyDetailsHeader';
import PropertyGallery from './PropertyGallery';
import PropertyHighlights from './PropertyHighlights';
import DescriptionCard from './cards/DescriptionCard';
import ListingHistoryCard from './cards/ListingHistoryCard';
import PropertyInformationCard from './cards/PropertyInformationCard';
import RoomDetailsCard from './cards/RoomDetailsCard';
import ContactAgentCard from './cards/ContactAgentCard';
import { usePropertyFields } from '@/hooks/usePropertyFields';
import { PropertyFieldUtils } from '@/utils/propertyFieldUtils';
import { Property } from '@/types';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  property?: Property;
  propertyId?: string;
  onClose?: () => void;
}

export default function PropertyDetailsModal({ isOpen, property, propertyId, onClose }: PropertyDetailsModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use the new property fields hook for standardized field access
  const propertyFields = usePropertyFields(property || {} as Property);


  if (!isOpen) return null;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!property) {
    return (
      <SharedModal
        open={isOpen}
        onClose={() => onClose?.()}
        title="Property not found"
        description="The requested property could not be found in our database."
      >
        <div className="text-center p-8">
          <div className="mb-4">
            {propertyId && <p className="text-sm text-gray-400">Property ID: {propertyId}</p>}
          </div>
        </div>
      </SharedModal>
    );
  }

  return (
    <SharedModal
      open={isOpen}
      onClose={() => onClose?.()}
      title=""
      showCloseButton={false}
    >
      <div className={`flex flex-col h-full ${isExpanded ? 'max-h-screen' : 'max-h-[80vh]'}`}>
        {/* Action Controls - Fixed at top */}
        <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200/60 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Property Details</h2>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleExpand}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label={isExpanded ? "Minimize" : "Expand to full screen"}
              title={isExpanded ? "Minimize" : "Expand to full screen"}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => onClose?.()}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close modal"
              title="Close"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header with controls integrated */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
            <PropertyDetailsHeader property={property} />
          </div>

          {/* Gallery Section */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-4 md:pb-6 border-b border-gray-200/60">
          <PropertyGallery
            status={property?.status || 'Active'}
            propertyType={property?.propertyType || 'Condo Apartment'}
            property={property}
          />
          </div>

          {/* Content Section */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* Highlights Card - Full width, positioned before columns */}
              <div>
                <PropertyHighlights property={property} />
              </div>
              
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
                {/* Left Column - 75% width */}
                <div className="w-full lg:w-3/4">
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    <DescriptionCard property={property} />
                    <ListingHistoryCard property={property} />
                    <PropertyInformationCard property={property} />
                    <RoomDetailsCard property={property} />
                  </div>
                </div>
                
                {/* Right Column - 25% width */}
                <div className="w-full lg:w-1/4">
                  <ContactAgentCard property={property} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SharedModal>
  );
}
