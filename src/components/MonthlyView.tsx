import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const MonthlyView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const sampleEvents = {
    15: ["Team meeting", "Dentist appointment"],
    22: ["Birthday party"],
    28: ["Project deadline"],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-journal-stone flex items-center gap-3">
            <CalendarIcon size={28} className="text-journal-sage" />
            Monthly Overview
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="px-4 py-2 rounded-xl bg-journal-cream-dark text-journal-stone hover:bg-journal-sage/10 transition-colors duration-200"
            >
              ←
            </button>
            <h3 className="text-xl font-semibold text-journal-stone min-w-[200px] text-center">
              {monthName}
            </h3>
            <button
              onClick={() => navigateMonth("next")}
              className="px-4 py-2 rounded-xl bg-journal-cream-dark text-journal-stone hover:bg-journal-sage/10 transition-colors duration-200"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-journal-stone/70 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div
              key={day.index}
              className={`
                aspect-square p-2 rounded-xl border border-transparent transition-all duration-200
                ${day ? "hover:bg-journal-sage/10 cursor-pointer" : ""}
                ${
                  isToday(day)
                    ? "bg-journal-sage text-white shadow-md"
                    : "bg-journal-cream-dark/30"
                }
              `}
            >
              {day && (
                <div className="h-full flex flex-col">
                  <div
                    className={`font-semibold mb-1 ${
                      isToday(day) ? "text-white" : "text-journal-stone"
                    }`}
                  >
                    {day}
                  </div>

                  {/* Sample events */}
                  {sampleEvents[day as keyof typeof sampleEvents] && (
                    <div className="space-y-1 flex-1">
                      {sampleEvents[day as keyof typeof sampleEvents].map(
                        (event, i) => (
                          <div
                            key={event[i]}
                            className={`
                            text-xs px-2 py-1 rounded-md truncate
                            ${
                              isToday(day)
                                ? "bg-white/20 text-white"
                                : "bg-journal-lavender/20 text-journal-stone"
                            }
                          `}
                            title={event}
                          >
                            {event}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Goals */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-journal-stone mb-4">
          Monthly Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Complete project Alpha",
            "Read 2 books",
            "Exercise 15 times",
            "Learn new skill",
          ].map((goal, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-journal-cream-dark/50"
            >
              <div className="w-4 h-4 border-2 border-journal-sage rounded"></div>
              <span className="text-journal-stone">{goal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
