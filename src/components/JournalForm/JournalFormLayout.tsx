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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Form Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6  ">
          <ThoughtsSection />
          <YesterdaySection />
          <GratitudeSection />
          <LifeRatingSection />
          <ThinkOutSideTheBoxSection />
        </div>
        {/* Right Column */}
        <div className="space-y-6  ">
          <MaintenanceSection />
          <DailyQuoteSection />
          <ScheduleSection />
          <GoalsSection />
        </div>
      </div>
    </div>
  );
};

export default JournalFormLayout;
