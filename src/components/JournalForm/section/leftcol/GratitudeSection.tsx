interface GratitudeSectionProps {
  value: string;
  onGratitudeChange: (Gratitude: string) => void;
}

const GratitudeSection = ({
  value,
  onGratitudeChange,
}: GratitudeSectionProps): JSX.Element => {
  return (
    <div className="border-2 border-gray-400">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Today I Am Grateful For</h3>
      </div>
      <div className="p-3">
        <textarea
          value={value}
          onChange={(e) => onGratitudeChange(e.target.value)}
          className="w-full h-20 resize-none bg-transparent focus:outline-none text-sm leading-relaxed"
          placeholder="What are you grateful for today?"
        />
      </div>
    </div>
  );
};

export default GratitudeSection;
