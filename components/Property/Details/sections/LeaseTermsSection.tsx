'use client';

import { FileText, CheckSquare, Home, Calendar, DollarSign } from 'lucide-react';
import { Property } from '@/types';
import CollapsibleSection from '../ui/CollapsibleSection';

interface LeaseTermsSectionProps {
  property: Property;
}

function formatValue(value: string | undefined | null): string {
  if (!value || typeof value !== 'string' || value.trim() === '') return 'N/A';
  const cleaned = value.trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function LeaseTermsSection({ property }: LeaseTermsSectionProps) {
  const leaseTerms = [
    {
      icon: CheckSquare,
      label: 'Rent Includes',
      value: formatValue(property.RentIncludes),
      highlight: property.RentIncludes && property.RentIncludes.trim() !== ''
    },
    {
      icon: Home,
      label: 'Furnished',
      value: formatValue(property.Furnished),
      highlight: property.Furnished && property.Furnished.toLowerCase() === 'yes'
    },
    {
      icon: Calendar,
      label: 'Lease Term',
      value: (property as any).LeaseTerm || 'N/A'
    },
  ];

  return (
    <CollapsibleSection
      title="Lease Terms"
      icon={FileText}
      colorScheme="purple"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaseTerms.map((term, index) => {
          const IconComponent = term.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                term.highlight ? 'text-purple-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {term.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  term.highlight ? 'text-purple-900' : 'text-gray-900'
                }`}>
                  {term.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}