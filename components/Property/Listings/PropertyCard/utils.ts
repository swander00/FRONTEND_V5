/**
 * Utility functions for PropertyCard
 */

/**
 * Format price for display
 */
export const formatPrice = (price: number, isLease: boolean = false): string => {
  const formatted = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return isLease ? `${formatted}/mo` : formatted;
};

/**
 * Calculate relative time from date
 */
export const getRelativeTime = (dateString: string): string => {
  if (!dateString) return 'Recently listed';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `Listed ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  if (diffInHours < 24) {
    return `Listed ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  if (diffInDays < 30) {
    return `Listed ${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `Listed ${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
};

