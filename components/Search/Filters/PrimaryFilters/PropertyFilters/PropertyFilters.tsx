import PropertyGroup from './PropertyGroup';
import AdvancedFilter from './AdvancedFilter';

export default function PropertyFilters() {
  return (
    <div className="flex items-center gap-4">
      <PropertyGroup />
      <AdvancedFilter />
    </div>
  );
}