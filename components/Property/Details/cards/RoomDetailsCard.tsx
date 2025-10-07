"use client";

import { useState } from 'react';
import { ChevronDown, Layout, Bed, Bath, ChefHat, Home, Ruler, Star, Loader2, MapPin, Zap } from 'lucide-react';
import { Property, Room } from '@/types';
import { usePropertyRooms } from '@/hooks/usePropertyRooms';

interface RoomDetailsCardProps {
  property: Property;
}

interface RoomData {
  roomType: string;
  level: string;
  roomDimensions: string;
  roomFeatures: string[];
  icon: React.ReactNode;
  color: string;
}

export default function RoomDetailsCard({ property }: RoomDetailsCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Get the listing key from the property
  const listingKey = property.MLSNumber;
  
  // Fetch room data from the database
  const { rooms, loading, error } = usePropertyRooms(listingKey || '');

  if (!property) {
    return null;
  }

  // Transform database rooms to display format
  const generateRoomData = (): RoomData[] => {
    if (!rooms || rooms.length === 0) {
      return [];
    }

    return rooms.map((room: Room) => {
      // Determine icon and color based on room type
      const getRoomConfig = () => {
        const roomType = room.RoomType?.toLowerCase() || '';
        
        if (roomType.includes('bedroom') || roomType.includes('bed')) {
          return { icon: <Bed className="h-4 w-4" />, color: 'blue' };
        }
        if (roomType.includes('bathroom') || roomType.includes('bath')) {
          return { icon: <Bath className="h-4 w-4" />, color: 'cyan' };
        }
        if (roomType.includes('kitchen')) {
          return { icon: <ChefHat className="h-4 w-4" />, color: 'orange' };
        }
        if (roomType.includes('living') || roomType.includes('family')) {
          return { icon: <Home className="h-4 w-4" />, color: 'green' };
        }
        if (roomType.includes('dining')) {
          return { icon: <Home className="h-4 w-4" />, color: 'amber' };
        }
        if (roomType.includes('basement') || room.RoomLevel?.toLowerCase().includes('basement')) {
          return { icon: <Home className="h-4 w-4" />, color: 'slate' };
        }
        return { icon: <Layout className="h-4 w-4" />, color: 'gray' };
      };

      // Generate features array from available room data
      const generateRoomFeatures = (): string[] => {
        const roomFeatures: string[] = [];
        
        if (room.RoomFeatures) {
          // Split features by comma and trim whitespace
          const features = room.RoomFeatures.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0);
          roomFeatures.push(...features);
        }
        
        return roomFeatures;
      };

      const config = getRoomConfig();

      // Format dimensions to show units only once
      const formatDimensions = (dimensions: string): string => {
        if (!dimensions || dimensions === 'N/A') {
          return 'N/A';
        }
        
        // If dimensions already contain "feet" or "ft", don't add it again
        if (dimensions.toLowerCase().includes('feet') || dimensions.toLowerCase().includes('ft')) {
          return dimensions;
        }
        
        // Add "feet" at the end if it's not already there
        return `${dimensions} feet`;
      };

      return {
        roomType: room.RoomType,
        level: room.RoomLevel || 'Unknown Level',
        roomDimensions: formatDimensions(room.RoomDimensions || 'N/A'),
        roomFeatures: generateRoomFeatures(),
        icon: config.icon,
        color: config.color,
      };
    });
  };

  const roomData = generateRoomData();
  const hasRoomData = roomData.length > 0;

  // Get color classes for room types
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      slate: 'bg-slate-50 text-slate-700 border-slate-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Layout className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Room Details</h3>
              <p className="text-xs text-gray-500">{hasRoomData ? `${roomData.length} rooms` : 'Limited data'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${hasRoomData ? 'bg-green-400' : 'bg-gray-300'}`}></div>
            <span className="text-xs text-gray-500">{hasRoomData ? 'Available' : 'Limited'}</span>
          </div>
        </div>
        
        {/* 4-Brick Stats Row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-gray-900">{property.Bedrooms}</div>
            <div className="text-xs text-gray-600">Beds</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-gray-900">{property.Bathrooms}</div>
            <div className="text-xs text-gray-600">Baths</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-gray-900">{property.SquareFootage ? Math.round(Number(property.SquareFootage) / 1000) : 'N/A'}</div>
            <div className="text-xs text-gray-600">K Sq Ft</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-gray-900">{hasRoomData ? roomData.length : 'N/A'}</div>
            <div className="text-xs text-gray-600">Rooms</div>
          </div>
        </div>

        {/* Compact Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <Layout className="h-3 w-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">
              {loading ? 'Loading...' : 
               hasRoomData ? 'View Room Details' : 
               'No Room Data'}
            </span>
          </div>
          <ChevronDown
            className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Compact Expanded Content */}
        {isExpanded && (
          <div className="mt-3">
            {loading ? (
              <div className="text-center py-6">
                <Loader2 className="h-5 w-5 text-indigo-500 mx-auto mb-2 animate-spin" />
                <p className="text-gray-600 text-xs">Loading room details...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <Layout className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-600 text-xs">Error loading room details</p>
              </div>
            ) : hasRoomData ? (
              <div className="max-h-60 overflow-y-auto">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-2 py-1.5 bg-gray-50 rounded-t-lg border border-gray-200 text-xs font-medium text-gray-700">
                  <div className="col-span-3">Room Type</div>
                  <div className="col-span-2">Level</div>
                  <div className="col-span-2">Dimensions</div>
                  <div className="col-span-5">Features</div>
                </div>
                
                {/* Room Rows */}
                <div className="space-y-0">
                  {roomData.map((room, index) => (
                    <div key={index} className={`grid grid-cols-12 gap-2 px-2 py-2 border-l border-r border-gray-200 hover:bg-gray-50 transition-colors ${index === roomData.length - 1 ? 'border-b rounded-b-lg' : 'border-b border-gray-100'}`}>
                      {/* Room Type */}
                      <div className="col-span-3 flex items-center gap-2">
                        <div className={`p-1 rounded border ${getColorClasses(room.color)}`}>
                          {room.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-900 truncate">{room.roomType}</span>
                      </div>
                      
                      {/* Level */}
                      <div className="col-span-2 flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="truncate">{room.level}</span>
                      </div>
                      
                      {/* Dimensions */}
                      <div className="col-span-2 flex items-center gap-1 text-xs text-gray-600">
                        <Ruler className="h-3 w-3 text-gray-400" />
                        <span className="truncate">{room.roomDimensions}</span>
                      </div>
                      
                      {/* Features */}
                      <div className="col-span-5 flex items-center gap-1 flex-wrap">
                        {room.roomFeatures.length > 0 ? (
                          <>
                            {room.roomFeatures.map((feature, featureIndex) => (
                              <span
                                key={featureIndex}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full border border-indigo-200 whitespace-nowrap shadow-sm"
                              >
                                <Zap className="h-2 w-2" />
                                {feature}
                              </span>
                            ))}
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">No features</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Layout className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-xs font-medium">No room details available</p>
                <p className="text-gray-500 text-xs mt-1">
                  Room data available for ~43% of listings
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 