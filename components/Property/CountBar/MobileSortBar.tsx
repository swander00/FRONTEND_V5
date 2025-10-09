'use client';

import SortByControl from './SortByControl';
import { useSearchParams, useRouter } from 'next/navigation';
import { Grid3X3, Map } from 'lucide-react';

export default function MobileSortBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeView = searchParams?.get('view') || 'gallery';
  
  const handleViewChange = (view: string) => {
    if (view === 'map') {
      // For map view, go directly to full screen map
      const params = new URLSearchParams(searchParams?.toString() || '');
      router.push(`/map-view?${params.toString()}`);
    } else {
      // For gallery view, stay on current page
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('view', view);
      router.push(`?${params.toString()}`);
    }
  };
  
  return (
    <div className="lg:hidden bg-white border-b border-gray-200">
      <div className="px-4">
        <div className="flex items-center justify-between py-3">
          {/* Left side - View Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => handleViewChange('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                activeView === 'gallery'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid view"
              aria-label="Switch to grid view"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="font-medium">Grid</span>
            </button>
            <button
              onClick={() => handleViewChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                activeView === 'map'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Full screen map view"
              aria-label="Open full screen map view"
            >
              <Map className="h-4 w-4" />
              <span className="font-medium">Map</span>
            </button>
          </div>

          {/* Right side - Sort Only */}
          <div className="flex items-center">
            <SortByControl />
          </div>
        </div>
      </div>
    </div>
  );
}

