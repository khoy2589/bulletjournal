interface LifeRatingSectionProps {
  ratings: {
    selfLove: string;
    mindfulness: string;
    confident: string;
    health: string;
    relationship: string;
    creativity: string;
    career: string;
    financial: string;
  };
  onRatingsChange: (
    key: keyof LifeRatingSectionProps["ratings"],
    value: string,
  ) => void;
  improvement: string;
  onImprovementChange: (improvement: string) => void;
}

const LifeRatingSection = ({
  ratings,
  onRatingsChange,
  improvement,
  onImprovementChange,
}: LifeRatingSectionProps) => {
  return (
    <div className="border-2 border-gray-400">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Rate My Life On 10</h3>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          {[
            { key: "selfLove", label: "Self-love:" },
            { key: "mindfulness", label: "Mindfulness:" },
            { key: "confident", label: "Confident:" },
            { key: "health", label: "Health:" },
            { key: "relationship", label: "Relationship:" },
            { key: "creativity", label: "Creativity:" },
            { key: "career", label: "Career:" },
            { key: "financial", label: "Financial:" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span>{item.label}</span>
              <input
                placeholder="0-10"
                type="text"
                value={ratings[item.key]}
                onChange={(e) =>
                  onRatingsChange(
                    item.key as keyof LifeRatingSectionProps["ratings"],
                    e.target.value,
                  )
                }
                className="w-8 text-center border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                maxLength={2}
              />
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-3">
          <h4 className="font-semibold text-xs mb-2">How Can I Improve?</h4>
          <textarea
            value={improvement}
            onChange={(e) => onImprovementChange(e.target.value)}
            className="w-full h-16 resize-none bg-transparent focus:outline-none text-xs leading-relaxed"
            placeholder="Areas for improvement..."
          />
        </div>
      </div>
    </div>
  );
};

export default LifeRatingSection;
