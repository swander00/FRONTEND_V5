"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PriceDropdown from './PriceDropdown';
import { useFilters } from '../../../FilterContext/FilterContext';

interface PriceButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function PriceButton({ isOpen, onToggle, onClose }: PriceButtonProps) {
  const { filters } = useFilters();
  const priceRange = filters.priceRange;
  
  const getDisplayText = () => {
    if (!priceRange || (priceRange.min === 0 && priceRange.max === 5000000)) return 'Price';
    
    const formatPrice = (price: number) => {
      if (price >= 1000000) {
        return `$${(price / 1000000).toFixed(1)}M`;
      } else if (price >= 1000) {
        return `$${(price / 1000).toFixed(0)}K`;
      }
      return `$${price.toLocaleString()}`;
    };
    
    return `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`;
  };
  
  const isActive = priceRange !== null && (priceRange.min !== 0 || priceRange.max !== 5000000);

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
        <PriceDropdown onClose={onClose} />
      )}
    </div>
  );
}