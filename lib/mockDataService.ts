// Clean mock data service for real estate application
// This replaces all Supabase functionality with mock data

import { Property } from '@/types';

// ============================================================================
// MOCK PROPERTY DATA
// ============================================================================

export const mockProperties: Property[] = [
  {
    // Property Card Fields
    ListingKey: 'W1234567',
    UnparsedAddress: '123 Main Street',
    MLSNumber: 'W1234567',
    StreetAddress: '123 Main Street',
    StreetNumber: '123',
    StreetName: 'Main',
    StreetSuffix: 'Street',
    Community: 'Downtown',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 750000,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: true,
    Bedrooms: 3,
    BedroomsAboveGrade: 3,
    BedroomsBelowGrade: 1,
    Bathrooms: 2,
    SquareFootage: '1800',
    SquareFootageMin: 1700,
    SquareFootageMax: 1900,
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    ],
    VirtualTourUrl: 'https://my.matterport.com/show/?m=example',
    // Open House Information
    OpenHouseDetails: 'Sat, Jan 15, 2:00-4:00 PM',
    DaysOnMarket: 5,

    // Property Details Page Fields
    // Header Section
    IsPremiumListing: true,
    Views: 156,
    Likes: 23,
    Shares: 8,

    // Highlights Card
    PropertyType: 'house',
    propertyType: 'house',
    SubType: 'Detached',
    LotSize: '30x120',
    Basement: 'Finished',
    GarageSpaces: 2,
    PropertyAge: '15',

    // Description Card
    Description: 'Beautiful family home in the heart of downtown Toronto. This well-maintained property features modern amenities and is perfect for families looking for convenience and comfort. Features include hardwood floors, updated kitchen, and finished basement.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 750000,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'buy',
    Kitchens: 2,
    HasFamilyRoom: true,
    HasFireplace: true,

    // Parking Section
    DriveParking: 2,
    GarageParking: 2,
    TotalParking: 4,

    // Lease Terms Section
    RentIncludes: undefined,
    Furnished: undefined,

    // Condo Information Section
    MaintenanceFee: undefined,
    FeeIncludes: 'N/A',
    CondoAmenities: 'N/A',
    Pets: 'Negotiable',
    Locker: 'N/A',
    Balcony: 'N/A',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Hardwood Floors, Updated Kitchen, Finished Basement',
    ExteriorFeatures: 'Deck, Garden, Driveway',
    OtherFeatures: 'Security System, Smart Home Features',
  },
  {
    // Property Card Fields
    ListingKey: 'W2345678',
    UnparsedAddress: '456 Queen Street West',
    MLSNumber: 'W2345678',
    StreetAddress: '456 Queen Street West',
    StreetNumber: '456',
    StreetName: 'Queen Street',
    StreetSuffix: 'West',
    Community: 'Queen West',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 550000,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: false,
    Bedrooms: 2,
    Bathrooms: 1,
    SquareFootage: '950',
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
    ],
    // Open House Information
    OpenHouseDetails: undefined, // No open house
    DaysOnMarket: 8,

    // Property Details Page Fields
    // Header Section
    IsPremiumListing: false,
    Views: 89,
    Likes: 12,
    Shares: 3,

    // Highlights Card
    PropertyType: 'condo',
    propertyType: 'condo',
    SubType: 'Apartment',
    LotSize: 'N/A',
    Basement: 'N/A',
    GarageSpaces: 0,
    PropertyAge: '5',

    // Description Card
    Description: 'Modern condo in the vibrant Queen West neighborhood. Walking distance to restaurants, shops, and public transit. Features include balcony, in-suite laundry, and underground parking.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 550000,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'buy',
    Kitchens: 1,
    HasFamilyRoom: false,
    HasFireplace: false,

    // Parking Section
    DriveParking: 1,
    GarageParking: 0,
    TotalParking: 1,

    // Lease Terms Section
    RentIncludes: undefined,
    Furnished: undefined,

    // Condo Information Section
    MaintenanceFee: 450,
    FeeIncludes: 'Heat, Water, Cable',
    CondoAmenities: 'Fitness Center, Party Room, Concierge',
    Pets: 'Small pets allowed',
    Locker: 'Included',
    Balcony: 'Yes',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Balcony, In-suite Laundry, Underground Parking',
    ExteriorFeatures: 'Balcony, City View',
    OtherFeatures: 'Concierge, Fitness Center, Party Room',
  },
  {
    // Property Card Fields
    ListingKey: 'W3456789',
    UnparsedAddress: '789 College Street',
    MLSNumber: 'W3456789',
    StreetAddress: '789 College Street',
    StreetNumber: '789',
    StreetName: 'College',
    StreetSuffix: 'Street',
    Community: 'Little Italy',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 3200,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: false,
    Bedrooms: 3,
    BedroomsAboveGrade: 3,
    BedroomsBelowGrade: 0,
    Bathrooms: 2,
    SquareFootage: '1600',
    SquareFootageMin: 1500,
    SquareFootageMax: 1700,
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'],
    // Open House Information
    OpenHouseDetails: undefined, // No open house
    DaysOnMarket: 15,

    // Property Details Page Fields
    // Header Section
    IsPremiumListing: false,
    Views: 67,
    Likes: 8,
    Shares: 2,

    // Highlights Card
    PropertyType: 'house',
    propertyType: 'house',
    SubType: 'Semi-Detached',
    LotSize: '25x100',
    Basement: 'Unfinished',
    GarageSpaces: 0,
    PropertyAge: '25',

    // Description Card
    Description: 'Charming semi-detached home available for lease in Little Italy. Close to restaurants, cafes, and public transit. Features include backyard, updated appliances, and storage.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 3200,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'lease',
    Kitchens: 1,
    HasFamilyRoom: true,
    HasFireplace: false,

    // Parking Section
    DriveParking: 1,
    GarageParking: 0,
    TotalParking: 1,

    // Lease Terms Section
    RentIncludes: 'Heat, Water',
    Furnished: 'Unfurnished',

    // Condo Information Section
    MaintenanceFee: undefined,
    FeeIncludes: 'N/A',
    CondoAmenities: 'N/A',
    Pets: 'Negotiable',
    Locker: 'N/A',
    Balcony: 'N/A',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Backyard, Updated Appliances, Storage',
    ExteriorFeatures: 'Backyard, Front Porch, Driveway',
    OtherFeatures: 'Laundry Hookup, Storage Shed',
  },
  {
    // Property Card Fields
    ListingKey: 'W4567890',
    UnparsedAddress: '321 Bay Street',
    MLSNumber: 'W4567890',
    StreetAddress: '321 Bay Street',
    StreetNumber: '321',
    StreetName: 'Bay',
    StreetSuffix: 'Street',
    Community: 'Financial District',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 1200000,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: true,
    Bedrooms: 4,
    BedroomsAboveGrade: 3,
    BedroomsBelowGrade: 1,
    Bathrooms: 3,
    SquareFootage: '2200',
    SquareFootageMin: 2000,
    SquareFootageMax: 2400,
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
    VirtualTourUrl: 'https://my.matterport.com/show/?m=example2',
    // Open House Information
    OpenHouseDetails: 'Sat, Jan 20, 1:00-3:00 PM',
    DaysOnMarket: 3,

    // Property Details Page Fields
    // Header Section
    IsPremiumListing: true,
    Views: 234,
    Likes: 45,
    Shares: 12,

    // Highlights Card
    PropertyType: 'house',
    propertyType: 'house',
    SubType: 'Detached',
    LotSize: '35x130',
    Basement: 'Finished',
    GarageSpaces: 2,
    PropertyAge: '8',

    // Description Card
    Description: 'Luxury detached home in the prestigious Financial District. This stunning property features high-end finishes, smart home technology, and premium amenities. Perfect for executives and families seeking luxury living in the heart of the city.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 1200000,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'buy',
    Kitchens: 2,
    HasFamilyRoom: true,
    HasFireplace: true,

    // Parking Section
    DriveParking: 2,
    GarageParking: 2,
    TotalParking: 4,

    // Lease Terms Section
    RentIncludes: undefined,
    Furnished: undefined,

    // Condo Information Section
    MaintenanceFee: undefined,
    FeeIncludes: 'N/A',
    CondoAmenities: 'N/A',
    Pets: 'Negotiable',
    Locker: 'N/A',
    Balcony: 'N/A',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'Y',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Hardwood Floors, Granite Countertops, Smart Home System',
    ExteriorFeatures: 'Deck, Garden, Driveway, Pool',
    OtherFeatures: 'Security System, Smart Home Features, Pool',
  },
  {
    // Property Card Fields
    ListingKey: 'W5678901',
    UnparsedAddress: '654 Yonge Street',
    MLSNumber: 'W5678901',
    StreetAddress: '654 Yonge Street',
    StreetNumber: '654',
    StreetName: 'Yonge',
    StreetSuffix: 'Street',
    Community: 'Midtown',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 2800,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: false,
    Bedrooms: 2,
    Bathrooms: 1,
    SquareFootage: '1100',
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
    // Open House Information
    OpenHouseDetails: undefined, // No open house
    DaysOnMarket: 12,

    // Property Details Page Fields
    // Header Section
    IsPremiumListing: false,
    Views: 78,
    Likes: 15,
    Shares: 4,

    // Highlights Card
    PropertyType: 'condo',
    propertyType: 'condo',
    SubType: 'Apartment',
    LotSize: 'N/A',
    Basement: 'N/A',
    GarageSpaces: 1,
    PropertyAge: '12',

    // Description Card
    Description: 'Spacious condo in the heart of Midtown Toronto. Close to subway, shopping, and entertainment. Features include large windows, modern kitchen, and in-suite laundry.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 2800,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'lease',
    Kitchens: 1,
    HasFamilyRoom: false,
    HasFireplace: false,

    // Parking Section
    DriveParking: 1,
    GarageParking: 1,
    TotalParking: 2,

    // Lease Terms Section
    RentIncludes: 'Heat, Water',
    Furnished: 'Unfurnished',

    // Condo Information Section
    MaintenanceFee: 350,
    FeeIncludes: 'Heat, Water, Cable',
    CondoAmenities: 'Fitness Center, Party Room',
    Pets: 'Small pets allowed',
    Locker: 'Included',
    Balcony: 'Yes',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Large Windows, Modern Kitchen, In-suite Laundry',
    ExteriorFeatures: 'Balcony, City View',
    OtherFeatures: 'Fitness Center, Party Room',
  },
  {
    // Property Card Fields
    ListingKey: 'W6789012',
    UnparsedAddress: '789 Yonge Street',
    MLSNumber: 'W6789012',
    StreetAddress: '789 Yonge Street',
    StreetNumber: '789',
    StreetName: 'Yonge',
    StreetSuffix: 'Street',
    Community: 'Yonge-Eglinton',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 950000,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: true,
    Bedrooms: 4,
    Bathrooms: 3,
    SquareFootage: '2200',
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'],
    VirtualTourUrl: 'https://my.matterport.com/show/?m=example3',
    OpenHouseDetails: 'Sat, Jan 20, 1:00-3:00 PM',
    DaysOnMarket: 3,

    // Property Details Page Fields
    IsPremiumListing: true,
    Views: 203,
    Likes: 31,
    Shares: 12,

    // Highlights Card
    PropertyType: 'house',
    propertyType: 'house',
    SubType: 'Detached',
    LotSize: '40x100',
    Basement: 'Unfinished',
    GarageSpaces: 2,
    PropertyAge: '8',

    // Description Card
    Description: 'Spacious family home in the heart of Yonge-Eglinton. This modern property features an open concept layout, updated kitchen, and large backyard perfect for entertaining.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 950000,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'buy',
    Kitchens: 1,
    HasFamilyRoom: true,
    HasFireplace: true,

    // Parking Section
    DriveParking: 2,
    GarageParking: 2,
    TotalParking: 4,

    // Lease Terms Section
    RentIncludes: undefined,
    Furnished: undefined,

    // Condo Information Section
    MaintenanceFee: undefined,
    FeeIncludes: 'N/A',
    CondoAmenities: 'N/A',
    Pets: 'Allowed',
    Locker: 'N/A',
    Balcony: 'N/A',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Open Concept, Updated Kitchen, Hardwood Floors',
    ExteriorFeatures: 'Large Backyard, Deck, Garden',
    OtherFeatures: 'Central Air, Security System',
  },
  {
    // Property Card Fields
    ListingKey: 'W7890123',
    UnparsedAddress: '321 Bloor Street West',
    MLSNumber: 'W7890123',
    StreetAddress: '321 Bloor Street West',
    StreetNumber: '321',
    StreetName: 'Bloor Street',
    StreetSuffix: 'West',
    Community: 'Annex',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 1200000,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: false,
    Bedrooms: 3,
    Bathrooms: 2,
    SquareFootage: '1600',
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
    OpenHouseDetails: undefined,
    DaysOnMarket: 12,

    // Property Details Page Fields
    IsPremiumListing: false,
    Views: 145,
    Likes: 18,
    Shares: 5,

    // Highlights Card
    PropertyType: 'condo',
    propertyType: 'condo',
    SubType: 'Apartment',
    LotSize: 'N/A',
    Basement: 'N/A',
    GarageSpaces: 1,
    PropertyAge: '3',

    // Description Card
    Description: 'Luxury condo in the heart of the Annex. Features include floor-to-ceiling windows, premium finishes, and access to building amenities including gym and concierge.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 1200000,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'buy',
    Kitchens: 1,
    HasFamilyRoom: false,
    HasFireplace: true,

    // Parking Section
    DriveParking: 0,
    GarageParking: 1,
    TotalParking: 1,

    // Lease Terms Section
    RentIncludes: undefined,
    Furnished: undefined,

    // Condo Information Section
    MaintenanceFee: 450,
    FeeIncludes: 'Heat, Water, Building Insurance',
    CondoAmenities: 'Gym, Concierge, Party Room',
    Pets: 'Allowed',
    Locker: 'Yes',
    Balcony: 'Yes',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Floor-to-Ceiling Windows, Premium Finishes, In-Suite Laundry',
    ExteriorFeatures: 'Balcony, City Views',
    OtherFeatures: 'Building Amenities, Concierge Service',
  },
  {
    // Property Card Fields
    ListingKey: 'W8901234',
    UnparsedAddress: '654 King Street West',
    MLSNumber: 'W8901234',
    StreetAddress: '654 King Street West',
    StreetNumber: '654',
    StreetName: 'King Street',
    StreetSuffix: 'West',
    Community: 'King West',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 680000,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: true,
    Bedrooms: 2,
    Bathrooms: 2,
    SquareFootage: '1100',
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'],
    VirtualTourUrl: 'https://my.matterport.com/show/?m=example4',
    OpenHouseDetails: 'Sun, Jan 18, 2:00-4:00 PM',
    DaysOnMarket: 7,

    // Property Details Page Fields
    IsPremiumListing: false,
    Views: 98,
    Likes: 14,
    Shares: 4,

    // Highlights Card
    PropertyType: 'condo',
    propertyType: 'condo',
    SubType: 'Apartment',
    LotSize: 'N/A',
    Basement: 'N/A',
    GarageSpaces: 0,
    PropertyAge: '7',

    // Description Card
    Description: 'Modern loft-style condo in the trendy King West neighborhood. Features exposed brick walls, high ceilings, and is walking distance to restaurants and entertainment.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 680000,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'buy',
    Kitchens: 1,
    HasFamilyRoom: false,
    HasFireplace: false,

    // Parking Section
    DriveParking: 0,
    GarageParking: 0,
    TotalParking: 0,

    // Lease Terms Section
    RentIncludes: undefined,
    Furnished: undefined,

    // Condo Information Section
    MaintenanceFee: 320,
    FeeIncludes: 'Heat, Water',
    CondoAmenities: 'Rooftop Deck, Gym',
    Pets: 'Allowed',
    Locker: 'Yes',
    Balcony: 'Yes',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Exposed Brick, High Ceilings, Open Concept',
    ExteriorFeatures: 'Balcony, City Views',
    OtherFeatures: 'Rooftop Access, Building Gym',
  },
  {
    // Property Card Fields
    ListingKey: 'W9012345',
    UnparsedAddress: '987 Bay Street',
    MLSNumber: 'W9012345',
    StreetAddress: '987 Bay Street',
    StreetNumber: '987',
    StreetName: 'Bay',
    StreetSuffix: 'Street',
    Community: 'Financial District',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 850000,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: false,
    Bedrooms: 2,
    Bathrooms: 2,
    SquareFootage: '1200',
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
    VirtualTourUrl: 'https://my.matterport.com/show/?m=example5',
    OpenHouseDetails: 'Wed, Jan 22, 1:00-3:00 PM',
    DaysOnMarket: 15,

    // Property Details Page Fields
    IsPremiumListing: true,
    Views: 167,
    Likes: 25,
    Shares: 7,

    // Highlights Card
    PropertyType: 'condo',
    propertyType: 'condo',
    SubType: 'Apartment',
    LotSize: 'N/A',
    Basement: 'N/A',
    GarageSpaces: 1,
    PropertyAge: '4',

    // Description Card
    Description: 'Luxury condo in the heart of the Financial District. Features premium finishes, floor-to-ceiling windows, and stunning city views. Walking distance to business district and entertainment.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 850000,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'buy',
    Kitchens: 1,
    HasFamilyRoom: false,
    HasFireplace: true,

    // Parking Section
    DriveParking: 0,
    GarageParking: 1,
    TotalParking: 1,

    // Lease Terms Section
    RentIncludes: undefined,
    Furnished: undefined,

    // Condo Information Section
    MaintenanceFee: 380,
    FeeIncludes: 'Heat, Water, Building Insurance',
    CondoAmenities: 'Gym, Concierge, Party Room, Rooftop Deck',
    Pets: 'Allowed',
    Locker: 'Yes',
    Balcony: 'Yes',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Premium Finishes, Floor-to-Ceiling Windows, In-Suite Laundry',
    ExteriorFeatures: 'Balcony, City Views',
    OtherFeatures: 'Building Amenities, Concierge Service, Rooftop Access',
  },
  {
    // Property Card Fields
    ListingKey: 'W0123456',
    UnparsedAddress: '147 College Street',
    MLSNumber: 'W0123456',
    StreetAddress: '147 College Street',
    StreetNumber: '147',
    StreetName: 'College',
    StreetSuffix: 'Street',
    Community: 'Little Italy',
    Region: 'Toronto',
    City: 'Toronto',
    StateOrProvince: 'ON',
    ListPrice: 720000,
    ClosePrice: undefined,
    MlsStatus: 'Active',
    IsNewListing: true,
    Bedrooms: 3,
    Bathrooms: 2,
    SquareFootage: '1400',
    PrimaryImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'],
    VirtualTourUrl: 'https://my.matterport.com/show/?m=example6',
    OpenHouseDetails: 'Sat, Jan 25, 2:00-4:00 PM',
    DaysOnMarket: 4,

    // Property Details Page Fields
    IsPremiumListing: false,
    Views: 112,
    Likes: 16,
    Shares: 3,

    // Highlights Card
    PropertyType: 'house',
    propertyType: 'house',
    SubType: 'Semi-Detached',
    LotSize: '25x100',
    Basement: 'Finished',
    GarageSpaces: 1,
    PropertyAge: '12',

    // Description Card
    Description: 'Charming semi-detached home in the vibrant Little Italy neighborhood. Features original character details, updated kitchen, and finished basement. Walking distance to restaurants and cafes.',

    // Listing History Card
    ListDate: new Date().toISOString(),
    ListingEnd: undefined,

    // Listing Information Card
    OriginalPrice: 720000,
    Possession: 'Immediate',

    // Property Details Card
    PropertyClass: 'Residential',
    status: 'buy',
    Kitchens: 1,
    HasFamilyRoom: true,
    HasFireplace: true,

    // Parking Section
    DriveParking: 1,
    GarageParking: 1,
    TotalParking: 2,

    // Lease Terms Section
    RentIncludes: undefined,
    Furnished: undefined,

    // Condo Information Section
    MaintenanceFee: undefined,
    FeeIncludes: 'N/A',
    CondoAmenities: 'N/A',
    Pets: 'Allowed',
    Locker: 'N/A',
    Balcony: 'N/A',

    // POTL Section
    POTLFee: 'N/A',

    // Pool & Waterfront Section
    SwimmingPool: 'N',
    Waterfront: false,

    // Features Section
    InteriorFeatures: 'Original Character Details, Updated Kitchen, Hardwood Floors',
    ExteriorFeatures: 'Front Porch, Backyard, Garden',
    OtherFeatures: 'Finished Basement, Storage Space',
  }
];

