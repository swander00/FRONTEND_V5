// Mock map data for property markers
// Toronto neighborhoods with realistic coordinates

export interface PropertyLocation {
  lat: number;
  lng: number;
  mlsNumber: string;
  price: number;
  address: string;
  propertyType: string;
}

// Toronto neighborhood coordinates
const TORONTO_NEIGHBORHOODS = {
  downtown: { lat: 43.6532, lng: -79.3832 },
  queenWest: { lat: 43.6437, lng: -79.4191 },
  littleItaly: { lat: 43.6549, lng: -79.4193 },
  financialDistrict: { lat: 43.6489, lng: -79.3817 },
  midtown: { lat: 43.7026, lng: -79.3977 },
  yongeEglinton: { lat: 43.7068, lng: -79.3975 },
  annex: { lat: 43.6686, lng: -79.4031 },
  kingWest: { lat: 43.6440, lng: -79.4024 }
};

/**
 * Generate mock property locations with realistic Toronto coordinates
 * Maps MLS numbers to specific neighborhood locations with slight randomization
 */
export function getMockPropertyLocations(): Map<string, PropertyLocation> {
  const locations = new Map<string, PropertyLocation>();

  // Map specific properties to neighborhoods
  const propertyNeighborhoodMap: { [key: string]: { lat: number; lng: number } } = {
    'W1234567': TORONTO_NEIGHBORHOODS.downtown,
    'W2345678': TORONTO_NEIGHBORHOODS.queenWest,
    'W3456789': TORONTO_NEIGHBORHOODS.littleItaly,
    'W4567890': TORONTO_NEIGHBORHOODS.financialDistrict,
    'W5678901': TORONTO_NEIGHBORHOODS.midtown,
    'W6789012': TORONTO_NEIGHBORHOODS.yongeEglinton,
    'W7890123': TORONTO_NEIGHBORHOODS.annex,
    'W8901234': TORONTO_NEIGHBORHOODS.kingWest,
    'W9012345': TORONTO_NEIGHBORHOODS.financialDistrict,
    'W0123456': TORONTO_NEIGHBORHOODS.littleItaly,
  };

  return locations;
}

/**
 * Get location for a specific property by MLS number
 * Generates consistent coordinates based on the property's neighborhood
 */
export function getPropertyLocation(
  mlsNumber: string,
  address: string,
  price: number,
  propertyType: string,
  community?: string
): PropertyLocation {
  // Default to downtown Toronto
  let baseLocation = TORONTO_NEIGHBORHOODS.downtown;

  // Map community names to neighborhoods
  const communityMap: { [key: string]: { lat: number; lng: number } } = {
    'Downtown': TORONTO_NEIGHBORHOODS.downtown,
    'Queen West': TORONTO_NEIGHBORHOODS.queenWest,
    'Little Italy': TORONTO_NEIGHBORHOODS.littleItaly,
    'Financial District': TORONTO_NEIGHBORHOODS.financialDistrict,
    'Midtown': TORONTO_NEIGHBORHOODS.midtown,
    'Yonge-Eglinton': TORONTO_NEIGHBORHOODS.yongeEglinton,
    'Annex': TORONTO_NEIGHBORHOODS.annex,
    'King West': TORONTO_NEIGHBORHOODS.kingWest,
  };

  // Use community to determine location
  if (community && communityMap[community]) {
    baseLocation = communityMap[community];
  }

  // Add small random offset for each property (0.002-0.008 degrees, roughly 200-800m)
  // Use MLS number as seed for consistent positioning across renders
  const seed = mlsNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomLat = ((seed % 100) / 100) * 0.006 + 0.002;
  const randomLng = (((seed * 2) % 100) / 100) * 0.006 + 0.002;
  
  // Alternate between positive and negative offsets
  const latOffset = seed % 2 === 0 ? randomLat : -randomLat;
  const lngOffset = (seed * 3) % 2 === 0 ? randomLng : -randomLng;

  return {
    lat: baseLocation.lat + latOffset,
    lng: baseLocation.lng + lngOffset,
    mlsNumber,
    price,
    address,
    propertyType,
  };
}

/**
 * Get all property locations from a list of properties
 */
export function getPropertyLocations(properties: any[]): PropertyLocation[] {
  return properties.map(property => 
    getPropertyLocation(
      property.MLSNumber || property.ListingKey,
      property.StreetAddress || property.UnparsedAddress,
      property.ListPrice || 0,
      property.PropertyType || 'Unknown',
      property.Community
    )
  );
}

/**
 * Calculate bounds for a set of property locations
 */
export function calculateBounds(locations: PropertyLocation[]): {
  north: number;
  south: number;
  east: number;
  west: number;
  center: { lat: number; lng: number };
} {
  if (locations.length === 0) {
    return {
      north: TORONTO_NEIGHBORHOODS.downtown.lat + 0.05,
      south: TORONTO_NEIGHBORHOODS.downtown.lat - 0.05,
      east: TORONTO_NEIGHBORHOODS.downtown.lng + 0.05,
      west: TORONTO_NEIGHBORHOODS.downtown.lng - 0.05,
      center: TORONTO_NEIGHBORHOODS.downtown,
    };
  }

  const lats = locations.map(loc => loc.lat);
  const lngs = locations.map(loc => loc.lng);

  const north = Math.max(...lats);
  const south = Math.min(...lats);
  const east = Math.max(...lngs);
  const west = Math.min(...lngs);

  return {
    north,
    south,
    east,
    west,
    center: {
      lat: (north + south) / 2,
      lng: (east + west) / 2,
    },
  };
}

/**
 * Format price for display on map marker
 */
export function formatMarkerPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}K`;
  }
  return `$${price}`;
}

