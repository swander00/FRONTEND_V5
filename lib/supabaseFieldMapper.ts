/**
 * Supabase Field Mapper
 * 
 * This file contains placeholder functions for mapping Supabase database fields
 * to the frontend Property type. Each section corresponds to a group of related fields.
 * 
 * HOW TO USE:
 * 1. Look at the section you want to map (e.g., "Core Identifiers")
 * 2. Find the corresponding field in your Supabase database
 * 3. Update the mapping function to return the correct value from dbProperty
 * 4. Test the mapping by fetching a property and verifying the values
 * 
 * EXAMPLE:
 * // Before:
 * mapListingKey: (dbProperty: any) => {
 *   return ''; // TODO: Map from Supabase field
 * }
 * 
 * // After:
 * mapListingKey: (dbProperty: any) => {
 *   return dbProperty.listing_key || '';
 * }
 */

import { Property } from '@/types';
import { SupabaseProperty } from './supabaseClient';

// ============================================================================
// FIELD MAPPER INTERFACE
// ============================================================================

/**
 * This interface defines all the mapping functions needed to transform
 * a Supabase property record into a frontend Property object.
 * 
 * Each function takes a SupabaseProperty (raw database row) and returns
 * the corresponding value for the frontend Property type.
 */
export interface PropertyFieldMapper {
  // Core Identifiers
  mapListingKey: (dbProperty: any) => string;
  
  // Address Fields
  mapUnparsedAddress: (dbProperty: any) => string;
  mapStreetNumber: (dbProperty: any) => string | undefined;
  mapStreetName: (dbProperty: any) => string | undefined;
  mapStreetSuffix: (dbProperty: any) => string | undefined;
  mapCity: (dbProperty: any) => string | undefined;
  mapCountyOrParish: (dbProperty: any) => string | undefined;
  mapCityRegion: (dbProperty: any) => string | undefined;
  mapStateOrProvince: (dbProperty: any) => string | undefined;
  mapPostalCode: (dbProperty: any) => string | undefined;
  mapUnitNumber: (dbProperty: any) => string | undefined;
  mapStreetAddress: (dbProperty: any) => string | undefined;
  mapCommunity: (dbProperty: any) => string | undefined;
  mapRegion: (dbProperty: any) => string | undefined;
  
  // Timestamp Fields
  mapOriginalEntryTimestamp: (dbProperty: any) => string | undefined;
  mapSoldConditionalEntryTimestamp: (dbProperty: any) => string | undefined;
  mapSoldEntryTimestamp: (dbProperty: any) => string | undefined;
  mapSuspendedEntryTimestamp: (dbProperty: any) => string | undefined;
  mapSuspendedDate: (dbProperty: any) => string | undefined;
  mapTerminatedEntryTimestamp: (dbProperty: any) => string | undefined;
  mapTerminatedDate: (dbProperty: any) => string | undefined;
  mapUnavailableDate: (dbProperty: any) => string | undefined;
  
  // Property Details
  mapMLSNumber: (dbProperty: any) => string | undefined;
  mapListPrice: (dbProperty: any) => number | undefined;
  mapClosePrice: (dbProperty: any) => number | undefined;
  mapMlsStatus: (dbProperty: any) => string | undefined;
  mapIsNewListing: (dbProperty: any) => boolean | undefined;
  mapBedrooms: (dbProperty: any) => number | undefined;
  mapBedroomsAboveGrade: (dbProperty: any) => number | undefined;
  mapBedroomsBelowGrade: (dbProperty: any) => number | undefined;
  mapBathrooms: (dbProperty: any) => number | undefined;
  mapKitchens: (dbProperty: any) => number | undefined;
  mapSquareFootage: (dbProperty: any) => string | undefined;
  mapSquareFootageMin: (dbProperty: any) => number | undefined;
  mapSquareFootageMax: (dbProperty: any) => number | undefined;
  mapPropertyType: (dbProperty: any) => string | undefined;
  mapSubType: (dbProperty: any) => string | undefined;
  mapPropertyClass: (dbProperty: any) => string | undefined;
  
