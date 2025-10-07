'use client';

import { Home, Building, Bed, Bath, ChefHat, Square, TreePine, Calendar, Users, Flame } from 'lucide-react';
import { Property } from '@/types';
import CollapsibleSection from '../ui/CollapsibleSection';

interface PropertyDetailsSectionProps {
  property: Property;
}

export default function PropertyDetailsSection({ property }: PropertyDetailsSectionProps) {
  const propertyDetails = [
    {
      icon: Building,
      label: 'Property Class',
      value: property.PropertyClass || 'Residential',
      highlight: true
    },
    {
      icon: Home,
      label: 'Property Type',
      value: property.PropertyType || 'N/A',
      highlight: true
    },
    {
      icon: Bed,
      label: 'Bedrooms',
      value: property.Bedrooms?.toString() || 'N/A',
      highlight: true
    },
    {
      icon: Bath,
      label: 'Bathrooms',
      value: property.Bathrooms?.toString() || 'N/A',
      highlight: true
    },
    {
      icon: ChefHat,
      label: 'Kitchens',
      value: property.Kitchens?.toString() || '1'
    },
    {
      icon: Square,
      label: 'Square Footage',
      value: property.SquareFootage ? `${property.SquareFootage.toLocaleString()} sq ft` : 'N/A',
      highlight: true
    },
    {
      icon: TreePine,
      label: 'Lot Size',
      value: property.LotSize || 'N/A'
    },
    {
      icon: Calendar,
      label: 'Property Age',
      value: property.PropertyAge ? `${property.PropertyAge} years` : 'N/A'
    },
    {
      icon: Users,
      label: 'Family Room',
      value: property.HasFamilyRoom ? 'Yes' : 'No'
    },
    {
      icon: Flame,
      label: 'Fireplace',
      value: property.HasFireplace ? 'Yes' : 'No'
    }
  ];

  return (
    <CollapsibleSection
      title="Property Details"
      icon={Home}
      colorScheme="green"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyDetails.map((detail, index) => {
          const IconComponent = detail.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                detail.highlight ? 'text-green-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {detail.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  detail.highlight ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {detail.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}