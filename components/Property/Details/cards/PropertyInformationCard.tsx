// components/Property/Details/cards/PropertyInformationCard.tsx
'use client';

import { Building2 } from 'lucide-react';
import { Property } from '@/types';
import ListingInformationSection from '../sections/ListingInformationSection';
import PropertyDetailsSection from '../sections/PropertyDetailsSection';
import BasementSection from '../sections/BasementSection';
import ParkingSection from '../sections/ParkingSection';
import UtilitiesSection from '../sections/UtilitiesSection';
import LeaseTermsSection from '../sections/LeaseTermsSection';
import CondoInfoSection from '../sections/CondoInfoSection';
import PotlSection from '../sections/PotlSection';
import PoolWaterfrontSection from '../sections/PoolWaterfrontSection';
import FeaturesSection from '../sections/FeaturesSection';

interface PropertyInformationCardProps {
  property: Property;
}

export default function PropertyInformationCard({ property }: PropertyInformationCardProps) {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Property Information
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Detailed property specifications
            </p>
          </div>
        </div>
        <div className="w-20 h-px bg-gradient-to-r from-blue-400 to-indigo-500" />
      </div>

      {/* All Sections Container */}
      <div className="px-6 pb-6 space-y-3">
        <ListingInformationSection property={property} />
        <PropertyDetailsSection property={property} />
        <BasementSection property={property} />
        <ParkingSection property={property} />
        <UtilitiesSection property={property} />
        <LeaseTermsSection property={property} />
        <CondoInfoSection property={property} />
        <PotlSection property={property} />
        <PoolWaterfrontSection property={property} />
        <FeaturesSection property={property} />
      </div>
    </div>
  );
}