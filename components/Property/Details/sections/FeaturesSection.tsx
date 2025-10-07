'use client';

import { Star, Home, TreePine, Sparkles } from 'lucide-react';
import { Property } from '@/types';
import CollapsibleSection from '../ui/CollapsibleSection';

interface FeaturesSectionProps {
  property: Property;
}

function parseFeatures(featuresString: string | undefined | null): string[] {
  if (!featuresString) return [];
  
  // Split by common delimiters and clean up
  return featuresString
    .split(/[,;|]/)
    .map(feature => feature.trim())
    .filter(feature => feature.length > 0)
    .map(feature => {
      // Capitalize first letter of each word
      return feature
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    });
}

export default function FeaturesSection({ property }: FeaturesSectionProps) {
  // Mock data for demonstration
  const mockInteriorFeatures = [
    'Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances', 
    'Walk-In Closet', 'Fireplace', 'Crown Molding', 'Recessed Lighting',
    'Kitchen Island', 'Master Suite', 'Updated Bathrooms'
  ];
  
  const mockExteriorFeatures = [
    'Swimming Pool', 'Patio', 'Garden', 'Two-Car Garage', 'Landscaping',
    'Deck', 'Outdoor Kitchen', 'Sprinkler System', 'Fence', 'Covered Porch'
  ];
  
  const mockOtherFeatures = [
    'Security System', 'Central Air', 'Heating', 'Laundry Room', 'Storage',
    'Pet Friendly', 'Parking', 'Elevator', 'Gym', 'Concierge'
  ];

  const interiorFeatures = parseFeatures(property.InteriorFeatures).length > 0 
    ? parseFeatures(property.InteriorFeatures) 
    : mockInteriorFeatures;
  const exteriorFeatures = parseFeatures(property.ExteriorFeatures).length > 0 
    ? parseFeatures(property.ExteriorFeatures) 
    : mockExteriorFeatures;
  const otherFeatures = parseFeatures(property.OtherFeatures).length > 0 
    ? parseFeatures(property.OtherFeatures) 
    : mockOtherFeatures;


  return (
    <CollapsibleSection
      title="Property Features"
      icon={Star}
      colorScheme="pink"
      defaultExpanded={true}
    >
      <div className="space-y-6">
        {/* Interior Features */}
        {interiorFeatures.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Interior Features</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {interiorFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Exterior Features */}
        {exteriorFeatures.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TreePine className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-900">Exterior Features</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {exteriorFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other Features */}
        {otherFeatures.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-900">Other Features</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {otherFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}