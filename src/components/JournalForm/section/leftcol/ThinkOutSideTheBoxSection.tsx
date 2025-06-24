interface ThinkOutSideTheBoxSectionProps {
  creativity: string;
  onCreativityChange: (creativity: string) => void;
}

const ThinkOutSideTheBoxSection = ({
  creativity,
  onCreativityChange,
}: ThinkOutSideTheBoxSectionProps): JSX.Element => {
  return (
    <div className="border-2 border-gray-400">
      <div className="flex  justify-between items-center bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Think Outside of the Box</h3>
        <span className="text-sm italic text-gray-600">
          Be creative and let it go
        </span>
      </div>
      <div className="p-3">
        <textarea
          value={creativity}
          onChange={(e) => onCreativityChange(e.target.value)}
          className="w-full h-32 resize-none bg-transparent focus:outline-none text-xs leading-relaxed"
          placeholder="Let your creativity flow..."
        />
      </div>
    </div>
  );
};

export default ThinkOutSideTheBoxSection;
