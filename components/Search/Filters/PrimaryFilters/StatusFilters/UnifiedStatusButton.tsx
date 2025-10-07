"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface StatusOption {
  value: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
  hoverBorder: string;
}

interface UnifiedStatusButtonProps {
  selectedStatus: string | null;
  onStatusSelect: (status: string) => void;
  hasAllTime?: boolean;
}

const statusOptions: StatusOption[] = [
  {
    value: 'buy',
    label: 'For Sale',
    color: 'text-white',
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-600',
    hoverBg: 'hover:bg-blue-700',
    hoverBorder: 'hover:border-blue-600'
  },
  {
    value: 'lease',
    label: 'For Lease',
    color: 'text-white',
    bgColor: 'bg-purple-600',
    borderColor: 'border-purple-600',
    hoverBg: 'hover:bg-purple-700',
    hoverBorder: 'hover:border-purple-600'
  },
  {
    value: 'sold',
    label: 'Sold',
    color: 'text-white',
    bgColor: 'bg-green-600',
    borderColor: 'border-green-600',
    hoverBg: 'hover:bg-green-700',
    hoverBorder: 'hover:border-green-600'
  },
  {
    value: 'leased',
    label: 'Leased',
    color: 'text-white',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-600',
    hoverBg: 'hover:bg-orange-700',
    hoverBorder: 'hover:border-orange-600'
  },
  {
    value: 'removed',
    label: 'Removed',
    color: 'text-white',
    bgColor: 'bg-gray-600',
    borderColor: 'border-gray-600',
    hoverBg: 'hover:bg-gray-700',
    hoverBorder: 'hover:border-gray-600'
  }
];

export default function UnifiedStatusButton({ selectedStatus, onStatusSelect, hasAllTime = false }: UnifiedStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentOption = statusOptions.find(option => option.value === selectedStatus) || statusOptions[0];

  const handleStatusSelect = (status: string) => {
    onStatusSelect(status);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Status Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-5 py-2.5 text-sm font-semibold transition-all duration-300 min-w-[120px] h-[48px] flex items-center justify-center gap-2 ${
          hasAllTime 
            ? 'rounded-l-xl border-r-0' 
            : 'rounded-xl'
        } ${
          currentOption.bgColor + ' ' + currentOption.color + ' ' + currentOption.borderColor + ' shadow-lg border hover:shadow-xl transform hover:scale-[1.02] ' + currentOption.hoverBg
        }`}
      >
        <span className="flex-1 text-center">{currentOption.label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Select Status</h3>
            <p className="text-xs text-gray-600 mt-0.5">Choose property status to filter</p>
          </div>

          {/* Status Options */}
          <div className="py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusSelect(option.value)}
                className={`w-full px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                  selectedStatus === option.value
                    ? `${option.bgColor} ${option.color} shadow-lg transform scale-[1.02]`
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${option.bgColor}`}></div>
                  {option.label}
                </span>
                {selectedStatus === option.value && (
                  <Check className="h-4 w-4 ml-1 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
