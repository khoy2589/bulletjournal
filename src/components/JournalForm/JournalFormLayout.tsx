import { useState } from "react";

// Left Column
import GratitudeSection from "./section/leftcol/GratitudeSection";
import LifeRatingSection from "./section/leftcol/LifeRatingSection";
import ThoughtsSection from "./section/leftcol/ThoughtsSection";
import YesterdaySection from "./section/leftcol/YesterdaySection";

// Right Column
import DailyQuoteSection from "./section/rightcol/DailyQuoteSection";
import MaintenanceSection from "./section/rightcol/MaintenanceSection";
import ScheduleSection from "./section/rightcol/ScheduleSection";
import GoalsSection from "./section/rightcol/GoalsSection";
import ThinkOutSideTheBoxSection from "./section/leftcol/ThinkOutSideTheBoxSection";
import CalendaHeader from "./CalendaHeader";

const JournalFormLayout = () => {
  const [sleepHours, setSleepHours] = useState("");
  const [mood, setMood] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [yesterdayBest, setYesterdayBest] = useState("");
  const [grateful, setGrateful] = useState("");

  const [ratings, setRatings] = useState({
    selfLove: "",
    mindfulness: "",
    confident: "",
    health: "",
    relationship: "",
    creativity: "",
    career: "",
    financial: "",
  });
  const [improvement, setImprovement] = useState("");

  const handleRatingChange = (key: keyof typeof ratings, value: string) => {
    setRatings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="">
      <CalendaHeader
        sleepHours={sleepHours}
        mood={mood}
        onSleepHoursChange={setSleepHours}
        onMoodChange={setMood}
      />
      <div className="max-w-6xl mx-auto px-4 py-6 ">
        {/* Form Grid Layout */}
        <div className="grid grid-cols-4 gap-6 md:grid-cols-2 ">
          <ThoughtsSection value={thoughts} onThoughtsChange={setThoughts} />
          <YesterdaySection
            value={yesterdayBest}
            onYesterdayBestChange={setYesterdayBest}
          />
          <GratitudeSection value={grateful} onGratitudeChange={setGrateful} />
          <LifeRatingSection
            ratings={ratings}
            onRatingsChange={handleRatingChange}
            improvement={improvement}
            onImprovementChange={setImprovement}
          />

          <MaintenanceSection />
          <DailyQuoteSection />
          <ScheduleSection />
          <GoalsSection />
        </div>

        <div className="mt-6">
          {/* Bottom Row */}
          <ThinkOutSideTheBoxSection />
        </div>
      </div>
    </div>
  );
};

export default JournalFormLayout;
