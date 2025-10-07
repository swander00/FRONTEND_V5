import { useFilters } from '../../../FilterContext/FilterContext';
import { useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface TypeDropdownProps {
  onClose: () => void;
}

interface PropertyTypeGroup {
  name: string;
  types: string[];
}

// Constants moved outside component for performance
const ALL_TYPES_KEY = 'All Types';

const PROPERTY_TYPE_GROUPS: PropertyTypeGroup[] = [
  {
    name: 'FREEHOLD HOUSES',
    types: ['Detached', 'Semi-Detached', 'Townhouse (Row)', 'Link House', 'Rural / Farm']
  },
  {
    name: 'CONDO LIVING',
    types: ['Condo Apartment', 'Condo Townhouse', 'Detached Condo', 'Semi-Detached Condo', 'Specialty Condos']
  },
  {
    name: 'MULTI-UNIT / INVESTOR',
    types: ['Duplex', 'Triplex', 'Multiplex']
  },
  {
    name: 'RECREATIONAL / LIFESTYLE',
    types: ['Cottage', 'Mobile / Manufactured Home']
  },
  {
    name: 'SPECIAL USE',
    types: ['Vacant Land', 'Vacant Land Condo', 'Parking / Locker', 'Individual Units (Room / Upper / Lower Level)', 'Timeshare', 'Other']
  }
];

export default function TypeDropdown({ onClose }: TypeDropdownProps) {
  const { filters, updateFilter } = useFilters();
  const selectedTypes = filters.propertyType;
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleTypeSelect = (type: string) => {
    if (type === ALL_TYPES_KEY) {
      updateFilter('propertyType', []);
    } else {
      const newSelection = selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type];
      updateFilter('propertyType', newSelection);
    }
  };

  return (
    <div 
      ref={dropdownRef} 
      className="absolute top-full left-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto"
      role="listbox"
      aria-label="Property type selection"
      aria-multiselectable="true"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">Select Property Type</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">Choose one or multiple types</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 p-1 hover:bg-white/60 rounded-full transition-colors duration-200"
            aria-label="Close type selector"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* All Types Option */}
      <div className="px-3 py-2.5 bg-gray-50/50">
        <button
          type="button"
          onClick={() => handleTypeSelect(ALL_TYPES_KEY)}
          className={`w-full pl-4 pr-2.5 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-between group ${
            selectedTypes.length === 0
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 border border-transparent hover:border-blue-200'
          }`}
          role="option"
          aria-selected={selectedTypes.length === 0}
        >
          <span className="truncate flex items-center">
            <div className={`w-1.5 h-1.5 rounded-full mr-3 ${
              selectedTypes.length === 0 ? 'bg-white' : 'bg-gray-400'
            }`}></div>
            All Property Types
          </span>
          {selectedTypes.length === 0 && (
            <Check className="h-4 w-4 ml-1 flex-shrink-0" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Property Type Groups */}
      <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <div className="space-y-4">
          {PROPERTY_TYPE_GROUPS.map((group) => (
            <div key={group.name}>
              {/* Group Header */}
              <div className="mb-3 relative">
                <div className="flex items-center">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                  <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider px-3 bg-gray-50/50 rounded-full border border-gray-200 shadow-sm">
                    {group.name}
                  </h4>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                </div>
              </div>
              
              {/* Property Types List */}
              <div className="space-y-1.5 mb-2">
                {group.types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`w-full pl-4 pr-2.5 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-between group relative ${
                      selectedTypes.includes(type)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 border border-transparent hover:border-blue-200'
                    }`}
                    role="option"
                    aria-selected={selectedTypes.includes(type)}
                  >
                    <span className="truncate flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-3 ${
                        selectedTypes.includes(type) ? 'bg-white' : 'bg-gray-400'
                      }`}></div>
                      {type}
                    </span>
                    {selectedTypes.includes(type) && (
                      <Check className="h-4 w-4 ml-1 flex-shrink-0" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}