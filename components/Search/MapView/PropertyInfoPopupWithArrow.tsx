'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Property } from '@/types';
import { PropertyInfoPopup } from './PropertyInfoPopup';
import { cn } from '@/lib/utils';

interface PropertyInfoPopupWithArrowProps {
  property: Property;
  onClose?: () => void;
  onViewDetails?: (property: Property) => void;
  className?: string;
  // Positioning props
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: number;
}

export const PropertyInfoPopupWithArrow: React.FC<PropertyInfoPopupWithArrowProps> = ({
  property,
  onClose,
  onViewDetails,
  className,
  position = 'auto',
  offset = 12
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const [popupStyles, setPopupStyles] = useState<React.CSSProperties>({});

  // Calculate optimal position based on viewport
  useEffect(() => {
    if (position === 'auto' && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Determine best position based on available space
      let newPosition: 'auto' | 'top' | 'right' | 'left' | 'bottom' = 'bottom';
      
      if (rect.top < 200) {
        newPosition = 'bottom';
      } else if (rect.bottom > viewport.height - 200) {
        newPosition = 'top';
      } else if (rect.left < 200) {
        newPosition = 'right';
      } else if (rect.right > viewport.width - 200) {
        newPosition = 'left';
      }

      setCalculatedPosition(newPosition);
    }
  }, [position]);

  // Calculate popup positioning styles
  useEffect(() => {
    const finalPosition = calculatedPosition;
    let styles: React.CSSProperties = {};

    switch (finalPosition) {
      case 'top':
        styles = {
          transform: `translateY(calc(-100% - ${offset}px))`,
          transformOrigin: 'bottom center'
        };
        break;
      case 'bottom':
        styles = {
          transform: `translateY(${offset}px)`,
          transformOrigin: 'top center'
        };
        break;
      case 'left':
        styles = {
          transform: `translateX(calc(-100% - ${offset}px))`,
          transformOrigin: 'right center'
        };
        break;
      case 'right':
        styles = {
          transform: `translateX(${offset}px)`,
          transformOrigin: 'left center'
        };
        break;
    }

    setPopupStyles(styles);
  }, [calculatedPosition, offset]);

  const getArrowClasses = () => {
    const baseClasses = "absolute w-4 h-4 bg-white border border-gray-200 rotate-45";
    
    switch (calculatedPosition) {
      case 'top':
        return cn(baseClasses, "bottom-[-8px] left-1/2 -translate-x-1/2 border-r-0 border-b-0");
      case 'bottom':
        return cn(baseClasses, "top-[-8px] left-1/2 -translate-x-1/2 border-l-0 border-t-0");
      case 'left':
        return cn(baseClasses, "right-[-8px] top-1/2 -translate-y-1/2 border-t-0 border-r-0");
      case 'right':
        return cn(baseClasses, "left-[-8px] top-1/2 -translate-y-1/2 border-b-0 border-l-0");
      default:
        return cn(baseClasses, "top-[-8px] left-1/2 -translate-x-1/2 border-l-0 border-t-0");
    }
  };

  return (
    <div
      ref={popupRef}
      className={cn(
        "absolute z-50 transition-all duration-200 ease-in-out",
        className
      )}
      style={popupStyles}
    >
      {/* Arrow */}
      <div className={getArrowClasses()} />
      
      {/* Popup Content */}
      <PropertyInfoPopup
        property={property}
        onClose={onClose}
        onViewDetails={onViewDetails}
        className="relative"
      />
    </div>
  );
};

export default PropertyInfoPopupWithArrow;
