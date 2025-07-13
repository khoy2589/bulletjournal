import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import JournalFormLayout from "./JournalForm/JournalFormLayout";
import EntriesFormLayout from "./JournalForm/exportdisplay/EntriesFormLayout";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Entry {
  id: string;
  text: string;
  inspiration?: string;
}

const DailyLog: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

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

  function handleLoadCSV(key: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-row justify-between  select-none  bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20 ">
        <h2 className="text-xl font-bold text-journal-stone ">Daily Log</h2>
        <div className="items-center pl-44 text-journal-stone text-xl">
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
            {/* Form Layout */}
            <JournalFormLayout />
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-journal-stone mb-1">
          Entries
        </h3>
        <div>
          <EntriesFormLayout />
        </div>
      </div>
    </div>
  );
};

export default DailyLog;
