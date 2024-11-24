import React, { useState } from "react";

interface TimePickerProps {
  date: string;
  setDate: (newTime: string) => void;
  required?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({ date, setDate, required }) => {
  const [time, setTime] = useState(date || "");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime: string = e.target.value;
    setTime(newTime);
    setDate(newTime);
  };

  return (
    <div className="flex flex-col">
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
