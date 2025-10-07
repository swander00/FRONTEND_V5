"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Grid3X3, Map } from 'lucide-react';

interface ViewToggleProps {
  activeView: string;
}

export default function ViewToggle({ activeView }: ViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('view', view);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center border border-gray-200 rounded-md">
      <button
        onClick={() => handleViewChange('gallery')}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors ${
          activeView === 'gallery'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
        title="Grid view"
        aria-label="Switch to grid view"
      >
        <Grid3X3 className="h-4 w-4" />
        <span>Grid</span>
      </button>
      <div className="h-6 w-px bg-gray-200" />
      <button
        onClick={() => handleViewChange('map')}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors ${
          activeView === 'map'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
        title="Map view"
        aria-label="Switch to map view"
      >
        <Map className="h-4 w-4" />
        <span>Map</span>
      </button>
    </div>
  );
}
