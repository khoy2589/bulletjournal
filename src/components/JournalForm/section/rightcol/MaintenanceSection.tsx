import Papa from "papaparse";
import { parse } from "path";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

type MaintenanceItem = {
  id?: string;
  label?: string;
  completed?: string | boolean;
};

export interface MaintenanceRef {
  getItems: () => MaintenanceItem[];
}

const MaintenanceSection = forwardRef<MaintenanceRef>((_, ref) => {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);

  useImperativeHandle(ref, () => ({
    getItems: () => items,
  }));

  interface MaintenanceCSVRow {
    id?: string;
    label: string;
    completed: string | boolean;
  }

  // Load CSV on first render
  useEffect(() => {
    const parseRow = (row: MaintenanceCSVRow): MaintenanceItem => {
      return {
        id: row.id || crypto.randomUUID(),
        label: row.label || "",
        completed: row.completed === "true" || row.completed === true,
      };
    };
    const loadFromCSV = async () => {
      try {
        const res = await fetch("/MaintenanceList.csv");
        const text = await res.text();

        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const parsed = (results.data as MaintenanceCSVRow[]).map(parseRow);
            setItems(parsed);
            localStorage.setItem("maintenance", JSON.stringify(parsed));
            setLoading(false);
          },
        });
      } catch (err) {
        console.error("Failed to load CSV:", err);
        setLoading(false);
      }
    };
    // only load if localStorage is empty
    const saved = localStorage.getItem("maintenance");
    if (saved) {
      setItems(JSON.parse(saved));
      setLoading(false);
    } else {
      loadFromCSV();
    }
  }, []);

  // save to local storage
  const saveToStorage = (updated: MaintenanceItem[]) => {
    localStorage.setItem("maintenance", JSON.stringify(updated));
  };

  const addItem = () => {
    if (!newItem.trim()) return;

    const newItemObj: MaintenanceItem = {
      id: crypto.randomUUID(),
      label: newItem.trim(),
      completed: false,
    };

    const updated = [...items, newItemObj];
    setItems(updated);
    saveToStorage(updated);
    setNewItem("");
  };

  const completeItem = (index: number) => {
    const updated = [...items];
    updated[index].completed = true;
    const filtered = updated.filter((item) => !item.completed);
    setItems(filtered);
    saveToStorage(filtered);
  };

  const deleteItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    saveToStorage(updated);
  };

  return (
    <div className="border-2 border-gray-400">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-400">
        <h3 className="font-bold text-sm">Maintenance Plan</h3>
      </div>

      <div className="p-3 space-y-2">
        {loading ? (
          <p className="text-xs italic text-gray-500">Loading...</p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id ?? index}
              className="flex items-center justify-between border-b border-gray-200 py-1"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  aria-label={`Mark ${item.label} complete`}
                  onChange={() => completeItem(index)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{item.label}</span>
              </div>
              <button
                onClick={() => deleteItem(index)}
                className="text-xs text-red-500"
              >
                ✕
              </button>
            </div>
          ))
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addItem();
          }}
          className="flex gap-2 mt-2"
        >
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="border px-2 py-1 text-sm flex-1 focus:outline-none"
            placeholder="Add item..."
          />
          <button
            type="submit"
            className="text-s bg-blue-500 p-1  rounded-sm text-white"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
});

export default MaintenanceSection;
