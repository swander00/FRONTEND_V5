"use client";

import { useState, useEffect, useCallback, useId } from 'react';
import FilterChip from './FilterChip';

export type PropertyClass = 'residential-freehold' | 'residential-condo' | 'commercial';

interface PropertyClassOption {
  id: PropertyClass;
  label: string;
  description: string;
}

const propertyClassOptions: PropertyClassOption[] = [
  {
    id: 'residential-freehold',
    label: 'Residential Freehold',
    description: 'Houses, townhouses, and detached properties'
  },
  {
    id: 'residential-condo',
    label: 'Residential Condo',
    description: 'Condominiums and apartment-style units'
  },
  {
    id: 'commercial',
    label: 'Commercial',
    description: 'Office, retail, and business properties'
  }
];

export default function PropertyClassSelector() {
  const [selectedClasses, setSelectedClasses] = useState<PropertyClass[]>(['residential-freehold', 'residential-condo']);
  const headingId = useId();
  const regionId = useId();

  // Initialize with both residential types selected
  useEffect(() => {
    setSelectedClasses(['residential-freehold', 'residential-condo']);
  }, []);

  const handleClassToggle = useCallback((classId: PropertyClass) => {
    setSelectedClasses(prev => {
      let newSelection: PropertyClass[];
      
      if (classId === 'commercial') {
        // Commercial is exclusive - if selected, unselect all others
        if (prev.includes('commercial')) {
          // If commercial is already selected, unselect it and select both residential types
          newSelection = ['residential-freehold', 'residential-condo'];
        } else {
          // Select only commercial
          newSelection = ['commercial'];
        }
      } else {
        // Handle residential types
        if (prev.includes('commercial')) {
          // If commercial is selected, replace it with the clicked residential type
          newSelection = [classId];
        } else {
          // Normal toggle for residential types
          if (prev.includes(classId)) {
            const filtered = prev.filter(id => id !== classId);
            // Don't allow deselecting if it would leave nothing selected
            newSelection = filtered.length === 0 ? prev : filtered;
          } else {
            newSelection = [...prev, classId];
          }
        }
      }
      
      // Announce to screen readers
      const option = propertyClassOptions.find(opt => opt.id === classId);
      const isSelected = newSelection.includes(classId);
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `${option?.label} ${isSelected ? 'selected' : 'deselected'}`;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
      
      return newSelection;
    });
  }, []);

  const selectAll = useCallback(() => {
    // Select all means both residential types (commercial is exclusive)
    setSelectedClasses(['residential-freehold', 'residential-condo']);
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'All residential types selected';
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, []);

  const clearAll = useCallback(() => {
    // Reset to default: both residential types
    setSelectedClasses(['residential-freehold', 'residential-condo']);
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Property class filter reset to default';
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, []);

  return (
    <section 
      className="space-y-4" 
      aria-labelledby={headingId}
      role="group"
      id={regionId}
    >
      <h2 id={headingId} className="sr-only">Property Class</h2>
      
      {/* Property Class Chips */}
      <div 
        className="flex flex-wrap gap-3" 
        role="group" 
        aria-label="Property class options"
      >
        {propertyClassOptions.map((option) => (
          <FilterChip
            key={option.id}
            label={option.label}
            description={option.description}
            isActive={selectedClasses.includes(option.id)}
            onClick={() => handleClassToggle(option.id)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 pt-2" role="group" aria-label="Filter actions">
        <button
          type="button"
          onClick={selectAll}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 min-h-[32px] touch-manipulation"
          aria-label="Select all residential property types"
        >
          Select Residential
        </button>
        <div className="w-px h-3 bg-gray-300" aria-hidden="true"></div>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 min-h-[32px] touch-manipulation"
          aria-label="Reset property class filter to default"
        >
          Reset
        </button>
      </div>
    </section>
  );
}