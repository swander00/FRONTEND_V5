'use client';

import MarketInsights from './MarketInsights';
import SortByControl from './SortByControl';
import ViewToggle from './ViewToggle';
import { usePagination } from '@/components/Property/Listings/PropertyListingsSection';
import { useSearchParams } from 'next/navigation';

export default function PropertyCountBar() {
  const { totalCount, currentPage, totalPages } = usePagination();
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view') || 'gallery';
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <MarketInsights totalCount={totalCount} currentPage={currentPage} totalPages={totalPages} />
          <div className="flex items-center gap-3">
            <ViewToggle activeView={activeView} />
            <SortByControl />
          </div>
        </div>
      </div>
    </div>
  );
}
