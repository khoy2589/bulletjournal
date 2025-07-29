interface GoalsSectionProps {
  dreamGoals: {
    small: string;
    big: string;
  };
  onDreamGoalsChange: (dreamGoals: { small: string; big: string }) => void;
}

const GoalsSection = ({
  dreamGoals,
  onDreamGoalsChange,
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
    </div>
  );
};

export default GoalsSection;
