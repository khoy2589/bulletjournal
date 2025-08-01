import React, { useState, useEffect, useCallback } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

type EventItem = {
  summary: string;
  start: { date?: string; dateTime?: string };
};

const MonthlyView: React.FC = () => {
  const [events, setEvents] = useState<Record<number, string[]>>({});
  const [currentDate, setCurrentDate] = useState(new Date());

  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [deleted, setDeleted] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goal.trim() === "") return;
    setGoals((goals) => [...goals, goal]);
    setGoal("");
  };
  const handleComplete = (index) => {
    const completedGoal = goals[index];
    setCompleted([...completed, completedGoal]);
    setGoals(goals.filter((_, i) => i !== index));
  };
  const handleDelete = (index) => {
    // ทำให้ function นี้ใช้ได้หรือลบทิ้ง
    const deletedGoal = goals[index];
    console.log("deletedGoal");
  };

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

  const days: (number | null)[] = [];

  for (let i = 0; i < startingDay; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);

  const fetchEvents = useCallback(
    async (accessToken: string) => {
      const startOfMonth = new Date(year, month, 1).toISOString();
      const endOfMonth = new Date(year, month + 1, 0).toISOString();

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfMonth}&timeMax=${endOfMonth}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await res.json();
      const items: EventItem[] = data.items ?? "[]";

      const grouped: Record<number, string[]> = {};
      items.forEach((event) => {
        const dateStr = event.start.dateTime ?? event.start.date;
        if (dateStr) {
          const date = new Date(dateStr);
          const day = date.getDate();
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(event.summary);
        }
      });

      setEvents(grouped);
    },
    [year, month],
  );

  useEffect(() => {
    const tokenClient = (
      window as Window
    ).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response: TokenResponse) => {
        fetchEvents(response.access_token);
      },
    });
    tokenClient.requestAccessToken();
  }, [currentDate, fetchEvents]);

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
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

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const key = day ? `day-${day}` : `empty-${index}`;
            return (
              <div
                key={key}
                className={`aspect-square p-2 rounded-xl border border-transparent transition-all duration-200
                ${day ? "hover:bg-journal-sage/10 cursor-pointer" : ""}
                ${
                  isToday(day)
                    ? "bg-journal-sage text-white shadow-md"
                    : "bg-journal-cream-dark/30"
                }`}
              >
                {Boolean(day) && (
                  <div className="h-full flex flex-col">
                    <div
                      className={`font-semibold mb-1 ${
                        isToday(day) ? "text-white" : "text-journal-stone"
                      }`}
                    >
                      {day}
                    </div>
                    {events[day] && (
                      <div className="space-y-1 flex-1">
                        {events[day].map((eventTitle) => (
                          <div
                            key={`${day}-${eventTitle}`}
                            className={`text-xs px-2 py-1 rounded-md truncate
                            ${
                              isToday(day)
                                ? "bg-white/20 text-white"
                                : "bg-journal-lavender/20 text-journal-stone"
                            }`}
                            title={eventTitle}
                          >
                            {eventTitle}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Goals */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 space-y-4">
        <h3 className="text-xl font-semibold text-journal-stone">
          Monthly Goals
        </h3>

        <form className=" flex gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="flex-1 px-3 bg-none border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-journal-sage focus:border-transparent py-1 text-sm font-medium"
            placeholder="What will you achieve in this month?"
          />
          <button
            type="submit"
            className="w-1/6 px-4 py-2 rounded-xl bg-journal-cream-dark text-journal-stone hover:bg-journal-sage/10 transition-colors duration-200"
          >
            Register
          </button>
        </form>

        {/* Goal List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal, index) => (
            <div
              key={`${goal}-${index}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-journal-cream-dark/50"
            >
              <input
                type="checkbox"
                placeholder="Completed"
                className="w-4 h-4  accent-journal-sage rounded bg-none"
                onChange={() => handleComplete(index)}
              />

              <span className="text-journal-stone">{goal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
