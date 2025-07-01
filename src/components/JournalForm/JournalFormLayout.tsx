import { useRef, useState } from "react";

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
import CalendarHeader from "./CalendarHeader";

import { supabase } from "@/lib/supabase";

// Define interfaces for component refs
interface MaintenanceRef {
  getItems: () => Array<{ id: string; label: string; completed: boolean }>;
}

interface ScheduleRef {
  getItems: () => Array<{ id: string; time: string; activity: string }>;
}

interface GoalsRef {
  getItems: () => Array<{ id: string; goal: string; completed: boolean }>;
}

interface QuoteRef {
  getQuote: () => string;
}

interface ThinkOutsideRef {
  getContent: () => string;
}

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

  // Refs to get data from child components
  const maintenanceRef = useRef<MaintenanceRef>(null);
  const scheduleRef = useRef<ScheduleRef>(null);
  const goalsRef = useRef<GoalsRef>(null);
  const [creativity, setCreativity] = useState("");

  const [todaySchedule, setTodaySchedule] = useState("");
  const [reward, setReward] = useState("");

  const [dreamGoals, setDreamGoals] = useState({
    small: "",
    big: "",
  });

  const [achievementIdeas, setAchievementIdeas] = useState<string[]>([""]);

  const handleRatingChange = (key: keyof typeof ratings, value: string) => {
    setRatings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const exportToCSV = async () => {
    const currentDate = new Date().toISOString().split("T")[0];

    const csvData = [
      // Header row
      ["Field", "Value"],
      // Data rows
      ["Date", currentDate],
      ["Sleep Hours", sleepHours],
      ["Mood", mood],

      ["Thoughts", thoughts.replace(/,/g, ";")], // Replace commas to avoid CSV issues
      ["Yesterday Best", yesterdayBest.replace(/,/g, ";")],

      ["Grateful For", grateful.replace(/,/g, ";")],
      ["Self Love Rating", ratings.selfLove],

      ["Mindfulness Rating", ratings.mindfulness],
      ["Confidence Rating", ratings.confident],

      ["Health Rating", ratings.health],
      ["Relationship Rating", ratings.relationship],

      ["Creativity Rating", ratings.creativity],
      ["Career Rating", ratings.career],

      ["Financial Rating", ratings.financial],
      ["Areas for Improvement", improvement.replace(/,/g, ";")],

      [
        "Maintenance Plan",
        maintenanceRef.current
          ?.getItems()
          .map((item) => item.label)
          .join(";") || "No items",
      ],

      // today schdule, reward to myself after
      ["Today's Schedule", todaySchedule.replace(/,/g, ";")],
      ["Reward to Myself After", reward.replace(/,/g, ";")],

      // dream come true(small, big)
      ["Dream Come True (Small)", dreamGoals.small.replace(/,/g, ";")],
      ["Dream Come True (Big)", dreamGoals.big.replace(/,/g, ";")],

      // 20 Idea
      ["20 Ideas", achievementIdeas.join(";")],

      ["Think Outside Box", creativity.replace(/,/g, ";")],
    ];

    // Add goals
    const goals = goalsRef.current?.getItems() || [];
    goals.forEach((goal, index) => {
      csvData.push([`Goal ${index + 1}`, goal.goal]);
    });

    // Add schedule
    const schedule = scheduleRef.current?.getItems() || [];
    schedule.forEach((item, index) => {
      csvData.push([`Schedule ${index + 1}`, `${item.time}: ${item.activity}`]);
    });

    // Convert to CSV string
    const csvContent = csvData
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");
    // Save to localStorage
    localStorage.setItem(`journal_${currentDate}.csv`, csvContent);

    const fileName = `journal_${currentDate}.csv`;

    // Download file
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const file = new File([blob], fileName, {
      type: "text/csv",
    });

    // Upload to Supabase Storage (bucket: "exports")
    const { error } = await supabase.storage
      .from("exports")
      .upload(fileName, file, {
        upsert: true,
        contentType: "text/csv",
      });

    if (error) {
      console.error("Upload failed:", error.message);
    } else {
      console.log("Upload successful");
    }

    // Create download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `journal_${currentDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="">
      <CalendarHeader
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

          <MaintenanceSection ref={maintenanceRef} />
          <DailyQuoteSection />
          <ScheduleSection
            schedule={todaySchedule}
            onScheduleChange={setTodaySchedule}
            rewards={reward}
            onRewardsChange={setReward}
          />
          <GoalsSection
            dreamGoals={dreamGoals}
            onDreamGoalsChange={setDreamGoals}
            achievementIdeas={achievementIdeas}
            onAchievementIdeasChange={setAchievementIdeas}
          />
        </div>

        {/* Bottom Row */}
        <div className="mt-6">
          <ThinkOutSideTheBoxSection
            creativity={creativity}
            onCreativityChange={setCreativity}
          />
        </div>
      </div>

      {/* Export Button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={exportToCSV}
            className="bg-journal-sage hover:bg-journal-sage-dark text-white transition-colors duration-200 px-4 py-2 rounded-md text-s font-medium"
          >
            📊 Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalFormLayout;
