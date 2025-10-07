"use client";

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { ChevronDown, Square, X } from 'lucide-react';
import FilterChip from '../../core/FilterChip';

export type SquareFootageRange = 
  | '<500'
  | '500-700'
  | '700-1000'
  | '1000-1500'
  | '1500-2000'
  | '2000-2500'
  | '2500-3000'
  | '3000-3500'
  | '3500-5000'
  | '5000+';

interface SquareFootageOption {
  id: SquareFootageRange;
  label: string;
  description: string;
}

const squareFootageOptions: SquareFootageOption[] = [
  { id: '<500', label: 'Under 500 sq ft', description: 'Compact living spaces' },
  { id: '500-700', label: '500 - 700 sq ft', description: 'Cozy apartments' },
  { id: '700-1000', label: '700 - 1,000 sq ft', description: 'Small homes' },
  { id: '1000-1500', label: '1,000 - 1,500 sq ft', description: 'Medium homes' },
  { id: '1500-2000', label: '1,500 - 2,000 sq ft', description: 'Large homes' },
  { id: '2000-2500', label: '2,000 - 2,500 sq ft', description: 'Spacious homes' },
  { id: '2500-3000', label: '2,500 - 3,000 sq ft', description: 'Very large homes' },
  { id: '3000-3500', label: '3,000 - 3,500 sq ft', description: 'Luxury homes' },
  { id: '3500-5000', label: '3,500 - 5,000 sq ft', description: 'Premium homes' },
  { id: '5000+', label: '5,000+ sq ft', description: 'Estate homes' }
];

export default function SquareFootageFilter() {
  const [selectedRanges, setSelectedRanges] = useState<SquareFootageRange[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const listboxId = useId();
  const regionId = useId();

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleRangeToggle = useCallback((rangeId: SquareFootageRange) => {
    setSelectedRanges(prev => {
      const isAdding = !prev.includes(rangeId);
      const newRanges = isAdding 
        ? [...prev, rangeId]
        : prev.filter(id => id !== rangeId);
      
      // Announce to screen readers
      const option = squareFootageOptions.find(opt => opt.id === rangeId);
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `${option?.label} ${isAdding ? 'selected' : 'deselected'}. ${newRanges.length} range${newRanges.length !== 1 ? 's' : ''} selected.`;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
      
      return newRanges;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedRanges(squareFootageOptions.map(option => option.id));
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'All square footage ranges selected';
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedRanges([]);
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'All square footage ranges cleared';
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, []);

  const getDisplayText = () => {
    if (selectedRanges.length === 0) return 'Any Size';
    if (selectedRanges.length === 1) {
      const option = squareFootageOptions.find(opt => opt.id === selectedRanges[0]);
      return option?.label || 'Any Size';
    }
    return `${selectedRanges.length} ranges selected`;
  };

  return (
    <section 
      className="space-y-4" 
      aria-labelledby={headingId}
      role="group"
      id={regionId}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg" aria-hidden="true">
          <Square className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 id={headingId} className="text-base font-semibold text-gray-800">Square Footage</h3>
          <p className="text-sm text-gray-500">Select property size ranges</p>
        </div>
      </div>

      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-label={`Square footage filter: ${getDisplayText()}`}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px] touch-manipulation"
        >
          <span className="text-sm font-medium text-gray-700">{getDisplayText()}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div 
            ref={dropdownRef} 
            role="listbox" 
            id={listboxId}
            aria-label="Square footage range options"
            aria-multiselectable="true"
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
          >
            {/* Header Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <span className="text-sm font-medium text-gray-700">Select Size Ranges</span>
              <div className="flex items-center gap-3" role="group" aria-label="Filter actions">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-2 py-1 min-h-[32px] touch-manipulation"
                  aria-label="Select all square footage ranges"
                >
                  Select All
                </button>
                <div className="w-px h-3 bg-gray-300" aria-hidden="true"></div>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-2 py-1 min-h-[32px] touch-manipulation"
                  aria-label="Clear all square footage ranges"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[28px] min-h-[28px] flex items-center justify-center touch-manipulation"
                  aria-label="Close square footage dropdown"
                >
                  <X className="h-3 w-3 text-gray-400" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Options List */}
            <div className="p-2" role="group" aria-label="Square footage options">
              {squareFootageOptions.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={selectedRanges.includes(option.id)}
                  onClick={() => handleRangeToggle(option.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset min-h-[44px] touch-manipulation ${
                    selectedRanges.includes(option.id) ? 'bg-orange-50 border border-orange-200' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 30}ms`,
                    animation: 'fadeInUp 0.3s ease-out forwards'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedRanges.includes(option.id)
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-gray-300 group-hover:border-orange-400'
                      }`}
                      aria-hidden="true"
                    >
                      {selectedRanges.includes(option.id) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-medium transition-colors duration-200 ${
                        selectedRanges.includes(option.id) ? 'text-orange-700' : 'text-gray-700'
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
      {selectedRanges.length > 0 && (
        <div 
          className="flex flex-wrap gap-2" 
          role="list" 
          aria-label="Selected square footage ranges"
        >
          {selectedRanges.map((rangeId) => {
            const option = squareFootageOptions.find(opt => opt.id === rangeId);
            return option ? (
              <div key={rangeId} role="listitem">
                <FilterChip
                  label={option.label}
                  isActive={true}
                  onClick={() => handleRangeToggle(rangeId)}
                  variant="compact"
                />
              </div>
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
    </section>
  );
}