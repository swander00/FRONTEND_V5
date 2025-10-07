import { FieldConfig, ValidationRule, FormatOptions, StatusConfig } from '@/types/propertyFieldTypes';

/**
 * Field mapping configurations and validation rules for property field architecture
 */

// Field display configurations
export const FIELD_DISPLAY_CONFIG: Record<string, FieldConfig> = {
  // Address fields
  streetAddress: {
    key: 'streetAddress',
    displayName: 'Street Address',
    required: true,
    defaultValue: '',
    formatOptions: {
      type: 'text',
      textFormat: 'title'
    }
  },
  
  city: {
    key: 'city',
    displayName: 'City',
    required: true,
    defaultValue: '',
    formatOptions: {
      type: 'text',
      textFormat: 'title'
    }
  },
  
  province: {
    key: 'stateOrProvince',
    displayName: 'Province',
    required: true,
    defaultValue: '',
    formatOptions: {
      type: 'text',
      textFormat: 'upper'
    }
  },
  
  community: {
    key: 'community',
    displayName: 'Community',
    required: false,
    defaultValue: '',
    formatOptions: {
      type: 'text',
      textFormat: 'title'
    }
  },
  
  // Property details
  bedrooms: {
    key: 'bedrooms',
    displayName: 'Bedrooms',
    required: false,
    defaultValue: 0,
    validationRules: [
      {
        type: 'min',
        value: 0,
        message: 'Bedrooms cannot be negative'
      },
      {
        type: 'max',
        value: 20,
        message: 'Bedrooms cannot exceed 20'
      }
    ],
    formatOptions: {
      type: 'number',
      numberFormat: 'integer'
    }
  },
  
  bathrooms: {
    key: 'bathrooms',
    displayName: 'Bathrooms',
    required: false,
    defaultValue: 0,
    validationRules: [
      {
        type: 'min',
        value: 0,
        message: 'Bathrooms cannot be negative'
      },
      {
        type: 'max',
        value: 10,
        message: 'Bathrooms cannot exceed 10'
      }
    ],
    formatOptions: {
      type: 'number',
      numberFormat: 'integer'
    }
  },
  
  squareFootage: {
    key: 'squareFootage',
    displayName: 'Square Footage',
    required: false,
    defaultValue: '',
    formatOptions: {
      type: 'number',
      numberFormat: 'integer'
    }
  },
  
  // Listing information
  listPrice: {
    key: 'listPrice',
    displayName: 'List Price',
    required: false,
    defaultValue: 0,
    validationRules: [
      {
        type: 'min',
        value: 0,
        message: 'Price cannot be negative'
      }
    ],
    formatOptions: {
      type: 'currency',
      currency: 'CAD',
      locale: 'en-CA'
    }
  },
  
  mlsNumber: {
    key: 'mlsNumber',
    displayName: 'MLS Number',
    required: false,
    defaultValue: '',
    formatOptions: {
      type: 'text',
      textFormat: 'upper'
    }
  },
  
  listDate: {
    key: 'listDate',
    displayName: 'List Date',
    required: false,
    defaultValue: '',
    formatOptions: {
      type: 'date',
      dateFormat: 'medium'
    }
  },
  
  mlsStatus: {
    key: 'mlsStatus',
    displayName: 'MLS Status',
    required: false,
    defaultValue: '',
    formatOptions: {
      type: 'status'
    }
  }
};

// Status configuration mappings
export const STATUS_CONFIG_MAP: Record<string, StatusConfig> = {
  'for sale': {
    badgeText: 'For Sale',
    badgeColorClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm',
    showNewListingRibbon: true,
    overlayComponent: null,
    textColor: 'text-gray-900',
    statusColor: 'text-emerald-600'
  },
  
  'active': {
    badgeText: 'Active',
    badgeColorClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm',
    showNewListingRibbon: true,
    overlayComponent: null,
    textColor: 'text-gray-900',
    statusColor: 'text-emerald-600'
  },
  
  'for lease': {
    badgeText: 'For Lease',
    badgeColorClass: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm',
    showNewListingRibbon: true,
    overlayComponent: null,
    textColor: 'text-gray-900',
    statusColor: 'text-blue-600'
  },
  
  'sold': {
    badgeText: 'Sold',
    badgeColorClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm',
    showNewListingRibbon: false,
    overlayComponent: null, // Will be set dynamically
    textColor: 'text-gray-600',
    statusColor: 'text-emerald-600'
  },
  
  'leased': {
    badgeText: 'Leased',
    badgeColorClass: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm',
    showNewListingRibbon: false,
    overlayComponent: null, // Will be set dynamically
    textColor: 'text-gray-600',
    statusColor: 'text-blue-600'
  },
  
  'terminated': {
    badgeText: 'Terminated',
    badgeColorClass: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm',
    showNewListingRibbon: false,
    overlayComponent: null, // Will be set dynamically
    textColor: 'text-gray-600',
    statusColor: 'text-red-600'
  },
  
  'expired': {
    badgeText: 'Expired',
    badgeColorClass: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm',
    showNewListingRibbon: false,
    overlayComponent: null, // Will be set dynamically
    textColor: 'text-gray-600',
    statusColor: 'text-red-600'
  },
  
  'suspended': {
    badgeText: 'Suspended',
    badgeColorClass: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm',
    showNewListingRibbon: false,
    overlayComponent: null, // Will be set dynamically
    textColor: 'text-gray-600',
    statusColor: 'text-red-600'
  }
};

