import KeywordSearchBar from './KeywordSearchBar';
import PropertyClassSelector from './PropertyClassSelector';

export default function TopSection() {
  return (
    <div className="space-y-6 mb-6 sm:mb-8">
      {/* Keyword Search Bar with semantic heading */}
      <div>
        <h2 className="text-sm sm:text-base font-medium text-gray-700 mb-3">
          Keyword Search
        </h2>
        <KeywordSearchBar />
      </div>

      {/* Property Class Selector with semantic heading */}
      <div>
        <h2 className="text-sm sm:text-base font-medium text-gray-700 mb-3">
          Property Class
        </h2>
        <PropertyClassSelector />
      </div>
    </div>
  );
}