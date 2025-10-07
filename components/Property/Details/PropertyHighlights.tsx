"use client";

import { 
  Home, 
  Building2, 
  Bed, 
  Bath, 
  Square, 
  SquareStack, 
  Car, 
  Calendar, 
  Clock, 
  MapPin 
} from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyHighlightsProps {
  property: Property;
}

const formatTitleCase = (value: string): string => {
  return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export default function PropertyHighlights({ property }: PropertyHighlightsProps) {

  const allSpecs = [
    {
      icon: Bed,
      label: 'Beds',
      value: property.Bedrooms?.toString() || 'N/A',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      primary: true
    },
    {
      icon: Bath,
      label: 'Baths',
      value: property.Bathrooms?.toString() || 'N/A',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      primary: true
    },
    {
      icon: Square,
      label: 'Sq Ft',
      value: property.SquareFootage ? property.SquareFootage.toString() : 'N/A',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      primary: true
    },
    {
      icon: Home,
      label: 'Type',
      value: property.PropertyType ? formatTitleCase(property.PropertyType) : 'N/A',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      primary: false
    },
    {
      icon: Building2,
      label: 'Sub Type',
      value: property.SubType ? formatTitleCase(property.SubType) : 'N/A',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      primary: false
    },
    {
      icon: SquareStack,
      label: 'Basement',
      value: property.Basement ? formatTitleCase(property.Basement) : 'None',
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      primary: false
    },
    {
      icon: Car,
      label: 'Parking',
      value: property.GarageSpaces ? `${property.GarageSpaces} Space` : 'None',
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      primary: false
    },
    {
      icon: MapPin,
      label: 'Lot Size',
      value: property.LotSize || 'N/A',
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      primary: false
    },
    {
      icon: Calendar,
      label: 'Age',
      value: property.PropertyAge || 'N/A',
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      primary: false
    },
    {
      icon: Clock,
      label: 'Days on Market',
      value: property.DaysOnMarket?.toString() || 'N/A',
      iconColor: 'text-slate-600',
      bgColor: 'bg-slate-50',
      primary: false
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-xl shadow-md border border-gray-200/60 overflow-hidden">
      {/* Compact Header */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 border-b border-gray-200/50">
        <h3 className="text-sm font-bold text-gray-900">Quick Overview</h3>
      </div>

      {/* Horizontal Grid - All in Two Rows */}
      <div className="p-4">
        <div className="grid grid-cols-5 gap-3">
          {allSpecs.map((spec, index) => {
            const IconComponent = spec.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-gray-200/60 hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg ${spec.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                  <IconComponent className={`w-4.5 h-4.5 ${spec.iconColor}`} />
                </div>
                
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 font-medium leading-tight">
                    {spec.label}
                  </div>
                  <div className={`${spec.primary ? 'text-base' : 'text-sm'} font-bold text-gray-900 leading-tight truncate`}>
                    {spec.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}