// Default status configuration for unknown statuses
export const DEFAULT_STATUS_CONFIG: StatusConfig = {
  badgeText: 'Unknown',
  badgeColorClass: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm',
  showNewListingRibbon: false,
  overlayComponent: null,
  textColor: 'text-gray-600',
  statusColor: 'text-gray-500'
};

// Street suffix abbreviations
export const STREET_SUFFIX_MAP: Record<string, string> = {
  'Street': 'St',
  'Avenue': 'Ave',
  'Road': 'Rd',
  'Boulevard': 'Blvd',
  'Drive': 'Dr',
  'Lane': 'Ln',
  'Court': 'Ct',
  'Place': 'Pl',
  'Way': 'Way',
  'Circle': 'Cir',
  'Terrace': 'Ter',
  'Crescent': 'Cres',
  'Close': 'Cl',
  'Grove': 'Grv',
  'Heights': 'Hts',
  'Park': 'Pk',
  'Square': 'Sq',
  'Trail': 'Trl',
  'Walk': 'Walk',
  'Mews': 'Mews',
  'Gardens': 'Gdns',
  'Manor': 'Mnr',
  'Village': 'Vlg',
  'Estates': 'Est',
  'Harbour': 'Hbr',
  'Harbor': 'Hbr',
  'Centre': 'Ctr',
  'Center': 'Ctr',
  'Plaza': 'Plz',
  'Commons': 'Com',
  'Crossing': 'Xing',
  'Extension': 'Ext',
  'North': 'N',
  'South': 'S',
  'East': 'E',
  'West': 'W',
  'Northeast': 'NE',
  'Northwest': 'NW',
  'Southeast': 'SE',
  'Southwest': 'SW'
};

// Component-specific field mappings
export const COMPONENT_FIELD_MAPPINGS = {
  PropertyCard: {
    address: ['streetAddress', 'cityProvince', 'community'],
    details: ['bedrooms', 'bathrooms', 'squareFootage', 'garageParking', 'driveParking'],
    listing: ['mlsNumber', 'listDate', 'mlsStatus', 'listPrice', 'closePrice'],
    meta: ['daysOnMarket']
  },
  
  PropertyDetailsModal: {
    address: ['streetAddress', 'cityProvince', 'community', 'region'],
    details: ['bedrooms', 'bathrooms', 'squareFootage', 'propertyType', 'subType'],
    listing: ['mlsNumber', 'listDate', 'mlsStatus', 'listPrice', 'closePrice'],
    meta: ['daysOnMarket', 'propertyAge', 'lotSize', 'basement']
  }
};

// Validation rules for common fields
export const COMMON_VALIDATION_RULES: Record<string, ValidationRule[]> = {
  bedrooms: [
    {
      type: 'min',
      value: 0,
      message: 'Bedrooms cannot be negative'
    },
    {
      type: 'max',
      value: 20,
      message: 'Bedrooms cannot exceed 20'
    }
  ],
  
  bathrooms: [
    {
      type: 'min',
      value: 0,
      message: 'Bathrooms cannot be negative'
    },
    {
      type: 'max',
      value: 10,
      message: 'Bathrooms cannot exceed 10'
    }
  ],
  
  price: [
    {
      type: 'min',
      value: 0,
      message: 'Price cannot be negative'
    }
  ]
};

// Format options for different field types
export const DEFAULT_FORMAT_OPTIONS: Record<string, FormatOptions> = {
  currency: {
    type: 'currency',
    locale: 'en-CA',
    currency: 'CAD'
  },
  
  date: {
    type: 'date',
    dateFormat: 'medium'
  },
  
  dateRelative: {
    type: 'date',
    dateFormat: 'relative'
  },
  
  number: {
    type: 'number',
    numberFormat: 'integer'
  },
  
  text: {
    type: 'text',
    textFormat: 'title'
  }
};
