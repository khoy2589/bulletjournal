import { useState } from "react";

const ScheduleSection = () => {
  const [schedule, setSchedule] = useState("");
  const [rewards, setRewards] = useState("");

  return (
    <div className="border-2 border-gray-400">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Today's Schedule</h3>
      </div>
      <div className="p-3">
        <textarea
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="w-full h-32 resize-none bg-transparent focus:outline-none text-sm leading-relaxed"
          placeholder="Plan your day..."
        />

        <div className="border-t border-gray-300 pt-3 mt-3">
          <div className="bg-gray-50 px-2 py-1 mb-2">
            <span className="text-xs font-semibold">
              Rewards to myself after:
            </span>
          </div>
          <textarea
            value={rewards}
            onChange={(e) => setRewards(e.target.value)}
            className="w-full h-16 resize-none bg-transparent focus:outline-none text-xs leading-relaxed"
            placeholder="How will you reward yourself?"
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;
