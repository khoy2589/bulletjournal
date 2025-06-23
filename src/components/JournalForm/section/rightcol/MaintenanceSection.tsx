import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type MaintenanceItem = {
  id: string;
  label: string;
  completed: boolean;
};

const MaintenanceSection = () => {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [entryId, setEntryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestEntry = async () => {
      console.log("Loading latest entry...");

      const { data, error } = await supabase
        .from("entries")
        .select("id, MaintenancePlan")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Load error:", error);

        if (error.code !== "PGRST116") {
          console.error("Unexpected error:", error);
        }
      } else if (data) {
        console.log("Loaded entry:", data);
        setEntryId(data.id);
        setItems(data.MaintenancePlan ?? []);
      }

      setLoading(false);
    };

    loadLatestEntry();
  }, []);

  const createOrUpdateEntry = async (updated: MaintenanceItem[]) => {
    console.log("Saving with entryId:", entryId, "items:", updated); // Debug

    if (!entryId) {
      // Create new entry
      const { data: newEntry, error: createError } = await supabase
        .from("entries")
        .insert({
          MaintenancePlan: updated,
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Create error:", createError);
        return false;
      } else {
        console.log("Created new entry:", newEntry);
        setEntryId(newEntry.id);
        return true;
      }
    } else {
      // Update existing entry
      const { error } = await supabase
        .from("entries")
        .update({
          MaintenancePlan: updated,
        })
        .eq("id", entryId);

      if (error) {
        console.error("Update error:", error);
        return false;
      } else {
        console.log("Updated successfully");
        return true;
      }
    }
  };

  const updatePlanInDB = async (updated: MaintenanceItem[]) => {
    if (!entryId) return;
    const { error } = await supabase
      .from("entries")
      .update({
        MaintenancePlan: updated,
      })
      .eq("id", entryId);

    if (error) console.error("Update error:", error);
  };

  const addItem = async () => {
    if (!newItem.trim()) return;

    const newItemObj: MaintenanceItem = {
      id: crypto.randomUUID(),
      label: newItem.trim(),
      completed: false,
    };

    const updated = [...items, newItemObj];
    setItems(updated);
    setNewItem("");
    await updatePlanInDB(updated);

    await createOrUpdateEntry(updated);
  };

  const completeItem = async (index: number) => {
    const updated = [...items];
    updated[index].completed = true;
    const filtered = updated.filter((item) => !item.completed);

    setItems(filtered);
    await createOrUpdateEntry(filtered);
  };

  const deleteItem = async (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    await createOrUpdateEntry(updated);
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
