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

const JournalFormLayout = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 ">
      {/* Form Grid Layout */}
      <div className="grid grid-cols-4 gap-6 md:grid-cols-2 ">
        {/* Left Column */}

        <ThoughtsSection />
        <YesterdaySection />
        <GratitudeSection />
        <LifeRatingSection />

        {/* Right Column */}
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
  );
};

export default JournalFormLayout;
