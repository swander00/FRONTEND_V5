'use client';

import { Car, Home } from 'lucide-react';
import { Property } from '@/types';
import { CollapsibleSection } from '../ui';

interface ParkingSectionProps {
  property: Property;
}

function formatParkingValue(value: string | number | undefined): string {
  if (!value) return 'N/A';
  const match = value.toString().match(/^(\d+)/);
  if (match) return match[1];
  const num = parseInt(value.toString());
  return !isNaN(num) ? num.toString() : value.toString();
}

export default function ParkingSection({ property }: ParkingSectionProps) {
  const parkingInfo = [
    {
      icon: Home,
      label: 'Garage Spaces',
      value: formatParkingValue(property.GarageParking),
      highlight: true
    },
    {
      icon: Car,
      label: 'Driveway Spaces',
      value: formatParkingValue(property.DriveParking)
    },
    {
      icon: Car,
      label: 'Total Parking',
      value: formatParkingValue(property.TotalParking),
      highlight: true
    }
  ];

  return (
    <CollapsibleSection
      title="Parking & Garage"
      icon={Car}
      colorScheme="orange"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {parkingInfo.map((parking, index) => {
          const IconComponent = parking.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                parking.highlight ? 'text-orange-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {parking.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  parking.highlight ? 'text-orange-900' : 'text-gray-900'
                }`}>
                  {parking.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}