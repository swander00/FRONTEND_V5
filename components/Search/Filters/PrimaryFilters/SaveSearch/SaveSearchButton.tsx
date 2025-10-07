"use client"

import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SaveSearchButton() {
  const handleSaveSearch = () => {
    // Save search logic here
    console.log('Saving search');
  };

  return (
    <Button
      onClick={handleSaveSearch}
      variant="default"
      size="sm"
      className={cn(
        "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700",
        "border border-emerald-600 hover:border-emerald-700",
        "focus:ring-emerald-500 focus:ring-offset-2",
        "transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl",
        "rounded-xl px-6 py-3 h-[52px] text-sm font-bold",
        "group relative overflow-hidden transform hover:scale-105 active:scale-95"
      )}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-white/8 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-center gap-2 relative">
        <Save className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12 text-white drop-shadow-sm" />
        <span className="drop-shadow-sm">Save Search</span>
      </div>
      
      {/* Subtle pulse effect for extra attention */}
      <div className="absolute inset-0 rounded-xl bg-white/10 
                     animate-pulse opacity-40" />
    </Button>
  );
}
