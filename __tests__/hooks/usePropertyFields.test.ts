import { renderHook } from '@testing-library/react';
import { usePropertyFields } from '@/hooks/usePropertyFields';
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

describe('usePropertyFields', () => {
  it('should return comprehensive field data', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current).toHaveProperty('fieldData');
    expect(result.current).toHaveProperty('address');
    expect(result.current).toHaveProperty('details');
    expect(result.current).toHaveProperty('listing');
    expect(result.current).toHaveProperty('meta');
    expect(result.current).toHaveProperty('validation');
    expect(result.current).toHaveProperty('config');
    expect(result.current).toHaveProperty('formatters');
    expect(result.current).toHaveProperty('componentFields');
    expect(result.current).toHaveProperty('status');
    expect(result.current).toHaveProperty('price');
  });

  it('should provide address fields with multiple formats', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.address.full).toBe('123 Test Street, Toronto, ON');
    expect(result.current.address.short).toBe('123 Test Street');
    expect(result.current.address.street).toBe('123 Test Street');
    expect(result.current.address.city).toBe('Toronto');
    expect(result.current.address.province).toBe('ON');
    expect(result.current.address.community).toBe('Downtown');
    expect(result.current.address.region).toBe('Central');
    expect(result.current.address.cityProvince).toBe('Toronto, ON');
    
    expect(result.current.address.display).toHaveProperty('primary');
    expect(result.current.address.display).toHaveProperty('secondary');
    expect(result.current.address.display).toHaveProperty('compact');
  });

  it('should provide details fields with formatted values', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.details.bedrooms).toBe('3');
    expect(result.current.details.bathrooms).toBe('2');
    expect(result.current.details.squareFootage).toBe('1500');
    expect(result.current.details.parking).toBe('1+1');
    expect(result.current.details.propertyType).toBe('Condo');
    expect(result.current.details.subType).toBe('Apartment');
    
    expect(result.current.details.display).toHaveProperty('bedrooms');
    expect(result.current.details.display).toHaveProperty('bathrooms');
    expect(result.current.details.display).toHaveProperty('squareFootage');
    expect(result.current.details.display).toHaveProperty('parking');
  });

  it('should provide listing information with formatted values', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.listing.mlsNumber).toBe('W1234567');
    expect(result.current.listing.status.badgeText).toBe('For Sale');
    expect(result.current.listing.price.display).toBe('$750,000');
    expect(result.current.listing.price.amount).toBe(750000);
    expect(result.current.listing.price.currency).toBe('CAD');
    expect(result.current.listing.price.suffix).toBe('');
    
    expect(result.current.listing.display).toHaveProperty('mlsNumber');
    expect(result.current.listing.display).toHaveProperty('price');
    expect(result.current.listing.display).toHaveProperty('priceWithSuffix');
    expect(result.current.listing.display).toHaveProperty('status');
  });

  it('should provide validation utilities', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.validation).toHaveProperty('validateProperty');
    expect(result.current.validation).toHaveProperty('validateField');
    expect(result.current.validation).toHaveProperty('isValid');
    expect(result.current.validation).toHaveProperty('getErrors');
    expect(result.current.validation).toHaveProperty('getWarnings');
    
    expect(typeof result.current.validation.validateProperty).toBe('function');
    expect(typeof result.current.validation.validateField).toBe('function');
    expect(typeof result.current.validation.isValid).toBe('function');
  });

  it('should provide configuration utilities', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.config).toHaveProperty('getFieldConfig');
    expect(result.current.config).toHaveProperty('getRequiredFields');
    expect(result.current.config).toHaveProperty('getFieldValidationRules');
    expect(result.current.config).toHaveProperty('getAllFieldConfigs');
    
    expect(typeof result.current.config.getFieldConfig).toBe('function');
    expect(typeof result.current.config.getRequiredFields).toBe('function');
  });

  it('should provide formatting utilities', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.formatters).toHaveProperty('formatField');
    expect(result.current.formatters).toHaveProperty('formatAddress');
    expect(result.current.formatters).toHaveProperty('formatPrice');
    expect(result.current.formatters).toHaveProperty('formatDate');
    
    expect(typeof result.current.formatters.formatField).toBe('function');
    expect(typeof result.current.formatters.formatAddress).toBe('function');
    expect(typeof result.current.formatters.formatPrice).toBe('function');
  });

  it('should provide component-specific field mappings', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.componentFields).toHaveProperty('card');
    expect(result.current.componentFields).toHaveProperty('modal');
    
    expect(result.current.componentFields.card).toHaveProperty('address');
    expect(result.current.componentFields.card).toHaveProperty('details');
    expect(result.current.componentFields.card).toHaveProperty('listing');
    expect(result.current.componentFields.card).toHaveProperty('meta');
    
    expect(result.current.componentFields.modal).toHaveProperty('address');
    expect(result.current.componentFields.modal).toHaveProperty('details');
    expect(result.current.componentFields.modal).toHaveProperty('listing');
    expect(result.current.componentFields.modal).toHaveProperty('meta');
  });

  it('should provide status utilities', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.status).toHaveProperty('config');
    expect(result.current.status).toHaveProperty('text');
    expect(result.current.status).toHaveProperty('colorClass');
    expect(result.current.status).toHaveProperty('showNewListingRibbon');
    expect(result.current.status).toHaveProperty('hasOverlay');
    expect(result.current.status).toHaveProperty('overlayType');
    
    expect(result.current.status.text).toBe('For Sale');
    expect(result.current.status.showNewListingRibbon).toBe(true);
    expect(result.current.status.hasOverlay).toBe(false);
  });

  it('should provide price utilities', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.price).toHaveProperty('display');
    expect(result.current.price).toHaveProperty('amount');
    expect(result.current.price).toHaveProperty('currency');
    expect(result.current.price).toHaveProperty('suffix');
    expect(result.current.price).toHaveProperty('textColor');
    expect(result.current.price).toHaveProperty('statusColor');
    expect(result.current.price).toHaveProperty('isSold');
    expect(result.current.price).toHaveProperty('isLeased');
    expect(result.current.price).toHaveProperty('isActive');
    
    expect(result.current.price.display).toBe('$750,000');
    expect(result.current.price.amount).toBe(750000);
    expect(result.current.price.currency).toBe('CAD');
    expect(result.current.price.isActive).toBe(true);
  });

  it('should provide quick access to common fields', () => {
    const { result } = renderHook(() => usePropertyFields(mockProperty));
    
    expect(result.current.streetAddress).toBe('123 Test Street');
    expect(result.current.cityProvince).toBe('Toronto, ON');
    expect(result.current.bedrooms).toBe('3');
    expect(result.current.bathrooms).toBe('2');
    expect(result.current.squareFootage).toBe('1500');
    expect(result.current.parking).toBe('1+1');
    expect(result.current.mlsNumber).toBe('W1234567');
    expect(result.current.priceDisplay).toBe('$750,000');
    expect(result.current.priceWithSuffix).toBe('$750,000');
  });

  it('should handle empty or missing property data', () => {
    const emptyProperty: Property = {
      ListingKey: 'EMPTY123',
      UnparsedAddress: ''
    };
    
    const { result } = renderHook(() => usePropertyFields(emptyProperty));
    
    expect(result.current.streetAddress).toBe('');
    expect(result.current.bedrooms).toBe('?');
    expect(result.current.bathrooms).toBe('?');
    expect(result.current.priceDisplay).toBe('?');
  });
});
