"use client";

import UnifiedStatusButton from './UnifiedStatusButton';
import AllTime from './AllTime';
import { useFilters } from '../../FilterContext/FilterContext';

export default function StatusFilters() {
  const { filters, updateFilter, removeFilter } = useFilters();
  const selectedStatus = filters.status;

  const handleStatusSelect = (status: string) => {
    if (selectedStatus === status) {
      removeFilter('status');
    } else {
      updateFilter('status', status);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        <UnifiedStatusButton 
          selectedStatus={selectedStatus} 
          onStatusSelect={handleStatusSelect}
          hasAllTime={!!selectedStatus}
        />
        {selectedStatus && (
          <AllTime selectedStatus={selectedStatus} />
        )}
      </div>
    </div>
  );
}