"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BedDropdown from './BedDropdown';
import { useFilters } from '../../../FilterContext/FilterContext';

interface BedButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function BedButton({ isOpen, onToggle, onClose }: BedButtonProps) {
  const { filters, updateFilter } = useFilters();
  const bedrooms = filters.bedrooms;
  
  const getDisplayText = () => {
    if (!bedrooms) return 'Beds';
    
    const { min, max } = bedrooms;
    if (min === 0 && max === 10) return 'Beds';
    if (min === max) return `${min} bed${min !== 1 ? 's' : ''}`;
    if (max === 10) return `${min}+ bed${min !== 1 ? 's' : ''}`;
    return `${min}-${max} beds`;
  };
  
  const isActive = bedrooms !== null;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 border rounded-none text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md border-r-0 min-w-[120px] h-[48px] ${
          isActive
            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        }`}
      >
        <span className="flex-1 text-center">{getDisplayText()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <BedDropdown
          onBedSelect={(range) => updateFilter('bedrooms', range)}
          onClose={onClose}
        />
      )}
    </div>
  );
}