import { Property } from '@/types/property';
import { 
  PropertyFieldFormatter, 
  PropertyFieldValidator, 
  PropertyFieldAccessor,
  ValidationResult,
  StatusConfig,
  FieldConfig,
  FormatOptions,
  PropertyFieldData
} from '@/types/propertyFieldTypes';
import { 
  FIELD_DISPLAY_CONFIG, 
  STATUS_CONFIG_MAP, 
  DEFAULT_STATUS_CONFIG,
  STREET_SUFFIX_MAP,
  COMMON_VALIDATION_RULES
} from './propertyFieldConstants';

/**
 * Centralized utility class for property field processing
 * Handles formatting, validation, and field access patterns
 */
export class PropertyFieldUtils implements PropertyFieldAccessor {
  
  // Address formatting methods
  static formatFullAddress(property: Property): string {
    const parts = [
      property.StreetAddress,
      property.City,
      property.StateOrProvince,
      property.PostalCode
    ].filter(Boolean);
    
    return parts.join(', ');
  }
  
  static formatShortAddress(property: Property): string {
    return property.StreetAddress || '';
  }
  
  static formatCityProvince(property: Property): string {
    return `${property.City || ''}, ${property.StateOrProvince || ''}`.replace(/^,\s*|,\s*$/g, '');
  }
  
  // Generate comprehensive address data
  static generateAddressData(property: Property) {
    return {
      full: PropertyFieldUtils.formatFullAddress(property),
      short: PropertyFieldUtils.formatShortAddress(property),
      street: property.StreetAddress || '',
      city: property.City || '',
      province: property.StateOrProvince || '',
      community: property.Community,
      region: property.Region
    };
  }
  
