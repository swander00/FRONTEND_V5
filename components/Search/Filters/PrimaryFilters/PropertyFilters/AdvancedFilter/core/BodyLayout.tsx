import SquareFootageFilter from '../filters/SquareFootageFilter';
import HouseStyleFilter from '../filters/HouseStyleFilter';
import LotFrontageFilter from '../filters/LotFrontageFilter';
import LotDepthFilter from '../filters/LotDepthFilter';
import MaintenanceFeeFilter from '../filters/MaintenanceFeeFilter';
import DaysOnMarketFilter from '../filters/DaysOnMarketFilter';
import GarageParkingFilter from '../filters/GarageParkingFilter';
import TotalParkingFilter from '../filters/TotalParkingFilter';
import BasementFeaturesFilter from '../filters/BasementFeaturesFilter';
import BasementKitchenFilter from '../filters/BasementKitchenFilter';
import OpenHouseFilter from '../filters/OpenHouseFilter';

export default function BodyLayout() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left Column - Property Specifications */}
        <div className="space-y-5 sm:space-y-6" role="region" aria-label="Property specifications filters">
          {/* Square Footage Filter */}
          <SquareFootageFilter />
          
          {/* Lot Frontage Filter */}
          <LotFrontageFilter />
          
          {/* Maintenance Fee Filter */}
          <MaintenanceFeeFilter />
          
          {/* Garage Parking Filter */}
          <GarageParkingFilter />
          
          {/* Basement Features Filter */}
          <BasementFeaturesFilter />
        </div>

        {/* Right Column - Property Features */}
        <div className="space-y-5 sm:space-y-6" role="region" aria-label="Property features filters">
          {/* House Style Filter */}
          <HouseStyleFilter />
          
          {/* Lot Depth Filter */}
          <LotDepthFilter />
          
          {/* Days on Market Filter */}
          <DaysOnMarketFilter />
          
          {/* Total Parking Filter */}
          <TotalParkingFilter />
          
          {/* Basement Kitchen Filter */}
          <BasementKitchenFilter />
        </div>
      </div>

      {/* Bottom Section - Full Width Open House Filter */}
      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200" role="region" aria-label="Open house filter">
        <OpenHouseFilter />
      </div>
    </>
  );
}