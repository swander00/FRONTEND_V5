"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Ruler, X } from 'lucide-react';
import FilterChip from '../../core/FilterChip';

export type LotFrontageRange = 
  | 'all'
  | '20-30'
  | '32-40'
  | '40-50'
  | '50-70'
  | '70-100'
  | '100-200'
  | '200-500'
  | '500-1000'
  | '1000+';

interface LotFrontageOption {
  id: LotFrontageRange;
  label: string;
  description: string;
}

const lotFrontageOptions: LotFrontageOption[] = [
  { id: 'all', label: 'All', description: 'Any frontage size' },
  { id: '20-30', label: '20–30 ft', description: 'Compact frontage' },
  { id: '32-40', label: '32–40 ft', description: 'Standard frontage' },
  { id: '40-50', label: '40–50 ft', description: 'Wide frontage' },
  { id: '50-70', label: '50–70 ft', description: 'Generous frontage' },
  { id: '70-100', label: '70–100 ft', description: 'Large frontage' },
  { id: '100-200', label: '100–200 ft', description: 'Very large frontage' },
  { id: '200-500', label: '200–500 ft', description: 'Estate frontage' },
  { id: '500-1000', label: '500–1000 ft', description: 'Premium frontage' },
  { id: '1000+', label: 'Over 1000 ft', description: 'Exceptional frontage' }
];

export default function LotFrontageFilter() {
  const [selectedRanges, setSelectedRanges] = useState<LotFrontageRange[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  const handleRangeToggle = (rangeId: LotFrontageRange) => {
    setSelectedRanges(prev => {
      if (rangeId === 'all') {
        // If "All" is selected, clear all other selections
        return prev.includes('all') ? [] : ['all'];
      } else {
        // Remove "All" if any specific range is selected
        const withoutAll = prev.filter(id => id !== 'all');
        if (withoutAll.includes(rangeId)) {
          return withoutAll.filter(id => id !== rangeId);
        } else {
          return [...withoutAll, rangeId];
        }
      }
    });
  };

  const selectAll = () => {
    setSelectedRanges(['all']);
  };

  const clearAll = () => {
    setSelectedRanges([]);
  };

  const getDisplayText = () => {
    if (selectedRanges.length === 0) return 'Any Frontage';
    if (selectedRanges.includes('all')) return 'All Frontages';
    if (selectedRanges.length === 1) {
      const option = lotFrontageOptions.find(opt => opt.id === selectedRanges[0]);
      return option?.label || 'Any Frontage';
    }
    return `${selectedRanges.length} ranges selected`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
          <Ruler className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Lot Frontage</h3>
          <p className="text-sm text-gray-500">Select frontage dimensions</p>
        </div>
      </div>

      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="text-sm font-medium text-gray-700">{getDisplayText()}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
          >
            {/* Header Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <span className="text-sm font-medium text-gray-700">Select Frontage Ranges</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAll}
                  className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors duration-200"
                >
                  Select All
                </button>
                <div className="w-px h-3 bg-gray-300"></div>
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Options List */}
            <div className="p-2">
              {lotFrontageOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleRangeToggle(option.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 group ${
                    selectedRanges.includes(option.id) ? 'bg-teal-50 border border-teal-200' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 30}ms`,
                    animation: 'fadeInUp 0.3s ease-out forwards'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedRanges.includes(option.id)
                        ? 'bg-teal-500 border-teal-500'
                        : 'border-gray-300 group-hover:border-teal-400'
                    }`}>
                      {selectedRanges.includes(option.id) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-medium transition-colors duration-200 ${
                        selectedRanges.includes(option.id) ? 'text-teal-700' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Items Display */}
      {selectedRanges.length > 0 && !selectedRanges.includes('all') && (
        <div className="flex flex-wrap gap-2">
          {selectedRanges.map((rangeId) => {
            const option = lotFrontageOptions.find(opt => opt.id === rangeId);
            return option ? (
              <FilterChip
                key={rangeId}
                label={option.label}
                isActive={true}
                onClick={() => handleRangeToggle(rangeId)}
                variant="compact"
              />
            ) : null;
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}