import { FieldConfig, FormatOptions } from '@/types/propertyFieldTypes';
import { PropertyFieldUtils } from '@/utils/propertyFieldUtils';

/**
 * Field display configurations for different components and contexts
 * Provides component-specific field mappings and formatting preferences
 */

// Component-specific field display configurations
export const COMPONENT_FIELD_CONFIGS = {
  PropertyCard: {
    // Address fields to display
    address: {
      fields: ['streetAddress', 'cityProvince', 'community'],
      format: 'short' as const,
      showUnit: false,
      abbreviateSuffix: true
    },
    
    // Property details to display
    details: {
      fields: ['bedrooms', 'bathrooms', 'squareFootage', 'parking'],
      format: 'compact' as const,
      showIcons: true
    },
    
    // Listing information to display
    listing: {
      fields: ['mlsNumber', 'listDateRelative', 'status', 'price'],
      format: 'card' as const,
      showSuffix: true
    },
    
    // Meta information to display
    meta: {
      fields: ['daysOnMarket'],
      format: 'minimal' as const
    }
  },
  
  PropertyDetailsModal: {
    // Address fields to display
    address: {
      fields: ['streetAddress', 'cityProvince', 'community', 'region'],
      format: 'full' as const,
      showUnit: true,
      abbreviateSuffix: false
    },
    
    // Property details to display
    details: {
      fields: ['bedrooms', 'bathrooms', 'squareFootage', 'propertyType', 'subType'],
      format: 'detailed' as const,
      showIcons: true
    },
    
    // Listing information to display
    listing: {
      fields: ['mlsNumber', 'listDate', 'status', 'price'],
      format: 'modal' as const,
      showSuffix: true
    },
    
    // Meta information to display
    meta: {
      fields: ['daysOnMarket', 'propertyAge', 'lotSize', 'basement'],
      format: 'full' as const
    }
  },
  
  PropertyList: {
    // Address fields to display
    address: {
      fields: ['streetAddress', 'cityProvince'],
      format: 'short' as const,
      showUnit: false,
      abbreviateSuffix: true
    },
    
    // Property details to display
    details: {
      fields: ['bedrooms', 'bathrooms', 'squareFootage'],
      format: 'minimal' as const,
      showIcons: false
    },
    
    // Listing information to display
    listing: {
      fields: ['price', 'status'],
      format: 'list' as const,
      showSuffix: false
    },
    
    // Meta information to display
    meta: {
      fields: ['listDateRelative'],
      format: 'minimal' as const
    }
  }
};

// Format preferences for different contexts
export const FORMAT_PREFERENCES = {
  // Price formatting preferences
  price: {
    PropertyCard: {
      size: 'lg' as const,
      showSuffix: true,
      align: 'left' as const
    },
    PropertyDetailsModal: {
      size: 'xl' as const,
      showSuffix: true,
      align: 'left' as const
    },
    PropertyList: {
      size: 'md' as const,
      showSuffix: false,
      align: 'right' as const
    }
  },
  
  // Status formatting preferences
  status: {
    PropertyCard: {
      size: 'md' as const,
      showNewListingRibbon: true
    },
    PropertyDetailsModal: {
      size: 'lg' as const,
      showNewListingRibbon: true
    },
    PropertyList: {
      size: 'sm' as const,
      showNewListingRibbon: false
    }
  },
  
  // Address formatting preferences
  address: {
    PropertyCard: {
      format: 'short' as const,
      showCommunity: true
    },
    PropertyDetailsModal: {
      format: 'full' as const,
      showCommunity: true
    },
    PropertyList: {
      format: 'street' as const,
      showCommunity: false
    }
  },
  
  // Meta info formatting preferences
  metaInfo: {
    PropertyCard: {
      compact: false,
      showIcons: true
    },
    PropertyDetailsModal: {
      compact: false,
      showIcons: true
    },
    PropertyList: {
      compact: true,
      showIcons: false
    }
  }
};

// Field visibility configurations
export const FIELD_VISIBILITY_CONFIG = {
  // Fields that should always be visible
  alwaysVisible: [
    'streetAddress',
    'listPrice',
    'mlsStatus',
    'bedrooms',
    'bathrooms'
  ],
  
  // Fields that should be hidden for certain statuses
  hiddenForStatus: {
    'sold': ['listPrice'],
    'leased': ['listPrice'],
    'terminated': ['listPrice'],
    'expired': ['listPrice'],
    'suspended': ['listPrice']
  },
  
  // Fields that should be shown only for certain statuses
  shownForStatus: {
    'sold': ['closePrice'],
    'leased': ['closePrice'],
    'for lease': ['listPrice']
  },
  
  // Fields that should be hidden if empty
  hideIfEmpty: [
    'community',
    'region',
    'squareFootage',
    'parking',
    'propertyAge',
    'lotSize',
    'basement'
  ]
};

