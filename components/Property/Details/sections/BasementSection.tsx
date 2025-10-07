'use client';

import { SquareStack, DoorOpen, ChefHat, CheckCircle } from 'lucide-react';
import { Property } from '@/types';
import CollapsibleSection from '../ui/CollapsibleSection';

interface BasementSectionProps {
  property: Property;
}

export default function BasementSection({ property }: BasementSectionProps) {
  const basementFeatures = [
    {
      icon: CheckCircle,
      label: 'Basement Status',
      value: property.Basement || 'Not specified',
      highlight: property.Basement?.toLowerCase().includes('finished') || false
    },
    {
      icon: DoorOpen,
      label: 'Basement Entrance',
      value: property.Basement?.toLowerCase().includes('separate') ? 'Separate Entrance' : 'Shared Entrance',
      highlight: property.Basement?.toLowerCase().includes('separate') || false
    },
    {
      icon: ChefHat,
      label: 'Kitchen',
      value: property.Basement?.toLowerCase().includes('kitchen') ? 'Yes' : 'No',
      highlight: property.Basement?.toLowerCase().includes('kitchen') || false
    }
  ];

  return (
    <CollapsibleSection
      title="Basement Features"
      icon={SquareStack}
      colorScheme="amber"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {basementFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                feature.highlight ? 'text-amber-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {feature.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  feature.highlight ? 'text-amber-900' : 'text-gray-900'
                }`}>
                  {feature.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}