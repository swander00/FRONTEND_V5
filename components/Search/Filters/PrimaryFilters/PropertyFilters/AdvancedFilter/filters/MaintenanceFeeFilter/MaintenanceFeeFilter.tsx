"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { RangeSliderWithInputs } from '@/components/ui/Data';

export default function MaintenanceFeeFilter() {
  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(2000);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  const MIN_LIMIT = 0;
  const MAX_LIMIT = 2000;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatInputCurrency = (value: number) => {
    return value.toLocaleString('en-CA');
  };

  const parseInputCurrency = (value: string) => {
    return parseInt(value.replace(/[,$]/g, '')) || 0;
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMinInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue <= maxFee && numValue >= MIN_LIMIT && numValue <= MAX_LIMIT) {
      setMinFee(numValue);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMaxInput(value);
    const numValue = parseInt(value) || MAX_LIMIT;
    if (numValue >= minFee && numValue >= MIN_LIMIT && numValue <= MAX_LIMIT) {
      setMaxFee(numValue);
    }
  };

  const handleMinInputBlur = () => {
    setMinInput(formatInputCurrency(minFee));
  };

  const handleMaxInputBlur = () => {
    setMaxInput(formatInputCurrency(maxFee));
  };

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxFee) {
      setMinFee(value);
      setMinInput(formatInputCurrency(value));
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minFee) {
      setMaxFee(value);
      setMaxInput(formatInputCurrency(value));
    }
  };

  const handleReset = () => {
    setMinFee(MIN_LIMIT);
    setMaxFee(MAX_LIMIT);
    setMinInput('');
    setMaxInput('');
  };

  // Initialize input values
  React.useEffect(() => {
    setMinInput(minFee.toString());
    setMaxInput(maxFee.toString());
  }, [minFee, maxFee]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
          <DollarSign className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Maintenance Fee</h3>
          <p className="text-sm text-gray-500">Set monthly maintenance fee range</p>
        </div>
      </div>
      <RangeSliderWithInputs
        min={MIN_LIMIT}
        max={MAX_LIMIT}
        step={25}
        value={[minFee, maxFee]}
        onChange={([min, max]) => { setMinFee(min); setMaxFee(max); }}
        formatValue={formatCurrency}
        formatInput={formatInputCurrency}
        parseInput={parseInputCurrency}
        unitLabel="/mo"
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