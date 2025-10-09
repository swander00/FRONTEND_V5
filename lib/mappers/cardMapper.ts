/**
 * Property Card Mapper
 * 
 * Maps only the essential fields needed for property cards/listings.
 * This is a lightweight mapper for list views and search results.
 * 
 * FIELDS INCLUDED:
 * - Core identifier (ListingKey)
 * - Address (for display)
 * - Price
 * - Basic stats (beds, baths, sqft)
 * - Property type
 * - Primary image
 * - Status
 * - Optional: Days on market, open house indicator
 * 
 * For full property details, use detailsMapper.ts
 */

import { Property } from '@/types';
import { sharedMappers } from './shared';

/**
 * Lightweight property object for cards
 * Contains only essential display fields
 */
export interface PropertyCard {
  // Core Identifiers
  ListingKey: string;
  
  // Address Fields
  UnparsedAddress: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  
  // Basic Property Details
  MLSNumber?: string;
  ListPrice?: number;
  Bedrooms?: number;
  Bathrooms?: number;
  SquareFootage?: string;
  PropertyType?: string;
  MlsStatus?: string;
  
  // Media
  PrimaryImageUrl?: string;
  images?: string[];
  
  // Quick Info
  DaysOnMarket?: number;
  IsNewListing?: boolean;
  OpenHouseDate?: string; // To show "Open House" badge
}

/**
 * Card-specific mappers (beyond what's in shared)
 */
const cardMappers = {
  mapDaysOnMarket: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapIsNewListing: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },

  mapOpenHouseDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
};

/**
 * Maps a Supabase property record to a lightweight PropertyCard object
 * Use this for list views, search results, and map markers
 * 
 * @param dbProperty - Raw property data from Supabase
 * @returns Mapped PropertyCard object
 */
export function mapSupabasePropertyToCard(dbProperty: any): PropertyCard {
  return {
    // Core Identifiers
    ListingKey: sharedMappers.mapListingKey(dbProperty),
    
    // Address Fields
    UnparsedAddress: sharedMappers.mapUnparsedAddress(dbProperty),
    StreetNumber: sharedMappers.mapStreetNumber(dbProperty),
    StreetName: sharedMappers.mapStreetName(dbProperty),
    StreetSuffix: sharedMappers.mapStreetSuffix(dbProperty),
    City: sharedMappers.mapCity(dbProperty),
    StateOrProvince: sharedMappers.mapStateOrProvince(dbProperty),
    PostalCode: sharedMappers.mapPostalCode(dbProperty),
    
    // Basic Property Details
    MLSNumber: sharedMappers.mapMLSNumber(dbProperty),
    ListPrice: sharedMappers.mapListPrice(dbProperty),
    Bedrooms: sharedMappers.mapBedrooms(dbProperty),
    Bathrooms: sharedMappers.mapBathrooms(dbProperty),
    SquareFootage: sharedMappers.mapSquareFootage(dbProperty),
    PropertyType: sharedMappers.mapPropertyType(dbProperty),
    MlsStatus: sharedMappers.mapMlsStatus(dbProperty),
    
    // Media
    PrimaryImageUrl: sharedMappers.mapPrimaryImageUrl(dbProperty),
    images: sharedMappers.mapImages(dbProperty),
    
    // Quick Info
    DaysOnMarket: cardMappers.mapDaysOnMarket(dbProperty),
    IsNewListing: cardMappers.mapIsNewListing(dbProperty),
    OpenHouseDate: cardMappers.mapOpenHouseDate(dbProperty),
  };
}

/**
 * Supabase query fields for card data
 * Use this string in your .select() calls to fetch only needed columns
 * 
 * Example:
 * const { data } = await supabase
 *   .from('properties')
 *   .select(PROPERTY_CARD_FIELDS)
 */
export const PROPERTY_CARD_FIELDS = `
  listing_key,
  unparsed_address,
  street_number,
  street_name,
  street_suffix,
  city,
  state_or_province,
  postal_code,
  mls_number,
  list_price,
  bedrooms,
  bathrooms,
  square_footage,
  property_type,
  mls_status,
  primary_image_url,
  images,
  days_on_market,
  is_new_listing,
  open_house_date
`.trim().replace(/\s+/g, ',');