  // Date formatting methods
  static formatListDate(dateString: string, format: FormatOptions['dateFormat'] = 'medium'): string {
    if (!dateString) return '?';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '?';
      
      switch (format) {
        case 'short':
          return date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        case 'long':
          return date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        case 'relative':
          return PropertyFieldUtils.formatRelativeDate(dateString);
        default: // medium
          return date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
      }
    } catch (error) {
      return '?';
    }
  }
  
  static formatRelativeDate(dateString: string): string {
    if (!dateString) return '?';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '?';
      
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInMinutes < 60) {
        if (diffInMinutes === 0) return 'Just listed';
        if (diffInMinutes === 1) return 'Listed 1 min ago';
        return `Listed ${diffInMinutes} mins ago`;
      }
      
      if (diffInHours < 24) {
        if (diffInHours === 1) return 'Listed 1 hour ago';
        return `Listed ${diffInHours} hours ago`;
      }
      
      if (diffInDays === 1) return 'Listed 1 day ago';
      if (diffInDays < 7) return `Listed ${diffInDays} days ago`;
      
      if (diffInDays < 14) return 'Listed 1 week ago';
      if (diffInDays < 30) return `Listed ${Math.floor(diffInDays / 7)} weeks ago`;
      
      if (diffInDays < 60) return 'Listed 1 month ago';
      return `Listed ${Math.floor(diffInDays / 30)} months ago`;
    } catch (error) {
      return '?';
    }
  }
  
  // Price formatting methods
  static formatPrice(price?: number, currency: string = 'CAD'): string {
    if (!price || price === 0) return '?';
    
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  
  static formatPriceRange(min: number, max: number, currency: string = 'CAD'): string {
    if (!min && !max) return '?';
    if (!min) return PropertyFieldUtils.formatPrice(max, currency);
    if (!max) return PropertyFieldUtils.formatPrice(min, currency);
    
    return `${PropertyFieldUtils.formatPrice(min, currency)} - ${PropertyFieldUtils.formatPrice(max, currency)}`;
  }
  
  // Status formatting methods
  static getStatusConfig(status: string): StatusConfig {
    if (!status) return DEFAULT_STATUS_CONFIG;
    
    const normalizedStatus = status.toLowerCase().trim();
    return STATUS_CONFIG_MAP[normalizedStatus] || DEFAULT_STATUS_CONFIG;
  }
  
  static formatStatusText(status: string): string {
    if (!status) return 'Unknown';
    
    return status
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Meta info formatting methods
  static formatBedrooms(count?: number, aboveGrade?: number, belowGrade?: number): string {
    // If we have above/below grade breakdown
    if (aboveGrade !== undefined && belowGrade !== undefined && (aboveGrade > 0 || belowGrade > 0)) {
      if (belowGrade === 0) return aboveGrade.toString();
      return `${aboveGrade}+${belowGrade}`;
    }
    
    // Fallback to simple count
    if (count === undefined || count === null) return '?';
    return count > 0 ? count.toString() : '?';
  }
  
  static formatBathrooms(count?: number): string {
    if (count === undefined || count === null) return '?';
    return count > 0 ? count.toString() : '?';
  }
  
  static formatParkingSpaces(garage?: number, drive?: number): string {
    const garageCount = garage || 0;
    const driveCount = drive || 0;
    
    if (garageCount === 0 && driveCount === 0) return '?';
    if (garageCount === 0) return driveCount.toString();
    if (driveCount === 0) return garageCount.toString();
    return `${garageCount}+${driveCount}`;
  }
  
  static formatSquareFootage(sqft?: string | number, minSqft?: number, maxSqft?: number): string {
    // If we have a range
    if (minSqft !== undefined && maxSqft !== undefined && (minSqft > 0 || maxSqft > 0)) {
      if (minSqft === maxSqft) return minSqft.toLocaleString('en-CA');
      if (minSqft === 0) return maxSqft.toLocaleString('en-CA');
      if (maxSqft === 0) return minSqft.toLocaleString('en-CA');
      return `${minSqft.toLocaleString('en-CA')}-${maxSqft.toLocaleString('en-CA')}`;
    }
    
    // Fallback to single value
    if (!sqft || sqft === '0' || sqft === 0) return '?';
    
    if (typeof sqft === 'number') {
      return sqft.toLocaleString('en-CA');
    }
    
    return sqft.toString();
  }
  
  static formatDaysOnMarket(days?: number): string {
    if (!days || days === 0) return '?';
    return days.toString();
  }
  
  // Street suffix formatting
  static shortenStreetSuffix(suffix?: string): string {
    if (!suffix) return '';
    
    // Check for exact match first
    if (STREET_SUFFIX_MAP[suffix]) {
      return STREET_SUFFIX_MAP[suffix];
    }
    
    // Check for case-insensitive match
    const lowerSuffix = suffix.toLowerCase();
    for (const [full, short] of Object.entries(STREET_SUFFIX_MAP)) {
      if (full.toLowerCase() === lowerSuffix) {
        return short;
      }
    }
    
    return suffix;
  }
  
  // Field access methods
  static getFieldValue(property: Property, fieldKey: string): any {
    return (property as any)[fieldKey];
  }
  
  getFieldValue(property: Property, fieldKey: string): any {
    return (property as any)[fieldKey];
  }
  
  getFieldConfig(fieldKey: string): FieldConfig | undefined {
    return FIELD_DISPLAY_CONFIG[fieldKey];
  }
  
  validateField(fieldKey: string, value: any): ValidationResult {
    const config = this.getFieldConfig(fieldKey);
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!config) {
      warnings.push(`No configuration found for field: ${fieldKey}`);
      return { isValid: true, errors, warnings };
    }
    
    // Check required fields
    if (config.required && (value === undefined || value === null || value === '')) {
      errors.push(`${config.displayName} is required`);
    }
    
    // Apply validation rules
    if (config.validationRules) {
      for (const rule of config.validationRules) {
        if (!this.validateRule(rule, value)) {
          errors.push(rule.message);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private validateRule(rule: any, value: any): boolean {
    switch (rule.type) {
      case 'required':
        return value !== undefined && value !== null && value !== '';
      case 'min':
        return typeof value === 'number' ? value >= rule.value : true;
      case 'max':
        return typeof value === 'number' ? value <= rule.value : true;
      case 'pattern':
        return typeof value === 'string' ? new RegExp(rule.value).test(value) : true;
      case 'custom':
        return rule.validator ? rule.validator(value) : true;
      default:
        return true;
    }
  }
  
  formatField(fieldKey: string, value: any, options?: Partial<FormatOptions>): string {
    const config = this.getFieldConfig(fieldKey);
    if (!config || !config.formatOptions) {
      return value?.toString() || '';
    }
    
    const formatOptions = { ...config.formatOptions, ...options };
    return this.formatValue(value, formatOptions);
  }
  
  private formatValue(value: any, options: FormatOptions): string {
    switch (options.type) {
      case 'currency':
        return PropertyFieldUtils.formatPrice(value, options.currency);
      case 'date':
        return PropertyFieldUtils.formatListDate(value, options.dateFormat);
      case 'number':
        if (options.numberFormat === 'integer') {
          return value ? value.toString() : '?';
        }
        return value ? value.toString() : '?';
      case 'text':
        return this.formatTextValue(value, options.textFormat);
      case 'status':
        return PropertyFieldUtils.formatStatusText(value);
      case 'custom':
        return options.customFormatter ? options.customFormatter(value) : value?.toString() || '';
      default:
        return value?.toString() || '';
    }
  }
  
  private formatTextValue(value: any, format?: string): string {
    if (!value || typeof value !== 'string') return '';
    
    switch (format) {
      case 'title':
        return value
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      case 'upper':
        return value.toUpperCase();
      case 'lower':
        return value.toLowerCase();
      case 'sentence':
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      default:
        return value;
    }
  }
  
  // Property validation methods
  validateProperty(property: Property): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate required fields
    const requiredFields = this.getRequiredFields();
    for (const field of requiredFields) {
      const value = this.getFieldValue(property, field);
      const fieldResult = this.validateField(field, value);
      
      if (!fieldResult.isValid) {
        errors.push(...fieldResult.errors);
      }
      warnings.push(...fieldResult.warnings);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  getRequiredFields(): string[] {
    return Object.values(FIELD_DISPLAY_CONFIG)
      .filter(config => config.required)
      .map(config => config.key);
  }
  
  getFieldValidationRules(fieldKey: string): any[] {
    const config = this.getFieldConfig(fieldKey);
    return config?.validationRules || [];
  }
  
  // Comprehensive field data generation
  static generatePropertyFieldData(property: Property): PropertyFieldData {
    return {
      address: PropertyFieldUtils.generateAddressData(property),
      
      details: {
        bedrooms: PropertyFieldUtils.formatBedrooms(property.Bedrooms, property.BedroomsAboveGrade, property.BedroomsBelowGrade),
        bathrooms: PropertyFieldUtils.formatBathrooms(property.Bathrooms),
        squareFootage: PropertyFieldUtils.formatSquareFootage(property.SquareFootage, property.SquareFootageMin, property.SquareFootageMax),
        parking: PropertyFieldUtils.formatParkingSpaces(property.GarageParking, property.DriveParking),
        propertyType: property.PropertyType || '',
        subType: property.SubType
      },
      
      listing: {
        mlsNumber: property.ListingKey || '',
        listDate: PropertyFieldUtils.formatListDate(property.ListDate || ''),
        listDateRelative: PropertyFieldUtils.formatRelativeDate(property.ListDate || ''),
        status: PropertyFieldUtils.getStatusConfig((property as any).status || (property as any).MlsStatus || ''),
        price: {
          display: PropertyFieldUtils.formatPrice((property as any).ListPrice || (property as any).ClosePrice || 0),
          amount: (property as any).ListPrice || (property as any).ClosePrice || 0,
          currency: 'CAD',
          suffix: PropertyFieldUtils.getPriceSuffix(property),
          textColor: PropertyFieldUtils.getPriceTextColor(property),
          statusColor: PropertyFieldUtils.getPriceStatusColor(property)
        }
      },
      
      meta: {
        daysOnMarket: PropertyFieldUtils.formatDaysOnMarket(property.DaysOnMarket),
        propertyAge: property.PropertyAge || '',
        lotSize: property.LotSize || '',
        basement: property.Basement || ''
      }
    };
  }
  
  private static getPriceSuffix(property: Property): string {
    const status = ((property as any).MlsStatus || property.status || '').toLowerCase();
    
    switch (status) {
      case 'for lease':
        return '/month';
      case 'sold':
        return ' · Sold';
      case 'leased':
        return '/month · Leased';
      default:
        return '';
    }
  }
  
  private static getPriceTextColor(property: Property): string {
    const status = ((property as any).MlsStatus || property.status || '').toLowerCase();
    
    switch (status) {
      case 'sold':
      case 'leased':
      case 'terminated':
      case 'expired':
      case 'suspended':
        return 'text-gray-600';
      default:
        return 'text-gray-900';
    }
  }
  
  private static getPriceStatusColor(property: Property): string {
    const status = ((property as any).MlsStatus || property.status || '').toLowerCase();
    
    switch (status) {
      case 'for lease':
      case 'leased':
        return 'text-blue-600';
      case 'sold':
        return 'text-emerald-600';
      case 'terminated':
      case 'expired':
      case 'suspended':
        return 'text-red-600';
      default:
        return 'text-emerald-600';
    }
  }
}
