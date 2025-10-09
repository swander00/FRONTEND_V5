"use client";

import { useState, useMemo, useEffect } from 'react';
import { X, Maximize2, Minimize2, Eye, Heart, Share2, MapPin, TrendingUp, Bookmark, ChevronLeft, ChevronRight, Video, 
  Home, Building2, Bed, Bath, Square, SquareStack, Car, Calendar, Clock, Sparkles, FileText, Bot, History, ChevronDown,
  Info, DollarSign, Hash, Key, ChefHat, TreePine, Users, Flame, DoorOpen, CheckCircle, Zap, Snowflake, Droplets, Wrench,
  CheckSquare, Building, PawPrint, Package, Receipt, Waves, Anchor, Mountain, Star, Layout, Ruler, Loader2, Phone, Mail,
  MessageCircle, Award } from 'lucide-react';
import Image from 'next/image';
import { PropertyDetailsModal as SharedModal } from '@/components/shared';
import { PropertyLikeButton, PropertySaveButton, CircularActionButton } from '@/components/shared/buttons';
import { OpenHouseBadge } from '@/components/shared/badges';
import { useLikedListings } from '@/hooks/useUserData';
import { usePropertyRooms } from '@/hooks/usePropertyRooms';
import { Property, Room } from '@/types';
import { toast } from 'sonner';

interface PropertyDetailsModalDesktopProps {
  isOpen: boolean;
  property?: Property;
  propertyId?: string;
  onClose?: () => void;
}

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

