import { Property } from '@/types';
import { formatTitleCase } from '@/utils';
import { 
  getPropertiesWithPagination as getMockProperties,
  getPropertyByMLS as getMockPropertyByMLS,
  getPropertyCount as getMockPropertyCount,
  getSampleProperties as getMockSampleProperties,
  searchProperties as searchMockProperties,
  mockGetProperty
} from './mockDataService';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================
export interface FilterCriteria {
  city?: string[];
  propertyType?: string[];
  priceRange?: { min: number; max: number } | null;
  bedrooms?: { min: number; max: number } | null;
  bathrooms?: { min: number; max: number } | null;
  status: string | null;
  searchTerm?: string;
}

// ============================================================================
// PARSING UTILITIES
// ============================================================================
export class PropertyParsers {
  static parseSquareFootageRange(livingAreaRange: string | null) {
    if (!livingAreaRange) return undefined;
    const parts = livingAreaRange.trim().split(/[-–]/);
    if (parts.length === 2) {
      const min = parseInt(parts[0].trim(), 10);
      const max = parseInt(parts[1].trim(), 10);
      if (!isNaN(min) && !isNaN(max)) return { min, max };
    }
    return undefined;
  }

  static formatLotSizeFromDimensions(width: number | null, units: string | null, depth: number | null) {
    if (!width || !depth) return '';
    const unit = units || 'ft';
    return `${width} x ${depth} ${unit}`;
  }

  static formatParkingSpaces(spaces: number | null) {
    if (!spaces || spaces === 0) return '0 spaces';
    return `${spaces} space${spaces === 1 ? '' : 's'}`;
  }

  static parseInteriorFeatures(features: string | null): string[] {
    if (!features) return [];
    return features.split(',').map(f => f.trim()).filter(f => f.length > 0);
  }

  static parseFeaturesArray(features: string | null): string[] {
    if (!features) return [];
    return features.split(',').map(f => f.trim()).filter(f => f.length > 0);
  }

  static parsePropertyFeatures(features: string | null): string[] {
    if (!features) return [];
    return features.split(',').map(f => f.trim()).filter(f => f.length > 0);
  }
}

// ============================================================================
// STATUS MAPPING
// ============================================================================
export function mapStatus(contractStatus: string | null, transactionType: string | null, mlsStatus: string | null): string {
  // Handle null values
  if (!contractStatus && !transactionType && !mlsStatus) {
    return 'Unknown';
  }

  // Check for sold/leased status first
  if (contractStatus) {
    const status = contractStatus.toLowerCase();
    if (status.includes('sold') || status.includes('closed')) return 'Sold';
    if (status.includes('leased')) return 'Leased';
    if (status.includes('pending') || status.includes('conditional')) return 'Pending';
    if (status.includes('terminated') || status.includes('expired')) return 'Terminated';
  }

  // Check transaction type
  if (transactionType) {
    const type = transactionType.toLowerCase();
    if (type.includes('sale')) return 'For Sale';
    if (type.includes('lease')) return 'For Lease';
    if (type.includes('rent')) return 'For Rent';
  }

  // Check MLS status
  if (mlsStatus) {
    const status = mlsStatus.toLowerCase();
    if (status.includes('active')) return 'Active';
    if (status.includes('inactive')) return 'Inactive';
    if (status.includes('suspended')) return 'Suspended';
  }

  // Default fallback
  return 'Available';
}

// ============================================================================
// MOCK DATA FUNCTIONS
// ============================================================================

