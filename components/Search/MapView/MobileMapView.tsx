"use client";

import React, { useMemo, useRef, useCallback, useState } from 'react';
import { Property } from '@/types';
import { Icon } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { getPropertyLocations, formatMarkerPrice } from '@/lib/mockMapData';
import { MobilePropertyInfoPopup } from './MobilePropertyInfoPopup';
import { PropertyDetailsModalMobile } from '@/components/Property/Details';

interface MobileMapViewProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

// Default to Toronto downtown
const DEFAULT_LOCATION = { lat: 43.6532, lng: -79.3832 };

export function MobileMapView({
  properties,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: MobileMapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  
  // Get property locations with mock coordinates
  const propertyLocations = useMemo(
    () => {
      console.log('MobileMapView: Processing properties', properties.length);
      const locations = getPropertyLocations(properties);
      console.log('MobileMapView: Generated locations', locations.length);
      return locations;
    },
    [properties]
  );

  // Create a map of MLSNumber to Property for quick lookup
  const propertyMap = useMemo(
    () => new Map(properties.map(p => [p.MLSNumber, p])),
    [properties]
  );

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <MobileMap
        properties={properties}
        propertyLocations={propertyLocations}
        selectedProperty={selectedProperty}
        hoveredMarker={hoveredMarker}
        onPropertyClick={(property) => setSelectedProperty(property)}
        onMarkerHover={setHoveredMarker}
        showLegend={showLegend}
        onToggleLegend={() => setShowLegend(!showLegend)}
      />

      {/* Property Details Modal */}
      <PropertyDetailsModalMobile
        isOpen={!!selectedProperty}
        property={selectedProperty || undefined}
        onClose={() => setSelectedProperty(null)}
      />

      {/* Load More Button - Fixed at bottom */}
      {currentPage < totalPages && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            size="sm"
          >
            <Icon name="refresh" size="sm" className="mr-2" />
            Load More Properties
          </Button>
        </div>
      )}
    </div>
  );
}

// Mobile Map Component
interface MobileMapProps {
  properties: Property[];
  propertyLocations: any[];
  selectedProperty: Property | null;
  hoveredMarker: string | null;
  onPropertyClick: (property: Property) => void;
  onMarkerHover: (mlsNumber: string | null) => void;
  showLegend: boolean;
  onToggleLegend: () => void;
}

function MobileMap({ 
  properties, 
  propertyLocations, 
  selectedProperty, 
  hoveredMarker,
  onPropertyClick,
  onMarkerHover,
  showLegend,
  onToggleLegend
}: MobileMapProps) {
  console.log('MobileMap rendering with', propertyLocations.length, 'locations');
  
  // Calculate bounds for viewport
  const bounds = useMemo(() => {
    if (propertyLocations.length === 0) {
      return {
        minLat: DEFAULT_LOCATION.lat - 0.05,
        maxLat: DEFAULT_LOCATION.lat + 0.05,
        minLng: DEFAULT_LOCATION.lng - 0.05,
        maxLng: DEFAULT_LOCATION.lng + 0.05,
      };
    }

    const lats = propertyLocations.map(loc => loc.lat);
    const lngs = propertyLocations.map(loc => loc.lng);
    
    return {
      minLat: Math.min(...lats) - 0.01,
      maxLat: Math.max(...lats) + 0.01,
      minLng: Math.min(...lngs) - 0.01,
      maxLng: Math.max(...lngs) + 0.01,
    };
  }, [propertyLocations]);

  // Convert lat/lng to pixel coordinates within the container
  const toPixels = useCallback((lat: number, lng: number) => {
    const latRange = bounds.maxLat - bounds.minLat;
    const lngRange = bounds.maxLng - bounds.minLng;

    // Convert to percentage (0-100)
    const x = ((lng - bounds.minLng) / lngRange) * 100;
    const y = ((bounds.maxLat - lat) / latRange) * 100; // Inverted because screen coords go top to bottom

    return { x, y };
  }, [bounds]);

  return (
    <div 
      className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden"
      onClick={() => {
        onMarkerHover(null);
      }}
    >
      {/* Grid overlay to simulate map */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="mobile-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mobile-grid)" />
        </svg>
      </div>

      {/* Placeholder map notice */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-100/95 backdrop-blur-sm border border-yellow-300 text-yellow-800 px-3 py-1.5 rounded-lg shadow-lg z-10 text-xs max-w-[90%]">
        <div className="flex items-center gap-1.5">
          <Icon name="alert" size="xs" />
          <span className="truncate">Mock Map (Google Maps API not configured)</span>
        </div>
      </div>

      {/* Legend Toggle Button - Mobile Optimized */}
      <button
        onClick={onToggleLegend}
        className="absolute top-14 right-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 border border-gray-200 z-10 active:scale-95 transition-transform"
        aria-label={showLegend ? 'Hide legend' : 'Show legend'}
      >
        <Icon name="info" size="sm" className="text-gray-700" />
      </button>

      {/* Legend - Collapsible on Mobile */}
      {showLegend && (
        <div className="absolute top-14 left-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 z-10 max-w-[160px]">
          <div className="text-xs font-semibold mb-2 text-gray-900">Legend</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm flex-shrink-0"></div>
              <span className="text-xs text-gray-700">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm flex-shrink-0"></div>
              <span className="text-xs text-gray-700">New</span>
            </div>
          </div>
        </div>
      )}

      {/* Property markers */}
      {propertyLocations.map((location) => {
        const property = properties.find(p => p.MLSNumber === location.mlsNumber);
        if (!property) return null;

        const { x, y } = toPixels(location.lat, location.lng);
        const isHovered = hoveredMarker === location.mlsNumber;

        return (
          <div
            key={location.mlsNumber}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              zIndex: isHovered ? 100 : 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onPropertyClick(property);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              onMarkerHover(location.mlsNumber);
            }}
          >
            {/* Marker pin - Mobile optimized size */}
            <div
              className={`relative flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-all active:scale-110 ${
                isHovered ? 'scale-125 ring-2 ring-blue-400 ring-offset-2' : 'scale-100'
              } ${
                property.IsNewListing ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{
                width: isHovered ? '52px' : '44px',
                height: isHovered ? '52px' : '44px',
                minWidth: '44px',
                minHeight: '44px',
              }}
            >
              <span className="text-white text-xs font-bold px-1 text-center leading-tight">
                {formatMarkerPrice(location.price)}
              </span>
            </div>

            {/* Mobile Property Info Popup */}
            {isHovered && (
              <MobilePropertyInfoPopup
                property={property}
                onClose={(e) => {
                  e?.stopPropagation();
                  onMarkerHover(null);
                }}
                onViewDetails={(prop) => {
                  onPropertyClick(prop);
                  onMarkerHover(null);
                }}
              />
            )}
          </div>
        );
      })}

      {/* Showing count - Bottom center on mobile */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-3 py-1.5 border border-gray-200 z-10">
        <div className="text-xs text-gray-700 font-medium whitespace-nowrap">
          <span className="font-bold text-blue-600">{propertyLocations.length}</span> properties
        </div>
      </div>
    </div>
  );
}

