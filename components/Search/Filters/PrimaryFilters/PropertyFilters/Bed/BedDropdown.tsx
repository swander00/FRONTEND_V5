"use client";

import { useState, useEffect, useRef } from 'react';
import { Bed, X } from 'lucide-react';
import { useFilters } from '@/components/Search';
import { RangeSliderWithInputs } from '@/components/ui';

interface BedDropdownProps {
  onBedSelect: (range: { min: number; max: number } | null) => void;
  onClose: () => void;
}

export default function BedDropdown({ onBedSelect, onClose }: BedDropdownProps) {
  const { filters } = useFilters();
  const [minBeds, setMinBeds] = useState(filters.bedrooms?.min || 0);
  const [maxBeds, setMaxBeds] = useState(filters.bedrooms?.max || 10);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync local state with filter state
  useEffect(() => {
    if (filters.bedrooms) {
      setMinBeds(filters.bedrooms.min);
      setMaxBeds(filters.bedrooms.max);
    } else {
      setMinBeds(0);
      setMaxBeds(10);
    }
  }, [filters.bedrooms]);

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
    { label: '1+ Bed', min: 1, max: 10 },
    { label: '2+ Beds', min: 2, max: 10 },
    { label: '3+ Beds', min: 3, max: 10 },
    { label: '4+ Beds', min: 4, max: 10 },
    { label: 'Exactly 1', min: 1, max: 1 },
    { label: 'Exactly 2', min: 2, max: 2 },
    { label: 'Exactly 3', min: 3, max: 3 }
  ];

  const formatBedText = (min: number, max: number) => {
    if (min === 0 && max === 10) return 'Any';
    if (min === max) return `${min} bed${min !== 1 ? 's' : ''}`;
    if (max === 10) return `${min}+ bed${min !== 1 ? 's' : ''}`;
    return `${min}-${max} beds`;
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value <= maxBeds && value >= MIN_LIMIT && value <= MAX_LIMIT) {
      setMinBeds(value);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || MAX_LIMIT;
    if (value >= minBeds && value >= MIN_LIMIT && value <= MAX_LIMIT) {
      setMaxBeds(value);
    }
  };

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxBeds) {
      setMinBeds(value);
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minBeds) {
      setMaxBeds(value);
    }
  };

  const handleQuickSelect = (min: number, max: number) => {
    setMinBeds(min);
    setMaxBeds(max);
  };

  const handleApply = () => {
    onBedSelect({ min: minBeds, max: maxBeds });
    onClose();
  };

  const handleReset = () => {
    setMinBeds(0);
    setMaxBeds(10);
    onBedSelect(null);
  };

  return (
    <div 
      ref={dropdownRef} 
      className="absolute top-full left-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto"
      role="dialog"
      aria-label="Bedroom range selector"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">Bedrooms</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">Select bedroom count</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 p-1 hover:bg-white/60 rounded-full transition-colors duration-200"
            aria-label="Close bedroom selector"
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
          value={[minBeds, maxBeds]}
          onChange={([min, max]) => { setMinBeds(min); setMaxBeds(max); }}
          formatValue={n => `${n} bed${n !== 1 ? 's' : ''}`}
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
                onClick={() => { setMinBeds(option.min); setMaxBeds(option.max); }}
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