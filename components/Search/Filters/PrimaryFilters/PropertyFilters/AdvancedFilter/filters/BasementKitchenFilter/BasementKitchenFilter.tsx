"use client";

import { useState } from 'react';
import { ChefHat } from 'lucide-react';
import FilterChip from '../../core/FilterChip';

export type BasementKitchenOption = 'yes' | 'no';

interface BasementKitchenChoice {
  id: BasementKitchenOption;
  label: string;
  description: string;
}

const basementKitchenOptions: BasementKitchenChoice[] = [
  { id: 'yes', label: 'Yes', description: 'Has basement kitchen' },
  { id: 'no', label: 'No', description: 'No basement kitchen' }
];

export default function BasementKitchenFilter() {
  const [selectedOption, setSelectedOption] = useState<BasementKitchenOption | null>(null);

  const handleOptionSelect = (optionId: BasementKitchenOption) => {
    // Single-select: toggle off if already selected, otherwise select new option
    setSelectedOption(prev => prev === optionId ? null : optionId);
  };

  const clearSelection = () => {
    setSelectedOption(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
          <ChefHat className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Basement Kitchen</h3>
          <p className="text-sm text-gray-500">Does the basement have a kitchen?</p>
        </div>
      </div>

      {/* Kitchen Option Chips */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {basementKitchenOptions.map((option) => (
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
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={clearSelection}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Clear Selection
          </button>
          <div className="w-px h-3 bg-gray-300"></div>
          <span className="text-xs text-gray-500">
            {selectedOption ? `Selected: ${basementKitchenOptions.find(opt => opt.id === selectedOption)?.label}` : 'None selected'}
          </span>
        </div>
      </div>
    </div>
  );
}