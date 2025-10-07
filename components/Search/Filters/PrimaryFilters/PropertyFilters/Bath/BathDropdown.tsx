"use client";

import { useState, useEffect, useRef } from 'react';
import { Bath, X } from 'lucide-react';
import { useFilters } from '@/components/Search';
import { RangeSliderWithInputs } from '@/components/ui';

interface BathDropdownProps {
  onBathSelect: (range: { min: number; max: number } | null) => void;
  onClose: () => void;
}

export default function BathDropdown({ onBathSelect, onClose }: BathDropdownProps) {
  const { filters } = useFilters();
  const [minBaths, setMinBaths] = useState(filters.bathrooms?.min || 0);
  const [maxBaths, setMaxBaths] = useState(filters.bathrooms?.max || 10);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync local state with filter state
  useEffect(() => {
    if (filters.bathrooms) {
      setMinBaths(filters.bathrooms.min);
      setMaxBaths(filters.bathrooms.max);
    } else {
      setMinBaths(0);
      setMaxBaths(10);
    }
  }, [filters.bathrooms]);

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

  const MIN_LIMIT = 0;
  const MAX_LIMIT = 10;

  // Quick select options
  const quickOptions = [
    { label: 'Any', min: 0, max: 10 },
    { label: '1+ Bath', min: 1, max: 10 },
    { label: '2+ Baths', min: 2, max: 10 },
    { label: '3+ Baths', min: 3, max: 10 },
    { label: '4+ Baths', min: 4, max: 10 },
    { label: 'Exactly 1', min: 1, max: 1 },
    { label: 'Exactly 2', min: 2, max: 2 },
    { label: 'Exactly 3', min: 3, max: 3 }
  ];

  const formatBathText = (min: number, max: number) => {
    if (min === 0 && max === 10) return 'Any';
    if (min === max) return `${min} bath${min !== 1 ? 's' : ''}`;
    if (max === 10) return `${min}+ bath${min !== 1 ? 's' : ''}`;
    return `${min}-${max} baths`;
  };

  const handleApply = () => {
    onBathSelect({ min: minBaths, max: maxBaths });
    onClose();
  };

  const handleReset = () => {
    setMinBaths(0);
    setMaxBaths(10);
    onBathSelect(null);
  };

  return (
    <div 
      ref={dropdownRef} 
      className="absolute top-full left-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto"
      role="dialog"
      aria-label="Bathroom range selector"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">Bathrooms</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">Select bathroom count</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 p-1 hover:bg-white/60 rounded-full transition-colors duration-200"
            aria-label="Close bathroom selector"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-3 py-2.5 bg-gray-50/50">
        <RangeSliderWithInputs
          min={MIN_LIMIT}
          max={MAX_LIMIT}
          step={1}
          value={[minBaths, maxBaths]}
          onChange={([min, max]) => { setMinBaths(min); setMaxBaths(max); }}
          formatValue={n => `${n} bath${n !== 1 ? 's' : ''}`}
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
            {quickOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => { setMinBaths(option.min); setMaxBaths(option.max); }}
                className="w-full pl-4 pr-2.5 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-between group text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 border border-transparent hover:border-blue-200"
              >
                <span className="truncate flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full mr-3 bg-gray-400 group-hover:bg-blue-400 transition-colors duration-200"></div>
                  {option.label}
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