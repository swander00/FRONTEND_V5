import { Property } from '@/types/property';
import { PropertyFieldRenderer } from '@/components/Property/Fields/PropertyFieldRenderer';

export interface PropertyAddressProps {
  property?: Property;
  streetAddress?: string;
  cityProvince?: string;
  region?: string;
  format?: 'full' | 'short' | 'street' | 'city-province';
  className?: string;
}

/**
 * PropertyAddress component using the new property field architecture
 * Provides consistent address rendering across the application
 */
export default function PropertyAddress({
  property,
  streetAddress,
  cityProvince,
  region,
  format = 'full',
  className = '',
}: PropertyAddressProps) {
  // Use new architecture if property is provided
  if (property) {
    return (
      <PropertyFieldRenderer.Address
        property={property}
        format={format}
        className={className}
      />
    );
  }
  
  // Fallback to legacy rendering for backward compatibility
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold mb-1">{streetAddress}</h1>
      {cityProvince && (
        <p className="text-lg text-white/80 font-normal">{cityProvince}</p>
      )}
    </div>
  );
}
