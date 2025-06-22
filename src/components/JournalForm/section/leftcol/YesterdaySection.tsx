interface YesterdaySectionProps {
  value: string;
  onYesterdayBestChange: (yesterdayBest: string) => void;
}

const YesterdaySection = ({
  value,
  onYesterdayBestChange,
}: YesterdaySectionProps): JSX.Element => {
  return (
    <div className="border-2 border-gray-400">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Yesterday's Best Part</h3>
      </div>
      <div className="p-3">
        <textarea
          value={value}
          onChange={(e) => onYesterdayBestChange(e.target.value)}
          className="w-full h-24 resize-none bg-transparent focus:outline-none text-sm leading-relaxed"
          placeholder="What was the best part of yesterday?"
        />
      </div>
    </div>
  );
};

export default YesterdaySection;
