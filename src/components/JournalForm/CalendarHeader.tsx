import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarHeaderProps {
  sleepHours: string;
  mood: string;
  onSleepHoursChange: (sleepHours: string) => void;
  onMoodChange: (mood: string) => void;
}

const CalendarHeader = ({
  sleepHours,
  mood,
  onSleepHoursChange,
  onMoodChange,
}: CalendarHeaderProps): JSX.Element => {
  const [selectDate, setSelectDate] = useState(new Date());

  const days = ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"];
  const currentDay = new Date().getDay();

  return (
    <div className="border-b-2 border-gray-300 pb-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center">
        {/* Date Picker */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <span className="font-semibold select-none whitespace-nowrap">
            Date:
          </span>
          <DatePicker
            selected={selectDate}
            onChange={(date: Date | null) => date && setSelectDate(date)}
            dateFormat="dd / MM / yyyy"
            className="border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-journal-sage px-1 py-1 min-w-28 text-center transition-colors duration-200"
          />
        </div>

        {/* Days of the Week */}
        <div className="flex justify-center gap-1 sm:gap-2 flex-1 min-w-0">
          {days.map((day, index) => (
            <button
              key={day}
              className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium rounded border-2 transition-all duration-200 select-none flex-shrink-0 ${
                index === currentDay
                  ? "bg-journal-sage text-white shadow-md border-journal-sage"
                  : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Sleep & Mood */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-0.5">
            <span className="font-medium select-none whitespace-nowrap text-blue-800 text-s">
              Sleep
            </span>
            <input
              type="number"
              min={0}
              max={24}
              value={sleepHours}
              onChange={(e) => onSleepHoursChange(e.target.value)}
              className="w-10 bg-white border border-blue-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent py-1 text-sm font-medium"
              placeholder="0"
              list="sleep-hours"
            />
          </div>

          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-0.5">
            <span className="font-medium select-none whitespace-nowrap text-green-800 text-s">
              Mood
            </span>
            <input
              type="number"
              min={1}
              max={10}
              value={mood}
              onChange={(e) => onMoodChange(e.target.value)}
              className="w-10 bg-white border border-green-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-1 text-sm font-medium"
              placeholder="0"
              list="mood-level"
            />
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default CalendarHeader;
