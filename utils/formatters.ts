export function formatPrice(price?: number): string {
  if (!price) return '—';
  
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Listed today';
  if (diffInDays === 1) return 'Listed 1 day ago';
  if (diffInDays < 7) return `Listed ${diffInDays} days ago`;
  if (diffInDays < 14) return 'Listed 1 week ago';
  if (diffInDays < 30) return `Listed ${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 60) return 'Listed 1 month ago';
  return `Listed ${Math.floor(diffInDays / 30)} months ago`;
}

export function formatSquareFootage(squareFootage: number): string {
  return squareFootage.toLocaleString('en-CA');
}

export function shortenStreetSuffix(suffix?: string): string {
  if (!suffix) return '';
  
  // Common street suffix abbreviations
  const suffixMap: Record<string, string> = {
    'Street': 'St',
    'Avenue': 'Ave',
    'Road': 'Rd',
    'Boulevard': 'Blvd',
    'Drive': 'Dr',
    'Lane': 'Ln',
    'Court': 'Ct',
    'Place': 'Pl',
    'Way': 'Way',
    'Circle': 'Cir',
    'Terrace': 'Ter',
    'Crescent': 'Cres',
    'Close': 'Cl',
    'Grove': 'Grv',
    'Heights': 'Hts',
    'Park': 'Pk',
    'Square': 'Sq',
    'Trail': 'Trl',
    'Walk': 'Walk',
    'Mews': 'Mews',
    'Gardens': 'Gdns',
    'Manor': 'Mnr',
    'Village': 'Vlg',
    'Estates': 'Est',
    'Harbour': 'Hbr',
    'Harbor': 'Hbr',
    'Centre': 'Ctr',
    'Center': 'Ctr',
    'Plaza': 'Plz',
    'Commons': 'Com',
    'Crossing': 'Xing',
    'Extension': 'Ext',
    'North': 'N',
    'South': 'S',
    'East': 'E',
    'West': 'W',
    'Northeast': 'NE',
    'Northwest': 'NW',
    'Southeast': 'SE',
    'Southwest': 'SW'
  };
  
  // Check for exact match first
  if (suffixMap[suffix]) {
    return suffixMap[suffix];
  }
  
  // Check for case-insensitive match
  const lowerSuffix = suffix.toLowerCase();
  for (const [full, short] of Object.entries(suffixMap)) {
    if (full.toLowerCase() === lowerSuffix) {
      return short;
    }
  }
  
  // If no match found, return the original suffix
  return suffix;
}

/**
 * Cleans database values by removing square brackets and quotes for frontend rendering
 * Examples: ["Bungalow"] -> Bungalow, "Single Family" -> Single Family
 */
export function cleanDatabaseValue(value?: string | null): string {
  // Check if value is null, undefined, or not a string
  if (!value || typeof value !== 'string') return '';
  
  // Remove square brackets and their contents if they wrap the entire value
  let cleaned = value.trim();
  
  // Remove outer square brackets if they wrap the entire string
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    cleaned = cleaned.slice(1, -1);
  }
  
  // Remove outer quotes (single or double) if they wrap the entire string
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
      (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1);
  }
  
  return cleaned.trim();
}

/**
 * Formats text to Title Case with proper capitalization
 * Examples: "swimming pool" -> "Swimming Pool", "FITNESS CENTER" -> "Fitness Center"
 */
export function formatTitleCase(value?: string | null): string {
  if (!value || typeof value !== 'string') return '';
  
  // First clean the database value
  const cleaned = cleanDatabaseValue(value);
  
  // Convert to title case
  return cleaned
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}