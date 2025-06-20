import { useState } from "react";

const MaintenanceSection = () => {
  const [maintenance, setMaintenance] = useState({
    exercise: false,
    mindfulness: false,
    hydration: false,
    relationship: false,
    petPlant: false,
  });

  const toggleItem = (key: string) => {
    setMaintenance((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const items = [
    { key: "exercise", label: "Exercise" },
    { key: "mindfulness", label: "Mindfulness" },
    { key: "hydration", label: "Hydration" },
    { key: "relationship", label: "Relationship" },
    { key: "petPlant", label: "Pet & Plant" },
  ];

  return (
    <div className="border-2 border-gray-400">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Maintenance Plan</h3>
      </div>
      <div className="p-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-2 py-1 border-b border-gray-200 last:border-b-0"
          >
            <input
              type="checkbox"
              checked={maintenance[item.key]}
              onChange={() => toggleItem(item.key)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceSection;
