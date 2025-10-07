'use client';

import { Info, Calendar, DollarSign, Hash, Clock, Key } from 'lucide-react';
import { Property } from '@/types';
import CollapsibleSection from '../ui/CollapsibleSection';

interface ListingInformationSectionProps {
  property: Property;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function ListingInformationSection({ property }: ListingInformationSectionProps) {
  const listingInfo = [
    {
      icon: Calendar,
      label: 'Date Listed',
      value: property.ListDate ? formatDate(property.ListDate) : 'N/A'
    },
    {
      icon: Info,
      label: 'Status',
      value: property.MlsStatus || 'Active',
      highlight: true
    },
    {
      icon: DollarSign,
      label: 'Original Price',
      value: formatPrice(property.OriginalPrice || property.ListPrice || 0),
      highlight: true
    },
    {
      icon: Hash,
      label: 'MLS Number',
      value: property.MLSNumber || 'N/A'
    },
    {
      icon: Clock,
      label: 'Days on Market',
      value: property.DaysOnMarket?.toString() || 'N/A',
      highlight: property.DaysOnMarket && property.DaysOnMarket > 30
    },
    {
      icon: Key,
      label: 'Possession',
      value: property.Possession || 'N/A'
    }
  ];

  return (
    <CollapsibleSection
      title="Listing Information"
      icon={Info}
      colorScheme="blue"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {listingInfo.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                item.highlight ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  item.highlight ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}