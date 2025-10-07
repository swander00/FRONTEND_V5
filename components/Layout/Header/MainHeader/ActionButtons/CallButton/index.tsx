import { Phone } from 'lucide-react';

export default function CallButton() {
  return (
    <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-200">
      <Phone className="h-4 w-4" />
      <span>Call</span>
    </button>
  );
}