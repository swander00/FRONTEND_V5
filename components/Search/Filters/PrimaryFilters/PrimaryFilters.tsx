"use client";

import StatusFilters from './StatusFilters';
import { PropertyFilters } from './PropertyFilters';
import ResetButton from './ResetButton';
import SearchBar from './SearchBar';

export default function PrimaryFilters() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-[22rem] flex-shrink-0">
            <SearchBar />
          </div>
          <StatusFilters />
          <PropertyFilters />
        </div>
        <ResetButton />
      </div>
    </div>
  );
}