"use client";

import { SharedVirtualTourButton, Icon, FadeIn } from '@/components/shared';

interface PropertyVirtualTourButtonProps {
  onClick: () => void;
  position?: 'top-right' | 'bottom-right';
  className?: string;
}

export default function PropertyVirtualTourButton({ 
  onClick, 
  position = 'top-right',
  className = '' 
}: PropertyVirtualTourButtonProps) {
  const positionClasses = {
    'top-right': 'absolute top-4 right-16',
    'bottom-right': 'absolute bottom-4 right-4'
  };

  return (
    <div className={`${positionClasses[position]} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${className}`}>
      <FadeIn duration="normal" delay="short">
        <SharedVirtualTourButton
          onClick={onClick}
          size="md"
          icon={<Icon name="play" size="sm" className="mr-1" />}
          className="shadow-xl backdrop-blur-sm border border-white/20 font-bold"
        />
      </FadeIn>
    </div>
  );
}
