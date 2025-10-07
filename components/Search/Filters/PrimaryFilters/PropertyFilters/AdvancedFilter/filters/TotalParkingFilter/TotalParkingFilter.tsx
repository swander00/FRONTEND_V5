"use client";

import { useState, useEffect } from 'react';
import { ParkingCircle } from 'lucide-react';
import { RangeSliderWithInputs } from '@/components/ui/Data';

export default function TotalParkingFilter() {
  const [minSpaces, setMinSpaces] = useState(0);
  const [maxSpaces, setMaxSpaces] = useState(15);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  const MIN_LIMIT = 0;
  const MAX_LIMIT = 15;

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMinInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue <= maxSpaces && numValue >= MIN_LIMIT && numValue <= MAX_LIMIT) {
      setMinSpaces(numValue);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMaxInput(value);
    const numValue = parseInt(value) || MAX_LIMIT;
    if (numValue >= minSpaces && numValue >= MIN_LIMIT && numValue <= MAX_LIMIT) {
      setMaxSpaces(numValue);
    }
  };

  const handleMinInputBlur = () => {
    setMinInput(minSpaces.toString());
  };

  const handleMaxInputBlur = () => {
    setMaxInput(maxSpaces.toString());
  };

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxSpaces) {
      setMinSpaces(value);
      setMinInput(value.toString());
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minSpaces) {
      setMaxSpaces(value);
      setMaxInput(value.toString());
    }
  };

  const handleReset = () => {
    setMinSpaces(MIN_LIMIT);
    setMaxSpaces(MAX_LIMIT);
    setMinInput('');
    setMaxInput('');
  };

  // Initialize input values
  useEffect(() => {
    setMinInput(minSpaces.toString());
    setMaxInput(maxSpaces.toString());
  }, [minSpaces, maxSpaces]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg flex items-center justify-center shadow-lg">
          <ParkingCircle className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Total Parking</h3>
          <p className="text-sm text-gray-500">Set total parking spaces range</p>
        </div>
      </div>
      <RangeSliderWithInputs
        min={MIN_LIMIT}
        max={MAX_LIMIT}
        step={1}
        value={[minSpaces, maxSpaces]}
        onChange={([min, max]) => { setMinSpaces(min); setMaxSpaces(max); }}
        formatValue={n => `${n} spaces`}
      />
      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-[1.02]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}