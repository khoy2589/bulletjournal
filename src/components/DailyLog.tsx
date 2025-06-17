import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus, Check, Circle } from "lucide-react";

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL; //<- ไม่ได้ใช้

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

type PriorityLevel =
  | "ด่วนที่สุด"
  | "ด่วน"
  | "ปกติ"
  | "พัก"
  | "ยังไม่เริ่ม"
  | "ไม่สำเร็จ"
  | "ยกเลิก";

type EntryType = "task" | "event" | "note";

interface Entry {
  id: string;
  type: EntryType;
  text: string;
  completed?: CompletionStatus;
  priority?: PriorityLevel;
  inspiration?: string;
}

const priorities: { label: PriorityLevel; color: string }[] = [
  { label: "ด่วนที่สุด", color: "text-red-600" },
  { label: "ด่วน", color: "text-orange-500" },
  { label: "ปกติ", color: "text-green-600" },
  { label: "พัก", color: "text-purple-600" },
  { label: "ยังไม่เริ่ม", color: "text-gray-400" },
  { label: "ไม่สำเร็จ", color: "text-red-400" },
  { label: "ยกเลิก", color: "text-yellow-500" },
];

type CompletionStatus =
  | "สำเร็จ"
  | "ไม่สำเร็จ"
  | "กำลังทำ"
  | "พัก"
  | "หยุด"
  | "ยกเลิก"
  | "ทิ้ง";

interface Entry {
  id: string;
  type: "task" | "event" | "note";
  text: string;
  completed?: CompletionStatus;
  priority?:
    | "ด่วนที่สุด"
    | "ด่วน"
    | "ปกติ"
    | "พัก"
    | "ยังไม่เริ่ม"
    | "ไม่สำเร็จ"
    | "ยกเลิก";
  inspiration?: string; // ข้อความ หรือ URL ก็ได้ << ดึงมาจากที่ไหนซักที่เช่นไฟล์ md
}

