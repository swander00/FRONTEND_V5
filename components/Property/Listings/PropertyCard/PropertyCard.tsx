'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Bed, Bath, Square, ChevronLeft, ChevronRight, ParkingCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
import { Property } from '@/types';

// Shared Components
import {
  StatusBadge,
  TypeBadge as SharedTypeBadge,
  CommunityBadge as SharedCommunityBadge,
  OpenHouseBadge,
  StatusOverlay,
} from '@/components/shared';
import { ImageActionButtons, PropertyLikeButton, PropertySaveButton } from '@/components/shared/buttons';

// Hooks
import { usePropertyFields } from '@/hooks/usePropertyFields';

// Utils
import { formatPrice, getRelativeTime } from './utils';

type PropertyCardProps = {
  property: Property;
  onClick?: (property: Property) => void;
};

/**
 * Modern Property Card Component
 * A visually stunning, responsive card for displaying real estate listings
 * Works with Property data from lib/mockDataService or real API
 */
const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onClick 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use hooks to extract property data
  const { address: addr, status: statusData, price: priceData, details } = usePropertyFields(property);
  
  // Extract data from property
  const id = property.ListingKey || property.MLSNumber || '';
  const primaryImage = property.PrimaryImageUrl || '';
  const images = property.images || (primaryImage ? [primaryImage] : []);
  const status = statusData.text || 'Active';
  const type = details.propertyType || property.PropertyType || '';
  const community = addr.community;
  const hasOpenHouse = !!property.OpenHouseDetails;
  const openHouseDate = property.OpenHouseDetails;
  // Check for virtual tour - using VirtualTourURL or VirtualTourUrl fields from property
  const hasVirtualTour = !!property.VirtualTourURL || !!property.VirtualTourUrl;
  const streetAddress = addr.street || property.StreetAddress || property.UnparsedAddress || '';
  const city = addr.city || '';
  const province = addr.province || '';
  const price = priceData.amount || property.ListPrice || 0;
  const mlsNumber = property.MLSNumber || property.ListingKey || '';
  const listedDate = property.ListDate || property.OriginalEntryTimestamp || '';
  const bedrooms = details.bedrooms; // Already formatted with +
  const bathrooms = details.bathrooms;
  const squareFootage = details.squareFootage; // Already formatted with range
  const parking = details.parking; // Already formatted with +
  const salePrice = property.SalePrice || property.salePrice;
  const saleDate = property.SaleDate || property.saleDate;
  const leasePrice = property.LeasePrice || property.leasePrice;
  const leaseStartDate = property.LeaseStartDate || property.leaseStartDate;

  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex] || primaryImage;
  const isLeaseProperty = status === 'Leased' || (price < 10000 && status.toLowerCase().includes('lease'));
  const displayPrice = status === 'Sold' && salePrice 
    ? salePrice 
    : status === 'Leased' && leasePrice 
    ? leasePrice 
    : price;

  // Navigation handlers
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleViewImages = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Open image gallery modal or navigate to gallery page
    console.log('Open image gallery with', images.length, 'images');
  };

  const handleViewTour = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open virtual tour in new tab
    const tourUrl = property.VirtualTourUrl || property.VirtualTourURL;
    if (tourUrl) {
      window.open(tourUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Render overlay based on status
  const renderOverlay = () => {
    if (status === 'Sold' && salePrice && saleDate) {
      return <StatusOverlay status="sold" data={{ price: salePrice, date: saleDate }} showDetails />;
    }
    if (status === 'Leased' && leasePrice && leaseStartDate) {
      return <StatusOverlay status="leased" data={{ price: leasePrice, date: leaseStartDate }} showDetails />;
    }
    return null;
  };

  // Handler for card click
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(property);
    }
  };

  const commonClasses = "block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl";
  const commonProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  const cardContent = (
    <article 
        className={cn(
          "relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out h-full flex flex-col",
          "shadow-sm hover:shadow-2xl hover:shadow-blue-500/10",
          "border border-gray-100 hover:border-blue-200",
          "transform hover:-translate-y-2",
          status !== 'Active' && "opacity-90"
        )}
      >
        {/* Status Overlay */}
        {renderOverlay()}

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Main Image */}
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              alt={`${streetAddress} - Property Image`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
                "group-hover:scale-110"
              )}
              onLoad={() => setImageLoaded(true)}
              priority={false}
            />
            
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            )}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

          {/* Top Section - Badges */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Badge */}
              {status === 'Active' && (
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {status}
                </div>
              )}
              
              {/* Type Badge */}
              <div className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                {type}
              </div>

              {/* Open House Badge */}
              {hasOpenHouse && openHouseDate && (
                <OpenHouseBadge dateTime={openHouseDate} />
              )}
            </div>
          </div>

          {/* Action Buttons (Like & Save) */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <PropertySaveButton 
              property={property}
              variant="card"
              size="md"
            />
            <PropertyLikeButton 
              property={property}
              variant="card"
              size="md"
            />
          </div>

          {/* Image Navigation */}
          {hasMultipleImages && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {hasMultipleImages && images.length <= 5 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/60 hover:bg-white/80"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Image Action Buttons */}
          <ImageActionButtons
            imageCount={images.length}
            hasVirtualTour={hasVirtualTour}
            onImageClick={handleViewImages}
            onVirtualTourClick={handleViewTour}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-5">
          {/* Price and Community Badge */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(displayPrice, isLeaseProperty)}
            </p>
            {/* Community Badge */}
            {community && (
              <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-200 flex-shrink-0">
                📍 {community}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {addr.full || [streetAddress, city, province].filter(Boolean).join(', ')}
            </h3>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            {bedrooms && bedrooms !== '?' && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <Bed className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">{bedrooms}</span>
              </div>
            )}
            {bedrooms && bedrooms !== '?' && (bathrooms && bathrooms !== '?') && (
              <div className="w-px h-4 bg-gray-300" />
            )}
            {bathrooms && bathrooms !== '?' && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <Bath className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">{bathrooms}</span>
              </div>
            )}
            {bathrooms && bathrooms !== '?' && (squareFootage && squareFootage !== '?') && (
              <div className="w-px h-4 bg-gray-300" />
            )}
            {squareFootage && squareFootage !== '?' && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <Square className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">
                  {squareFootage} sqft
                </span>
              </div>
            )}
            {squareFootage && squareFootage !== '?' && (parking && parking !== '?') && (
              <div className="w-px h-4 bg-gray-300" />
            )}
            {parking && parking !== '?' && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <ParkingCircle className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">{parking}</span>
              </div>
            )}
          </div>

          {/* Bottom Info */}
          <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">MLS® {mlsNumber}</span>
            <span>{getRelativeTime(listedDate)}</span>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" />
        </div>
    </article>
  );

  // Return with appropriate wrapper based on onClick prop
  if (onClick) {
    return (
      <div
        onClick={handleCardClick}
        className={`${commonClasses} cursor-pointer`}
        {...commonProps}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`#property-${id}`}
      className={commonClasses}
      {...commonProps}
    >
      {cardContent}
    </Link>
  );
};

export default memo(PropertyCard);

