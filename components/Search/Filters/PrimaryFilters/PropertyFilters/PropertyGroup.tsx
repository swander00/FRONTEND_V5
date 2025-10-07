"use client";

import { useState } from 'react';
import CityButton from './City/CityButton';
import TypeButton from './Type/TypeButton';
import PriceButton from './Price/PriceButton';
import BedButton from './Bed/BedButton';
import BathButton from './Bath/BathButton';

export default function PropertyGroup() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  return (
    <div className="flex items-center">
      <CityButton 
        isOpen={openDropdown === 'city'}
        onToggle={() => handleDropdownToggle('city')}
        onClose={handleDropdownClose}
      />
      <TypeButton 
        isOpen={openDropdown === 'type'}
        onToggle={() => handleDropdownToggle('type')}
        onClose={handleDropdownClose}
      />
      <PriceButton 
        isOpen={openDropdown === 'price'}
        onToggle={() => handleDropdownToggle('price')}
        onClose={handleDropdownClose}
      />
      <BedButton 
        isOpen={openDropdown === 'bed'}
        onToggle={() => handleDropdownToggle('bed')}
        onClose={handleDropdownClose}
      />
      <BathButton 
        isOpen={openDropdown === 'bath'}
        onToggle={() => handleDropdownToggle('bath')}
        onClose={handleDropdownClose}
      />
    </div>
  );
}