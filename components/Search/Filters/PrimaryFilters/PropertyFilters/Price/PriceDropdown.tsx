"use client";

import { useState, useEffect, useRef } from 'react';
import { DollarSign, X } from 'lucide-react';
import { useFilters } from '@/components/Search';
import { RangeSliderWithInputs } from '@/components/ui';

interface PriceDropdownProps {
  onClose: () => void;
}

// Constants moved outside component for performance
const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 5000000;

// Quick select price ranges
const QUICK_PRICE_RANGES = [
  { label: 'Under $500K', min: 0, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: '$1M - $1.5M', min: 1000000, max: 1500000 },
  { label: '$1.5M - $2M', min: 1500000, max: 2000000 },
  { label: '$2M - $3M', min: 2000000, max: 3000000 },
  { label: 'Over $3M', min: 3000000, max: 5000000 }
];

export default function PriceDropdown({ onClose }: PriceDropdownProps) {
  const { filters, updateFilter } = useFilters();
  const [minPrice, setMinPrice] = useState(filters.priceRange?.min ?? MIN_PRICE_LIMIT);
  const [maxPrice, setMaxPrice] = useState(filters.priceRange?.max ?? MAX_PRICE_LIMIT);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatInputPrice = (value: number) => {
    return value.toLocaleString();
  };

  const parseInputPrice = (value: string) => {
    return parseInt(value.replace(/[,$]/g, '')) || 0;
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMinInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue <= maxPrice) {
      setMinPrice(Math.max(MIN_PRICE_LIMIT, numValue));
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMaxInput(value);
    const numValue = parseInt(value) || MAX_PRICE_LIMIT;
    if (numValue >= minPrice) {
      setMaxPrice(Math.min(MAX_PRICE_LIMIT, numValue));
    }
  };

  const handleMinInputBlur = () => {
    setMinInput(formatInputPrice(minPrice));
  };

  const handleMaxInputBlur = () => {
    setMaxInput(formatInputPrice(maxPrice));
  };

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxPrice) {
      setMinPrice(value);
      setMinInput(formatInputPrice(value));
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minPrice) {
      setMaxPrice(value);
      setMaxInput(formatInputPrice(value));
    }
  };

  const handleQuickSelect = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setMinInput(formatInputPrice(min));
    setMaxInput(formatInputPrice(max));
  };

  const handleApply = () => {
    updateFilter('priceRange', { min: minPrice, max: maxPrice });
    onClose();
  };

  const handleReset = () => {
    setMinPrice(MIN_PRICE_LIMIT);
    setMaxPrice(MAX_PRICE_LIMIT);
    setMinInput('');
    setMaxInput('');
    updateFilter('priceRange', { min: MIN_PRICE_LIMIT, max: MAX_PRICE_LIMIT });
  };

  // Initialize input values
  useEffect(() => {
    setMinInput(minPrice.toString());
    setMaxInput(maxPrice.toString());
  }, [minPrice, maxPrice]);

  return (
    <div 
      ref={dropdownRef} 
      className="absolute top-full left-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto"
      role="dialog"
      aria-label="Price range selector"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">Price Range</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">Set your budget preferences</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 p-1 hover:bg-white/60 rounded-full transition-colors duration-200"
            aria-label="Close price selector"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        </div>
      </div>
      {/* Content Area */}
      <div className="px-3 py-2.5 bg-gray-50/50">
         <RangeSliderWithInputs
           min={MIN_PRICE_LIMIT}
           max={MAX_PRICE_LIMIT}
           step={25000}
           value={[minPrice, maxPrice]}
           onChange={([min, max]) => { setMinPrice(min); setMaxPrice(max); setMinInput(formatInputPrice(min)); setMaxInput(formatInputPrice(max)); }}
           formatValue={formatPrice}
           formatInput={formatInputPrice}
           parseInput={parseInputPrice}
         />
        {/* Quick Select */}
        <div className="mt-6">
          <div className="mb-3 relative">
            <div className="flex items-center">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider px-3 bg-gray-50/50 rounded-full border border-gray-200 shadow-sm">
                Quick Select
              </h4>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            </div>
          </div>
          <div className="space-y-1.5">
            {QUICK_PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                type="button"
                onClick={() => { setMinPrice(range.min); setMaxPrice(range.max); setMinInput(formatInputPrice(range.min)); setMaxInput(formatInputPrice(range.max)); }}
                className="w-full pl-4 pr-2.5 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-between group text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 border border-transparent hover:border-blue-200"
              >
                <span className="truncate flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full mr-3 bg-gray-400 group-hover:bg-blue-400 transition-colors duration-200"></div>
                  {range.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}