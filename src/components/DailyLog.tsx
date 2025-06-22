import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus, Check, Circle } from "lucide-react";
import CalendaHeader from "./JournalForm/CalendaHeader";
import JournalFormLayout from "./JournalForm/JournalFormLayout";
import { stat } from "fs";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

const DailyLog: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedType, setSelectedType] = useState<"task" | "event" | "note">(
    "task",
  );
  const [priorityState, setPriorityState] = useState<PriorityLevel>("ปกติ");

  const [selectDate, setSelectDate] = useState<Date | null>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  type DateTimeFormatType = "date" | "time" | "datetime";
  const formatDateForDisplay = (
    date: Date | null,
    time: Date,
    formatType: DateTimeFormatType = "datetime",
  ): string => {
    const effectiveDate = date || time;

    const day = String(effectiveDate.getDate()).padStart(2, "0");
    const month = String(effectiveDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = effectiveDate.getFullYear();

    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");

    const formattedDate = `${day} / ${month} / ${year}`;
    const formattedTime = `${hours} : ${minutes} : ${seconds}`;

    // Handle the "No date selected" case specifically for the 'date' or 'datetime' part
    let datePart = formattedDate;
    if (!date && (formatType === "date" || formatType === "datetime")) {
      datePart = `No date selected | ${formattedDate}`; // Or just "No date selected" if you prefer less info
    }

    switch (formatType) {
      case "date":
        return datePart;
      case "time":
        return formattedTime;
      case "datetime":
        return `${datePart} | ${formattedTime}`;
    }
  };

  const currentLocaleDateString = (
    selectDate || currentTime
  ).toLocaleDateString("en-US", {
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

  const addEntry = async () => {
    if (!newEntry.trim()) return;

    const entry: Omit<Entry, "id"> = {
      type: selectedType,
      text: newEntry.trim(),
      completed: "พัก",
      priority: "ปกติ",
      inspiration: "",
    };

    setNewEntry("");

    try {
      await supabase.from("entries").insert([entry]);

      const { data } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setEntries(data as Entry[]);
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

  const [selectedPriority, setSelectedPriority] = useState(priorities[2]);

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
      default:
        return ""; // Add default case for safety
    }
  };

  const statuses: CompletionStatus[] = [
    "สำเร็จ",
    "ไม่สำเร็จ",
    "กำลังทำ",
    "พัก",
    "หยุด",
    "ยกเลิก",
    "ทิ้ง",
  ];

  const toggleCompleted = (id: string) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id !== id) return entry;

        const index = statuses.indexOf(entry.completed);
        const nextStatus = statuses[(index + 1) % statuses.length];

        return { ...entry, completed: nextStatus };
      }),
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="select-none flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-xl font-bold text-journal-stone ">Daily Log</h2>
        <div className="text-journal-stone text-xl">
          {formatDateForDisplay(selectDate, currentTime, "time")}
        </div>
        <p className="text-journal-stone/70 text-xl">
          {currentLocaleDateString}
        </p>
      </div>

      {/* Form header */}
      <div className=" bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className=" items-center mb-4">
          <div className="text-lg font-semibold text-journal-stone">
            <CalendaHeader />
            {/* Form Grid Layout */}
            <JournalFormLayout />
            <div className="flex gap-3">
              <button
                onClick={addEntry}
                className="px-6 py-3 bg-journal-sage text-white rounded-xl hover:bg-journal-sage-dark transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
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
