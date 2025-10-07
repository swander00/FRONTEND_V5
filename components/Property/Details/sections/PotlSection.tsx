'use client';

import { Receipt, DollarSign, Calendar, FileText } from 'lucide-react';
import { Property } from '@/types';
import CollapsibleSection from '../ui/CollapsibleSection';

interface PotlSectionProps {
  property: Property;
}

function formatPotlFee(fee: string | number | undefined): string {
  if (!fee) return 'N/A';
  const feeStr = fee.toString();
  if (feeStr.includes('$')) return feeStr;
  return `$${feeStr}`;
}

export default function PotlSection({ property }: PotlSectionProps) {
  const potlInfo = [
    {
      icon: DollarSign,
      label: 'POTL Fee',
      value: formatPotlFee(property.POTLFee),
      highlight: true
    },
    {
      icon: Calendar,
      label: 'Fee Schedule',
      value: (property as any).POTLSchedule || 'Monthly'
    },
    {
      icon: FileText,
      label: 'Fee Includes',
      value: (property as any).POTLIncludes || 'Standard Services'
    }
  ];

  return (
    <CollapsibleSection
      title="POTL Information"
      icon={Receipt}
      colorScheme="teal"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {potlInfo.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                item.highlight ? 'text-teal-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  item.highlight ? 'text-teal-900' : 'text-gray-900'
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