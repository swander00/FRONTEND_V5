import { PropertyFieldUtils } from '@/utils/propertyFieldUtils';
import { Property } from '@/types/property';

// Mock property data for testing
const mockProperty: Property = {
  ListingKey: 'TEST123',
  UnparsedAddress: '123 Test Street, Toronto, ON',
  StreetAddress: '123 Test Street',
  City: 'Toronto',
  StateOrProvince: 'ON',
  Community: 'Downtown',
  Region: 'Central',
  Bedrooms: 3,
  Bathrooms: 2,
  SquareFootage: '1500',
  GarageParking: 1,
  DriveParking: 1,
  ListPrice: 750000,
  ClosePrice: 0,
  MLSNumber: 'W1234567',
  MlsStatus: 'For Sale',
  ListDate: '2024-01-15',
  IsNewListing: true,
  PropertyType: 'Condo',
  SubType: 'Apartment'
};

describe('PropertyFieldUtils', () => {
  describe('Address Formatting', () => {
    it('should format full address correctly', () => {
      const result = PropertyFieldUtils.formatFullAddress(mockProperty);
      expect(result).toBe('123 Test Street, Toronto, ON');
    });

    it('should format short address correctly', () => {
      const result = PropertyFieldUtils.formatShortAddress(mockProperty);
      expect(result).toBe('123 Test Street');
    });

    it('should format city province correctly', () => {
      const result = PropertyFieldUtils.formatCityProvince(mockProperty);
      expect(result).toBe('Toronto, ON');
    });
  });

  describe('Date Formatting', () => {
    it('should format list date in medium format', () => {
      const result = PropertyFieldUtils.formatListDate('2024-01-15');
      expect(result).toBe('January 15, 2024');
    });

    it('should format list date in short format', () => {
      const result = PropertyFieldUtils.formatListDate('2024-01-15', 'short');
      expect(result).toBe('Jan 15, 2024');
    });

    it('should format relative date correctly', () => {
      const result = PropertyFieldUtils.formatRelativeDate('2024-01-15');
      expect(result).toContain('Listed');
    });

    it('should handle invalid dates', () => {
      const result = PropertyFieldUtils.formatListDate('invalid-date');
      expect(result).toBe('?');
    });
  });

  describe('Price Formatting', () => {
    it('should format price correctly', () => {
      const result = PropertyFieldUtils.formatPrice(750000);
      expect(result).toBe('$750,000');
    });

    it('should handle zero price', () => {
      const result = PropertyFieldUtils.formatPrice(0);
      expect(result).toBe('?');
    });

    it('should handle undefined price', () => {
      const result = PropertyFieldUtils.formatPrice(undefined);
      expect(result).toBe('?');
    });

    it('should format price range correctly', () => {
      const result = PropertyFieldUtils.formatPriceRange(700000, 800000);
      expect(result).toBe('$700,000 - $800,000');
    });
  });

  describe('Status Formatting', () => {
    it('should get status config for valid status', () => {
      const result = PropertyFieldUtils.getStatusConfig('For Sale');
      expect(result.badgeText).toBe('For Sale');
      expect(result.badgeColorClass).toContain('emerald');
    });

    it('should handle unknown status', () => {
      const result = PropertyFieldUtils.getStatusConfig('Unknown Status');
      expect(result.badgeText).toBe('Unknown');
      expect(result.badgeColorClass).toContain('gray');
    });

    it('should format status text correctly', () => {
      const result = PropertyFieldUtils.formatStatusText('for sale');
      expect(result).toBe('For Sale');
    });
  });

  describe('Meta Info Formatting', () => {
    it('should format bedrooms correctly', () => {
      const result = PropertyFieldUtils.formatBedrooms(3);
      expect(result).toBe('3');
    });

    it('should handle zero bedrooms', () => {
      const result = PropertyFieldUtils.formatBedrooms(0);
      expect(result).toBe('?');
    });

    it('should format bathrooms correctly', () => {
      const result = PropertyFieldUtils.formatBathrooms(2);
      expect(result).toBe('2');
    });

    it('should format parking spaces correctly', () => {
      const result = PropertyFieldUtils.formatParkingSpaces(1, 1);
      expect(result).toBe('1+1');
    });

    it('should format parking with only garage', () => {
      const result = PropertyFieldUtils.formatParkingSpaces(2, 0);
      expect(result).toBe('2');
    });

    it('should format parking with only drive', () => {
      const result = PropertyFieldUtils.formatParkingSpaces(0, 3);
      expect(result).toBe('3');
    });

    it('should format square footage correctly', () => {
      const result = PropertyFieldUtils.formatSquareFootage('1500');
      expect(result).toBe('1500');
    });

    it('should format square footage as number', () => {
      const result = PropertyFieldUtils.formatSquareFootage(1500);
      expect(result).toBe('1,500');
    });

    it('should handle empty square footage', () => {
      const result = PropertyFieldUtils.formatSquareFootage('0');
      expect(result).toBe('?');
    });
  });

  describe('Street Suffix Formatting', () => {
    it('should shorten street suffix correctly', () => {
      const result = PropertyFieldUtils.shortenStreetSuffix('Street');
      expect(result).toBe('St');
    });

    it('should handle unknown suffix', () => {
      const result = PropertyFieldUtils.shortenStreetSuffix('UnknownSuffix');
      expect(result).toBe('UnknownSuffix');
    });

    it('should handle empty suffix', () => {
      const result = PropertyFieldUtils.shortenStreetSuffix('');
      expect(result).toBe('');
    });
  });

  describe('Comprehensive Field Data Generation', () => {
    it('should generate complete property field data', () => {
      const result = PropertyFieldUtils.generatePropertyFieldData(mockProperty);
      
      expect(result.address.full).toBe('123 Test Street, Toronto, ON');
      expect(result.address.short).toBe('123 Test Street');
      expect(result.address.street).toBe('123 Test Street');
      expect(result.address.city).toBe('Toronto');
      expect(result.address.province).toBe('ON');
      expect(result.address.community).toBe('Downtown');
      expect(result.address.region).toBe('Central');
      
      expect(result.details.bedrooms).toBe('3');
      expect(result.details.bathrooms).toBe('2');
      expect(result.details.squareFootage).toBe('1500');
      expect(result.details.parking).toBe('1+1');
      expect(result.details.propertyType).toBe('Condo');
      expect(result.details.subType).toBe('Apartment');
      
      expect(result.listing.mlsNumber).toBe('W1234567');
      expect(result.listing.status.badgeText).toBe('For Sale');
      expect(result.listing.price.display).toBe('$750,000');
      expect(result.listing.price.amount).toBe(750000);
      expect(result.listing.price.currency).toBe('CAD');
    });
  });
});
