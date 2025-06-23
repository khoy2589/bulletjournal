import { useState } from "react";

const DailyQuoteSection = () => {
  const defaultQuote =
    "In tears, uncertainty's dance begins, Embrace the now, where hope and fear thin.";
  const [quote, setQuote] = useState(defaultQuote);

  return (
    <div className="border-2 border-gray-400">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Daily Advice or Quote</h3>
      </div>
      <div className="p-3">
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full h-24 resize-none bg-transparent focus:outline-none text-sm leading-relaxed italic text-right"
          placeholder="Your daily inspiration..."
          readOnly
        />
      </div>
    </div>
  );
};

export default DailyQuoteSection;
