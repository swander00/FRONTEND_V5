
export interface Property {
  // Core identifiers
  ListingKey: string;
  
  // Address fields
  UnparsedAddress: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  City?: string;
  CountyOrParish?: string;
  CityRegion?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  UnitNumber?: string;
  
  // Computed address fields
  StreetAddress?: string;
  Community?: string;
  Region?: string;
  
  // Timestamp fields
  OriginalEntryTimestamp?: string;
  SoldConditionalEntryTimestamp?: string;
  SoldEntryTimestamp?: string;
  SuspendedEntryTimestamp?: string;
  SuspendedDate?: string;
  TerminatedEntryTimestamp?: string;
  TerminatedDate?: string;
  UnavailableDate?: string;
  
  // Legacy fields (kept for backward compatibility but will be undefined)
  MLSNumber?: string;
  ListPrice?: number;
  ClosePrice?: number;
  MlsStatus?: string;
  IsNewListing?: boolean;
  Bedrooms?: number;
  BedroomsAboveGrade?: number;
  BedroomsBelowGrade?: number;
  Bathrooms?: number;
  Kitchens?: number;
  SquareFootage?: string;
  SquareFootageMin?: number;
  SquareFootageMax?: number;
  PropertyType?: string;
  propertyType?: string;
  SubType?: string;
  PropertyClass?: string;
  status?: string;
  PrimaryImageUrl?: string;
  images?: string[];
  VirtualTourUrl?: string;
  VirtualTourURL?: string;
  OpenHouseDetails?: string;
  OpenHouseDate?: string;
  OpenHouseStartTime?: string;
  OpenHouseEndTime?: string;
  OpenHouseStatus?: string;
  OpenHouseDateTime?: string;
  DaysOnMarket?: number;
  ListDate?: string;
  PropertyTaxes?: number;
  TaxYear?: number;
  LotSize?: string;
  Basement?: string;
  GarageSpaces?: number;
  PropertyAge?: string;
  Description?: string;
  HasFamilyRoom?: boolean;
  HasFireplace?: boolean;
  GarageParking?: number;
  DriveParking?: number;
  TotalParking?: number;
  ParkingType?: string;
  RentIncludes?: string;
  Furnished?: string;
  MaintenanceFee?: number;
  FeeIncludes?: string;
  CondoAmenities?: string;
  Pets?: string;
  Locker?: string;
  Balcony?: string;
  POTLFee?: string;
  SwimmingPool?: string;
  Waterfront?: boolean;
  InteriorFeatures?: string;
  ExteriorFeatures?: string;
  OtherFeatures?: string;
  Possession?: string;
  RoomType?: string;
  RoomLevel?: string;
  RoomDimensions?: string;
  RoomFeatures?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  OriginalPrice?: number;
  ListingEnd?: string;
  Views?: number;
  Likes?: number;
  Shares?: number;
  IsPremiumListing?: boolean;
  
  // Additional fields for property overlays and status
  salePrice?: number;
  saleDate?: string;
  leasePrice?: number;
  leaseStartDate?: string;
  removalDate?: string;
  
  // Properly cased overlay fields (from RESO/TRREB)
  SalePrice?: number;
  SaleDate?: string;
  LeasePrice?: number;
  LeaseStartDate?: string;
  RemovalDate?: string;
}

/**
 * TRREB Image Group Interface
 * Represents a group of related images with different size variants
 */
export interface TRREBImageGroup {
  base: string;                    // Base MediaKey without size suffix
  preferred: boolean;              // Whether this is the preferred image
  order: number;                   // Display order
  variants: {
    thumbnail?: string;            // -t suffix
    medium?: string;               // -m suffix
    large?: string;                // -l suffix
    original?: string;             // -nw suffix
    standard?: string;             // No suffix
  };
}

/**
 * Media Record Interface
 * Complete media data from the media table
 */
export interface MediaRecord {
  // Core identifiers
  ResourceRecordKey: string;        // Property identifier (ListingKey)
  MediaKey: string;                 // Unique media identifier
  MediaObjectID?: string;           // Groups size variants of same image
  
  // Media content
  MediaURL: string;                 // Direct URL to media file
  MediaCategory: string;            // e.g., 'Photo', 'Video', 'Floor Plan'
  MediaType: string;                // e.g., 'image/jpeg', 'pdf'
  MediaStatus: string;              // 'Active' or 'Inactive'
  
  // Display properties
  Order: number;                    // Display order (0 = main photo)
  PreferredPhotoYN: boolean;        // Boolean flag for preferred photo
  ImageSizeDescription: string;     // e.g., 'Thumbnail', 'Largest'
  
  // Descriptions
  ShortDescription?: string;        // Short description of media
  ImageOf?: string;                 // What the image shows
  
  // Classification
  ClassName: string;                // e.g., 'ResidentialCondo', 'ResidentialFree'
  ResourceName: string;             // Resource type (e.g., 'Property')
  OriginatingSystemID: string;      // Originating system identifier
  
  // Timestamps
  MediaModificationTimestamp: string; // When media content was modified
  ModificationTimestamp: string;    // When record was modified
  CreatedAt: string;                // Record creation timestamp
  UpdatedAt: string;                // Record update timestamp
}

/**
 * Frontend Media Interface
 * Simplified media data for frontend display
 */
export interface FrontendMedia {
  id: string;                       // MediaKey
  url: string;                      // MediaURL
  type: string;                     // MediaType
  category: string;                 // MediaCategory
  order: number;                    // Order
  isPrimary: boolean;               // PreferredPhotoYN
  size: string;                     // ImageSizeDescription
  description?: string;             // ShortDescription
  imageOf?: string;                 // ImageOf
  className: string;                // ClassName
  createdAt: string;                // CreatedAt
  updatedAt: string;                // UpdatedAt
}

/**
 * Legacy TRREB Media Record Interface (for backward compatibility)
 * @deprecated Use MediaRecord instead
 */
export interface TRREBMediaRecord {
  MediaKey: string;
  MediaURL: string;
  MediaType: string;
  MediaCategory?: string;
  Order?: number;
  PreferredPhotoYN?: boolean;
  ShortDescription?: string;
  ListingKey: string;
}

export interface PropertyWithCoords extends Property {
  lat: number;
  lng: number;
}

export interface PropertyStatusConfig {
  badgeText: string;
  badgeColorClass: string;
  showNewListingRibbon: boolean;
  overlayComponent: React.ComponentType<any> | null;
}

export interface PropertyDetailsData {
  propertyType: string
  bedrooms: string
  bathrooms: string
  subType: string
  garages: string
  lotSize: string
  squareFootage: string
  basement: string
  propertyAge: string
  daysOnMarket: string
}

export interface Room {
  MLSNumber: string;
  RoomType: string;
  RoomLevel?: string;
  RoomDimensions?: string;
  RoomFeatures?: string;
}

export interface Basement {
  MLSNumber: string;
  basementType: string;
  status: string;
  entrance: string;
  kitchen: boolean;
  features?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Utility {
  MLSNumber: string;
  utilityType: string; // heating, cooling, water, sewer
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}