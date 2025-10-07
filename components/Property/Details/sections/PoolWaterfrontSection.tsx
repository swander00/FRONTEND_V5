'use client';

import { Waves, Droplets, Anchor, Mountain } from 'lucide-react';
import { Property } from '@/types';
import { CollapsibleSection } from '../ui';

interface PoolWaterfrontSectionProps {
  property: Property;
}

export default function PoolWaterfrontSection({ property }: PoolWaterfrontSectionProps) {
  const waterFeatures = [
    {
      icon: Droplets,
      label: 'Swimming Pool',
      value: property.SwimmingPool || 'None',
      highlight: property.SwimmingPool && property.SwimmingPool !== 'None'
    },
    {
      icon: Waves,
      label: 'Waterfront',
      value: property.Waterfront ? 'Yes' : 'No',
      highlight: property.Waterfront
    },
    {
      icon: Anchor,
      label: 'Water Access',
      value: (property as any).WaterAccess || 'None'
    },
    {
      icon: Mountain,
      label: 'Water View',
      value: (property as any).WaterView ? 'Yes' : 'No'
    }
  ];

  return (
    <CollapsibleSection
      title="Pool & Waterfront"
      icon={Waves}
      colorScheme="blue"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {waterFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                feature.highlight ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {feature.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  feature.highlight ? 'text-blue-900' : 'text-gray-900'
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