// Get property data from database
export async function getRealPropertyData(propertyId: string) {
  try {
    console.log('🔍 getRealPropertyData: Fetching property with ID:', propertyId);
    
    // Try to get from mock service by MLS number
    let dbProperty = await getMockPropertyByMLS(propertyId);
    
    if (dbProperty) {
      console.log('✅ Successfully fetched property from database:', propertyId);
      console.log('🔍 Database property images:', {
        PrimaryImageUrl: dbProperty.PrimaryImageUrl,
        images: dbProperty.images,
        imagesLength: dbProperty.images?.length
      });
      
      // Transform database property to match the expected format
      return {
        listingKey: dbProperty.ListingKey,
        mlsNumber: dbProperty.MLSNumber,
        listPrice: dbProperty.ListPrice,
        contractStatus: dbProperty.MlsStatus,
        transactionType: dbProperty.PropertyClass,
        mlsStatus: dbProperty.MlsStatus,
        propertyType: dbProperty.SubType,
        subType: dbProperty.SubType,
        streetNumber: dbProperty.StreetAddress?.split(' ')[0],
        streetName: dbProperty.StreetAddress?.split(' ').slice(1).join(' '),
        streetSuffix: '',
        city: dbProperty.City,
        community: dbProperty.Community,
        postalCode: '',
        bedrooms: dbProperty.Bedrooms,
        bathrooms: dbProperty.Bathrooms,
        squareFootage: dbProperty.SquareFootage,
        squareFootageRaw: dbProperty.SquareFootage,
        imageUrls: dbProperty.images || (dbProperty.PrimaryImageUrl ? [dbProperty.PrimaryImageUrl] : []),
        publicRemarks: dbProperty.Description,
        lotSize: dbProperty.LotSize,
        propertyAge: dbProperty.PropertyAge,
        TaxAnnualAmount: dbProperty.PropertyTaxes,
        kitchens: dbProperty.Kitchens,
        hasFamilyRoom: dbProperty.HasFamilyRoom,
        hasFireplace: dbProperty.HasFireplace,
        garages: dbProperty.GarageSpaces,
        basementKitchen: false,
        driveParking: dbProperty.DriveParking,
        garageParking: dbProperty.GarageParking,
        totalParking: dbProperty.TotalParking,
        ac: (dbProperty as any).Cooling || '',
        heatSource: (dbProperty as any).HeatType || '',
        sewers: (dbProperty as any).Sewer || '',
        water: '',
        rentIncludes: dbProperty.RentIncludes,
        furnished: dbProperty.Furnished,
        portionForLease: '',
        paymentFrequency: '',
        maintenanceFee: dbProperty.MaintenanceFee,
        feeIncludes: dbProperty.FeeIncludes,
        petsAllowed: dbProperty.Pets,
        locker: dbProperty.Locker,
        potlFee: dbProperty.POTLFee,
        swimmingPool: dbProperty.SwimmingPool,
        waterfront: dbProperty.Waterfront,
        interiorFeatures: dbProperty.InteriorFeatures,
        exteriorFeatures: dbProperty.ExteriorFeatures,
        otherFeatures: dbProperty.OtherFeatures,
        propertyClass: dbProperty.PropertyClass,
        lotSizeAcres: '',
        leaseTerm: '',
        pets: dbProperty.Pets
      };
    }
    
    // Fallback to mock data if not found in database
    console.log('⚠️ Property not found in database, falling back to mock data:', propertyId);
    const mockProperty = await mockGetProperty(propertyId);
    
    if (!mockProperty) {
      console.log('❌ Property not found in mock data either:', propertyId);
      return null;
    }
    
    // Transform mock property to match the expected format
    return {
      mlsNumber: mockProperty.MLSNumber,
      listPrice: mockProperty.ListPrice,
      contractStatus: mockProperty.MlsStatus,
      transactionType: mockProperty.PropertyClass,
      mlsStatus: mockProperty.MlsStatus,
      propertyType: mockProperty.SubType,
      subType: mockProperty.SubType,
      streetNumber: mockProperty.StreetAddress?.split(' ')[0] || '',
      streetName: mockProperty.StreetAddress?.split(' ').slice(1).join(' ') || '',
      streetSuffix: '',
      city: mockProperty.City || '',
      community: mockProperty.Community || '',
      postalCode: '',
      bedrooms: mockProperty.Bedrooms,
      bathrooms: mockProperty.Bathrooms,
      squareFootage: mockProperty.SquareFootage,
      squareFootageRaw: mockProperty.SquareFootage,
      imageUrls: mockProperty.images || (mockProperty.PrimaryImageUrl ? [mockProperty.PrimaryImageUrl] : []),
      publicRemarks: mockProperty.Description || '',
      lotSize: mockProperty.LotSize || '',
      propertyAge: mockProperty.PropertyAge,
      TaxAnnualAmount: mockProperty.PropertyTaxes,
      kitchens: mockProperty.Kitchens,
      hasFamilyRoom: mockProperty.HasFamilyRoom,
      hasFireplace: mockProperty.HasFireplace,
      garages: mockProperty.GarageSpaces,
      basementKitchen: false,
      driveParking: mockProperty.DriveParking,
      garageParking: mockProperty.GarageParking,
      totalParking: mockProperty.TotalParking,
      ac: '',
      heatSource: '',
      sewers: '',
      water: '',
      rentIncludes: mockProperty.RentIncludes || '',
      furnished: mockProperty.Furnished || '',
      portionForLease: '',
      paymentFrequency: '',
      maintenanceFee: mockProperty.MaintenanceFee,
      feeIncludes: mockProperty.FeeIncludes || '',
      petsAllowed: mockProperty.Pets || '',
      locker: mockProperty.Locker || '',
      potlFee: mockProperty.POTLFee || '',
      swimmingPool: mockProperty.SwimmingPool || '',
      waterfront: mockProperty.Waterfront,
      interiorFeatures: mockProperty.InteriorFeatures || '',
      exteriorFeatures: mockProperty.ExteriorFeatures || '',
      otherFeatures: mockProperty.OtherFeatures || '',
      propertyClass: mockProperty.PropertyClass || '',
      lotSizeAcres: '',
      leaseTerm: '',
      pets: mockProperty.Pets || ''
    };
  } catch (error) {
    console.error('❌ Error fetching property data:', error);
    throw new Error('Failed to fetch property data');
  }
}

