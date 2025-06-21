import { useState } from "react";

const ThoughtsSection = () => {
  const [thoughts, setThoughts] = useState("");

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
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          className="w-full h-32 resize-none bg-transparent focus:outline-none text-sm leading-relaxed"
          placeholder="Write your thoughts here..."
        />
      </div>
    </div>
  );
};

export default ThoughtsSection;
