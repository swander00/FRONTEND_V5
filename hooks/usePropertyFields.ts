import { useMemo } from 'react';
import { Property } from '@/types/property';
import { PropertyFieldData, ValidationResult, FieldConfig } from '@/types/propertyFieldTypes';
import { PropertyFieldUtils } from '@/utils/propertyFieldUtils';
import { FIELD_DISPLAY_CONFIG } from '@/utils/propertyFieldConstants';

/**
 * Custom hook for standardized property field access and processing
 * Provides consistent field access patterns across components
 */
export const usePropertyFields = (property: Property) => {
  
  // Generate comprehensive field data using centralized utilities
  const fieldData = useMemo((): PropertyFieldData => {
    // Handle empty or undefined property gracefully
    if (!property || Object.keys(property).length === 0) {
      return {
        address: { full: '', short: '', street: '', city: '', province: '', community: '', region: '' },
        details: { bedrooms: '?', bathrooms: '?', squareFootage: '?', parking: '?', propertyType: '', subType: '' },
        listing: {
          mlsNumber: '', listDate: '', listDateRelative: '', 
          status: { badgeText: 'Unknown', badgeColorClass: '', showNewListingRibbon: false, overlayComponent: null, textColor: '', statusColor: '' },
          price: { display: '?', amount: 0, currency: 'CAD', suffix: '', textColor: '', statusColor: '' }
        },
        meta: { daysOnMarket: '?', propertyAge: '', lotSize: '', basement: '' }
      };
    }
    return PropertyFieldUtils.generatePropertyFieldData(property);
  }, [property]);
  
  // Address fields with multiple format options
  const address = useMemo(() => ({
    full: fieldData.address.full,
    short: fieldData.address.short,
    street: fieldData.address.street,
    city: fieldData.address.city,
    province: fieldData.address.province,
    community: fieldData.address.community,
    region: fieldData.address.region,
    cityProvince: fieldData.address.city ? `${fieldData.address.city}, ${fieldData.address.province}` : fieldData.address.province,
    
    // Additional formatted options
    display: {
      primary: fieldData.address.full,
      secondary: fieldData.address.community || fieldData.address.region,
      compact: fieldData.address.short
    }
  }), [fieldData.address]);
  
  // Property details with formatted values
  const details = useMemo(() => ({
    bedrooms: fieldData.details.bedrooms,
    bathrooms: fieldData.details.bathrooms,
    squareFootage: fieldData.details.squareFootage,
    parking: fieldData.details.parking,
    propertyType: fieldData.details.propertyType,
    subType: fieldData.details.subType,
    
    // Additional formatted options
    display: {
      bedrooms: `${fieldData.details.bedrooms} Bed${fieldData.details.bedrooms !== '1' ? 's' : ''}`,
      bathrooms: `${fieldData.details.bathrooms} Bath${fieldData.details.bathrooms !== '1' ? 's' : ''}`,
      squareFootage: fieldData.details.squareFootage !== '?' ? `${fieldData.details.squareFootage} Sqft` : '?',
      parking: fieldData.details.parking !== '?' ? `${fieldData.details.parking} Park` : '?'
    }
  }), [fieldData.details]);
  
  // Listing information with formatted values
  const listing = useMemo(() => ({
    mlsNumber: fieldData.listing.mlsNumber,
    listDate: fieldData.listing.listDate,
    listDateRelative: fieldData.listing.listDateRelative,
    status: fieldData.listing.status,
    price: fieldData.listing.price,
    
    // Additional formatted options
    display: {
      mlsNumber: fieldData.listing.mlsNumber ? 
        (fieldData.listing.mlsNumber.startsWith('#') ? fieldData.listing.mlsNumber : `#${fieldData.listing.mlsNumber}`) : 
        '?',
      price: fieldData.listing.price.display,
      priceWithSuffix: `${fieldData.listing.price.display}${fieldData.listing.price.suffix}`,
      status: fieldData.listing.status.badgeText
    }
  }), [fieldData.listing]);
  
  // Meta information with formatted values
  const meta = useMemo(() => ({
    daysOnMarket: fieldData.meta.daysOnMarket,
    propertyAge: fieldData.meta.propertyAge,
    lotSize: fieldData.meta.lotSize,
    basement: fieldData.meta.basement,
    
    // Additional formatted options
    display: {
      daysOnMarket: fieldData.meta.daysOnMarket !== '?' ? `${fieldData.meta.daysOnMarket} days on market` : '?',
      propertyAge: fieldData.meta.propertyAge || '?',
      lotSize: fieldData.meta.lotSize || '?',
      basement: fieldData.meta.basement || '?'
    }
  }), [fieldData.meta]);
  
  // Validation utilities
  const validation = useMemo(() => {
    const validator = new PropertyFieldUtils();
    return {
      validateProperty: (): ValidationResult => validator.validateProperty(property),
      validateField: (fieldKey: string, value?: any): ValidationResult => {
        const fieldValue = value !== undefined ? value : validator.getFieldValue(property, fieldKey);
        return validator.validateField(fieldKey, fieldValue);
      },
      isValid: (): boolean => validator.validateProperty(property).isValid,
      getErrors: (): string[] => validator.validateProperty(property).errors,
      getWarnings: (): string[] => validator.validateProperty(property).warnings
    };
  }, [property]);
  
  // Field configuration utilities
  const config = useMemo(() => {
    const validator = new PropertyFieldUtils();
    return {
      getFieldConfig: (fieldKey: string): FieldConfig | undefined => validator.getFieldConfig(fieldKey),
      getRequiredFields: (): string[] => validator.getRequiredFields(),
      getFieldValidationRules: (fieldKey: string) => validator.getFieldValidationRules(fieldKey),
      getAllFieldConfigs: (): Record<string, FieldConfig> => FIELD_DISPLAY_CONFIG
    };
  }, []);
  
  // Formatting utilities
  const formatters = useMemo(() => ({
    formatField: (fieldKey: string, options?: any) => {
      const validator = new PropertyFieldUtils();
      const value = validator.getFieldValue(property, fieldKey);
      return validator.formatField(fieldKey, value, options);
    },
    formatAddress: (format: 'full' | 'short' | 'street' = 'full') => {
      switch (format) {
        case 'short':
          return fieldData.address.short;
        case 'street':
          return fieldData.address.street;
        default:
          return fieldData.address.full;
      }
    },
    formatPrice: (currency: string = 'CAD') => {
      return PropertyFieldUtils.formatPrice(property.ListPrice || property.ClosePrice, currency);
    },
    formatDate: (dateString: string, format: 'short' | 'medium' | 'long' | 'relative' = 'medium') => {
      return PropertyFieldUtils.formatListDate(dateString, format);
    }
  }), [property, fieldData]);
  
  // Component-specific field mappings
  const componentFields = useMemo(() => ({
    // Fields commonly used in PropertyCard
    card: {
      address: [address.short, address.cityProvince, address.community],
      details: [details.bedrooms, details.bathrooms, details.squareFootage, details.parking],
      listing: [listing.mlsNumber, listing.listDateRelative, listing.status, listing.price],
      meta: [meta.daysOnMarket]
    },
    
    // Fields commonly used in PropertyDetailsModal
    modal: {
      address: [address.full, address.community, address.region],
      details: [details.bedrooms, details.bathrooms, details.squareFootage, details.propertyType],
      listing: [listing.mlsNumber, listing.listDate, listing.status, listing.price],
      meta: [meta.daysOnMarket, meta.propertyAge, meta.lotSize, meta.basement]
    }
  }), [address, details, listing, meta]);
  
  // Status and overlay utilities
  const status = useMemo(() => ({
    config: fieldData.listing.status,
    text: fieldData.listing.status.badgeText,
    colorClass: fieldData.listing.status.badgeColorClass,
    showNewListingRibbon: fieldData.listing.status.showNewListingRibbon && property.IsNewListing,
    hasOverlay: ['sold', 'leased', 'terminated', 'expired', 'suspended'].includes(
      property.MlsStatus?.toLowerCase() || ''
    ),
    overlayType: property.MlsStatus?.toLowerCase() || ''
  }), [fieldData.listing.status, property.MlsStatus, property.IsNewListing]);
  
  // Price utilities
  const price = useMemo(() => ({
    display: fieldData.listing.price.display,
    amount: fieldData.listing.price.amount,
    currency: fieldData.listing.price.currency,
    suffix: fieldData.listing.price.suffix,
    textColor: fieldData.listing.price.textColor,
    statusColor: fieldData.listing.price.statusColor,
    isSold: property.MlsStatus?.toLowerCase() === 'sold',
    isLeased: property.MlsStatus?.toLowerCase() === 'leased',
    isActive: ['for sale', 'active', 'for lease'].includes(property.MlsStatus?.toLowerCase() || '')
  }), [fieldData.listing.price, property.MlsStatus]);
  
  return {
    // Core field data
    fieldData,
    
    // Organized field groups
    address,
    details,
    listing,
    meta,
    
    // Utility functions
    validation,
    config,
    formatters,
    
    // Component-specific helpers
    componentFields,
    status,
    price,
    
    // Quick access to common fields
    streetAddress: fieldData.address.street,
    cityProvince: fieldData.address.city ? `${fieldData.address.city}, ${fieldData.address.province}` : fieldData.address.province,
    bedrooms: fieldData.details.bedrooms,
    bathrooms: fieldData.details.bathrooms,
    squareFootage: fieldData.details.squareFootage,
    parking: fieldData.details.parking,
    mlsNumber: fieldData.listing.mlsNumber,
    listDate: fieldData.listing.listDate,
    listDateRelative: fieldData.listing.listDateRelative,
    statusConfig: fieldData.listing.status,
    priceDisplay: fieldData.listing.price.display,
    priceWithSuffix: `${fieldData.listing.price.display}${fieldData.listing.price.suffix}`
  };
};

export default usePropertyFields;
