"use client";

import { Check } from 'lucide-react';

interface FilterChipProps {
  label: string;
  description?: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export default function FilterChip({ 
  label, 
  description, 
  isActive, 
  onClick, 
  variant = 'default' 
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="checkbox"
      aria-checked={isActive}
      aria-label={description ? `${label}: ${description}` : label}
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] touch-manipulation ${
        variant === 'compact' 
          ? 'px-4 py-2' 
          : 'px-5 py-3'
      } ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl border-2 border-blue-600'
          : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Background Animation */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100'
      }`} />
      
      {/* Content */}
      <div className="relative flex items-center gap-3">
        {/* Check Icon for Active State */}
        {isActive && (
          <div className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full" aria-hidden="true">
            <Check className="h-3 w-3 text-white" aria-hidden="true" />
          </div>
        )}
        
        {/* Text Content */}
        <div className={`${variant === 'compact' ? 'text-center' : 'text-left'} flex-1`}>
          <div className={`font-semibold transition-colors duration-200 ${
            variant === 'compact' ? 'text-sm' : 'text-sm'
          }`}>
            {label}
          </div>
          {description && variant === 'default' && (
            <div className={`text-xs mt-0.5 transition-colors duration-200 ${
              isActive ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {description}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle Border Animation */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'ring-2 ring-blue-400 ring-opacity-50' 
          : 'ring-0'
      }`} />
    </button>
  );
}