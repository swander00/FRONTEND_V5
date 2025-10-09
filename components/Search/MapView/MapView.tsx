"use client";

import React, { useMemo, useRef, useCallback, useState } from 'react';
import { GoogleMap, Marker, MarkerClusterer, useJsApiLoader, InfoWindow, OverlayView } from '@react-google-maps/api';
import { PropertyCard } from '@/components/Property';
import { Property } from '@/types';
import Pagination from '@/components/ui/pagination';
import { Icon } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { getPropertyLocations, formatMarkerPrice, calculateBounds } from '@/lib/mockMapData';
import { PropertyInfoPopupWithArrow } from './PropertyInfoPopupWithArrow';
import { PropertyDetailsModal, PropertyDetailsModalMobile } from '@/components/Property/Details';
import { useIsMobile } from '@/hooks';

interface MapViewProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const mapContainerStyle = { width: '100%', height: '100%' };

// Default to Toronto downtown
const DEFAULT_LOCATION = { lat: 43.6532, lng: -79.3832 };

export default function MapView({
  properties,
  currentPage,
  totalPages,
  onPageChange,
  initialCenter = DEFAULT_LOCATION,
  initialZoom = 12,
}: MapViewProps) {
  // State for full-screen map mode
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Google Maps integration
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY || '',
    libraries: ['places'],
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Get property locations with mock coordinates
  const propertyLocations = useMemo(
    () => getPropertyLocations(properties),
    [properties]
  );

  // Create a map of MLSNumber to Property for quick lookup
  const propertyMap = useMemo(
    () => new Map(properties.map(p => [p.MLSNumber, p])),
    [properties]
  );

  // Calculate map center and bounds
  const mapBounds = useMemo(
    () => calculateBounds(propertyLocations),
    [propertyLocations]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (propertyLocations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      propertyLocations.forEach((loc) => 
        bounds.extend({ lat: loc.lat, lng: loc.lng })
      );
      map.fitBounds(bounds);
    }
  }, [propertyLocations]);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  // Handle escape key to exit full-screen
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullScreen) {
      setIsFullScreen(false);
    }
  }, [isFullScreen]);

  // Add/remove escape key listener
  React.useEffect(() => {
    if (isFullScreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullScreen, handleKeyDown]);

  // Trigger map resize when toggling full-screen
  React.useEffect(() => {
    if (mapRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        if (mapRef.current) {
          window.google?.maps?.event?.trigger(mapRef.current, 'resize');
        }
      }, 100);
    }
  }, [isFullScreen]);

  // Prevent body scroll when in full-screen mode
  React.useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isFullScreen]);

  return (
    <div className={`flex gap-6 h-[800px] transition-all duration-300 ease-in-out ${
      isFullScreen ? 'fixed inset-0 z-50 bg-white' : 'relative'
    }`}
    role="main"
    aria-label="Property map view">
      {/* Left Side - Property Grid (2 columns) - 40% width */}
      <div className={`flex flex-col transition-all duration-300 ease-in-out ${
        isFullScreen ? 'w-0 overflow-hidden opacity-0' : 'w-2/5 opacity-100'
      } ${isFullScreen ? 'hidden' : 'block'}`}>
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-4">
            {properties.map((property) => (
              <div 
                key={property.MLSNumber}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedProperty(property);
                }}
                onClickCapture={(e) => {
                  e.preventDefault();
                }}
                className="cursor-pointer"
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination */}
        <div className="pr-4 py-4 mt-4 border-t border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={properties.length}
            pageSize={12}
            onPageChange={onPageChange}
            showQuickNavigation={false}
            showResultsSummary={false}
          />
        </div>
      </div>

      {/* Right Side - Map - 60% width */}
      <div className={`relative transition-all duration-300 ease-in-out ${
        isFullScreen ? 'w-full' : 'w-3/5'
      }`}>
        {/* Full-screen toggle button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={toggleFullScreen}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200 transition-all duration-200 hover:shadow-xl"
            aria-label={isFullScreen ? 'Exit full-screen map' : 'Expand map to full-screen'}
            title={isFullScreen ? 'Press Esc or click to exit full-screen' : 'Click to expand map to full-screen'}
          >
            <Icon 
              name={isFullScreen ? 'minimize' : 'maximize'} 
              size="sm" 
              className="mr-2" 
            />
            <span className="hidden sm:inline">
              {isFullScreen ? 'Exit Full-Screen' : 'Expand Map'}
            </span>
            <span className="sm:hidden">
              {isFullScreen ? 'Exit' : 'Expand'}
            </span>
          </Button>
        </div>

        {/* Always show placeholder map for now since Google Maps API key is not configured */}
        <PlaceholderMap
          properties={properties}
          propertyLocations={propertyLocations}
          selectedProperty={selectedProperty}
          onPropertyClick={(property) => setSelectedProperty(property)}
        />
      </div>

      {/* Property Details Modal - Responsive */}
      {isMobile ? (
        <PropertyDetailsModalMobile
          isOpen={!!selectedProperty}
          property={selectedProperty || undefined}
          onClose={() => setSelectedProperty(null)}
        />
      ) : (
        <PropertyDetailsModal
          isOpen={!!selectedProperty}
          property={selectedProperty || undefined}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}

// Placeholder Map Component (used when Google Maps API is not available)
interface PlaceholderMapProps {
  properties: Property[];
  propertyLocations: any[];
  selectedProperty: Property | null;
  onPropertyClick: (property: Property) => void;
}

function PlaceholderMap({ properties, propertyLocations, selectedProperty, onPropertyClick }: PlaceholderMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

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
      className="relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden"
      onClick={() => setHoveredMarker(null)}
    >
      {/* Grid overlay to simulate map */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Placeholder map notice */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-md z-10 text-sm">
        <div className="flex items-center gap-2">
          <Icon name="alert" size="sm" />
          <span>Mock Map View (Google Maps API not configured)</span>
        </div>
      </div>

      {/* Property markers */}
      {propertyLocations.map((location) => {
        const property = properties.find(p => p.MLSNumber === location.mlsNumber);
        if (!property) return null;

        const { x, y } = toPixels(location.lat, location.lng);
        const isHovered = hoveredMarker === location.mlsNumber;

        return (
          <div
            key={location.mlsNumber}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              zIndex: isHovered ? 100 : 10,
            }}
            onClick={() => onPropertyClick(property)}
            onMouseEnter={() => setHoveredMarker(location.mlsNumber)}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            {/* Marker pin */}
            <div
              className={`relative flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-all ${
                isHovered ? 'scale-125' : 'scale-100'
              } ${
                property.IsNewListing ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{
                width: isHovered ? '44px' : '36px',
                height: isHovered ? '44px' : '36px',
              }}
            >
              <span className="text-white text-xs font-bold">
                {formatMarkerPrice(location.price)}
              </span>
            </div>

            {/* Enhanced Property Info Popup */}
            {isHovered && (
              <PropertyInfoPopupWithArrow
                property={property}
                onClose={() => setHoveredMarker(null)}
                onViewDetails={(prop) => {
                  onPropertyClick(prop);
                  setHoveredMarker(null);
                }}
                position="auto"
                offset={16}
              />
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="text-xs font-semibold mb-2">Legend</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-xs">Active Listing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-xs">New Listing</span>
          </div>
        </div>
      </div>

      {/* Showing count */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2 border border-gray-200">
        <div className="text-xs text-gray-600">
          Showing <span className="font-semibold">{propertyLocations.length}</span> properties
        </div>
      </div>
    </div>
  );
}