const DailyLog: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedType, setSelectedType] = useState<"task" | "event" | "note">(
    "task",
  );
  const [priorityState, setPriorityState] = useState<PriorityLevel>("ปกติ");

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Load error:", error.message);
        return;
      }

      setEntries(data as Entry[]);
    };

    fetchEntries();
  }, []);

  const toggleCompleted = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              completed: entry.completed === "สำเร็จ" ? "สำเร็จ" : "ไม่สำเร็จ",
            }
          : entry,
      ),
    );
  };

  const addEntry = async () => {
    if (!newEntry.trim()) return;

    const entry: Omit<Entry, "id"> = {
      // id: Date.now().toString(),
      type: selectedType,
      text: newEntry.trim(),

      // ตั้งค่าค่า default ของ field ใหม่ตรงนี้
      completed: "พัก", // ✅ ใช้ string แทน boolean
      priority: "ปกติ", // ✅ ค่า default
      inspiration: "", // ✅ หรือใส่ข้อความ, emoji, URL รูปภาพ
    };

    setNewEntry("");

    try {
      await supabase.from("entries").insert([entry]);

      // Reload entries after save
      const { data } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setEntries(data as Entry[]);

      // await sendToDiscord(
      //   /* ไม่ส่งแล้ว เอาไปเก็บใน supabase แทน */
      //   `📅 ${new Date().toLocaleDateString()}\n📝 Type: ${entry.type}\n💬 ${
      //     entry.text
      //   }`,
      // );
    } catch (error) {
      console.error("❌ Save error:", error);
    }
  };

  const getEntryIcon = (entry: Entry) => {
    if (entry.type === "task") {
      return entry.completed ? (
        <div className="w-6 h-6 bg-journal-sage rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 border-2 border-journal-sage rounded-full"></div>
      );
    } else if (entry.type === "event") {
      return <Circle size={20} className="text-journal-lavender" />;
    } else {
      return <div className="w-6 h-1 bg-journal-stone rounded-full"></div>;
    }
  };
  /* ========================== Default Priority ========================== */
  const [selectedPriority, setSelectedPriority] = useState(priorities[2]); // default = ปกติ
  /* ====================================================================== */

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case "ด่วนที่สุด":
        return "bg-red-100 text-red-600";
      case "ด่วน":
        return "bg-orange-100 text-orange-500";
      case "ปกติ":
        return "bg-green-100 text-green-600";
      case "พัก":
        return "bg-purple-100 text-purple-600";
      case "ยังไม่เริ่ม":
        return "bg-gray-100 text-gray-400";
      case "ไม่สำเร็จ":
        return "bg-gray-200 text-red-400 italic";
      case "ยกเลิก":
        return "bg-yellow-100 text-yellow-500 italic";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-journal-stone mb-2">
          Daily Log
        </h2>
        <p className="text-journal-stone/70">{dateString}</p>
      </div>

      {/* Quick Entry */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-journal-stone">
            Quick Entry
          </h3>

          <div className="">
            {/* Priority */}
            <h3 className="text-lg font-semibold text-journal-stone">
              Priority
            </h3>
          </div>
        </div>

        {/* Type + Priority Selector */}
        <div className="flex gap-2 flex-wrap justify-between items-center">
          {/* Type Selector */}
          <div className="flex gap-2 mb-4">
            {[
              { type: "task" as const, label: "Task", icon: "•" },
              { type: "event" as const, label: "Event", icon: "O" },
              { type: "note" as const, label: "Note", icon: "—" },
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
                ${
                  selectedType === type
                    ? "bg-journal-sage text-white shadow-md"
                    : "bg-journal-cream-dark text-journal-stone hover:bg-journal-sage/10"
                }
              `}
              >
                <span className="font-mono text-lg">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Priority */}
          {/* Priority Selector */}
          <Listbox value={selectedPriority} onChange={setSelectedPriority}>
            <div className="relative flex gap-2 mb-4">
              <ListboxButton
                className={`
                            px-4 py-2 rounded-xl font-medium transition-all duration-200
                            ${getPriorityStyle(selectedPriority.label)}
                          `}
              >
                {selectedPriority.label}
              </ListboxButton>
              <ListboxOptions className="absolute mt-1 bg-white border rounded-xl shadow-md z-10 w-40">
                {priorities.map((p) => (
                  <ListboxOption
                    key={p.label}
                    value={p}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${p.color}`}
                  >
                    {p.label}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addEntry();
              }
            }}
            placeholder={`Add a new ${selectedType}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-journal-sage/20 focus:border-journal-sage focus:outline-none focus:ring-2 focus:ring-journal-sage/20 bg-white/90 text-black"
          />
          <button
            onClick={addEntry}
            className="px-6 py-3 bg-journal-sage text-white rounded-xl hover:bg-journal-sage-dark transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-journal-stone mb-4">
          Today's Entries
        </h3>

        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`
                flex items-center gap-4 p-4 rounded-xl transition-all duration-200 entry-hover
                ${entry.completed ? "opacity-60" : ""}
              `}
            >
              <button
                onClick={() =>
                  entry.type === "task" && toggleCompleted(entry.id)
                }
                className={
                  entry.type === "task" ? "cursor-pointer" : "cursor-default"
                }
              >
                {getEntryIcon(entry)}
              </button>

              <div className="flex-1">
                <p
                  className={`
                  text-journal-stone ${entry.completed ? "line-through" : ""}
                  ${entry.priority ? "font-semibold" : ""}
                `}
                >
                  {entry.priority && (
                    <span className="text-journal-peach mr-1">★</span>
                  )}
                  {entry.inspiration && (
                    <span className="text-journal-lavender mr-1">!</span>
                  )}
                  {entry.text}
                </p>
              </div>

              <div className="text-xs text-journal-stone/50 capitalize">
                {entry.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyLog;
