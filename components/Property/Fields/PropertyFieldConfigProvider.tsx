"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Property } from '@/types/property';
import { PropertyFieldConfig } from '@/config';
import { FieldConfig, FormatOptions } from '@/types/propertyFieldTypes';

/**
 * Context for property field configuration
 * Provides dynamic field display options and component-specific overrides
 */

interface PropertyFieldConfigContextType {
  // Current configuration state
  currentConfig: any;
  componentType: string;
  
  // Configuration methods
  setComponentType: (type: string) => void;
  updateFieldConfig: (fieldKey: string, config: Partial<FieldConfig>) => void;
  updateFormatOptions: (fieldKey: string, options: Partial<FormatOptions>) => void;
  
  // Dynamic configuration methods
  getDynamicConfig: (property: Property) => any;
  getFieldVisibility: (property: Property, fieldKey: string) => boolean;
  getFieldFormat: (fieldKey: string) => FormatOptions | undefined;
  
  // Component-specific helpers
  getComponentConfig: () => any;
  getFormatPreferences: () => any;
  getComponentOverrides: () => any;
}

const PropertyFieldConfigContext = createContext<PropertyFieldConfigContextType | undefined>(undefined);

interface PropertyFieldConfigProviderProps {
  children: ReactNode;
  defaultComponentType?: string;
  customConfig?: Partial<PropertyFieldConfigContextType>;
}

/**
 * PropertyFieldConfigProvider component
 * Provides context-based field configuration for property components
 */
export const PropertyFieldConfigProvider: React.FC<PropertyFieldConfigProviderProps> = ({
  children,
  defaultComponentType = 'PropertyCard',
  customConfig
}) => {
  const [componentType, setComponentType] = useState(defaultComponentType);
  const [fieldConfigs, setFieldConfigs] = useState<Record<string, Partial<FieldConfig>>>({});
  const [formatOptions, setFormatOptions] = useState<Record<string, Partial<FormatOptions>>>({});
  
  // Memoized current configuration
  const currentConfig = useMemo(() => {
    const baseConfig = PropertyFieldConfig.getComponentConfig(componentType);
    const overrides = PropertyFieldConfig.getComponentOverrides(componentType);
    
    return {
      ...baseConfig,
      overrides: overrides || {},
      customFieldConfigs: fieldConfigs,
      customFormatOptions: formatOptions
    };
  }, [componentType, fieldConfigs, formatOptions]);
  
  // Configuration update methods
  const updateFieldConfig = (fieldKey: string, config: Partial<FieldConfig>) => {
    setFieldConfigs(prev => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], ...config }
    }));
  };
  
  const updateFormatOptions = (fieldKey: string, options: Partial<FormatOptions>) => {
    setFormatOptions(prev => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], ...options }
    }));
  };
  
  // Dynamic configuration methods
  const getDynamicConfig = (property: Property) => {
    return PropertyFieldConfig.getDynamicConfig(property, componentType);
  };
  
  const getFieldVisibility = (property: Property, fieldKey: string) => {
    const dynamicConfig = getDynamicConfig(property);
    if (!dynamicConfig) return true;
    
    // Check if field should be hidden based on status
    const status = property?.MlsStatus?.toLowerCase();
    const hiddenForStatus = PropertyFieldConfig.getFieldVisibility().hiddenForStatus;
    
    if (status && hiddenForStatus[status as keyof typeof hiddenForStatus]?.includes(fieldKey)) {
      return false;
    }
    
    // Check if field should be shown only for certain statuses
    const shownForStatus = PropertyFieldConfig.getFieldVisibility().shownForStatus;
    if (status && shownForStatus[status as keyof typeof shownForStatus]?.includes(fieldKey)) {
      return true;
    }
    
    // Check if field should be hidden if empty
    const hideIfEmpty = PropertyFieldConfig.getFieldVisibility().hideIfEmpty;
    if (hideIfEmpty.includes(fieldKey)) {
      const value = (property as any)[fieldKey];
      return value && value !== '' && value !== 0 && value !== '?';
    }
    
    return true;
  };
  
  const getFieldFormat = (fieldKey: string): FormatOptions | undefined => {
    const customFormat = formatOptions[fieldKey];
    if (customFormat) return customFormat as FormatOptions;
    
    const componentConfig = PropertyFieldConfig.getComponentConfig(componentType);
    const fieldConfig = componentConfig?.details?.fields?.includes(fieldKey) ? 
      componentConfig.details : 
      componentConfig?.listing?.fields?.includes(fieldKey) ? 
      componentConfig.listing : 
      componentConfig?.address?.fields?.includes(fieldKey) ? 
      componentConfig.address : 
      null;
    
    return fieldConfig?.format ? { type: 'text' as const } : undefined;
  };
  
  // Component-specific helper methods
  const getComponentConfig = () => {
    return PropertyFieldConfig.getComponentConfig(componentType);
  };
  
  const getFormatPreferences = () => {
    return PropertyFieldConfig.getFormatPreferences(componentType);
  };
  
  const getComponentOverrides = () => {
    return PropertyFieldConfig.getComponentOverrides(componentType);
  };
  
  const contextValue: PropertyFieldConfigContextType = {
    currentConfig,
    componentType,
    setComponentType,
    updateFieldConfig,
    updateFormatOptions,
    getDynamicConfig,
    getFieldVisibility,
    getFieldFormat,
    getComponentConfig,
    getFormatPreferences,
    getComponentOverrides,
    ...customConfig
  };
  
  return (
    <PropertyFieldConfigContext.Provider value={contextValue}>
      {children}
    </PropertyFieldConfigContext.Provider>
  );
};

/**
 * Hook to use property field configuration context
 */
export const usePropertyFieldConfig = (): PropertyFieldConfigContextType => {
  const context = useContext(PropertyFieldConfigContext);
  if (!context) {
    throw new Error('usePropertyFieldConfig must be used within a PropertyFieldConfigProvider');
  }
  return context;
};

/**
 * Higher-order component to wrap components with property field configuration
 */
export const withPropertyFieldConfig = <P extends object>(
  Component: React.ComponentType<P>,
  defaultComponentType?: string
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <PropertyFieldConfigProvider defaultComponentType={defaultComponentType}>
        <Component {...props} />
      </PropertyFieldConfigProvider>
    );
  };
  
  WrappedComponent.displayName = `withPropertyFieldConfig(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Hook to get component-specific field configuration
 */
export const useComponentFieldConfig = (componentType: string) => {
  const { getDynamicConfig } = usePropertyFieldConfig();
  
  return useMemo(() => ({
    getConfig: (property: Property) => getDynamicConfig(property),
    getFieldVisibility: (property: Property, fieldKey: string) => {
      const config = getDynamicConfig(property);
      return config ? Object.values(config).some((section: any) => 
        section.fields?.includes(fieldKey)
      ) : false;
    },
    getFormatPreferences: () => PropertyFieldConfig.getFormatPreferences(componentType),
    getComponentOverrides: () => PropertyFieldConfig.getComponentOverrides(componentType)
  }), [componentType, getDynamicConfig]);
};

export default PropertyFieldConfigProvider;