// ============================================================================
// MOCK SERVICE FUNCTIONS
// ============================================================================

export interface PropertySearchResult {
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PropertyCountResult {
  totalCount: number;
  filteredCount: number;
}

/**
 * Get properties with pagination and filtering
 */
export async function getPropertiesWithPagination(
  page: number = 1,
  pageSize: number = 12,
  filters?: any
): Promise<PropertySearchResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log('🔍 getPropertiesWithPagination called with:', { page, pageSize, filters });
  console.log('📊 Total mock properties available:', mockProperties.length);
  
  let filteredProperties = [...mockProperties];
  
  // Apply filters if provided
  if (filters) {
    console.log('🔧 Applying filters...');
    // Filter by status
    if (filters.status === 'buy') {
      console.log('🏠 Filtering for buy properties...');
      filteredProperties = filteredProperties.filter(p => p.status === 'buy');
      console.log(`✅ Found ${filteredProperties.length} buy properties`);
    } else if (filters.status === 'lease') {
      console.log('🏢 Filtering for lease properties...');
      filteredProperties = filteredProperties.filter(p => p.status === 'lease');
      console.log(`✅ Found ${filteredProperties.length} lease properties`);
    }
    
    // Filter by city
    if (filters.city && filters.city.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.city.some((city: string) => 
          p.City?.toLowerCase().includes(city.toLowerCase()) ||
          p.Community?.toLowerCase().includes(city.toLowerCase())
        )
      );
    }
    
