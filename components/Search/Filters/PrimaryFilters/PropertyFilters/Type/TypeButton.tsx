"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TypeDropdown from './TypeDropdown';
import { useFilters } from '../../../FilterContext/FilterContext';

interface TypeButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function TypeButton({ isOpen, onToggle, onClose }: TypeButtonProps) {
  const { filters } = useFilters();
  const selectedTypes = filters.propertyType;
  
  const getDisplayText = () => {
    if (selectedTypes.length === 0) return 'Type';
    if (selectedTypes.length === 1) return selectedTypes[0];
    return `${selectedTypes.length} types`;
  };
  
  const isActive = selectedTypes.length > 0;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 border rounded-none text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md border-r-0 min-w-[120px] h-[48px] ${
          isActive
            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Property type filter: ${getDisplayText()}`}
      >
        <span className="flex-1 text-center">{getDisplayText()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <TypeDropdown
          onClose={onClose}
        />
      )}
    </div>
  );
}