import React from 'react';
import { SuggestionCard as SharedSuggestionCard } from '@/components/shared';

interface ListingSuggestion {
  id: string;
  type: 'listing';
  MlsNumber: string;
  address: string;
  Community: string;
  ListPrice: number;
  Bedrooms: number;
  Bathrooms: number;
  SquareFootage: number;
  ThumbnailUrl: string;
  TransactionType?: string;
  OriginalEntryTimestamp?: string;
  LivingAreaRange?: string;
}

interface FilterSuggestion {
  id: string;
  type: 'city' | 'community';
  name: string;
}

type Suggestion = ListingSuggestion | FilterSuggestion;

interface SuggestionCardProps {
  suggestion: Suggestion;
  onClick: (suggestion: Suggestion) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onClick }) => {
  const handleClick = () => {
    onClick(suggestion);
  };

  // Format time ago from OriginalEntryTimestamp
  const formatTimeAgo = (timestamp: string | undefined): string => {
    if (!timestamp) return 'Recently listed';
    
    try {
      const listingDate = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(listingDate.getTime())) {
        return 'Recently listed';
      }
      
      const now = new Date();
      const diffInMs = now.getTime() - listingDate.getTime();
      
      // Convert to different time units
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      // Show minutes for listings less than 1 hour old
      if (diffInMinutes < 60) {
        if (diffInMinutes === 0) return 'Just listed';
        if (diffInMinutes === 1) return '1 min ago';
        return `${diffInMinutes} mins ago`;
      }
      
      // Show hours for listings less than 24 hours old
      if (diffInHours < 24) {
        if (diffInHours === 1) return '1 hour ago';
        return `${diffInHours} hours ago`;
      }
      
      // Show days for listings less than 30 days old
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 30) return `${diffInDays} days ago`;
      
      // Show months for listings less than 1 year old
      if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return months === 1 ? '1 month ago' : `${months} months ago`;
      }
      
      // Show years for older listings
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    } catch {
      return 'Recently listed';
    }
  };

  // Format price with commas
  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  // Format square footage with ranges
  const formatSqFt = (sqft: number, livingAreaRange?: string): string => {
    console.log('formatSqFt called with:', { sqft, livingAreaRange });
    
    if (livingAreaRange && livingAreaRange.trim()) {
      return `${livingAreaRange} sq ft`;
    }
    if (sqft > 0) {
      return `${sqft.toLocaleString()} sq ft`;
    }
    return '';
  };

  // Get transaction status
  const getStatus = (transactionType?: string): string => {
    if (!transactionType) return 'For Sale';
    return transactionType;
  };

  // Render city/community suggestion
  if (suggestion.type === 'city' || suggestion.type === 'community') {
    const filterSuggestion = suggestion as FilterSuggestion;
    return (
      <SharedSuggestionCard onClick={handleClick}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <span className="text-white text-sm">
              {suggestion.type === 'city' ? '🏙️' : '🏘️'}
            </span>
          </div>
          <div className="flex-1">
            <span className={`font-semibold text-base ${suggestion.type === 'city' ? 'text-emerald-600 group-hover:text-emerald-700' : 'text-orange-600 group-hover:text-orange-700'} transition-colors duration-200`}>
              {filterSuggestion.name}
            </span>
            <span className="text-sm text-gray-500 ml-2 font-medium">
              ({suggestion.type === 'city' ? 'Municipality' : 'Community'})
            </span>
          </div>
          <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
        </div>
      </SharedSuggestionCard>
    );
  }

  // Render listing suggestion as horizontal card
  const listingSuggestion = suggestion as ListingSuggestion;
  const timeAgo = formatTimeAgo(listingSuggestion.OriginalEntryTimestamp);
  const status = getStatus(listingSuggestion.TransactionType);
  const beds = listingSuggestion.Bedrooms;
  const baths = listingSuggestion.Bathrooms;
  const sqft = formatSqFt(listingSuggestion.SquareFootage, listingSuggestion.LivingAreaRange);
  
  return (
    <SharedSuggestionCard onClick={handleClick}>
      <div className="flex gap-3 items-stretch"> {/* items-stretch for equal height */}
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          {listingSuggestion.ThumbnailUrl ? (
            <img 
              src={listingSuggestion.ThumbnailUrl} 
              alt="Property thumbnail"
              className="w-16 h-16 object-cover rounded-xl bg-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          {/* Placeholder when no image or image fails */}
          <div 
            className={`w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200 ${listingSuggestion.ThumbnailUrl ? 'hidden' : ''}`}
          >
            <span className="text-gray-400 text-lg">🏠</span>
          </div>
        </div>

        {/* Content - perfectly aligned with thumbnail */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5"> {/* py-0.5 for perfect alignment */}
          {/* Top section: Status, Time, Address */}
          <div>
            {/* Status and Time - aligned to top of thumbnail */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full shadow-sm">
                {status}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {timeAgo}
              </span>
            </div>

            {/* Address */}
            <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate group-hover:text-blue-700 transition-colors duration-200">
              {listingSuggestion.address}
            </h3>
          </div>

          {/* Bottom section: Property Details and Price - aligned to bottom of thumbnail */}
          <div className="flex items-center justify-between mt-1">
            {/* Property Details */}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {beds > 0 && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 13c1.65 0 3-1.35 3-3S8.65 7 7 7s-3 1.35-3 3 1.35 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                  </svg>
                  <span className="font-semibold text-gray-700">{beds}</span>
                </div>
              )}
              {beds > 0 && baths > 0 && <span className="text-gray-400 font-bold">•</span>}
              {baths > 0 && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 14c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6-2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-6 6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6-2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  <span className="font-semibold text-gray-700">{baths}</span>
                </div>
              )}
              {(beds > 0 || baths > 0) && sqft && <span className="text-gray-400 font-bold">•</span>}
              {sqft && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
                    <path d="M7 7h4v4H7V7zm6 0h4v4h-4V7zM7 13h4v4H7v-4zm6 0h4v4h-4v-4z"/>
                  </svg>
                  <span className="font-semibold text-gray-700 text-xs">{sqft}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="font-bold text-emerald-600 text-base flex-shrink-0 ml-3 group-hover:text-emerald-700 transition-colors duration-200">
              {formatPrice(listingSuggestion.ListPrice)}
            </div>
          </div>
        </div>
      </div>
    </SharedSuggestionCard>
  );
};

export default SuggestionCard;