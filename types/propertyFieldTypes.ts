import { Property } from './property';

/**
 * Field configuration interfaces for property field architecture
 */

export interface FieldConfig {
  key: string;
  displayName: string;
  required: boolean;
  defaultValue?: any;
  validationRules?: ValidationRule[];
  formatOptions?: FormatOptions;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface FormatOptions {
  type: 'currency' | 'date' | 'number' | 'text' | 'address' | 'status' | 'custom';
  locale?: string;
  currency?: string;
  dateFormat?: 'short' | 'medium' | 'long' | 'relative';
  numberFormat?: 'integer' | 'decimal' | 'percentage';
  textFormat?: 'title' | 'upper' | 'lower' | 'sentence';
  customFormatter?: (value: any) => string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StatusConfig {
  badgeText: string;
  badgeColorClass: string;
  showNewListingRibbon: boolean;
  overlayComponent: React.ComponentType<any> | null;
  textColor: string;
  statusColor: string;
}

export interface AddressConfig {
  format: 'full' | 'short' | 'street' | 'city-province';
  showUnit?: boolean;
  abbreviateSuffix?: boolean;
}

export interface PropertyFieldData {
  // Address fields
  address: {
    full: string;
    short: string;
    street: string;
    city: string;
    province: string;
    community?: string;
    region?: string;
  };
  
  // Property details
  details: {
    bedrooms: string;
    bathrooms: string;
    squareFootage: string;
    parking: string;
    propertyType: string;
    subType?: string;
  };
  
  // Listing info
  listing: {
    mlsNumber: string;
    listDate: string;
    listDateRelative: string;
    status: StatusConfig;
    price: {
      display: string;
      amount: number;
      currency: string;
      suffix: string;
      textColor: string;
      statusColor: string;
    };
  };
  
  // Meta information
  meta: {
    daysOnMarket: string;
    propertyAge: string;
    lotSize: string;
    basement: string;
  };
}

export interface FieldRendererProps {
  property: Property;
  config?: Partial<FieldConfig>;
  className?: string;
  format?: string;
}

export interface PropertyFieldAccessor {
  getFieldValue(property: Property, fieldKey: string): any;
  getFieldConfig(fieldKey: string): FieldConfig | undefined;
  validateField(fieldKey: string, value: any): ValidationResult;
  formatField(fieldKey: string, value: any, options?: Partial<FormatOptions>): string;
}

export interface PropertyFieldFormatter {
  formatAddress(property: Property, format?: AddressConfig['format']): string;
  formatDate(dateString: string, format?: FormatOptions['dateFormat']): string;
  formatPrice(price: number, currency?: string): string;
  formatStatus(status: string): StatusConfig;
  formatBedrooms(count: number): string;
  formatBathrooms(count: number): string;
  formatParkingSpaces(garage: number, drive: number): string;
  formatSquareFootage(sqft: string | number): string;
  formatDaysOnMarket(days: number): string;
}

export interface PropertyFieldValidator {
  validateProperty(property: Property): ValidationResult;
  validateField(fieldKey: string, value: any): ValidationResult;
  getRequiredFields(): string[];
  getFieldValidationRules(fieldKey: string): ValidationRule[];
}
