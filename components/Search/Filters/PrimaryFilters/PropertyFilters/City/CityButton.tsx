"use client";

import { ChevronDown } from 'lucide-react';
import CityDropdown from './CityDropdown';
import { useFilters } from '../../../FilterContext/FilterContext';

interface CityButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function CityButton({ isOpen, onToggle, onClose }: CityButtonProps) {
  const { filters } = useFilters();
  const selectedCities = filters.city;
  
  const getDisplayText = () => {
    if (selectedCities.length === 0) return 'City';
    if (selectedCities.length === 1) return selectedCities[0];
    return `${selectedCities.length} cities`;
  };
  
  const isActive = selectedCities.length > 0;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 border rounded-l-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md border-r-0 min-w-[120px] h-[48px] ${
          isActive
            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`City filter: ${getDisplayText()}`}
      >
        <span className="flex-1 text-center">{getDisplayText()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <CityDropdown onClose={onClose} />
      )}
    </div>
  );
}