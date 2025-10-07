import { Download } from 'lucide-react';

export default function AppButton() {
  return (
    <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-colors duration-200">
      <Download className="h-4 w-4" />
      <span>App</span>
    </button>
  );
}