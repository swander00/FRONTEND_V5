"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BathDropdown from './BathDropdown';
import { useFilters } from '../../../FilterContext/FilterContext';

interface BathButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function BathButton({ isOpen, onToggle, onClose }: BathButtonProps) {
  const { filters, updateFilter } = useFilters();
  const bathrooms = filters.bathrooms;
  
  const getDisplayText = () => {
    if (!bathrooms) return 'Baths';
    
    const { min, max } = bathrooms;
    if (min === 0 && max === 10) return 'Baths';
    if (min === max) return `${min} bath${min !== 1 ? 's' : ''}`;
    if (max === 10) return `${min}+ bath${min !== 1 ? 's' : ''}`;
    return `${min}-${max} baths`;
  };
  
  const isActive = bathrooms !== null;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 border rounded-r-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md min-w-[120px] h-[48px] ${
          isActive
            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        }`}
      >
        <span className="flex-1 text-center">{getDisplayText()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <BathDropdown
          onBathSelect={(range) => updateFilter('bathrooms', range)}
          onClose={onClose}
        />
      )}
    </div>
  );
}