// Get properties with pagination from database
export async function getPropertiesWithPaginationFromDB(page: number = 1, pageSize: number = 12, filters?: FilterCriteria) {
  console.log('🔍 getPropertiesWithPagination called with:', { page, pageSize, filters });
  
  try {
    // Use mock service
    const result = await getMockProperties(page, pageSize, filters);
    
    console.log(`✅ Successfully fetched ${result.properties.length} properties from database`);
    return {
      properties: result.properties,
      totalCount: result.totalCount,
      totalPages: result.totalPages
    };
  } catch (error) {
    console.error('❌ Error fetching properties from database, falling back to mock data:', error);
    
    // Fallback to mock data if database fails
    const { mockProperties } = await import('./mockData');
    let filteredProperties = [...mockProperties];
    
    if (filters) {
      // Apply same filters as before for fallback
      if (filters.status) {
        if (filters.status === 'buy') {
          filteredProperties = filteredProperties.filter(p => p.MlsStatus === 'Active');
        } else if (filters.status === 'lease') {
          filteredProperties = filteredProperties.filter(p => p.MlsStatus === 'Active');
        }
      }
      
      if (filters.city && filters.city.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
          filters.city!.some(city => p.City?.includes(city))
        );
      }
      
      if (filters.propertyType && filters.propertyType.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
          p.PropertyType && filters.propertyType!.includes(p.PropertyType)
        );
      }
      
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredProperties = filteredProperties.filter(p => 
          (p.MLSNumber && p.MLSNumber.toLowerCase().includes(searchTerm)) ||
          (p.StreetAddress && p.StreetAddress.toLowerCase().includes(searchTerm)) ||
          (p.City && p.City.toLowerCase().includes(searchTerm)) ||
          (p.Community && p.Community.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters.priceRange) {
        filteredProperties = filteredProperties.filter(p => {
          if (!p.ListPrice) return false;
          return p.ListPrice >= filters.priceRange!.min && p.ListPrice <= filters.priceRange!.max;
        });
      }
      
      if (filters.bedrooms) {
        filteredProperties = filteredProperties.filter(p => 
          p.Bedrooms !== undefined && p.Bedrooms >= filters.bedrooms!.min && p.Bedrooms <= filters.bedrooms!.max
        );
      }
      
      if (filters.bathrooms) {
        filteredProperties = filteredProperties.filter(p => 
          p.Bathrooms !== undefined && p.Bathrooms >= filters.bathrooms!.min && p.Bathrooms <= filters.bathrooms!.max
        );
      }
    }
    
    // Calculate pagination for fallback
    const totalCount = filteredProperties.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    
    return {
      properties: paginatedProperties,
      totalCount,
      totalPages
    };
  }
}