  // Media Fields
  mapPrimaryImageUrl: (dbProperty: any) => string | undefined;
  mapImages: (dbProperty: any) => string[] | undefined;
  mapVirtualTourUrl: (dbProperty: any) => string | undefined;
  
  // Open House Fields
  mapOpenHouseDetails: (dbProperty: any) => string | undefined;
  mapOpenHouseDate: (dbProperty: any) => string | undefined;
  mapOpenHouseStartTime: (dbProperty: any) => string | undefined;
  mapOpenHouseEndTime: (dbProperty: any) => string | undefined;
  mapOpenHouseStatus: (dbProperty: any) => string | undefined;
  mapOpenHouseDateTime: (dbProperty: any) => string | undefined;
  
  // Marketing Fields
  mapDaysOnMarket: (dbProperty: any) => number | undefined;
  mapListDate: (dbProperty: any) => string | undefined;
  mapDescription: (dbProperty: any) => string | undefined;
  mapViews: (dbProperty: any) => number | undefined;
  mapLikes: (dbProperty: any) => number | undefined;
  mapShares: (dbProperty: any) => number | undefined;
  mapIsPremiumListing: (dbProperty: any) => boolean | undefined;
  
  // Property Features
  mapPropertyTaxes: (dbProperty: any) => number | undefined;
  mapTaxYear: (dbProperty: any) => number | undefined;
  mapLotSize: (dbProperty: any) => string | undefined;
  mapBasement: (dbProperty: any) => string | undefined;
  mapGarageSpaces: (dbProperty: any) => number | undefined;
  mapPropertyAge: (dbProperty: any) => string | undefined;
  mapHasFamilyRoom: (dbProperty: any) => boolean | undefined;
  mapHasFireplace: (dbProperty: any) => boolean | undefined;
  mapGarageParking: (dbProperty: any) => number | undefined;
  mapDriveParking: (dbProperty: any) => number | undefined;
  mapTotalParking: (dbProperty: any) => number | undefined;
  mapParkingType: (dbProperty: any) => string | undefined;
  
  // Rental/Lease Fields
  mapRentIncludes: (dbProperty: any) => string | undefined;
  mapFurnished: (dbProperty: any) => string | undefined;
  mapMaintenanceFee: (dbProperty: any) => number | undefined;
  mapFeeIncludes: (dbProperty: any) => string | undefined;
  
  // Condo/Building Features
  mapCondoAmenities: (dbProperty: any) => string | undefined;
  mapPets: (dbProperty: any) => string | undefined;
  mapLocker: (dbProperty: any) => string | undefined;
  mapBalcony: (dbProperty: any) => string | undefined;
  mapPOTLFee: (dbProperty: any) => string | undefined;
  
  // Property Amenities
  mapSwimmingPool: (dbProperty: any) => string | undefined;
  mapWaterfront: (dbProperty: any) => boolean | undefined;
  mapInteriorFeatures: (dbProperty: any) => string | undefined;
  mapExteriorFeatures: (dbProperty: any) => string | undefined;
  mapOtherFeatures: (dbProperty: any) => string | undefined;
  mapPossession: (dbProperty: any) => string | undefined;
  
  // System Fields
  mapCreatedAt: (dbProperty: any) => string | undefined;
  mapUpdatedAt: (dbProperty: any) => string | undefined;
  mapOriginalPrice: (dbProperty: any) => number | undefined;
  mapListingEnd: (dbProperty: any) => string | undefined;
  
  // Sale/Lease Overlay Fields
  mapSalePrice: (dbProperty: any) => number | undefined;
  mapSaleDate: (dbProperty: any) => string | undefined;
  mapLeasePrice: (dbProperty: any) => number | undefined;
  mapLeaseStartDate: (dbProperty: any) => string | undefined;
  mapRemovalDate: (dbProperty: any) => string | undefined;
}

// ============================================================================
// PLACEHOLDER FIELD MAPPER
// ============================================================================