    // Filter by property type
    if (filters.propertyType && filters.propertyType.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.propertyType.includes(p.PropertyType)
      );
    }
    
    // Filter by price range
    if (filters.priceRange) {
      filteredProperties = filteredProperties.filter(p => 
        p.ListPrice && p.ListPrice >= filters.priceRange.min && p.ListPrice <= filters.priceRange.max
      );
    }
    
    // Filter by bedrooms
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p => 
        p.Bedrooms !== undefined && p.Bedrooms >= filters.bedrooms.min && p.Bedrooms <= filters.bedrooms.max
      );
    }
    
    // Filter by bathrooms
    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(p => 
        p.Bathrooms !== undefined && p.Bathrooms >= filters.bathrooms.min && p.Bathrooms <= filters.bathrooms.max
      );
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.MLSNumber?.toLowerCase().includes(searchTerm) ||
        p.StreetAddress?.toLowerCase().includes(searchTerm) ||
        p.City?.toLowerCase().includes(searchTerm) ||
        p.Community?.toLowerCase().includes(searchTerm) ||
        p.Description?.toLowerCase().includes(searchTerm)
      );
    }
  }
  
  // Calculate pagination
  const totalCount = filteredProperties.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
  
  console.log(`📋 Final result: ${paginatedProperties.length} properties on page ${page} of ${totalPages} (${totalCount} total)`);
  
  return {
    properties: paginatedProperties,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize
  };
}