// Component-specific field overrides
export const COMPONENT_FIELD_OVERRIDES = {
  PropertyCard: {
    // Override default field configurations for PropertyCard
    price: {
      ...FORMAT_PREFERENCES.price.PropertyCard,
      className: 'text-3xl font-bold'
    },
    status: {
      ...FORMAT_PREFERENCES.status.PropertyCard,
      className: 'px-3 py-1.5 rounded-lg text-xs font-semibold'
    },
    address: {
      ...FORMAT_PREFERENCES.address.PropertyCard,
      className: 'text-xl font-bold leading-tight'
    }
  },
  
  PropertyDetailsModal: {
    // Override default field configurations for PropertyDetailsModal
    price: {
      ...FORMAT_PREFERENCES.price.PropertyDetailsModal,
      className: 'text-4xl font-bold'
    },
    status: {
      ...FORMAT_PREFERENCES.status.PropertyDetailsModal,
      className: 'px-4 py-2 rounded-lg text-sm font-semibold'
    },
    address: {
      ...FORMAT_PREFERENCES.address.PropertyDetailsModal,
      className: 'text-3xl font-bold'
    }
  }
};

// Dynamic field configuration based on property data
export const getDynamicFieldConfig = (property: any, componentType: string) => {
  const baseConfig = COMPONENT_FIELD_CONFIGS[componentType as keyof typeof COMPONENT_FIELD_CONFIGS];
  if (!baseConfig) return null;
  
  const status = property?.MlsStatus?.toLowerCase();
  const overrides = COMPONENT_FIELD_OVERRIDES[componentType as keyof typeof COMPONENT_FIELD_OVERRIDES];
  
  // Apply status-based field visibility
  const visibleFields = { ...baseConfig };
  
  // Hide fields based on status
  if (status && FIELD_VISIBILITY_CONFIG.hiddenForStatus[status as keyof typeof FIELD_VISIBILITY_CONFIG.hiddenForStatus]) {
    FIELD_VISIBILITY_CONFIG.hiddenForStatus[status as keyof typeof FIELD_VISIBILITY_CONFIG.hiddenForStatus].forEach((field: string) => {
      if (visibleFields.listing.fields.includes(field)) {
        visibleFields.listing.fields = visibleFields.listing.fields.filter(f => f !== field);
      }
    });
  }
  
  // Show fields based on status
  if (status && FIELD_VISIBILITY_CONFIG.shownForStatus[status as keyof typeof FIELD_VISIBILITY_CONFIG.shownForStatus]) {
    FIELD_VISIBILITY_CONFIG.shownForStatus[status as keyof typeof FIELD_VISIBILITY_CONFIG.shownForStatus].forEach((field: string) => {
      if (!visibleFields.listing.fields.includes(field)) {
        visibleFields.listing.fields.push(field);
      }
    });
  }
  
  // Hide empty fields
  Object.keys(visibleFields).forEach(section => {
    (visibleFields as any)[section].fields = (visibleFields as any)[section].fields.filter((field: string) => {
      if (FIELD_VISIBILITY_CONFIG.hideIfEmpty.includes(field)) {
        const value = PropertyFieldUtils.getFieldValue(property, field) || 
                     (property as any)[field];
        return value && value !== '' && value !== 0 && value !== '?';
      }
      return true;
    });
  });
  
  return {
    ...visibleFields,
    overrides: overrides || {}
  };
};

// Export configuration utilities
export const PropertyFieldConfig = {
  getComponentConfig: (componentType: string) => COMPONENT_FIELD_CONFIGS[componentType as keyof typeof COMPONENT_FIELD_CONFIGS],
  getFormatPreferences: (componentType: string) => FORMAT_PREFERENCES,
  getFieldVisibility: () => FIELD_VISIBILITY_CONFIG,
  getComponentOverrides: (componentType: string) => COMPONENT_FIELD_OVERRIDES[componentType as keyof typeof COMPONENT_FIELD_OVERRIDES],
  getDynamicConfig: getDynamicFieldConfig
};
