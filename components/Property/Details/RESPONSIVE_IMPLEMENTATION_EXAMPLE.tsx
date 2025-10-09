/**
 * RESPONSIVE IMPLEMENTATION EXAMPLE
 * 
 * This file demonstrates how to implement responsive switching between
 * PropertyDetailsModal (desktop) and PropertyDetailsModalMobile (mobile)
 * based on screen size.
 * 
 * DO NOT USE THIS FILE DIRECTLY - It's for reference only.
 */

'use client';

import { useState, useEffect } from 'react';
import { PropertyDetailsModal, PropertyDetailsModalMobile } from '@/components/Property/Details';
import { Property } from '@/types';

// ============================================================================
// EXAMPLE 1: Using CSS Media Query Hook
// ============================================================================

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function ResponsivePropertyDetailsExample1({ property }: { property: Property }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Property Details
      </button>

      {isMobile ? (
        <PropertyDetailsModalMobile
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <PropertyDetailsModal
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 2: Using Window Width
// ============================================================================

function useWindowWidth(): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Set initial width
    setWidth(window.innerWidth);

    // Update width on resize
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

export function ResponsivePropertyDetailsExample2({ property }: { property: Property }) {
  const [isOpen, setIsOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const MOBILE_BREAKPOINT = 768;

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Property Details
      </button>

      {windowWidth <= MOBILE_BREAKPOINT ? (
        <PropertyDetailsModalMobile
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <PropertyDetailsModal
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 3: Using Device Detection
// ============================================================================

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for mobile devices
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
}

export function ResponsivePropertyDetailsExample3({ property }: { property: Property }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Property Details
      </button>

      {isMobile ? (
        <PropertyDetailsModalMobile
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <PropertyDetailsModal
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 4: Combined Approach (Recommended)
// ============================================================================

/**
 * Combined approach that checks both screen size AND device type
 * This is the most reliable method for production use
 */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Check screen width
      const isSmallScreen = window.innerWidth <= 768;
      
      // Check device type
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase()
      );
      
      // Consider mobile if either condition is true
      setIsMobile(isSmallScreen || isMobileDevice);
    };

    // Initial check
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

export function ResponsivePropertyDetailsExample4({ property }: { property: Property }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Property Details
      </button>

      {isMobile ? (
        <PropertyDetailsModalMobile
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <PropertyDetailsModal
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 5: Using Tailwind CSS Classes (CSS-only approach)
// ============================================================================

/**
 * This approach uses Tailwind's responsive classes to show/hide
 * the appropriate modal based on screen size.
 * 
 * Note: Both modals will be in the DOM, which may impact performance
 */
export function ResponsivePropertyDetailsExample5({ property }: { property: Property }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Property Details
      </button>

      {/* Mobile version - hidden on larger screens */}
      <div className="block md:hidden">
        <PropertyDetailsModalMobile
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      </div>

      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:block">
        <PropertyDetailsModal
          isOpen={isOpen}
          property={property}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
}

// ============================================================================
// EXAMPLE 6: With Loading State
// ============================================================================

/**
 * Example showing how to handle loading states and missing property data
 */
export function ResponsivePropertyDetailsExample6() {
  const [isOpen, setIsOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleOpenModal = async (propertyId: string) => {
    setIsLoading(true);
    setIsOpen(true);
    
    try {
      // Fetch property data
      const response = await fetch(`/api/properties/${propertyId}`);
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Failed to fetch property:', error);
      setProperty(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // Optional: Clear property data after modal closes
    setTimeout(() => setProperty(null), 300);
  };

  return (
    <>
      <button onClick={() => handleOpenModal('property-123')}>
        View Property Details
      </button>

      {isOpen && (
        <>
          {isLoading ? (
            // Show loading state
            <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading property details...</p>
              </div>
            </div>
          ) : property ? (
            // Show appropriate modal based on device
            isMobile ? (
              <PropertyDetailsModalMobile
                isOpen={isOpen}
                property={property}
                onClose={handleCloseModal}
              />
            ) : (
              <PropertyDetailsModal
                isOpen={isOpen}
                property={property}
                onClose={handleCloseModal}
              />
            )
          ) : (
            // Show error state
            <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-4">Failed to load property</p>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 7: Integration with Property Card
// ============================================================================

/**
 * Example showing how to integrate with a property card component
 */
interface PropertyCardProps {
  property: Property;
}

export function PropertyCardWithModal({ property }: PropertyCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Property Card */}
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={property.PrimaryImageUrl || '/images/no-photo-placeholder.jpg'} 
          alt={property.StreetAddress}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{property.StreetAddress}</h3>
          <p className="text-gray-600 text-sm mb-2">
            {property.City}, {property.StateOrProvince}
          </p>
          <p className="text-2xl font-bold text-blue-600">
            ${property.ListPrice?.toLocaleString()}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>🛏 {property.Bedrooms} beds</span>
            <span>🛁 {property.Bathrooms} baths</span>
            <span>⬜ {property.SquareFootage} sqft</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isMobile ? (
        <PropertyDetailsModalMobile
          isOpen={isModalOpen}
          property={property}
          onClose={() => setIsModalOpen(false)}
        />
      ) : (
        <PropertyDetailsModal
          isOpen={isModalOpen}
          property={property}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * 1. RECOMMENDED APPROACH: Use Example 4 (Combined Approach)
 *    - Most reliable across devices
 *    - Handles edge cases well
 *    - Good performance
 * 
 * 2. PERFORMANCE: 
 *    - Avoid Example 5 (both modals in DOM) for production
 *    - Use conditional rendering (Examples 1-4, 6-7)
 *    - Only one modal should be rendered at a time
 * 
 * 3. BREAKPOINTS:
 *    - Mobile: 0-768px
 *    - Desktop: 769px+
 *    - Adjust based on your design requirements
 * 
 * 4. LOADING STATES:
 *    - Always show loading indicator when fetching data
 *    - Handle errors gracefully
 *    - Provide fallback UI
 * 
 * 5. TESTING:
 *    - Test on real devices, not just browser DevTools
 *    - Check both orientations (portrait/landscape)
 *    - Verify touch interactions work correctly
 * 
 * 6. ACCESSIBILITY:
 *    - Ensure keyboard navigation works
 *    - Test with screen readers
 *    - Proper focus management
 */

// ============================================================================
// EXPORTS
// ============================================================================

// Export the recommended implementation for easy use
export { ResponsivePropertyDetailsExample4 as ResponsivePropertyDetails };

// Export the hook for standalone use
export { useIsMobile };

