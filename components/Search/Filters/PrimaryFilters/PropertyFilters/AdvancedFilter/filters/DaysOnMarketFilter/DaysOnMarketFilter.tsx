"use client";

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { RangeSliderWithInputs } from '@/components/ui/Data';

export default function DaysOnMarketFilter() {
  const [minDays, setMinDays] = useState(0);
  const [maxDays, setMaxDays] = useState(365);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  const MIN_LIMIT = 0;
  const MAX_LIMIT = 365;

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMinInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue <= maxDays && numValue >= MIN_LIMIT && numValue <= MAX_LIMIT) {
      setMinDays(numValue);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMaxInput(value);
    const numValue = parseInt(value) || MAX_LIMIT;
    if (numValue >= minDays && numValue >= MIN_LIMIT && numValue <= MAX_LIMIT) {
      setMaxDays(numValue);
    }
  };

  const handleMinInputBlur = () => {
    setMinInput(minDays.toString());
  };

  const handleMaxInputBlur = () => {
    setMaxInput(maxDays.toString());
  };

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxDays) {
      setMinDays(value);
      setMinInput(value.toString());
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minDays) {
      setMaxDays(value);
      setMaxInput(value.toString());
    }
  };

  const handleReset = () => {
    setMinDays(MIN_LIMIT);
    setMaxDays(MAX_LIMIT);
    setMinInput('');
    setMaxInput('');
  };

  // Initialize input values
  useEffect(() => {
    setMinInput(minDays.toString());
    setMaxInput(maxDays.toString());
  }, [minDays, maxDays]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
          <Calendar className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Days on Market</h3>
          <p className="text-sm text-gray-500">Set listing duration range</p>
        </div>
      </div>
      <RangeSliderWithInputs
        min={MIN_LIMIT}
        max={MAX_LIMIT}
        step={1}
        value={[minDays, maxDays]}
        onChange={([min, max]) => { setMinDays(min); setMaxDays(max); }}
        formatValue={n => `${n} days`}
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