/**
 * This is the placeholder mapper with empty implementations.
 * Replace each TODO with the actual mapping logic.
 * 
 * INSTRUCTIONS:
 * 1. Start with the most important fields (ListingKey, Address, Price, etc.)
 * 2. Map one field at a time
 * 3. Test each mapping before moving to the next
 * 4. Use optional chaining (?.) and nullish coalescing (??) for safety
 */
export const fieldMapper: PropertyFieldMapper = {
  // ============================================================================
  // CORE IDENTIFIERS
  // ============================================================================
  
  mapListingKey: (dbProperty: any) => {
    // TODO: Map from Supabase field
    // Example: return dbProperty.listing_key || dbProperty.ListingKey || '';
    return '';
  },
  
  // ============================================================================
  // ADDRESS FIELDS
  // ============================================================================
  
  mapUnparsedAddress: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return '';
  },
  
  mapStreetNumber: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapStreetName: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapStreetSuffix: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapCity: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapCountyOrParish: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapCityRegion: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapStateOrProvince: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapPostalCode: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapUnitNumber: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapStreetAddress: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapCommunity: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapRegion: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // TIMESTAMP FIELDS
  // ============================================================================
  
  mapOriginalEntryTimestamp: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSoldConditionalEntryTimestamp: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSoldEntryTimestamp: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSuspendedEntryTimestamp: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSuspendedDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapTerminatedEntryTimestamp: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapTerminatedDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapUnavailableDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // PROPERTY DETAILS
  // ============================================================================
  
  mapMLSNumber: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapListPrice: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapClosePrice: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapMlsStatus: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapIsNewListing: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapBedrooms: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapBedroomsAboveGrade: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapBedroomsBelowGrade: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapBathrooms: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapKitchens: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSquareFootage: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSquareFootageMin: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSquareFootageMax: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapPropertyType: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSubType: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapPropertyClass: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // MEDIA FIELDS
  // ============================================================================
  
  mapPrimaryImageUrl: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapImages: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapVirtualTourUrl: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // OPEN HOUSE FIELDS
  // ============================================================================
  
  mapOpenHouseDetails: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapOpenHouseDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapOpenHouseStartTime: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapOpenHouseEndTime: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapOpenHouseStatus: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapOpenHouseDateTime: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // MARKETING FIELDS
  // ============================================================================
  
  mapDaysOnMarket: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapListDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapDescription: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapViews: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapLikes: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapShares: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapIsPremiumListing: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // PROPERTY FEATURES
  // ============================================================================
  
  mapPropertyTaxes: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapTaxYear: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapLotSize: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapBasement: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapGarageSpaces: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapPropertyAge: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapHasFamilyRoom: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapHasFireplace: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapGarageParking: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapDriveParking: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapTotalParking: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapParkingType: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // RENTAL/LEASE FIELDS
  // ============================================================================
  
  mapRentIncludes: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapFurnished: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapMaintenanceFee: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapFeeIncludes: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // CONDO/BUILDING FEATURES
  // ============================================================================
  
  mapCondoAmenities: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapPets: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapLocker: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapBalcony: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapPOTLFee: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // PROPERTY AMENITIES
  // ============================================================================
  
  mapSwimmingPool: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapWaterfront: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapInteriorFeatures: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapExteriorFeatures: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapOtherFeatures: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapPossession: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // SYSTEM FIELDS
  // ============================================================================
  
  mapCreatedAt: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapUpdatedAt: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapOriginalPrice: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapListingEnd: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  // ============================================================================
  // SALE/LEASE OVERLAY FIELDS
  // ============================================================================
  
  mapSalePrice: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapSaleDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapLeasePrice: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapLeaseStartDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
  
  mapRemovalDate: (dbProperty: any) => {
    // TODO: Map from Supabase field
    return undefined;
  },
};

// ============================================================================
// MAIN MAPPING FUNCTION
// ============================================================================

/**
 * Maps a Supabase property record to a frontend Property object
 * 
 * @param dbProperty - Raw property data from Supabase
 * @returns Mapped Property object for the frontend
 */
