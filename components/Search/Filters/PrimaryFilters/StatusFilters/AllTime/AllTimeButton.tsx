import { ChevronDown } from 'lucide-react';

interface AllTimeButtonProps {
  isOpen: boolean;
  selectedPeriod: string;
  onClick: () => void;
}

export default function AllTimeButton({ isOpen, selectedPeriod, onClick }: AllTimeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 border-l-0 rounded-r-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md min-w-[120px] h-[48px]"
    >
      <span className="flex-1 text-center">{selectedPeriod}</span>
      <ChevronDown className={`h-3 w-3 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
}