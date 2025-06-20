import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendaHeader = () => {
  const [selectDate, setSelectDate] = useState(new Date());
  const [sleepHours, setSleepHours] = useState("");
  const [mood, setMood] = useState("");

  const days = ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"];
  const currentDay = new Date().getDay();

  return (
    <div className="border-b-2 border-gray-300 pb-4 ">
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
              className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 select-none ${
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
          <div className="flex items-center gap-2">
            <span className="font-semibold select-none">Sleep:</span>
            <input
              type="text"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-14 border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 text-center"
              placeholder="8"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold select-none">Mood:</span>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-12 border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 text-center"
              placeholder="7"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendaHeader;
