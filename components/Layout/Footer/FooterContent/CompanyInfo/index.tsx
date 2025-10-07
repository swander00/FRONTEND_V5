import { Home } from 'lucide-react';

export default function CompanyInfo() {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Home className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold">RealEstate</span>
      </div>
      <p className="text-gray-400 leading-relaxed">
        Your trusted partner in finding the perfect home. We specialize in connecting buyers, sellers, and renters with premium properties in prime locations.
      </p>
    </div>
  );
}