export function mapSupabasePropertyToFrontend(dbProperty: any): Property {
  return {
    // Core Identifiers
    ListingKey: fieldMapper.mapListingKey(dbProperty),
    
    // Address Fields
    UnparsedAddress: fieldMapper.mapUnparsedAddress(dbProperty),
    StreetNumber: fieldMapper.mapStreetNumber(dbProperty),
    StreetName: fieldMapper.mapStreetName(dbProperty),
    StreetSuffix: fieldMapper.mapStreetSuffix(dbProperty),
    City: fieldMapper.mapCity(dbProperty),
    CountyOrParish: fieldMapper.mapCountyOrParish(dbProperty),
    CityRegion: fieldMapper.mapCityRegion(dbProperty),
    StateOrProvince: fieldMapper.mapStateOrProvince(dbProperty),
    PostalCode: fieldMapper.mapPostalCode(dbProperty),
    UnitNumber: fieldMapper.mapUnitNumber(dbProperty),
    StreetAddress: fieldMapper.mapStreetAddress(dbProperty),
    Community: fieldMapper.mapCommunity(dbProperty),
    Region: fieldMapper.mapRegion(dbProperty),
    
    // Timestamp Fields
    OriginalEntryTimestamp: fieldMapper.mapOriginalEntryTimestamp(dbProperty),
    SoldConditionalEntryTimestamp: fieldMapper.mapSoldConditionalEntryTimestamp(dbProperty),
    SoldEntryTimestamp: fieldMapper.mapSoldEntryTimestamp(dbProperty),
    SuspendedEntryTimestamp: fieldMapper.mapSuspendedEntryTimestamp(dbProperty),
    SuspendedDate: fieldMapper.mapSuspendedDate(dbProperty),
    TerminatedEntryTimestamp: fieldMapper.mapTerminatedEntryTimestamp(dbProperty),
    TerminatedDate: fieldMapper.mapTerminatedDate(dbProperty),
    UnavailableDate: fieldMapper.mapUnavailableDate(dbProperty),
    
    // Property Details
    MLSNumber: fieldMapper.mapMLSNumber(dbProperty),
    ListPrice: fieldMapper.mapListPrice(dbProperty),
    ClosePrice: fieldMapper.mapClosePrice(dbProperty),
    MlsStatus: fieldMapper.mapMlsStatus(dbProperty),
    IsNewListing: fieldMapper.mapIsNewListing(dbProperty),
    Bedrooms: fieldMapper.mapBedrooms(dbProperty),
    BedroomsAboveGrade: fieldMapper.mapBedroomsAboveGrade(dbProperty),
    BedroomsBelowGrade: fieldMapper.mapBedroomsBelowGrade(dbProperty),
    Bathrooms: fieldMapper.mapBathrooms(dbProperty),
    Kitchens: fieldMapper.mapKitchens(dbProperty),
    SquareFootage: fieldMapper.mapSquareFootage(dbProperty),
    SquareFootageMin: fieldMapper.mapSquareFootageMin(dbProperty),
    SquareFootageMax: fieldMapper.mapSquareFootageMax(dbProperty),
    PropertyType: fieldMapper.mapPropertyType(dbProperty),
    SubType: fieldMapper.mapSubType(dbProperty),
    PropertyClass: fieldMapper.mapPropertyClass(dbProperty),
    
    // Media Fields
    PrimaryImageUrl: fieldMapper.mapPrimaryImageUrl(dbProperty),
    images: fieldMapper.mapImages(dbProperty),
    VirtualTourUrl: fieldMapper.mapVirtualTourUrl(dbProperty),
    
    // Open House Fields
    OpenHouseDetails: fieldMapper.mapOpenHouseDetails(dbProperty),
    OpenHouseDate: fieldMapper.mapOpenHouseDate(dbProperty),
    OpenHouseStartTime: fieldMapper.mapOpenHouseStartTime(dbProperty),
    OpenHouseEndTime: fieldMapper.mapOpenHouseEndTime(dbProperty),
    OpenHouseStatus: fieldMapper.mapOpenHouseStatus(dbProperty),
    OpenHouseDateTime: fieldMapper.mapOpenHouseDateTime(dbProperty),
    
    // Marketing Fields
    DaysOnMarket: fieldMapper.mapDaysOnMarket(dbProperty),
    ListDate: fieldMapper.mapListDate(dbProperty),
    Description: fieldMapper.mapDescription(dbProperty),
    Views: fieldMapper.mapViews(dbProperty),
    Likes: fieldMapper.mapLikes(dbProperty),
    Shares: fieldMapper.mapShares(dbProperty),
    IsPremiumListing: fieldMapper.mapIsPremiumListing(dbProperty),
    
    // Property Features
    PropertyTaxes: fieldMapper.mapPropertyTaxes(dbProperty),
    TaxYear: fieldMapper.mapTaxYear(dbProperty),
    LotSize: fieldMapper.mapLotSize(dbProperty),
    Basement: fieldMapper.mapBasement(dbProperty),
    GarageSpaces: fieldMapper.mapGarageSpaces(dbProperty),
    PropertyAge: fieldMapper.mapPropertyAge(dbProperty),
    HasFamilyRoom: fieldMapper.mapHasFamilyRoom(dbProperty),
    HasFireplace: fieldMapper.mapHasFireplace(dbProperty),
    GarageParking: fieldMapper.mapGarageParking(dbProperty),
    DriveParking: fieldMapper.mapDriveParking(dbProperty),
    TotalParking: fieldMapper.mapTotalParking(dbProperty),
    ParkingType: fieldMapper.mapParkingType(dbProperty),
    
    // Rental/Lease Fields
    RentIncludes: fieldMapper.mapRentIncludes(dbProperty),
    Furnished: fieldMapper.mapFurnished(dbProperty),
    MaintenanceFee: fieldMapper.mapMaintenanceFee(dbProperty),
    FeeIncludes: fieldMapper.mapFeeIncludes(dbProperty),
    
    // Condo/Building Features
    CondoAmenities: fieldMapper.mapCondoAmenities(dbProperty),
    Pets: fieldMapper.mapPets(dbProperty),
    Locker: fieldMapper.mapLocker(dbProperty),
    Balcony: fieldMapper.mapBalcony(dbProperty),
    POTLFee: fieldMapper.mapPOTLFee(dbProperty),
    
    // Property Amenities
    SwimmingPool: fieldMapper.mapSwimmingPool(dbProperty),
    Waterfront: fieldMapper.mapWaterfront(dbProperty),
    InteriorFeatures: fieldMapper.mapInteriorFeatures(dbProperty),
    ExteriorFeatures: fieldMapper.mapExteriorFeatures(dbProperty),
    OtherFeatures: fieldMapper.mapOtherFeatures(dbProperty),
    Possession: fieldMapper.mapPossession(dbProperty),
    
    // System Fields
    CreatedAt: fieldMapper.mapCreatedAt(dbProperty),
    UpdatedAt: fieldMapper.mapUpdatedAt(dbProperty),
    OriginalPrice: fieldMapper.mapOriginalPrice(dbProperty),
    ListingEnd: fieldMapper.mapListingEnd(dbProperty),
    
    // Sale/Lease Overlay Fields
    SalePrice: fieldMapper.mapSalePrice(dbProperty),
    SaleDate: fieldMapper.mapSaleDate(dbProperty),
    LeasePrice: fieldMapper.mapLeasePrice(dbProperty),
    LeaseStartDate: fieldMapper.mapLeaseStartDate(dbProperty),
    RemovalDate: fieldMapper.mapRemovalDate(dbProperty),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper function to safely parse numbers from database values
 */
export function parseNumber(value: any): number | undefined {
  if (value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Helper function to safely parse booleans from database values
 */
export function parseBoolean(value: any): boolean | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === 'yes' || lower === '1') return true;
    if (lower === 'false' || lower === 'no' || lower === '0') return false;
  }
  if (typeof value === 'number') return value !== 0;
  return undefined;
}

/**
 * Helper function to safely parse dates from database values
 */
export function parseDate(value: any): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return undefined;
}

/**
 * Helper function to safely parse arrays from database values
 */
export function parseArray(value: any): string[] | undefined {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // Try to parse JSON array
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      // If not JSON, try comma-separated
      return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
  }
  return undefined;
}

