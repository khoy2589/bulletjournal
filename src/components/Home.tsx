
import React, { useState } from "react";
import { Calendar, Plus, BookOpen, Target, Star } from "lucide-react";
import DailyLog from "./DailyLog";
import MonthlyView from "./MonthlyView";
import FutureLog from "./FutureLog";
import Collections from "./Collections";
import Navigation from "./Navigation";
import DailyQuote from "./DailyQuote";

type View = "daily" | "monthly" | "future" | "collections";

const Home: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("daily");

  const renderCurrentView = () => {
    switch (currentView) {
      case "daily":
        return <DailyLog />;
      case "monthly":
        return <MonthlyView />;
      case "future":
        return <FutureLog />;
      case "collections":
        return <Collections />;
      default:
        return <DailyLog />;
    }
  };

  return (
    <div className="min-h-screen journal-gradient">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-journal-stone mb-2">
            Digital Bullet Journal
          </h1>
          <p className="text-journal-stone/70 text-lg">
            Mindful planning for a meaningful life
          </p>
        </header>

        {/* Daily Quote */}
        <DailyQuote />

        {/* Navigation */}
        <Navigation currentView={currentView} onViewChange={setCurrentView} />

        {/* Main Content */}
        <main className="mt-8">
          <div className="animate-fade-in">{renderCurrentView()}</div>
        </main>
      </div>
    </div>
  );
};

export default Home;
