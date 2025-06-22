import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendaHeaderProps {
  sleepHours: string;
  mood: string;
  onSleepHoursChange: (sleepHours: string) => void;
  onMoodChange: (mood: string) => void;
}

const CalendaHeader = ({
  sleepHours,
  mood,
  onSleepHoursChange,
  onMoodChange,
}) => {
  const [selectDate, setSelectDate] = useState(new Date());

  const days = ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"];
  const currentDay = new Date().getDay();

  return (
    <div className="border-b-2 border-gray-300 pb-2 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Date Picker */}
        <div className="flex items-center justify-start">
          <span className="font-semibold select-none">Date:</span>
          <DatePicker
            selected={selectDate}
            onChange={(date: Date | null) => date && setSelectDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-none w-32 md:border-t-4 bg-transparent focus:outline-none px-1 "
          />
        </div>

        {/* Days of the Week */}
        <div className="flex justify-center gap-2">
          {days.map((day, index) => (
            <button
              key={day}
              className={`w-10 h-10 text-sm font-medium rounded border transition-all duration-200 select-none ${
                index === currentDay
                  ? "bg-journal-sage text-white shadow-md border-journal-sage/10"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Sleep & Mood */}
        <div className="flex items-center gap-2 justify-end">
          <div className="flex items-center gap-2 ">
            <span className="font-semibold select-none">Sleep:</span>
            <input
              type="number"
              min={0}
              max={24}
              value={sleepHours}
              onChange={(e) => onSleepHoursChange(e.target.value)}
              className="w-17 border-b border-gray-400 bg-transparent  text-center focus:outline-none focus:ring-0"
              placeholder="Hrs"
              list="sleep-hours"
            />
            <datalist id="sleep-hours">
              {[...Array(24)].map((_, hour) => (
                <option key={hour + 1}>{hour + 1}</option>
              ))}
            </datalist>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold select-none">Mood:</span>
            <input
              type="number"
              min={0}
              max={10}
              value={mood}
              onChange={(e) => onMoodChange(e.target.value)}
              className="w-17 border-b border-gray-400 bg-transparent  text-center focus:outline-none focus:ring-0"
              placeholder="Feel"
              list="mood-level" // <-- add this
            />
            <datalist id="mood-level">
              {[...Array(10)].map((_, level) => (
                <option key={level + 1}>{level + 1}</option>
              ))}
            </datalist>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendaHeader;
