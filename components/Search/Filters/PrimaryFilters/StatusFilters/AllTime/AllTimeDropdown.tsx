"use client";

import { useState, useEffect, useRef } from 'react';
import { Calendar, Check, X } from 'lucide-react';

interface AllTimeDropdownProps {
  onPeriodSelect: (period: string) => void;
  onClose: () => void;
  selectedPeriod: string;
  selectedStatus: string;
}

export default function AllTimeDropdown({ onPeriodSelect, onClose, selectedPeriod, selectedStatus }: AllTimeDropdownProps) {
  const [customDate, setCustomDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const quickSelectPeriods = [
    { value: 'All Time', label: 'All Time' },
    { value: 'Today', label: 'Today' },
    { value: 'Last 7 Days', label: 'Last 7 Days' },
    { value: 'Last 14 Days', label: 'Last 14 Days' },
    { value: 'Last 30 Days', label: 'Last 30 Days' },
    { value: 'Last 90 Days', label: 'Last 90 Days' }
  ];

  // Dynamic header text based on selected status
  const getHeaderText = () => {
    switch (selectedStatus) {
      case 'buy':
        return {
          title: 'Filter by Date Listed',
          subtitle: 'Show for sale listings from a specific time period'
        };
      case 'lease':
        return {
          title: 'Filter by Date Listed',
          subtitle: 'Show for lease listings from a specific time period'
        };
      case 'sold':
        return {
          title: 'Filter by Date Sold',
          subtitle: 'Show sold listings from a specific time period'
        };
      case 'leased':
        return {
          title: 'Filter by Date Leased',
          subtitle: 'Show leased listings from a specific time period'
        };
      case 'removed':
        return {
          title: 'Filter by Date Removed',
          subtitle: 'Show removed listings from a specific time period'
        };
      default:
        return {
          title: 'Filter by Date Listed',
          subtitle: 'Show listings from a specific time period'
        };
    }
  };

  const headerText = getHeaderText();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setCustomDate(selectedDate);
    
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      onPeriodSelect(`Since ${formattedDate}`);
    }
  };

  const handleDatePickerToggle = () => {
    setShowDatePicker(!showDatePicker);
  };

  const clearCustomDate = () => {
    setCustomDate('');
    setShowDatePicker(false);
  };

  return (
    <div 
      ref={modalRef}
      className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">{headerText.title}</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{headerText.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-white/60 rounded-full transition-colors duration-200"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Quick Select Section */}
      <div className="px-3 py-2.5">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">QUICK SELECT</div>
        <div className="space-y-1">
          {quickSelectPeriods.map((period) => (
            <button
              key={period.value}
              onClick={() => onPeriodSelect(period.value)}
              className={`w-full px-2.5 py-2 text-left text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-between group ${
                selectedPeriod === period.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
              }`}
            >
              <span className="truncate">{period.label}</span>
              {selectedPeriod === period.value && (
                <Check className="h-3 w-3 ml-1 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Section */}
      <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">CUSTOM DATE</div>
        <div className="mb-2">
          <label className="text-xs font-medium text-gray-700">Show listings since:</label>
        </div>
        <div className="relative">
          <input
            type="date"
            value={customDate}
            onChange={handleDateChange}
            className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors duration-200 cursor-pointer"
            placeholder="Select date..."
          />
          {customDate && (
            <button
              onClick={clearCustomDate}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>
        {customDate && (
          <div className="mt-2 text-xs text-green-600 font-medium">
            ✓ Custom date selected
          </div>
        )}
      </div>
    </div>
  );
}