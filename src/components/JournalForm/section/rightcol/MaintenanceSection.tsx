import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type MaintenanceItem = {
  id?: string;
  label: string;
  completed: boolean;
};

const MaintenanceSection = () => {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      const { data, error } = await supabase
        .from("maintenance_items")
        .select("*")
        .eq("completed", false);

      if (error) {
        console.error("Load error:", error);
      } else if (data) {
        setItems(data);
      }

      setLoading(false);
    };

    loadItems();
  }, []);

  const addItem = async () => {
    if (!newItem.trim()) return;

    const { data, error } = await supabase
      .from("maintenance_items")
      .insert([{ label: newItem, completed: false }])
      .select()
      .single();

    if (data) {
      setItems((prev) => [...prev, data]);
      setNewItem("");
    }
  };

  const completeItem = async (id: string) => {
    await supabase
      .from("maintenance_items")
      .update({ completed: true })
      .eq("id", id);

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteItem = async (id: string) => {
    await supabase.from("maintenance_items").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
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
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-gray-200 py-1"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  aria-label={`Mark ${item.label} complete`}
                  onChange={() => item.id && completeItem(item.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{item.label}</span>
              </div>
              <button
                onClick={() => item.id && deleteItem(item.id)}
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
            className="border px-2 py-1 text-sm flex-1"
            placeholder="Add item..."
          />
          <button type="submit" className="text-xs text-blue-500">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceSection;