/**
 * Get total count of properties with optional filtering
 */
export async function getPropertyCount(filters?: any): Promise<PropertyCountResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let filteredProperties = [...mockProperties];
  
  // Apply same filters as getPropertiesWithPagination
  if (filters) {
    if (filters.status === 'buy') {
      filteredProperties = filteredProperties.filter(p => p.status === 'buy');
    } else if (filters.status === 'lease') {
      filteredProperties = filteredProperties.filter(p => p.status === 'lease');
    }
    
    if (filters.city && filters.city.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.city.some((city: string) => 
          p.City?.toLowerCase().includes(city.toLowerCase()) ||
          p.Community?.toLowerCase().includes(city.toLowerCase())
        )
      );
    }
    
    if (filters.propertyType && filters.propertyType.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.propertyType.includes(p.PropertyType)
      );
    }
    
    if (filters.priceRange) {
      filteredProperties = filteredProperties.filter(p => 
        p.ListPrice && p.ListPrice >= filters.priceRange.min && p.ListPrice <= filters.priceRange.max
      );
    }
    
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p => 
        p.Bedrooms !== undefined && p.Bedrooms >= filters.bedrooms.min && p.Bedrooms <= filters.bedrooms.max
      );
    }
    
    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(p => 
        p.Bathrooms !== undefined && p.Bathrooms >= filters.bathrooms.min && p.Bathrooms <= filters.bathrooms.max
      );
    }
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.MLSNumber?.toLowerCase().includes(searchTerm) ||
        p.StreetAddress?.toLowerCase().includes(searchTerm) ||
        p.City?.toLowerCase().includes(searchTerm) ||
        p.Community?.toLowerCase().includes(searchTerm) ||
        p.Description?.toLowerCase().includes(searchTerm)
      );
    }
  }
  
  return {
    totalCount: mockProperties.length,
    filteredCount: filteredProperties.length
  };
}

