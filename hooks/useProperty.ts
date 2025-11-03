import { useState, useEffect } from 'react';
import { Property } from '@/types';
import { getPropertyByMLS } from '@/lib/mockDataService';

export function useProperty(propertyId: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log('useProperty: Fetching property with ID:', propertyId);
        const mockProperty = await getPropertyByMLS(propertyId);
        
        if (!mockProperty) {
          console.log('useProperty: No data returned from getPropertyByMLS');
          setError('Property not found');
          return;
        }
        
        // Debug logging (only in development)
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 useProperty: Received data:', mockProperty);
          console.log('🔍 useProperty: Features data:', {
            InteriorFeatures: mockProperty.InteriorFeatures,
            ExteriorFeatures: mockProperty.ExteriorFeatures,
            OtherFeatures: mockProperty.OtherFeatures
          });
        }
        
        setProperty(mockProperty);
      } catch (err) {
        console.error('Error fetching property:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load property data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  return { property, isLoading, error };
} 