"use client";

import { useState, useEffect } from 'react';
import { 
  Eye, 
  Heart, 
  Share2, 
  MapPin, 
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { Property } from '@/types';
import { PropertyLikeButton, PropertySaveButton, CircularActionButton } from '@/components/shared/buttons';
import { OpenHouseBadge } from '@/components/shared/badges';
import { toast } from '@/hooks/use-toast';

// Mock property data for demonstration
const mockProperty: Property = {
  ListingKey: "MOCK-123456",
  UnparsedAddress: "456 Queen Street West, Toronto, ON",
  StreetAddress: "456 Queen Street West",
  City: "Toronto",
  StateOrProvince: "ON",
  Community: "Downtown Core",
  MlsStatus: "Active",
  PropertyType: "Condo Apartment",
  ListPrice: 849000,
  PropertyTaxes: 3456.87,
  TaxYear: 2024,
  ViewCount: 47,
  SaveCount: 12,
  TodayViews: 8,
  TodaySaves: 3,
  OpenHouse: {
    date: "Sat, Jun 14th",
    time: "2:00 - 4:00 PM"
  }
} as any;

// Helper to determine interest level
const getInterestLevel = (views: number, saves: number) => {
  const score = views + (saves * 3);
  if (score > 50) return { label: "High Interest", color: "from-red-500 to-pink-600" };
  if (score > 20) return { label: "Moderate Interest", color: "from-orange-500 to-amber-600" };
  return { label: "New Listing", color: "from-blue-500 to-cyan-600" };
};

// Helper for status colors with vibrant gradients
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Active: "from-blue-500 via-purple-500 to-pink-500",
    Pending: "from-amber-500 via-orange-500 to-red-500",
    Sold: "from-slate-600 via-slate-700 to-slate-800",
    Expired: "from-red-500 via-rose-600 to-pink-600"
  };
  return colors[status] || "from-slate-600 via-slate-700 to-slate-800";
};

interface CompactPropertyHeaderProps {
  property?: Property;
}

export default function CompactPropertyHeader({ property: propProperty }: CompactPropertyHeaderProps) {
  const property = propProperty || mockProperty;
  const statusGradient = getStatusColor(property.MlsStatus || 'Active');
  const interest = getInterestLevel(
    (property as any).ViewCount || 0, 
    (property as any).SaveCount || 0
  );

  // Share handler function
  const handleShare = async () => {
    const shareData = {
      title: `${property.StreetAddress} - ${property.City}, ${property.StateOrProvince}`,
      text: `Check out this ${property.PropertyType} listed at $${(property.ListPrice || 0).toLocaleString()}`,
      url: window.location.href
    };

    try {
      // Try using the Web Share API (works on mobile and some desktop browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Property details have been shared.",
          duration: 3000,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Property link has been copied to your clipboard.",
          duration: 3000,
        });
      }
    } catch (error) {
      // User cancelled the share or there was an error
      if ((error as Error).name !== 'AbortError') {
        // Try clipboard as a last resort
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link copied!",
            description: "Property link has been copied to your clipboard.",
            duration: 3000,
          });
        } catch (clipboardError) {
          toast({
            title: "Share failed",
            description: "Unable to share or copy the link. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
      
      <div className="relative w-full rounded-lg overflow-hidden shadow-2xl">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${statusGradient} animate-gradient-x`}></div>
      
      {/* Overlay shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
      
      {/* Content */}
      <div className="relative p-3 sm:p-4 text-white">
        {/* Row 1: Primary Information */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-3">
          {/* Left: Address and Badges */}
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            {/* Address with gradient text */}
            <h1 className="text-lg sm:text-2xl font-bold truncate mb-2 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent drop-shadow-lg">
              {property.StreetAddress}
            </h1>
            
            {/* Location and Badges - All inline */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-white/90 flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {property.City}, {property.StateOrProvince}
              </span>
              
              {property.Community && (
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm rounded text-[10px] sm:text-xs font-medium border border-white/40 shadow-sm">
                  {property.Community}
                </span>
              )}
              
              <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm rounded text-[10px] sm:text-xs font-semibold border border-white/50 shadow-md">
                {property.MlsStatus}
              </span>
              
              <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded text-[10px] sm:text-xs border border-white/30 shadow-sm">
                {property.PropertyType}
              </span>
            </div>
          </div>
          
          {/* Right: Price */}
          <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
              ${(property.ListPrice || 0).toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-xs text-white/90 mt-0.5 font-medium">
              Tax: ${(property as any).PropertyTaxes?.toLocaleString() || '0'} ({(property as any).TaxYear || 'N/A'})
            </div>
          </div>
        </div>
        
        {/* Row 2: Meta Information and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 pt-3 border-t border-white/20">
          {/* Left: Open House */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {property.OpenHouseDetails && (
              <OpenHouseBadge 
                dateTime={property.OpenHouseDetails} 
                size="md"
                variant="header"
                className="shadow-md"
              />
            )}
          </div>
          
          {/* Center: Engagement Stats */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">{(property as any).ViewCount || 0}</span>
                <span className="text-white/70 text-[10px] sm:text-xs hidden sm:inline">views</span>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">{(property as any).SaveCount || 0}</span>
                <span className="text-white/70 text-[10px] sm:text-xs hidden sm:inline">saved</span>
              </div>
            </div>
            
            {/* Interest Badge */}
            <div className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 ${interest.color} rounded-full text-[10px] sm:text-xs font-semibold shadow-lg bg-gradient-to-r whitespace-nowrap`}>
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">{interest.label}</span>
              <span className="sm:hidden">{interest.label.split(' ')[0]}</span>
            </div>
          </div>
          
          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
            <PropertyLikeButton 
              property={property}
              variant="header"
              size="sm"
            />
            
            <PropertySaveButton 
              property={property}
              variant="header"
              size="sm"
            />
            
            <CircularActionButton
              icon={Share2}
              onClick={handleShare}
              size="sm"
              visualVariant="header"
              aria-label="Share property"
              title="Share"
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}