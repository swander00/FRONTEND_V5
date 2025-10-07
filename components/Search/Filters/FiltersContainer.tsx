import { PrimaryFilters } from './PrimaryFilters';
import QuickFilters from './QuickFilters';
import FilterChips from './FilterChips/FilterChips';

export default function FiltersContainer() {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="py-3 space-y-2">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <PrimaryFilters />
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <QuickFilters />
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <FilterChips />
        </div>
      </div>
    </div>
  );
}