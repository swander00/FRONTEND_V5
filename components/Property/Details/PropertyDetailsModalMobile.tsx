"use client";

import { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Video, 
  Share2,
  Eye,
  Bookmark,
  MapPin,
  Bed,
  Bath,
  Square,
  Home,
  Building2,
  SquareStack,
  Car,
  Calendar,
  Clock,
  FileText,
  Bot,
  History,
  Phone,
  Mail,
  MessageCircle,
  Star,
  Award
} from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/types';
import { useLikedListings } from '@/hooks/useUserData';
import { toast } from 'sonner';
import ListingInformationSection from './sections/ListingInformationSection';
import PropertyDetailsSection from './sections/PropertyDetailsSection';
import BasementSection from './sections/BasementSection';
import ParkingSection from './sections/ParkingSection';
import UtilitiesSection from './sections/UtilitiesSection';
import LeaseTermsSection from './sections/LeaseTermsSection';
import CondoInfoSection from './sections/CondoInfoSection';
import PotlSection from './sections/PotlSection';
import PoolWaterfrontSection from './sections/PoolWaterfrontSection';
import FeaturesSection from './sections/FeaturesSection';
import { usePropertyRooms } from '@/hooks/usePropertyRooms';
import type { Room } from '@/types';

// Mock property images
const propertyImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', alt: 'Living Room' },
  { id: 2, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', alt: 'Kitchen' },
  { id: 3, url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop', alt: 'Bedroom' },
  { id: 4, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', alt: 'Bathroom' },
  { id: 5, url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop', alt: 'Exterior' },
  { id: 6, url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', alt: 'Balcony' },
];

interface PropertyDetailsModalMobileProps {
  isOpen: boolean;
  property?: Property;
  onClose?: () => void;
}

type TabType = 'about' | 'ai';

export default function PropertyDetailsModalMobile({ 
  isOpen, 
  property, 
  onClose 
}: PropertyDetailsModalMobileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [descriptionTab, setDescriptionTab] = useState<TabType>('about');
  const [expandedRooms, setExpandedRooms] = useState(false);
  
  const { likeListing, unlikeListing, checkIfLiked } = useLikedListings();
  
  // Room details hook
  const { rooms, loading: roomsLoading } = usePropertyRooms(property?.MLSNumber || '');

  // Check if property is liked
  useEffect(() => {
    if (property?.ListingKey) {
      setIsLiked(checkIfLiked(property.ListingKey));
    }
  }, [property?.ListingKey, checkIfLiked]);

  if (!isOpen || !property) return null;

  // Handle like/unlike
  const handleLikeClick = async () => {
    if (!property?.ListingKey) return;
    
    try {
      if (isLiked) {
        const success = await unlikeListing(property.ListingKey);
        if (success) {
          setIsLiked(false);
          toast.success('Removed from liked listings');
        }
      } else {
        const success = await likeListing(property);
        if (success) {
          setIsLiked(true);
          toast.success('Added to liked listings');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Navigation handlers
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  // Share handler
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${property.StreetAddress}`,
          text: `Check out this property`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Format helpers
  const formatPrice = (price: number) => `$${price.toLocaleString()}`;
  const formatTitleCase = (value: string) => 
    value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  
  // Format open house info
  const formatOpenHouseInfo = () => {
    if (property.OpenHouseDetails) {
      return property.OpenHouseDetails;
    }
    if (property.OpenHouseDate) {
      const date = new Date(property.OpenHouseDate);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      const daySuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      // If there's a time component, include it
      const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${dayOfWeek}, ${month} ${day}${daySuffix(day)}, ${time}`;
    }
    return 'Open House';
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Close Button - Fixed Top Right */}
      <button
        onClick={onClose}
        className="fixed top-2 right-2 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>

      {/* Media Gallery Section */}
      <div className="relative w-full h-[300px] bg-black">
        <img
          src={propertyImages[currentImageIndex].url}
          alt={propertyImages[currentImageIndex].alt}
          className="w-full h-full object-cover"
          onClick={() => setIsFullscreenGallery(true)}
        />
        
        {/* Badges - Top Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 max-w-[45%]">
          <span className="px-2 py-0.5 bg-blue-600 rounded text-xs font-semibold text-white shadow-lg">
            {property.MlsStatus || 'Active'}
          </span>
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-gray-800 shadow-md">
            {property.PropertyType || 'Property'}
          </span>
        </div>

        {/* Like Button - Top Right (with spacing for close button) */}
        <button
          onClick={handleLikeClick}
          className={`absolute top-2 right-14 p-2 rounded-full backdrop-blur-sm shadow-lg ${
            isLiked ? 'bg-red-500' : 'bg-white/90'
          }`}
          aria-label={isLiked ? 'Unlike property' : 'Like property'}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-gray-700'}`} />
        </button>
        
        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
          {currentImageIndex + 1} / {propertyImages.length}
        </div>

        {/* Virtual Tour Button */}
        {(property.VirtualTourUrl || property.VirtualTourURL) && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const tourUrl = property.VirtualTourUrl || property.VirtualTourURL;
              if (tourUrl) {
                window.open(tourUrl, '_blank');
              }
            }}
            className="absolute bottom-2 right-2 flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-lg bg-purple-600 hover:bg-purple-700"
          >
            <Video className="w-4 h-4" />
            Virtual Tour
          </button>
        )}
      </div>

      {/* Content Container - No padding on sides for full width */}
      <div className="pb-6">
        
        {/* Header Section - Optimized Layout */}
        <div className="px-3 py-4 border-b border-gray-200">
          {/* Address and Open House Badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900 flex-1">
              {property.StreetAddress}
            </h1>
            {/* Open House Badge */}
            {(property.OpenHouseDetails || property.OpenHouseDate) && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-xs font-semibold text-white shadow-md flex items-center gap-1 flex-shrink-0 max-w-[55%] whitespace-normal text-right leading-tight">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="break-words">{formatOpenHouseInfo()}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            {property.City}, {property.StateOrProvince}
          </div>

          {/* Price Section - Reorganized for better space usage */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(property.ListPrice || 0)}
              </span>
              <span className="text-sm text-gray-500">
                / {(property as any).PricePerSqFt || 'N/A'} per sqft
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Tax: ${property.PropertyTaxes?.toLocaleString() || '0'} ({property.TaxYear || 'N/A'})</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {property.DaysOnMarket || 0} days on market
              </span>
            </div>
          </div>

          {/* Engagement Stats and Actions - Horizontal Layout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {(property as any).ViewCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                {(property as any).SaveCount || 0}
              </span>
              <span className="text-gray-400">
                Today: {(property as any).TodayViews || 0}v, {(property as any).TodaySaves || 0}s
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleLikeClick}
                className={`p-1.5 rounded-lg ${isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-600">
                <Bookmark className="w-4 h-4" />
              </button>
              <button onClick={handleShare} className="p-1.5 rounded-lg bg-gray-100 text-gray-600">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Highlights Grid - 2-3 columns, dense layout */}
        <div className="px-3 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Overview</h3>
          <div className="grid grid-cols-3 gap-2">
            <HighlightItem icon={Bed} label="Beds" value={property.Bedrooms?.toString() || 'N/A'} color="blue" />
            <HighlightItem icon={Bath} label="Baths" value={property.Bathrooms?.toString() || 'N/A'} color="purple" />
            <HighlightItem icon={Square} label="Sq Ft" value={property.SquareFootage || 'N/A'} color="orange" />
            <HighlightItem icon={Home} label="Type" value={property.PropertyType ? formatTitleCase(property.PropertyType) : 'N/A'} color="green" />
            <HighlightItem icon={Building2} label="SubType" value={property.SubType ? formatTitleCase(property.SubType) : 'N/A'} color="indigo" />
            <HighlightItem icon={SquareStack} label="Basement" value={property.Basement ? formatTitleCase(property.Basement) : 'None'} color="amber" />
            <HighlightItem icon={Car} label="Parking" value={property.GarageSpaces ? `${property.GarageSpaces}` : 'None'} color="rose" />
            <HighlightItem icon={MapPin} label="Lot" value={property.LotSize || 'N/A'} color="teal" />
            <HighlightItem icon={Calendar} label="Age" value={property.PropertyAge || 'N/A'} color="violet" />
          </div>
        </div>

        {/* Description Section with Tabs */}
        <div className="px-3 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Property Description</h3>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setDescriptionTab('about')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                descriptionTab === 'about'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <FileText className="w-3 h-3" />
                <span>About</span>
              </div>
            </button>
            <button
              onClick={() => setDescriptionTab('ai')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                descriptionTab === 'ai'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <Bot className="w-3 h-3" />
                <span>AI Summary</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-sm text-gray-700 leading-relaxed">
            {descriptionTab === 'about' ? (
              <p className="whitespace-pre-line">
                {property.Description || 'No description available for this property.'}
              </p>
            ) : (
              <div className="space-y-3">
                <p className="whitespace-pre-line">
                  {property.Description || 'No description available for this property.'}
                </p>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700">
                    <strong>AI Summary Coming Soon</strong> - AI-powered property insights are currently in development.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Listing History */}
        <div className="px-3 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-bold text-gray-900">Listing History</h3>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-semibold">MLS# {property.MLSNumber}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                property.MlsStatus === 'Active' ? 'bg-green-100 text-green-700' :
                property.MlsStatus === 'Sold' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {property.MlsStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">List Date</div>
                <div className="text-sm font-semibold text-gray-900">
                  {property.ListDate ? new Date(property.ListDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">List Price</div>
                <div className="text-sm font-semibold text-gray-900">
                  {property.ListPrice ? formatPrice(property.ListPrice) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">Close Price</div>
                <div className="text-sm font-semibold text-gray-900">
                  {property.ClosePrice ? formatPrice(property.ClosePrice) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">Days on Market</div>
                <div className="text-sm font-semibold text-gray-900">
                  {property.DaysOnMarket || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Information Sections - Collapsible */}
        <div className="px-3 py-4 space-y-2">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Property Information</h3>
          <ListingInformationSection property={property} />
          <PropertyDetailsSection property={property} />
          <BasementSection property={property} />
          <ParkingSection property={property} />
          <UtilitiesSection property={property} />
          <LeaseTermsSection property={property} />
          <CondoInfoSection property={property} />
          <PotlSection property={property} />
          <PoolWaterfrontSection property={property} />
          <FeaturesSection property={property} />
        </div>

        {/* Room Details Section - Collapsible */}
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={() => setExpandedRooms(!expandedRooms)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-600" />
              <div className="text-left">
                <h3 className="text-sm font-bold text-gray-900">Room Details</h3>
                <p className="text-xs text-gray-500">
                  {rooms.length > 0 ? `${rooms.length} rooms` : 'Limited data'}
                </p>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 text-gray-600 transition-transform ${expandedRooms ? '-rotate-90' : 'rotate-180'}`} />
          </button>

          {expandedRooms && (
            <div className="mt-3 space-y-2">
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="text-base font-bold text-gray-900">{property.Bedrooms}</div>
                  <div className="text-[10px] text-gray-600">Beds</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="text-base font-bold text-gray-900">{property.Bathrooms}</div>
                  <div className="text-[10px] text-gray-600">Baths</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="text-base font-bold text-gray-900">
                    {property.SquareFootage ? Math.round(Number(property.SquareFootage) / 1000) : 'N/A'}
                  </div>
                  <div className="text-[10px] text-gray-600">K Sq Ft</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="text-base font-bold text-gray-900">{rooms.length || 'N/A'}</div>
                  <div className="text-[10px] text-gray-600">Rooms</div>
                </div>
              </div>

              {/* Room List */}
              {roomsLoading ? (
                <p className="text-center text-sm text-gray-500 py-4">Loading rooms...</p>
              ) : rooms.length > 0 ? (
                <div className="space-y-2">
                  {rooms.map((room: Room, index: number) => (
                    <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-blue-50 rounded border border-blue-200">
                          <Home className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">{room.RoomType}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <span>{room.RoomLevel || 'Unknown'}</span>
                            <span className="text-gray-300">•</span>
                            <span>{room.RoomDimensions || 'N/A'}</span>
                          </div>
                          {room.RoomFeatures && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {room.RoomFeatures.split(',').map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] border border-indigo-200"
                                >
                                  {feature.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 py-4">No room details available</p>
              )}
            </div>
          )}
        </div>

        {/* Contact Agent Section - Full width at the end */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-xl px-4 py-3">
            <h2 className="text-base font-bold text-white">Contact Agent</h2>
            <p className="text-green-100 text-xs mt-1">Get expert assistance</p>
          </div>
          
          <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-4">
            {/* Agent Profile */}
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                alt="Agent"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
              />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">Sarah Johnson</h3>
                <p className="text-xs text-gray-600">Senior Real Estate Agent</p>
                <p className="text-xs text-gray-500">PropertyHub Realty</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">4.9</span>
                </div>
                <p className="text-[10px] text-gray-600">127 Reviews</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Award className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-sm font-bold text-gray-900">245</span>
                </div>
                <p className="text-[10px] text-gray-600">Properties Sold</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl font-semibold text-sm">
                <Phone className="h-4 w-4" />
                Call Now
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium text-xs">
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg font-medium text-xs">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-4 rounded-xl font-semibold text-sm border border-gray-200">
                <Calendar className="h-4 w-4" />
                Schedule Viewing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isFullscreenGallery && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreenGallery(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm z-10">
            {currentImageIndex + 1} / {propertyImages.length}
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={propertyImages[currentImageIndex].url}
              alt={propertyImages[currentImageIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Description */}
          <div className="p-4 text-center text-white/80 text-sm">
            {propertyImages[currentImageIndex].alt}
          </div>
        </div>
      )}
    </div>
  );
}

// Highlight Item Component
interface HighlightItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}

function HighlightItem({ icon: Icon, label, value, color }: HighlightItemProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    teal: 'bg-teal-50 text-teal-600',
    violet: 'bg-violet-50 text-violet-600',
  }[color] || 'bg-gray-50 text-gray-600';

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
      <div className={`w-8 h-8 rounded-lg ${colorClasses} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-gray-500 font-medium leading-tight">{label}</div>
        <div className="text-xs font-bold text-gray-900 leading-tight truncate">{value}</div>
      </div>
    </div>
  );
}