/**
 * Get a single property by MLS number
 */
export async function getPropertyByMLS(mlsNumber: string): Promise<Property | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Use ListingKey instead of MLSNumber (legacy field removed)
  const property = mockProperties.find(p => p.ListingKey === mlsNumber);
  return property || null;
}

/**
 * Get sample properties for testing/display
 */
export async function getSampleProperties(limit: number = 5): Promise<Property[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return mockProperties.slice(0, limit);
}

/**
 * Search properties with text search
 */
export async function searchProperties(
  searchTerm: string,
  page: number = 1,
  pageSize: number = 12,
  filters?: any
): Promise<PropertySearchResult> {
  // Add search term to filters
  const searchFilters = {
    ...filters,
    searchTerm,
    status: filters?.status || null
  };

  return await getPropertiesWithPagination(page, pageSize, searchFilters);
}

/**
 * Get property statistics for dashboard/analytics
 */
export async function getPropertyStatistics(): Promise<{
  totalProperties: number;
  activeListings: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  propertyTypes: { [key: string]: number };
  topCommunities: { [key: string]: number };
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const totalProperties = mockProperties.length;
  const activeListings = mockProperties.filter(p => p.MlsStatus === 'Active').length;
  
  const prices = mockProperties
    .map(p => p.ListPrice)
    .filter(Boolean) as number[];
  
  const averagePrice = prices.length > 0 
    ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    : 0;
  
  const priceRange = prices.length > 0 
    ? { min: Math.min(...prices), max: Math.max(...prices) }
    : { min: 0, max: 0 };
  
  const propertyTypes: { [key: string]: number } = {};
  mockProperties.forEach(property => {
    if (property.PropertyType) {
      propertyTypes[property.PropertyType] = (propertyTypes[property.PropertyType] || 0) + 1;
    }
  });
  
  const topCommunities: { [key: string]: number } = {};
  mockProperties.forEach(property => {
    if (property.Community) {
      topCommunities[property.Community] = (topCommunities[property.Community] || 0) + 1;
    }
  });
  
  return {
    totalProperties,
    activeListings,
    averagePrice,
    priceRange,
    propertyTypes,
    topCommunities
  };
}

// ============================================================================
// USER PROFILE MOCK FUNCTIONS
// ============================================================================

export async function mockGetUserProfile(userId: string) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    id: userId,
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-555-0123',
    preferences: {
      propertyTypes: ['house', 'condo'],
      cities: ['Toronto', 'Mississauga'],
      priceRange: { min: 400000, max: 800000 }
    }
  };
}

export async function mockUpdateUserProfile(userId: string, profileData: any) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    success: true,
    message: 'Profile updated successfully'
  };
}

export async function mockVerifyEmail(token: string) {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return {
    success: true,
    message: 'Email verified successfully'
  };
}
