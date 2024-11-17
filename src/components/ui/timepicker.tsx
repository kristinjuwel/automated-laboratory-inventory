import React, { useState } from "react";

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange, required }) => {
  const [time, setTime] = useState(value || "");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onChange(newTime);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex items-center w-full">
        <input
          type="time"
          value={time}
          onChange={handleTimeChange}
          required={required}
          className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-sky-500 focus:ring-sky-500"
        />
      </div>
    </div>
  );
};

export default TimePicker;
