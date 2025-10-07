"use client";

import { useState } from 'react';
import AllTimeButton from './AllTimeButton';
import AllTimeDropdown from './AllTimeDropdown';

interface AllTimeProps {
  selectedStatus: string;
}

export default function AllTime({ selectedStatus }: AllTimeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('All Time');

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <AllTimeButton
        isOpen={isOpen}
        selectedPeriod={selectedPeriod}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <AllTimeDropdown
          onPeriodSelect={handlePeriodSelect}
          onClose={() => setIsOpen(false)}
          selectedPeriod={selectedPeriod}
          selectedStatus={selectedStatus}
        />
      )}
    </div>
  );
}