// Get properties with search from database
export async function getPropertiesWithSearch(page: number = 1, pageSize: number = 12, filters?: FilterCriteria) {
  console.log('🔍 getPropertiesWithSearch called with:', { page, pageSize, filters });
  
  try {
    // Use mock search service
    const result = await searchMockProperties('', page, pageSize, filters);
    
    console.log(`✅ Successfully searched ${result.properties.length} properties from database`);
    return {
      properties: result.properties,
      totalCount: result.totalCount,
      totalPages: result.totalPages
    };
  } catch (error) {
    console.error('❌ Error searching properties from database, falling back to pagination:', error);
    
    // Fallback to pagination function
    return getPropertiesWithPaginationFromDB(page, pageSize, filters);
  }
}

// Get property count from database
export async function getPropertyCountFromDB(filters?: FilterCriteria): Promise<number> {
  console.log('🔢 getPropertyCount called with:', { filters });
  
  try {
    // Use mock service
    const result = await getMockPropertyCount(filters);
    
    console.log(`✅ Successfully got property count from mock service: ${result.filteredCount}`);
    return result.filteredCount;
  } catch (error) {
    console.error('❌ Error getting property count from database, falling back to mock data:', error);
    
    // Fallback to mock data
    const { mockProperties } = await import('./mockData');
    let filteredProperties = [...mockProperties];
    
    if (filters) {
      // Apply same filters as before for fallback
      if (filters.status) {
        if (filters.status === 'buy') {
          filteredProperties = filteredProperties.filter(p => p.MlsStatus === 'Active');
        } else if (filters.status === 'lease') {
          filteredProperties = filteredProperties.filter(p => p.MlsStatus === 'Active');
        }
      }
      
      if (filters.city && filters.city.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
          filters.city!.some(city => p.City?.includes(city))
        );
      }
      
      if (filters.propertyType && filters.propertyType.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
          p.PropertyType && filters.propertyType!.includes(p.PropertyType)
        );
      }
      
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredProperties = filteredProperties.filter(p => 
          (p.MLSNumber && p.MLSNumber.toLowerCase().includes(searchTerm)) ||
          (p.StreetAddress && p.StreetAddress.toLowerCase().includes(searchTerm)) ||
          (p.City && p.City.toLowerCase().includes(searchTerm)) ||
          (p.Community && p.Community.toLowerCase().includes(searchTerm))
        );
      }
    }
    
    return filteredProperties.length;
  }
}

// Get sample properties from database
export async function getSamplePropertiesFromDB(limit: number = 5) {
  console.log('🔍 getSampleProperties called with:', { limit });
  
  try {
    // Use mock service
    const properties = await getMockSampleProperties(limit);
    
    console.log(`✅ Successfully fetched ${properties.length} sample properties from database`);
    return properties;
  } catch (error) {
    console.error('❌ Error fetching sample properties from database, falling back to mock data:', error);
    
    // Fallback to mock data
    const { mockProperties } = await import('./mockData');
    return mockProperties.slice(0, limit);
  }
}
