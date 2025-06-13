
import React from 'react';
import { Target, Plus } from 'lucide-react';

const FutureLog: React.FC = () => {
  const upcomingMonths = [];
  const currentDate = new Date();
  
  for (let i = 1; i <= 6; i++) {
    const futureDate = new Date(currentDate);
    futureDate.setMonth(currentDate.getMonth() + i);
    upcomingMonths.push(futureDate);
  }

  const sampleEvents = {
    0: ['Vacation planning', 'Annual review'],
    1: ['Conference attendance', 'Family reunion'],
    2: ['Project launch', 'Birthday celebration'],
    3: ['Course completion'],
    4: ['Holiday preparations'],
    5: ['Year-end goals review'],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-journal-stone flex items-center gap-3">
          <Target size={28} className="text-journal-sage" />
          Future Log
        </h2>
        <p className="text-journal-stone/70 mt-2">
          Plan ahead and track long-term goals
        </p>
      </div>

      {/* Future Months */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingMonths.map((date, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-journal-stone">
                {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button className="p-2 rounded-lg bg-journal-sage/10 text-journal-sage hover:bg-journal-sage/20 transition-colors duration-200">
                <Plus size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {sampleEvents[index as keyof typeof sampleEvents]?.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-journal-lavender-light/30 to-journal-peach-light/30 entry-hover"
                >
                  <div className="w-2 h-2 bg-journal-sage rounded-full"></div>
                  <span className="text-journal-stone text-sm">{event}</span>
                </div>
              )) || (
                <div className="text-journal-stone/50 text-sm italic text-center py-4">
                  No events planned yet
                </div>
              )}
            </div>

            <button className="w-full mt-4 px-4 py-2 rounded-xl border-2 border-dashed border-journal-sage/30 text-journal-sage hover:border-journal-sage hover:bg-journal-sage/5 transition-all duration-200">
              + Add event
            </button>
          </div>
        ))}
      </div>

      {/* Yearly Goals */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-journal-stone mb-4">Yearly Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { goal: 'Read 24 books', progress: 8, total: 24 },
            { goal: 'Learn Spanish', progress: 3, total: 12 },
            { goal: 'Run 500 miles', progress: 127, total: 500 },
            { goal: 'Save $10,000', progress: 3500, total: 10000 },
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-journal-cream-dark/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-journal-stone">{item.goal}</span>
                <span className="text-sm text-journal-stone/70">
                  {item.progress}/{item.total}
                </span>
              </div>
              <div className="w-full bg-journal-sage/20 rounded-full h-2">
                <div
                  className="bg-journal-sage h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.progress / item.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FutureLog;
