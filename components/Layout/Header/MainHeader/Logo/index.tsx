import { Home } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center space-x-3">
      <div className="bg-blue-600 p-2 rounded-lg">
        <Home className="h-6 w-6 text-white" />
      </div>
      <div>
        <span className="ml-2 text-xl font-bold tracking-tight text-gray-900">PropertyHub&apos;s</span>
        <p className="text-xs text-gray-500">Canada&apos;s #1 Real Estate Platform</p>
      </div>
    </div>
  );
}