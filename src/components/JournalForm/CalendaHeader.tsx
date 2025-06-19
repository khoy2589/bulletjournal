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
    <div className="border-b-2 border-gray-300 pb-4">
      <div className="flex flex-wrap justify-between items-center">
        {/* Date Picker */}
        <div className="flex ">
          <span className="font-semibold">Date:</span>
          <DatePicker
            selected={selectDate}
            onChange={(date: Date | null) => Date && setSelectDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border-b border-none bg-transparent focus:outline-none focus:border-blue-500 px-1"
          />
        </div>

        {/* Days of the Week */}
        <div className="flex justify-center gap-2">
          {days.map((day, index) => (
            <button
              key={day}
              className={`w-8 h-8 text-xs font-medium rounded border ${
                index === currentDay
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Sleep & Mood */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Sleep:</span>
            <input
              type="text"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-14 border-b border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 text-center"
              placeholder="8"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Mood:</span>
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
