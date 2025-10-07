"use client";

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Video, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useLikedListings } from '@/hooks/useUserData';
import { Property } from '@/types';
import { toast } from 'sonner';

// Mock property images
const propertyImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', alt: 'Living Room' },
  { id: 2, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', alt: 'Kitchen' },
  { id: 3, url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop', alt: 'Bedroom' },
  { id: 4, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', alt: 'Bathroom' },
  { id: 5, url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop', alt: 'Exterior' },
  { id: 6, url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', alt: 'Balcony' },
  { id: 7, url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop', alt: 'Dining Room' },
  { id: 8, url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop', alt: 'Office' },
];

interface PropertyImageGalleryProps {
  status?: string;
  propertyType?: string;
  property?: Property;
}

export default function PropertyImageGallery({ 
  status = 'Active',
  propertyType = 'Condo Apartment',
  property
}: PropertyImageGalleryProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { likeListing, unlikeListing, checkIfLiked } = useLikedListings();

  const totalImages = propertyImages.length;
  const visibleThumbnails = propertyImages.slice(0, 6);

  // Check if property is liked whenever likedListings changes
  useEffect(() => {
    if (property?.ListingKey) {
      setIsLiked(checkIfLiked(property.ListingKey));
    }
  }, [property?.ListingKey, checkIfLiked]);

  // Handle like/unlike
  const handleLikeClick = async () => {
    if (!property?.ListingKey) return;
    
    try {
      if (isLiked) {
        const success = await unlikeListing(property.ListingKey);
        if (success) {
          setIsLiked(false);
          toast.success('Removed from liked listings');
        } else {
          toast.error('Failed to remove from liked listings');
        }
      } else {
        const success = await likeListing(property);
        if (success) {
          setIsLiked(true);
          toast.success('Added to liked listings');
        } else {
          toast.error('Failed to add to liked listings');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('An error occurred');
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <>
      <div className="w-full grid grid-cols-2 gap-3 h-[500px]">
        {/* Left Column - Main Image */}
        <div className="relative rounded-xl overflow-hidden shadow-xl group">
          <img
            src={propertyImages[0].url}
            alt={propertyImages[0].alt}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => openLightbox(0)}
          />
          
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Top Left - Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-sm rounded-lg text-white text-sm font-semibold shadow-lg border border-white/30">
              {status}
            </span>
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800 text-sm font-medium shadow-md">
              {propertyType}
            </span>
          </div>
          
          {/* Top Right - Like Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleLikeClick}
              className={`p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 shadow-lg ${
                isLiked 
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-red-500/50 scale-110' 
                  : 'bg-white/90 hover:bg-white hover:scale-105'
              }`}
              aria-label="Like property"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-gray-700'}`} />
            </button>
          </div>
          
          {/* Bottom Left - Virtual Tour Button */}
          <div className="absolute bottom-4 left-4">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 border border-white/30">
              <Video className="w-5 h-5" />
              <span>Virtual Tour</span>
            </button>
          </div>
          
          {/* Bottom Right - Expand Icon */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
              <Maximize2 className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Right Column - Image Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3">
          {visibleThumbnails.map((image, index) => (
            <div
              key={image.id}
              className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                  index === 5 ? 'blur-sm' : ''
                }`}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
              
              {/* Last image overlay */}
              {index === 5 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                  <Maximize2 className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">+{totalImages - 6}</span>
                  <span className="text-sm font-medium">More Photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 z-10 border border-white/20"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Image counter */}
          <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium border border-white/20">
            {currentImageIndex + 1} / {totalImages}
          </div>
          
          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 border border-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          {/* Main image */}
          <div className="w-full h-full flex flex-col items-center justify-center px-4 py-20">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={propertyImages[currentImageIndex].url}
                alt={propertyImages[currentImageIndex].alt}
                className="max-w-none max-h-none w-auto h-auto object-contain rounded-lg shadow-2xl"
                style={{ 
                  maxWidth: 'calc(100vw - 8rem)', 
                  maxHeight: 'calc(100vh - 12rem)',
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </div>
            <p className="text-center text-white/80 mt-4 text-lg font-medium">
              {propertyImages[currentImageIndex].alt}
            </p>
          </div>
          
          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 border border-white/20"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          {/* Thumbnail strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 max-w-4xl overflow-x-auto z-10">
            {propertyImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                  currentImageIndex === index 
                    ? 'ring-3 ring-white scale-110' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}