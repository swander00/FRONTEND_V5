import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui';

interface RangeSliderWithInputsProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  label?: string;
  icon?: React.ReactNode;
  formatValue?: (n: number) => string;
  formatInput?: (n: number) => string;
  parseInput?: (s: string) => number;
  unitLabel?: string;
}

export const RangeSliderWithInputs: React.FC<RangeSliderWithInputsProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  label,
  icon,
  formatValue = n => n.toString(),
  formatInput = n => n.toString(),
  parseInput = s => parseInt(s.replace(/[^0-9]/g, '')) || 0,
  unitLabel = '',
}) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const [minInput, setMinInput] = useState(formatInput(value[0]));
  const [maxInput, setMaxInput] = useState(formatInput(value[1]));

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    setMinInput(formatInput(value[0]));
    setMaxInput(formatInput(value[1]));
  }, [value, formatInput]);

  const handleSliderChange = ([newMin, newMax]: [number, number]) => {
    setMinVal(newMin);
    setMaxVal(newMax);
    setMinInput(formatInput(newMin));
    setMaxInput(formatInput(newMax));
    onChange([newMin, newMax]);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInput(e.target.value);
    setMinInput(e.target.value);
    if (val <= maxVal && val >= min && val <= max) {
      setMinVal(val);
      onChange([val, maxVal]);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInput(e.target.value);
    setMaxInput(e.target.value);
    if (val >= minVal && val >= min && val <= max) {
      setMaxVal(val);
      onChange([minVal, val]);
    }
  };

  const handleMinInputBlur = () => {
    setMinInput(formatInput(minVal));
  };
  const handleMaxInputBlur = () => {
    setMaxInput(formatInput(maxVal));
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center gap-3 mb-2">
          {icon && <div className="w-8 h-8 flex items-center justify-center">{icon}</div>}
          <div>
            <h3 className="text-base font-semibold text-gray-800">{label}</h3>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Minimum</label>
          <input
            type="text"
            value={minInput}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            placeholder={formatInput(min)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Maximum</label>
          <input
            type="text"
            value={maxInput}
            onChange={handleMaxInputChange}
            onBlur={handleMaxInputBlur}
            placeholder={formatInput(max)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
          />
        </div>
      </div>
      <div>
        <Slider
          min={min}
          max={max}
          step={step}
          value={[minVal, maxVal]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex justify-between text-sm font-medium text-gray-600 mt-2">
          <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-lg">{formatValue(minVal)}{unitLabel}</span>
          <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-lg">{formatValue(maxVal)}{unitLabel}</span>
        </div>
      </div>
    </div>
  );
};
