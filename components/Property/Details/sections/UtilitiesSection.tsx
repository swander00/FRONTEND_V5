'use client';

import { Zap, Flame, Snowflake, Droplets, Wrench } from 'lucide-react';
import { Property } from '@/types';
import CollapsibleSection from '../ui/CollapsibleSection';

interface UtilitiesSectionProps {
  property: Property;
}

export default function UtilitiesSection({ property }: UtilitiesSectionProps) {
  const utilities = [
    {
      icon: Flame,
      label: 'Heating',
      value: (property as any).Heating || 'Forced Air',
      highlight: true
    },
    {
      icon: Snowflake,
      label: 'Cooling',
      value: (property as any).Cooling || 'Central Air',
      highlight: true
    },
    {
      icon: Droplets,
      label: 'Water',
      value: (property as any).WaterSource || 'Municipal'
    },
    {
      icon: Wrench,
      label: 'Sewer',
      value: (property as any).Sewer || 'Municipal'
    }
  ];

  return (
    <CollapsibleSection
      title="Utilities & Services"
      icon={Zap}
      colorScheme="cyan"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {utilities.map((utility, index) => {
          const IconComponent = utility.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                utility.highlight ? 'text-cyan-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {utility.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  utility.highlight ? 'text-cyan-900' : 'text-gray-900'
                }`}>
                  {utility.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}