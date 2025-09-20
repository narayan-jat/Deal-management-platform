import React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  disabled = false,
  className,
  id,
  name
}) => {
  const formatValue = (val: number): string => {
    if (val === 0) return '';
    
    // Check if the value has decimal places
    const hasDecimals = val % 1 !== 0;
    
    if (hasDecimals) {
      // Format with 2 decimal places
      return val.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      // Format without decimal places
      return val.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
  };

  const parseValue = (inputValue: string): number => {
    // Remove all non-numeric characters except decimal point
    let cleaned = inputValue.replace(/[^0-9.]/g, '');
    
    // Handle multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      // Keep only the first decimal point
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    const parsed = parseFloat(cleaned) || 0;
    return parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseValue(inputValue);
    onChange(parsedValue);
  };

  const handleBlur = () => {
    // Ensure proper formatting on blur
    const formatted = formatValue(value);
    // This will trigger a re-render with the formatted value
  };

  return (
    <Input
      id={id}
      name={name}
      type="text"
      value={formatValue(value)}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={cn("text-right", className)}
    />
  );
};
