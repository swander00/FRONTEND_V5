"use client";

import { useState, useCallback, useId } from 'react';
import { Calendar } from 'lucide-react';
import FilterChip from '../../core/FilterChip';

export type OpenHouseOption = 'all' | 'today' | 'tomorrow' | 'next-weekend';

interface OpenHouseChoice {
  id: OpenHouseOption;
  label: string;
  description: string;
}

const openHouseOptions: OpenHouseChoice[] = [
  { id: 'all', label: 'All Open Houses', description: 'Show all properties with open houses' },
  { id: 'today', label: 'Today', description: 'Open houses happening today' },
  { id: 'tomorrow', label: 'Tomorrow', description: 'Open houses happening tomorrow' },
  { id: 'next-weekend', label: 'Next Weekend', description: 'Open houses this upcoming weekend' }
];

export default function OpenHouseFilter() {
  const [selectedOption, setSelectedOption] = useState<OpenHouseOption | null>(null);
  const headingId = useId();
  const regionId = useId();

  const handleOptionSelect = useCallback((optionId: OpenHouseOption) => {
    const wasSelected = selectedOption === optionId;
    setSelectedOption(prev => prev === optionId ? null : optionId);
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = wasSelected 
      ? `${openHouseOptions.find(opt => opt.id === optionId)?.label} deselected` 
      : `${openHouseOptions.find(opt => opt.id === optionId)?.label} selected`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, [selectedOption]);

  const clearSelection = useCallback(() => {
    if (selectedOption) {
      setSelectedOption(null);
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = 'Open house filter cleared';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  }, [selectedOption]);

  return (
    <section 
      className="space-y-4" 
      aria-labelledby={headingId}
      role="group"
      id={regionId}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg" aria-hidden="true">
          <Calendar className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 id={headingId} className="text-base font-semibold text-gray-800">Open House</h3>
          <p className="text-sm text-gray-500">Filter by open house schedule</p>
        </div>
      </div>

      {/* Open House Option Chips */}
      <div className="space-y-4">
        <div 
          className="flex flex-wrap gap-3" 
          role="group" 
          aria-label="Open house time options"
        >
          {openHouseOptions.map((option) => (
            <FilterChip
              key={option.id}
              label={option.label}
              description={option.description}
              isActive={selectedOption === option.id}
              onClick={() => handleOptionSelect(option.id)}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 pt-2" role="group" aria-label="Filter actions">
          <button
            type="button"
            onClick={clearSelection}
            disabled={!selectedOption}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed min-h-[32px] touch-manipulation"
            aria-label="Clear open house filter selection"
          >
            Clear Selection
          </button>
          <div className="w-px h-3 bg-gray-300" aria-hidden="true"></div>
          <span className="text-xs text-gray-500" role="status" aria-live="polite">
            {selectedOption ? `Selected: ${openHouseOptions.find(opt => opt.id === selectedOption)?.label}` : 'None selected'}
          </span>
        </div>
      </div>
    </section>
  );
}