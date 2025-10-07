'use client';

import { Building, DollarSign, CheckCircle, Sparkles, PawPrint, Package, Home, Calendar, FileText } from 'lucide-react';
import { Property } from '@/types';
import CollapsibleSection from '../ui/CollapsibleSection';

interface CondoInfoSectionProps {
  property: Property;
}

function formatTitleCase(value: string | undefined | null): string {
  if (!value || value === '?' || value === 'N/A') return 'N/A';
  return value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function shouldShow(value: string | undefined | null): boolean {
  return !!(value && value !== '?' && value !== 'N/A');
}

export default function CondoInfoSection({ property }: CondoInfoSectionProps) {
  const condoInfo = [
    { 
      label: 'Maintenance Fee', 
      value: property.MaintenanceFee ? `$${property.MaintenanceFee}` : 'N/A', 
      icon: DollarSign, 
      highlight: true,
      show: true 
    },
    { 
      label: 'Fee Schedule', 
      value: (property as any).MaintenanceFeeSchedule || 'Monthly', 
      icon: Calendar, 
      show: true 
    },
    { 
      label: 'Fee Includes', 
      value: formatTitleCase(property.FeeIncludes || 'Standard Services'), 
      icon: FileText, 
      show: true 
    },
    { 
      label: 'Condo Amenities', 
      value: formatTitleCase(property.CondoAmenities || ''), 
      icon: Sparkles, 
      show: shouldShow(property.CondoAmenities) 
    },
    { 
      label: 'Pets', 
      value: formatTitleCase(property.Pets || ''), 
      icon: PawPrint, 
      show: shouldShow(property.Pets) 
    },
    { 
      label: 'Locker', 
      value: formatTitleCase(property.Locker || ''), 
      icon: Package, 
      show: shouldShow(property.Locker) 
    },
    { 
      label: 'Balcony', 
      value: formatTitleCase(property.Balcony || ''), 
      icon: Home, 
      show: shouldShow(property.Balcony) 
    }
  ];

  const visibleFields = condoInfo.filter(f => f.show);

  if (visibleFields.length === 0) return null;

  return (
    <CollapsibleSection
      title="Condo Information"
      icon={Building}
      colorScheme="indigo"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleFields.map((field, index) => {
          const IconComponent = field.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                field.highlight ? 'text-indigo-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {field.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  field.highlight ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  {field.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}