// Utility functions
const formatTitleCase = (value: string): string => value.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
const formatPrice = (price: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'N/A';
  }
};
const getInterestLevel = (views: number, saves: number) => {
  const score = views + (saves * 3);
  if (score > 50) return { label: "High Interest", color: "from-red-500 to-pink-600" };
  if (score > 20) return { label: "Moderate Interest", color: "from-orange-500 to-amber-600" };
  return { label: "New Listing", color: "from-blue-500 to-cyan-600" };
};
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Active: "from-blue-500 via-purple-500 to-pink-500",
    Pending: "from-amber-500 via-orange-500 to-red-500",
    Sold: "from-slate-600 via-slate-700 to-slate-800",
    Expired: "from-red-500 via-rose-600 to-pink-600"
  };
  return colors[status] || "from-slate-600 via-slate-700 to-slate-800";
};

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  icon: any;
  defaultExpanded?: boolean;
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'amber' | 'cyan' | 'indigo' | 'teal' | 'pink';
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon: Icon, defaultExpanded = false, colorScheme = 'blue', children }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const COLOR_SCHEMES = {
    blue: { hover: 'hover:bg-blue-50/50', icon: 'text-blue-600', iconBg: 'bg-blue-100', border: 'border-blue-200/60', chevron: 'text-blue-500', title: 'text-blue-900' },
    purple: { hover: 'hover:bg-purple-50/50', icon: 'text-purple-600', iconBg: 'bg-purple-100', border: 'border-purple-200/60', chevron: 'text-purple-500', title: 'text-purple-900' },
    green: { hover: 'hover:bg-green-50/50', icon: 'text-green-600', iconBg: 'bg-green-100', border: 'border-green-200/60', chevron: 'text-green-500', title: 'text-green-900' },
    orange: { hover: 'hover:bg-orange-50/50', icon: 'text-orange-600', iconBg: 'bg-orange-100', border: 'border-orange-200/60', chevron: 'text-orange-500', title: 'text-orange-900' },
    amber: { hover: 'hover:bg-amber-50/50', icon: 'text-amber-600', iconBg: 'bg-amber-100', border: 'border-amber-200/60', chevron: 'text-amber-500', title: 'text-amber-900' },
    cyan: { hover: 'hover:bg-cyan-50/50', icon: 'text-cyan-600', iconBg: 'bg-cyan-100', border: 'border-cyan-200/60', chevron: 'text-cyan-500', title: 'text-cyan-900' },
    indigo: { hover: 'hover:bg-indigo-50/50', icon: 'text-indigo-600', iconBg: 'bg-indigo-100', border: 'border-indigo-200/60', chevron: 'text-indigo-500', title: 'text-indigo-900' },
    teal: { hover: 'hover:bg-teal-50/50', icon: 'text-teal-600', iconBg: 'bg-teal-100', border: 'border-teal-200/60', chevron: 'text-teal-500', title: 'text-teal-900' },
    pink: { hover: 'hover:bg-pink-50/50', icon: 'text-pink-600', iconBg: 'bg-pink-100', border: 'border-pink-200/60', chevron: 'text-pink-500', title: 'text-pink-900' }
  };
  const colors = COLOR_SCHEMES[colorScheme];

  return (
    <div className="border border-gray-200/60 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm">
      <button onClick={() => setIsExpanded(!isExpanded)} className={`w-full px-4 py-3 flex items-center justify-between text-left transition-all duration-200 ${colors.hover}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors.iconBg} border ${colors.border}`}>
            <Icon className={`h-4 w-4 ${colors.icon}`} />
          </div>
          <span className={`text-sm font-semibold ${colors.title}`}>{title}</span>
        </div>
        <ChevronDown className={`h-4 w-4 ${colors.chevron} transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="border-t border-gray-200/40">
          <div className="p-4 bg-gray-50/50">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function PropertyDetailsModalDesktop({ isOpen, property, propertyId, onClose }: PropertyDetailsModalDesktopProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [descTab, setDescTab] = useState<'about' | 'ai'>('about');
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [roomsExpanded, setRoomsExpanded] = useState(true);

  const { likeListing, unlikeListing, checkIfLiked } = useLikedListings();
  const { rooms, loading: roomsLoading, error: roomsError } = usePropertyRooms(property?.MLSNumber || '');

  useEffect(() => {
    if (property?.ListingKey) setIsLiked(checkIfLiked(property.ListingKey));
  }, [property?.ListingKey, checkIfLiked]);

  // Move roomData calculation here to avoid conditional hook calls
  const roomData = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];
    return rooms.map((room: Room) => {
      const roomType = room.RoomType?.toLowerCase() || '';
      let icon = <Layout className="h-4 w-4" />;
      let color = 'gray';
      if (roomType.includes('bedroom')) { icon = <Bed className="h-4 w-4" />; color = 'blue'; }
      else if (roomType.includes('bathroom')) { icon = <Bath className="h-4 w-4" />; color = 'cyan'; }
      else if (roomType.includes('kitchen')) { icon = <ChefHat className="h-4 w-4" />; color = 'orange'; }
      else if (roomType.includes('living') || roomType.includes('family')) { icon = <Home className="h-4 w-4" />; color = 'green'; }
      
      const features = room.RoomFeatures ? room.RoomFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0) : [];
      const dimensions = room.RoomDimensions && room.RoomDimensions !== 'N/A' ? `${room.RoomDimensions} feet` : 'N/A';
      
      return { roomType: room.RoomType, level: room.RoomLevel || 'Unknown Level', roomDimensions: dimensions, roomFeatures: features, icon, color };
    });
  }, [rooms]);

  if (!isOpen) return null;
  if (!property) {
    return (
      <SharedModal open={isOpen} onClose={() => onClose?.()} title="Property not found" description="The requested property could not be found in our database.">
        <div className="text-center p-8">{propertyId && <p className="text-sm text-gray-400">Property ID: {propertyId}</p>}</div>
      </SharedModal>
    );
  }

  const statusGradient = getStatusColor(property.MlsStatus || 'Active');
  const interest = getInterestLevel((property as any).ViewCount || 0, (property as any).SaveCount || 0);
  const description = property.Description?.trim() || null;
  const hasDescription = description !== null;

  const handleLikeClick = async () => {
    if (!property?.ListingKey) return;
    try {
      if (isLiked) {
        if (await unlikeListing(property.ListingKey)) {
          setIsLiked(false);
          toast.success('Removed from liked listings');
        } else toast.error('Failed to remove');
      } else {
        if (await likeListing(property)) {
          setIsLiked(true);
          toast.success('Added to liked listings');
        } else toast.error('Failed to add');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${property.StreetAddress} - ${property.City}, ${property.StateOrProvince}`,
      text: `Check out this ${property.PropertyType} listed at $${(property.ListPrice || 0).toLocaleString()}`,
      url: window.location.href
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success('Link copied!');
        } catch {
          toast.error('Share failed');
        }
      }
    }
  };

  // Contact agent handlers
  const agent = {
    name: "Sarah Johnson", title: "Senior Real Estate Agent", company: "PropertyHub Realty",
    phone: "(555) 123-4567", email: "sarah.johnson@propertyhub.com",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 4.9, reviewCount: 127, specialties: ["Luxury Homes", "Investment Properties", "First-Time Buyers"],
    yearsExperience: 8, propertiesSold: 245
  };

  // Property highlights data
  const allSpecs = [
    { icon: Bed, label: 'Beds', value: property.Bedrooms?.toString() || 'N/A', iconColor: 'text-blue-600', bgColor: 'bg-blue-50', primary: true },
    { icon: Bath, label: 'Baths', value: property.Bathrooms?.toString() || 'N/A', iconColor: 'text-purple-600', bgColor: 'bg-purple-50', primary: true },
    { icon: Square, label: 'Sq Ft', value: property.SquareFootage ? property.SquareFootage.toString() : 'N/A', iconColor: 'text-orange-600', bgColor: 'bg-orange-50', primary: true },
    { icon: Home, label: 'Type', value: property.PropertyType ? formatTitleCase(property.PropertyType) : 'N/A', iconColor: 'text-green-600', bgColor: 'bg-green-50', primary: false },
    { icon: Building2, label: 'Sub Type', value: property.SubType ? formatTitleCase(property.SubType) : 'N/A', iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50', primary: false },
    { icon: SquareStack, label: 'Basement', value: property.Basement ? formatTitleCase(property.Basement) : 'None', iconColor: 'text-amber-600', bgColor: 'bg-amber-50', primary: false },
    { icon: Car, label: 'Parking', value: property.GarageSpaces ? `${property.GarageSpaces} Space` : 'None', iconColor: 'text-rose-600', bgColor: 'bg-rose-50', primary: false },
    { icon: MapPin, label: 'Lot Size', value: property.LotSize || 'N/A', iconColor: 'text-teal-600', bgColor: 'bg-teal-50', primary: false },
    { icon: Calendar, label: 'Age', value: property.PropertyAge || 'N/A', iconColor: 'text-violet-600', bgColor: 'bg-violet-50', primary: false },
    { icon: Clock, label: 'Days on Market', value: property.DaysOnMarket?.toString() || 'N/A', iconColor: 'text-slate-600', bgColor: 'bg-slate-50', primary: false }
  ];

  const visibleThumbnails = propertyImages.slice(0, 6);

  return (
    <SharedModal open={isOpen} onClose={() => onClose?.()} title="" showCloseButton={false}>
      <div className={`flex flex-col h-full ${isExpanded ? 'max-h-screen' : 'max-h-[80vh]'}`}>
        {/* Action Controls */}
        <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200/60 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Property Details</h2>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />}
            </button>
            <button onClick={() => onClose?.()} className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
            <div className="relative w-full rounded-lg overflow-hidden shadow-2xl">
              <div className={`absolute inset-0 bg-gradient-to-r ${statusGradient}`} style={{ animation: 'gradient-x 15s ease infinite' }}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
              <div className="relative p-3 sm:p-4 text-white">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-3">
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <h1 className="text-lg sm:text-2xl font-bold truncate mb-2 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent drop-shadow-lg">
                      {property.StreetAddress}
                    </h1>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm text-white/90 flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{property.City}, {property.StateOrProvince}
                      </span>
                      {property.Community && <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm rounded text-[10px] sm:text-xs font-medium border border-white/40 shadow-sm">{property.Community}</span>}
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm rounded text-[10px] sm:text-xs font-semibold border border-white/50 shadow-md">{property.MlsStatus}</span>
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded text-[10px] sm:text-xs border border-white/30 shadow-sm">{property.PropertyType}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">${(property.ListPrice || 0).toLocaleString()}</div>
                    <div className="text-[10px] sm:text-xs text-white/90 mt-0.5 font-medium">Tax: ${(property as any).PropertyTaxes?.toLocaleString() || '0'} ({(property as any).TaxYear || 'N/A'})</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    {(property.OpenHouseDetails || property.OpenHouseDate) && <OpenHouseBadge dateTime={property.OpenHouseDetails || property.OpenHouseDate || ''} size="md" variant="header" className="shadow-md" />}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" /><span className="font-medium">{(property as any).ViewCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" /><span className="font-medium">{(property as any).SaveCount || 0}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 ${interest.color} rounded-full text-[10px] sm:text-xs font-semibold shadow-lg bg-gradient-to-r whitespace-nowrap`}>
                      <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /><span>{interest.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
                    <PropertyLikeButton property={property} variant="header" size="sm" />
                    <PropertySaveButton property={property} variant="header" size="sm" />
                    <CircularActionButton icon={Share2} onClick={handleShare} size="sm" visualVariant="header" aria-label="Share property" title="Share" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-4 md:pb-6 border-b border-gray-200/60">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 h-[400px] sm:h-[450px] md:h-[500px]">
              <div className="relative rounded-xl overflow-hidden shadow-xl group h-full">
                <img src={propertyImages[0].url} alt={propertyImages[0].alt} className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105" onClick={() => { setCurrentImageIndex(0); setLightboxOpen(true); }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-2">
                  <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-semibold shadow-lg border border-white/30">{property.MlsStatus}</span>
                  <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800 text-xs sm:text-sm font-medium shadow-md">{property.PropertyType}</span>
                </div>
                {(property.VirtualTourUrl || property.VirtualTourURL) && (
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const tourUrl = property.VirtualTourUrl || property.VirtualTourURL;
                        if (tourUrl) {
                          window.open(tourUrl, '_blank');
                        }
                      }}
                      className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 border border-white/30 text-xs sm:text-sm"
                    >
                      <Video className="w-4 h-4 sm:w-5 sm:h-5" /><span>Virtual Tour</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-2 sm:grid-rows-2 gap-2 sm:gap-3 h-full">
                {visibleThumbnails.map((image, index) => (
                  <div key={image.id} className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group h-full" onClick={() => { setCurrentImageIndex(index); setLightboxOpen(true); }}>
                    <img src={image.url} alt={image.alt} className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${index === 5 ? 'blur-sm' : ''}`} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
                    {index === 5 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                        <Maximize2 className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                        <span className="text-xl sm:text-2xl font-bold">+{propertyImages.length - 6}</span>
                        <span className="text-xs sm:text-sm font-medium">More Photos</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* Highlights */}
              <div className="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-xl shadow-md border border-gray-200/60 overflow-hidden">
                <div className="px-4 py-2.5 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 border-b border-gray-200/50">
                  <h3 className="text-sm font-bold text-gray-900">Quick Overview</h3>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                    {allSpecs.map((spec, index) => {
                      const IconComponent = spec.icon;
                      return (
                        <div key={index} className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3 bg-white rounded-lg border border-gray-200/60 hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${spec.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                            <IconComponent className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${spec.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">{spec.label}</div>
                            <div className={`${spec.primary ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} font-bold text-gray-900 leading-tight truncate`}>{spec.value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
                {/* Left Column - 75% */}
                <div className="w-full lg:w-3/4">
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {/* Description Card */}
                    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Property Description</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Detailed property overview and features</p>
                          </div>
                        </div>
                        <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-blue-400 to-indigo-500" />
                      </div>
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                        <div className="flex bg-gradient-to-r from-slate-100/80 to-slate-50/80 rounded-xl p-1 sm:p-1.5 border border-slate-200/60">
                          <button onClick={() => setDescTab('about')} className={`flex-1 px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-lg ${descTab === 'about' ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md border border-blue-400/30' : 'text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-200/60'}`}>
                            <div className="flex items-center justify-center gap-1.5 sm:gap-3"><FileText className="h-3 w-3 sm:h-4 sm:w-4" /><span>About</span></div>
                          </button>
                          <button onClick={() => setDescTab('ai')} className={`flex-1 px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-lg ${descTab === 'ai' ? 'text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-md border border-purple-400/30' : 'text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border border-transparent hover:border-purple-200/60'}`}>
                            <div className="flex items-center justify-center gap-1.5 sm:gap-3"><Bot className="h-3 w-3 sm:h-4 sm:w-4" /><span>AI Summary</span></div>
                          </button>
                        </div>
                      </div>
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        {descTab === 'about' ? (
                          <div className="pl-5 border-l-2 border-slate-200">
                            {hasDescription ? <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{description}</p> : <p className="text-slate-500 leading-relaxed text-sm italic">No description available for this property.</p>}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="pl-5 border-l-2 border-slate-200">
                              {hasDescription ? <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{description}</p> : <p className="text-slate-500 leading-relaxed text-sm italic">No description available for this property.</p>}
                            </div>
                            <div className="pl-5 border-l-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-r-lg py-3">
                              <div className="flex items-start gap-3">
                                <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h5 className="text-sm font-semibold text-purple-800 mb-1">AI Summary Coming Soon</h5>
                                  <p className="text-sm text-purple-700 leading-relaxed">AI-powered property insights are currently in development.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Listing History Card */}
                    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
                      <div className="p-6">
                        <button onClick={() => setHistoryExpanded(!historyExpanded)} className="w-full flex items-center justify-between hover:bg-orange-50/50 transition-all duration-300 group rounded-lg p-2 -m-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
                              <History className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Listing History</h3>
                              <p className="text-sm text-slate-500 font-medium">Property listing timeline and changes</p>
                            </div>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-orange-500 transition-transform duration-300 ${historyExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="w-20 h-px bg-gradient-to-r from-orange-400 to-amber-500 mt-4"></div>
                      </div>
                      {historyExpanded && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                          <div className="space-y-3">
                            <div className="hidden md:grid grid-cols-6 gap-3 p-3 bg-slate-50/50 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-wider">
                              <div>Date Listed</div><div>List Price</div><div>Listing End</div><div>Status</div><div>Sold Price</div><div>MLS#</div>
                            </div>
                            <div className="hidden md:grid grid-cols-6 gap-3 p-3 hover:bg-slate-50/30 transition-all duration-300 rounded-lg border-b border-slate-200/60">
                              <div className="text-sm font-semibold text-slate-800">{property.ListDate ? formatDate(property.ListDate) : 'N/A'}</div>
                              <div className="text-sm font-semibold text-slate-800">{formatPrice(property.ListPrice || 0)}</div>
                              <div className="text-sm font-semibold text-slate-800">Active</div>
                              <div><span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-current/20">Active</span></div>
                              <div className="text-sm font-semibold text-slate-800">N/A</div>
                              <div className="text-sm font-semibold text-slate-800 font-mono">{property.MLSNumber || 'N/A'}</div>
                            </div>
                            <div className="md:hidden p-3 bg-white rounded-lg border border-slate-200/60 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-slate-600 uppercase">MLS# {property.MLSNumber || 'N/A'}</span>
                                <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-current/20">Active</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div><div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Date Listed</div><div className="text-sm font-semibold text-slate-800">{property.ListDate ? formatDate(property.ListDate) : 'N/A'}</div></div>
                                <div><div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">List Price</div><div className="text-sm font-semibold text-slate-800">{formatPrice(property.ListPrice || 0)}</div></div>
                                <div><div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Listing End</div><div className="text-sm font-semibold text-slate-800">Active</div></div>
                                <div><div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Sold Price</div><div className="text-sm font-semibold text-slate-800">N/A</div></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Property Information Card */}
                    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Property Information</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Detailed property specifications</p>
                          </div>
                        </div>
                        <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-blue-400 to-indigo-500" />
                      </div>
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
                        {/* Listing Information Section */}
                        <CollapsibleSection title="Listing Information" icon={Info} colorScheme="blue" defaultExpanded={true}>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                              { icon: Calendar, label: 'Date Listed', value: property.ListDate ? formatDate(property.ListDate) : 'N/A' },
                              { icon: Info, label: 'Status', value: property.MlsStatus || 'Active', highlight: true },
                              { icon: DollarSign, label: 'Original Price', value: formatPrice(property.OriginalPrice || property.ListPrice || 0), highlight: true },
                              { icon: Hash, label: 'MLS Number', value: property.MLSNumber || 'N/A' },
                              { icon: Clock, label: 'Days on Market', value: property.DaysOnMarket?.toString() || 'N/A' },
                              { icon: Key, label: 'Possession', value: property.Possession || 'N/A' }
                            ].map((item, index) => {
                              const IconComponent = item.icon;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${item.highlight ? 'text-blue-600' : 'text-gray-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                                    <p className={`text-sm font-semibold truncate ${item.highlight ? 'text-blue-900' : 'text-gray-900'}`}>{item.value}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>

                        {/* Property Details Section */}
                        <CollapsibleSection title="Property Details" icon={Home} colorScheme="green" defaultExpanded={true}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                              { icon: Building2, label: 'Property Class', value: property.PropertyClass || 'Residential', highlight: true },
                              { icon: Home, label: 'Property Type', value: property.PropertyType || 'N/A', highlight: true },
                              { icon: Bed, label: 'Bedrooms', value: property.Bedrooms?.toString() || 'N/A', highlight: true },
                              { icon: Bath, label: 'Bathrooms', value: property.Bathrooms?.toString() || 'N/A', highlight: true },
                              { icon: ChefHat, label: 'Kitchens', value: property.Kitchens?.toString() || '1' },
                              { icon: Square, label: 'Square Footage', value: property.SquareFootage ? `${property.SquareFootage.toLocaleString()} sq ft` : 'N/A', highlight: true },
                              { icon: TreePine, label: 'Lot Size', value: property.LotSize || 'N/A' },
                              { icon: Calendar, label: 'Property Age', value: property.PropertyAge ? `${property.PropertyAge} years` : 'N/A' },
                              { icon: Users, label: 'Family Room', value: property.HasFamilyRoom ? 'Yes' : 'No' },
                              { icon: Flame, label: 'Fireplace', value: property.HasFireplace ? 'Yes' : 'No' }
                            ].map((detail, index) => {
                              const IconComponent = detail.icon;
                              return (
                                <div key={index} className="flex items-center gap-2 sm:gap-3">
                                  <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${detail.highlight ? 'text-green-600' : 'text-gray-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5 sm:mb-1">{detail.label}</p>
                                    <p className={`text-xs sm:text-sm font-semibold truncate ${detail.highlight ? 'text-green-900' : 'text-gray-900'}`}>{detail.value}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>

                        {/* Other Sections */}
                        <CollapsibleSection title="Basement Features" icon={SquareStack} colorScheme="amber" defaultExpanded={true}>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {[
                              { icon: CheckCircle, label: 'Basement Status', value: property.Basement || 'Not specified', highlight: property.Basement?.toLowerCase().includes('finished') || false },
                              { icon: DoorOpen, label: 'Basement Entrance', value: property.Basement?.toLowerCase().includes('separate') ? 'Separate Entrance' : 'Shared Entrance' },
                              { icon: ChefHat, label: 'Kitchen', value: property.Basement?.toLowerCase().includes('kitchen') ? 'Yes' : 'No' }
                            ].map((feature, index) => {
                              const IconComponent = feature.icon;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${feature.highlight ? 'text-amber-600' : 'text-gray-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{feature.label}</p>
                                    <p className={`text-sm font-semibold truncate ${feature.highlight ? 'text-amber-900' : 'text-gray-900'}`}>{feature.value}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Parking & Garage" icon={Car} colorScheme="orange" defaultExpanded={true}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                              { icon: Home, label: 'Garage Spaces', value: property.GarageParking?.toString().match(/^(\d+)/)?.[1] || property.GarageParking?.toString() || 'N/A', highlight: true },
                              { icon: Car, label: 'Driveway Spaces', value: property.DriveParking?.toString().match(/^(\d+)/)?.[1] || property.DriveParking?.toString() || 'N/A' },
                              { icon: Car, label: 'Total Parking', value: property.TotalParking?.toString().match(/^(\d+)/)?.[1] || property.TotalParking?.toString() || 'N/A', highlight: true }
                            ].map((parking, index) => {
                              const IconComponent = parking.icon;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${parking.highlight ? 'text-orange-600' : 'text-gray-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{parking.label}</p>
                                    <p className={`text-sm font-semibold truncate ${parking.highlight ? 'text-orange-900' : 'text-gray-900'}`}>{parking.value}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Utilities & Services" icon={Zap} colorScheme="cyan" defaultExpanded={true}>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                              { icon: Flame, label: 'Heating', value: (property as any).Heating || 'Forced Air', highlight: true },
                              { icon: Snowflake, label: 'Cooling', value: (property as any).Cooling || 'Central Air', highlight: true },
                              { icon: Droplets, label: 'Water', value: (property as any).WaterSource || 'Municipal' },
                              { icon: Wrench, label: 'Sewer', value: (property as any).Sewer || 'Municipal' }
                            ].map((utility, index) => {
                              const IconComponent = utility.icon;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${utility.highlight ? 'text-cyan-600' : 'text-gray-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{utility.label}</p>
                                    <p className={`text-sm font-semibold truncate ${utility.highlight ? 'text-cyan-900' : 'text-gray-900'}`}>{utility.value}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Lease Terms" icon={FileText} colorScheme="purple" defaultExpanded={true}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { icon: CheckSquare, label: 'Rent Includes', value: property.RentIncludes || 'N/A', highlight: !!property.RentIncludes },
                              { icon: Home, label: 'Furnished', value: property.Furnished || 'N/A', highlight: property.Furnished?.toLowerCase() === 'yes' },
                              { icon: Calendar, label: 'Lease Term', value: (property as any).LeaseTerm || 'N/A' }
                            ].map((term, index) => {
                              const IconComponent = term.icon;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${term.highlight ? 'text-purple-600' : 'text-gray-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{term.label}</p>
                                    <p className={`text-sm font-semibold truncate ${term.highlight ? 'text-purple-900' : 'text-gray-900'}`}>{term.value}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>

                        {property.MaintenanceFee && (
                          <CollapsibleSection title="Condo Information" icon={Building} colorScheme="indigo" defaultExpanded={true}>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                              {[
                                { icon: DollarSign, label: 'Maintenance Fee', value: property.MaintenanceFee ? `$${property.MaintenanceFee}` : 'N/A', highlight: true },
                                { icon: Calendar, label: 'Fee Schedule', value: (property as any).MaintenanceFeeSchedule || 'Monthly' },
                                { icon: FileText, label: 'Fee Includes', value: formatTitleCase(property.FeeIncludes || 'Standard Services') },
                                ...(property.CondoAmenities ? [{ icon: Sparkles, label: 'Condo Amenities', value: formatTitleCase(property.CondoAmenities) }] : []),
                                ...(property.Pets ? [{ icon: PawPrint, label: 'Pets', value: formatTitleCase(property.Pets) }] : []),
                                ...(property.Locker ? [{ icon: Package, label: 'Locker', value: formatTitleCase(property.Locker) }] : []),
                                ...(property.Balcony ? [{ icon: Home, label: 'Balcony', value: formatTitleCase(property.Balcony) }] : [])
                              ].map((field, index) => {
                                const IconComponent = field.icon;
                                return (
                                  <div key={index} className="flex items-center gap-3">
                                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${field.highlight ? 'text-indigo-600' : 'text-gray-500'}`} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{field.label}</p>
                                      <p className={`text-sm font-semibold truncate ${field.highlight ? 'text-indigo-900' : 'text-gray-900'}`}>{field.value}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CollapsibleSection>
                        )}

                        {property.POTLFee && (
                          <CollapsibleSection title="POTL Information" icon={Receipt} colorScheme="teal" defaultExpanded={true}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                { icon: DollarSign, label: 'POTL Fee', value: property.POTLFee ? `$${property.POTLFee}` : 'N/A', highlight: true },
                                { icon: Calendar, label: 'Fee Schedule', value: (property as any).POTLSchedule || 'Monthly' },
                                { icon: FileText, label: 'Fee Includes', value: (property as any).POTLIncludes || 'Standard Services' }
                              ].map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                  <div key={index} className="flex items-center gap-3">
                                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${item.highlight ? 'text-teal-600' : 'text-gray-500'}`} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                                      <p className={`text-sm font-semibold truncate ${item.highlight ? 'text-teal-900' : 'text-gray-900'}`}>{item.value}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CollapsibleSection>
                        )}

                        <CollapsibleSection title="Pool & Waterfront" icon={Waves} colorScheme="blue" defaultExpanded={true}>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                              { icon: Droplets, label: 'Swimming Pool', value: property.SwimmingPool || 'None', highlight: property.SwimmingPool && property.SwimmingPool !== 'None' },
                              { icon: Waves, label: 'Waterfront', value: property.Waterfront ? 'Yes' : 'No', highlight: property.Waterfront },
                              { icon: Anchor, label: 'Water Access', value: (property as any).WaterAccess || 'None' },
                              { icon: Mountain, label: 'Water View', value: (property as any).WaterView ? 'Yes' : 'No' }
                            ].map((feature, index) => {
                              const IconComponent = feature.icon;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${feature.highlight ? 'text-blue-600' : 'text-gray-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{feature.label}</p>
                                    <p className={`text-sm font-semibold truncate ${feature.highlight ? 'text-blue-900' : 'text-gray-900'}`}>{feature.value}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Property Features" icon={Star} colorScheme="pink" defaultExpanded={true}>
                          <div className="space-y-6">
                            {/* Interior Features */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Home className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-semibold text-gray-900">Interior Features</h3>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {['Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances', 'Walk-In Closet', 'Fireplace', 'Crown Molding', 'Recessed Lighting'].map((feature, index) => (
                                  <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{feature}</span>
                                ))}
                              </div>
                            </div>
                            {/* Exterior Features */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <TreePine className="w-4 h-4 text-green-600" />
                                <h3 className="text-sm font-semibold text-gray-900">Exterior Features</h3>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {['Swimming Pool', 'Patio', 'Garden', 'Two-Car Garage', 'Landscaping', 'Deck'].map((feature, index) => (
                                  <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">{feature}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CollapsibleSection>
                      </div>
                    </div>

                    {/* Room Details Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                              <Layout className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">Room Details</h3>
                              <p className="text-xs text-gray-500">{roomData.length > 0 ? `${roomData.length} rooms` : 'Limited data'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${roomData.length > 0 ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                            <span className="text-xs text-gray-500">{roomData.length > 0 ? 'Available' : 'Limited'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          <div className="text-center p-1.5 sm:p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-base sm:text-lg font-bold text-gray-900">{property.Bedrooms}</div>
                            <div className="text-[10px] sm:text-xs text-gray-600">Beds</div>
                          </div>
                          <div className="text-center p-1.5 sm:p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-base sm:text-lg font-bold text-gray-900">{property.Bathrooms}</div>
                            <div className="text-[10px] sm:text-xs text-gray-600">Baths</div>
                          </div>
                          <div className="text-center p-1.5 sm:p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-base sm:text-lg font-bold text-gray-900">{property.SquareFootage ? Math.round(Number(property.SquareFootage) / 1000) : 'N/A'}</div>
                            <div className="text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">K Sq Ft</div>
                          </div>
                          <div className="text-center p-1.5 sm:p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-base sm:text-lg font-bold text-gray-900">{roomData.length > 0 ? roomData.length : 'N/A'}</div>
                            <div className="text-[10px] sm:text-xs text-gray-600">Rooms</div>
                          </div>
                        </div>
                        <button onClick={() => setRoomsExpanded(!roomsExpanded)} className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200">
                          <div className="flex items-center gap-2">
                            <Layout className="h-3 w-3 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">{roomsLoading ? 'Loading...' : roomData.length > 0 ? 'View Room Details' : 'No Room Data'}</span>
                          </div>
                          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${roomsExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {roomsExpanded && (
                          <div className="mt-3">
                            {roomsLoading ? (
                              <div className="text-center py-6">
                                <Loader2 className="h-5 w-5 text-indigo-500 mx-auto mb-2 animate-spin" />
                                <p className="text-gray-600 text-xs">Loading room details...</p>
                              </div>
                            ) : roomsError ? (
                              <div className="text-center py-6">
                                <Layout className="h-8 w-8 text-red-400 mx-auto mb-2" />
                                <p className="text-red-600 text-xs">Error loading room details</p>
                              </div>
                            ) : roomData.length > 0 ? (
                              <div className="space-y-2">
                                {roomData.map((room, index) => (
                                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-2 mb-2">
                                      <div className="p-1.5 rounded border bg-blue-50 text-blue-700 border-blue-200">{room.icon}</div>
                                      <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-900">{room.roomType}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gray-400" />{room.level}</span>
                                          <span className="text-gray-300">•</span>
                                          <span className="flex items-center gap-1"><Ruler className="h-3 w-3 text-gray-400" />{room.roomDimensions}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {room.roomFeatures.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {room.roomFeatures.map((feature, featureIndex) => (
                                          <span key={featureIndex} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full border border-indigo-200 shadow-sm">{feature}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <Layout className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 text-xs font-medium">No room details available</p>
                                <p className="text-gray-500 text-xs mt-1">Room data available for ~43% of listings</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - 25% - Contact Agent */}
                <div className="w-full lg:w-1/4">
                  <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden lg:sticky lg:top-4">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4">
                      <h2 className="text-base sm:text-lg font-bold text-white">Contact Agent</h2>
                      <p className="text-green-100 text-xs sm:text-sm mt-1">Get expert assistance with this property</p>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                        <div className="relative flex-shrink-0">
                          <Image src={agent.avatar} alt={agent.name} width={64} height={64} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-lg" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{agent.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{agent.title}</p>
                          <p className="text-xs text-gray-500 truncate">{agent.company}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mr-1 fill-yellow-500" />
                            <span className="text-base sm:text-lg font-bold text-gray-900">{agent.rating}</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-gray-600">{agent.reviewCount} Reviews</p>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1" />
                            <span className="text-base sm:text-lg font-bold text-gray-900">{agent.propertiesSold}</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-gray-600">Properties Sold</p>
                        </div>
                      </div>
                      <div className="mb-4 sm:mb-6">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {agent.specialties.map((specialty, index) => (
                            <span key={index} className="px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-medium rounded-full">{specialty}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <button onClick={() => window.open(`tel:${agent.phone}`)} className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-sm sm:text-base transition-colors duration-200">
                          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Call Now
                        </button>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <button onClick={() => window.open(`mailto:${agent.email}?subject=Inquiry about Property ${property.MLSNumber}`)} className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-colors duration-200">
                            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Email
                          </button>
                          <button className="flex items-center justify-center gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-colors duration-200">
                            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Message
                          </button>
                        </div>
                        <button className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-sm sm:text-base transition-colors duration-200 border border-gray-200">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Schedule Viewing
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button onClick={() => setLightboxOpen(false)} className="absolute top-2 right-2 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 z-10 border border-white/20">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="absolute top-2 left-2 sm:top-6 sm:left-6 px-2 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm sm:text-base font-medium border border-white/20">
            {currentImageIndex + 1} / {propertyImages.length}
          </div>
          <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length)} className="absolute left-2 sm:left-6 p-2 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 border border-white/20">
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="w-full h-full flex flex-col items-center justify-center px-2 sm:px-4 py-16 sm:py-20">
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={propertyImages[currentImageIndex].url} alt={propertyImages[currentImageIndex].alt} className="max-w-none max-h-none w-auto h-auto object-contain rounded-lg shadow-2xl" style={{ maxWidth: 'calc(100vw - 4rem)', maxHeight: 'calc(100vh - 10rem)', width: 'auto', height: 'auto' }} />
            </div>
            <p className="text-center text-white/80 mt-2 sm:mt-4 text-sm sm:text-lg font-medium px-4">{propertyImages[currentImageIndex].alt}</p>
          </div>
          <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length)} className="absolute right-2 sm:right-6 p-2 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 border border-white/20">
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 max-w-4xl overflow-x-auto z-10">
            {propertyImages.map((image, index) => (
              <button key={image.id} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 ${currentImageIndex === index ? 'ring-3 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}>
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
      `}</style>
    </SharedModal>
  );
}

