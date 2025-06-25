interface GoalsSectionProps {
  dreamGoals: {
    small: string;
    big: string;
  };
  onDreamGoalsChange: (dreamGoals: { small: string; big: string }) => void;
  achievementIdeas: string[];
  onAchievementIdeasChange: (achievementIdeas: string[]) => void;
}

const GoalsSection = ({
  dreamGoals,
  onDreamGoalsChange,
  achievementIdeas,
  onAchievementIdeasChange,
}: GoalsSectionProps): JSX.Element => {
  return (
    <div className="space-y-4">
      {/* Dream Come True Section */}
      <div className="border-2 border-gray-400">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
          <h3 className="font-bold text-sm">Dream Come True</h3>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-xs italic text-gray-600">
                Small goals - this week/months{" "}
                <textarea
                  value={dreamGoals.small}
                  onChange={(e) =>
                    onDreamGoalsChange({
                      ...dreamGoals,
                      small: e.target.value,
                    })
                  }
                  className="w-full h-16 resize-none bg-transparent focus:outline-none text-xs leading-relaxed border border-gray-200 p-2"
                  placeholder="Short-term goals..."
                />
              </label>
            </div>
            <div>
              <label className="text-xs italic text-gray-600">
                Big goals - this year, decade{""}
                <textarea
                  value={dreamGoals.big}
                  onChange={(e) =>
                    onDreamGoalsChange({ ...dreamGoals, big: e.target.value })
                  }
                  className="w-full h-16 resize-none bg-transparent focus:outline-none text-xs leading-relaxed border border-gray-200 p-2"
                  placeholder="Long-term goals..."
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 20 Ideas Section */}
      <div className="border-2 border-gray-400">
        <div className="flex justify-between bg-gray-100 px-3 py-2 border-b border-gray-400">
          <h3 className="font-bold text-sm">20 Ideas to Achieve My Goals</h3>
          <button
            type="button"
            onClick={() => onAchievementIdeasChange([...achievementIdeas, ""])}
            className="text-xs text-blue-500 hover:underline"
          >
            + Add Idea
          </button>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {achievementIdeas.map((idea, i) => (
              <div key={idea[i]} className="flex items-center space-x-2">
                <span className="text-xs w-5">{i + 1}.</span>
                <input
                  placeholder="Idea"
                  type="text"
                  value={idea}
                  onChange={(e) => {
                    const updated = [...achievementIdeas];
                    updated[i] = e.target.value;
                    onAchievementIdeasChange(updated);
                  }}
                  className="w-full text-xs bg-transparent border border-gray-300 rounded px-1 py-0.5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsSection;
