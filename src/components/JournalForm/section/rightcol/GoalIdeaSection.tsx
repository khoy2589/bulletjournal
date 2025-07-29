interface GoalIdeaSectionProps {
  achievementIdeas: string[];
  onAchievementIdeasChange: (achievementIdeas: string[]) => void;
}

const GoalIdeaSection = ({
  achievementIdeas,
  onAchievementIdeasChange,
}: GoalIdeaSectionProps): JSX.Element => {
  return (
    <div className="space-y-4">
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
              <div key={i} className="flex items-center space-x-2">
                <span className="text-xs w-5">{i + 1}.</span>
                <input
                  placeholder="Goal Done By..."
                  type="text"
                  value={idea}
                  onChange={(e) => {
                    const updated = [...achievementIdeas];
                    updated[i] = e.target.value;
                    onAchievementIdeasChange(updated);
                  }}
                  className="focus:outline-none w-full text-xs bg-transparent border border-gray-300 rounded px-1 py-0.5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalIdeaSection;
