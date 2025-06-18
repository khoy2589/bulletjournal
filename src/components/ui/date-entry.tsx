import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateEntryProps {
  onDateChange: (date: Date | null) => void;

  // เพิ่ม prop สำหรับค่าเริ่มต้นของวันที่ ถ้าอยากกำหนดมาจากคอมโพเนนต์แม่
  initialDate?: Date | null;
}

export const DateEntry = ({ onDateChange, initialDate }: DateEntryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate !== undefined ? initialDate : new Date(),
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date); // อัปเดต state ภายใน DateEntry
    onDateChange(date); // ส่งค่าวันที่ที่เลือกกลับไปให้คอมโพเนนต์แม่
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-journal-stone">
          Date Entry:
        </h3>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange} // ใช้ handleDateChange ที่จะอัปเดต state และส่งค่าออกไป
          dateFormat="dd|MM|yyyy" // กำหนดรูปแบบการแสดงผล DatePicker
          className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};
