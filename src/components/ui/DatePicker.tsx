import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  dateFormat?: string;
}

export const CustomDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  required = false,
  className,
  minDate,
  maxDate,
  showTimeSelect = false,
  dateFormat = "MM/dd/yyyy"
}) => {
  const selectedDate = (() => {
    if (!value || value.trim() === '') return null;
    
    // Handle YYYY-MM-DD format specifically
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    
    // Fallback to regular Date parsing
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })();

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Convert to YYYY-MM-DD format for storage
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      onChange(formattedDate);
    } else {
      onChange('');
    }
  };

  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText={placeholder}
        disabled={disabled}
        required={required}
        minDate={minDate}
        maxDate={maxDate}
        showTimeSelect={showTimeSelect}
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat={showTimeSelect ? "MM/dd/yyyy h:mm aa" : dateFormat}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        wrapperClassName="w-full"
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

