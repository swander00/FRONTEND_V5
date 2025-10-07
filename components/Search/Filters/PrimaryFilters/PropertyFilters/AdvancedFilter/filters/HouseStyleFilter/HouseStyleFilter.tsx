"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Home, X } from 'lucide-react';
import FilterChip from '../../core/FilterChip';

export type HouseStyle = 
  // Bungalows
  | 'bungalow'
  | 'raised-bungalow'
  | 'bungaloft'
  // Traditional & Storey Homes
  | '1.5-storey'
  | '2-storey'
  | '2.5-storey'
  | '3-storey'
  // Split-Level Homes
  | 'sidesplit'
  | 'backsplit'
  // Apartments & Studios
  | 'apartment'
  | '1-storey-apartment'
  | 'studio-bachelor'
  // Modern & Alternative Styles
  | 'contemporary'
  | 'chalet'
  | 'log'
  | 'garden-house'
  // Multilevel
  | 'duplex'
  | 'triplex'
  | 'fourplex'
  | 'other-multiplex';

interface HouseStyleOption {
  id: HouseStyle;
  label: string;
  description: string;
}

interface HouseStyleGroup {
  name: string;
  icon: string;
  gradient: string;
  styles: HouseStyleOption[];
}

const houseStyleGroups: HouseStyleGroup[] = [
  {
    name: 'Bungalows',
    icon: '🏠',
    gradient: 'from-blue-500 to-cyan-600',
    styles: [
      { id: 'bungalow', label: 'Bungalow', description: 'Single-level living' },
      { id: 'raised-bungalow', label: 'Raised Bungalow', description: 'Elevated single level' },
      { id: 'bungaloft', label: 'Bungaloft', description: 'Bungalow with loft space' }
    ]
  },
  {
    name: 'Traditional & Storey Homes',
    icon: '🏘️',
    gradient: 'from-green-500 to-emerald-600',
    styles: [
      { id: '1.5-storey', label: '1.5 Storey', description: 'One and a half levels' },
      { id: '2-storey', label: '2-Storey', description: 'Two full levels' },
      { id: '2.5-storey', label: '2.5 Storey', description: 'Two and a half levels' },
      { id: '3-storey', label: '3-Storey', description: 'Three full levels' }
    ]
  },
  {
    name: 'Split-Level Homes',
    icon: '🏗️',
    gradient: 'from-purple-500 to-violet-600',
    styles: [
      { id: 'sidesplit', label: 'Sidesplit', description: 'Side-oriented split levels' },
      { id: 'backsplit', label: 'Backsplit', description: 'Back-oriented split levels' }
    ]
  },
  {
    name: 'Apartments & Studios',
    icon: '🏢',
    gradient: 'from-orange-500 to-red-600',
    styles: [
      { id: 'apartment', label: 'Apartment', description: 'Multi-unit building' },
      { id: '1-storey-apartment', label: '1-Storey Apartment', description: 'Single-level apartment' },
      { id: 'studio-bachelor', label: 'Studio / Bachelor', description: 'Compact living space' }
    ]
  },
  {
    name: 'Modern & Alternative Styles',
    icon: '🏛️',
    gradient: 'from-pink-500 to-rose-600',
    styles: [
      { id: 'contemporary', label: 'Contemporary', description: 'Modern architectural style' },
      { id: 'chalet', label: 'Chalet', description: 'Alpine-style home' },
      { id: 'log', label: 'Log', description: 'Log construction' },
      { id: 'garden-house', label: 'Garden House', description: 'Garden-integrated design' }
    ]
  },
  {
    name: 'Multilevel',
    icon: '🏘️',
    gradient: 'from-indigo-500 to-blue-600',
    styles: [
      { id: 'duplex', label: 'Duplex', description: 'Two-unit building' },
      { id: 'triplex', label: 'Triplex', description: 'Three-unit building' },
      { id: 'fourplex', label: 'Fourplex', description: 'Four-unit building' },
      { id: 'other-multiplex', label: 'Other Multiplex', description: 'Five or more units' }
    ]
  }
];

export default function HouseStyleFilter() {
  const [selectedStyles, setSelectedStyles] = useState<HouseStyle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleStyleToggle = (styleId: HouseStyle) => {
    setSelectedStyles(prev => {
      if (prev.includes(styleId)) {
        return prev.filter(id => id !== styleId);
      } else {
        return [...prev, styleId];
      }
    });
  };

  const selectAll = () => {
    const allStyles = houseStyleGroups.flatMap(group => group.styles.map(style => style.id));
    setSelectedStyles(allStyles);
  };

  const clearAll = () => {
    setSelectedStyles([]);
  };

  const getDisplayText = () => {
    if (selectedStyles.length === 0) return 'Any Style';
    if (selectedStyles.length === 1) {
      const allStyles = houseStyleGroups.flatMap(group => group.styles);
      const style = allStyles.find(style => style.id === selectedStyles[0]);
      return style?.label || 'Any Style';
    }
    return `${selectedStyles.length} styles selected`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
          <Home className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">House Style</h3>
          <p className="text-sm text-gray-500">Select architectural styles</p>
        </div>
      </div>

      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="text-sm font-medium text-gray-700">{getDisplayText()}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Header Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <span className="text-sm font-medium text-gray-700">Select House Styles</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAll}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
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

            {/* Groups List */}
            <div className="p-2">
              {houseStyleGroups.map((group, groupIndex) => (
                <div key={group.name} className="mb-4 last:mb-0">
                  {/* Group Header */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className={`w-6 h-6 bg-gradient-to-r ${group.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                      <span className="text-xs">{group.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {group.name}
                      </h4>
                      <div className={`w-8 h-0.5 bg-gradient-to-r ${group.gradient} mt-1`}></div>
                    </div>
                  </div>

                  {/* Group Styles */}
                  <div className="space-y-1">
                    {group.styles.map((style, styleIndex) => (
                      <button
                        key={style.id}
                        onClick={() => handleStyleToggle(style.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 group ${
                          selectedStyles.includes(style.id) ? 'bg-indigo-50 border border-indigo-200' : ''
                        }`}
                        style={{ 
                          animationDelay: `${(groupIndex * 100) + (styleIndex * 30)}ms`,
                          animation: 'fadeInUp 0.3s ease-out forwards'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            selectedStyles.includes(style.id)
                              ? 'bg-indigo-500 border-indigo-500'
                              : 'border-gray-300 group-hover:border-indigo-400'
                          }`}>
                            {selectedStyles.includes(style.id) && (
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="text-left">
                            <div className={`text-sm font-medium transition-colors duration-200 ${
                              selectedStyles.includes(style.id) ? 'text-indigo-700' : 'text-gray-700'
                            }`}>
                              {style.label}
                            </div>
                            <div className="text-xs text-gray-500">{style.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Items Display */}
      {selectedStyles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedStyles.map((styleId) => {
            const allStyles = houseStyleGroups.flatMap(group => group.styles);
            const style = allStyles.find(s => s.id === styleId);
            return style ? (
              <FilterChip
                key={styleId}
                label={style.label}
                isActive={true}
                onClick={() => handleStyleToggle(styleId)}
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