"use client";

import { useState } from 'react';
import { SquareStack } from 'lucide-react';
import FilterChip from '../../core/FilterChip';

export type BasementFeature = 
  | 'apartment'
  | 'finished'
  | 'partly-finished'
  | 'crawl-space'
  | 'none'
  | 'walk-in'
  | 'separate-entrance'
  | 'walk-out'
  | 'walk-up'
  | 'unfinished'
  | 'other';

interface BasementFeatureOption {
  id: BasementFeature;
  label: string;
  description: string;
}

const basementFeatureOptions: BasementFeatureOption[] = [
  { id: 'apartment', label: 'Apartment', description: 'Separate living unit' },
  { id: 'finished', label: 'Finished', description: 'Fully completed basement' },
  { id: 'partly-finished', label: 'Partly Finished', description: 'Partially completed' },
  { id: 'crawl-space', label: 'Crawl Space', description: 'Low-height access area' },
  { id: 'none', label: 'None', description: 'No basement' },
  { id: 'walk-in', label: 'Walk-In', description: 'Ground-level entrance' },
  { id: 'separate-entrance', label: 'Separate Entrance', description: 'Independent access' },
  { id: 'walk-out', label: 'Walk-Out', description: 'Direct outdoor access' },
  { id: 'walk-up', label: 'Walk-Up', description: 'Elevated entrance' },
  { id: 'unfinished', label: 'Unfinished', description: 'Raw basement space' },
  { id: 'other', label: 'Other', description: 'Other basement type' }
];

export default function BasementFeaturesFilter() {
  const [selectedFeatures, setSelectedFeatures] = useState<BasementFeature[]>([]);

  const handleFeatureToggle = (featureId: BasementFeature) => {
    setSelectedFeatures(prev => {
      if (prev.includes(featureId)) {
        return prev.filter(id => id !== featureId);
      } else {
        return [...prev, featureId];
      }
    });
  };

  const selectAll = () => {
    setSelectedFeatures(basementFeatureOptions.map(option => option.id));
  };

  const clearAll = () => {
    setSelectedFeatures([]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-stone-500 to-slate-600 rounded-lg flex items-center justify-center shadow-lg">
          <SquareStack className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Basement Features</h3>
          <p className="text-sm text-gray-500">Select basement characteristics</p>
        </div>
      </div>

      {/* Feature Chips */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {basementFeatureOptions.map((option) => (
            <FilterChip
              key={option.id}
              label={option.label}
              description={option.description}
              isActive={selectedFeatures.includes(option.id)}
              onClick={() => handleFeatureToggle(option.id)}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={selectAll}
            className="text-xs font-medium text-stone-600 hover:text-stone-700 transition-colors duration-200"
          >
            Select All
          </button>
          <div className="w-px h-3 bg-gray-300"></div>
          <button
            onClick={clearAll}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Clear All
          </button>
          <div className="w-px h-3 bg-gray-300"></div>
          <span className="text-xs text-gray-500">
            {selectedFeatures.length} selected
          </span>
        </div>
      </div>
    </div>
  );
}