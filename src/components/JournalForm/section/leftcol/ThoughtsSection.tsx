interface ThoughtsSectionProps {
  value: string;
  onThoughtsChange: (thoughts: string) => void;
}

const ThoughtsSection = ({
  value,
  onThoughtsChange,
}: ThoughtsSectionProps): JSX.Element => {
  return (
    <div className=" border-2 border-gray-400">
      <div className="flex justify-between items-center bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Thoughts</h3>
        <span className="text-xs text-blue-600 italic">
          ✓ - mindfulness/clarity
        </span>
      </div>
      <div className="p-3">
        <textarea
          value={value}
          onChange={(e) => onThoughtsChange(e.target.value)}
          className="w-full h-32 resize-none bg-transparent focus:outline-none text-sm leading-relaxed"
          placeholder="Write your thoughts here..."
        />
      </div>
    </div>
  );
};

export default ThoughtsSection;
