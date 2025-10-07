import { useState, useEffect } from 'react';
import { Room } from '@/types/property';

// Mock rooms data
const mockRooms: Room[] = [
  {
    MLSNumber: 'W1234567',
    RoomType: 'Living Room',
    RoomLevel: 'Main',
    RoomDimensions: '38\'4" x 7\'5"',
    RoomFeatures: 'Hardwood Floors, Large Windows, Fireplace',
  },
  {
    MLSNumber: 'W1234567',
    RoomType: 'Kitchen',
    RoomLevel: 'Main',
    RoomDimensions: '26\'3" x 11\'6"',
    RoomFeatures: 'Updated Appliances, Granite Countertops, Island',
  },
  {
    MLSNumber: 'W1234567',
    RoomType: 'Master Bedroom',
    RoomLevel: 'Second',
    RoomDimensions: '13\'9" x 12\'6"',
    RoomFeatures: 'Walk-in Closet, Ensuite Bathroom, Large Windows',
  },
  {
    MLSNumber: 'W1234567',
    RoomType: 'Bedroom',
    RoomLevel: 'Second',
    RoomDimensions: '11\'6" x 10\'6"',
    RoomFeatures: 'Closet, Large Window',
  }
];

export const usePropertyRooms = (MLSNumber: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('usePropertyRooms: Hook called with MLSNumber:', MLSNumber);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!MLSNumber) {
        console.log('usePropertyRooms: No MLSNumber provided');
        setLoading(false);
        return;
      }

      console.log('usePropertyRooms: Fetching rooms for MLSNumber:', MLSNumber);

      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // Filter mock rooms by MLS number
        const filteredRooms = mockRooms.filter(room => room.MLSNumber === MLSNumber);

        console.log('usePropertyRooms: Mock rooms result:', { 
          dataCount: filteredRooms.length, 
          sampleData: filteredRooms[0] || 'No data'
        });

        setRooms(filteredRooms);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [MLSNumber]);

  return { rooms, loading, error };
};
