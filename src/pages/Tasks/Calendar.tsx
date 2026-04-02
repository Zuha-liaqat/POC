import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

type ViewMode = "Month" | "Week" | "Day";
type TabMode = "Tasks List" | "Calendar";

interface CalendarEvent {
  id: number;
  day: number;
  time?: string;
  title: string;
  color: "green" | "blue" | "teal";
}

const EVENTS: CalendarEvent[] = [
  { id: 1, day: 1, time: "", title: "Viewing: Oak St", color: "teal" },
  { id: 2, day: 3, time: "", title: "Call: Sarah Jane", color: "blue" },
  { id: 3, day: 3, time: "", title: "Doc Sign: Apt 4", color: "blue" },
  { id: 4, day: 5, time: "9:00", title: "Sunset Ville", color: "green" },
  { id: 5, day: 5, time: "11:30", title: "Client Call", color: "green" },
  { id: 6, day: 10, time: "", title: "Closing: Hilltop", color: "teal" },
  { id: 7, day: 19, time: "", title: "Open House: Loft", color: "teal" },
];

const COLOR_MAP = {
  green: { bg: "bg-sky-500", text: "text-white" },
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  teal: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const MONTH_NAME = "October 2023";
const FIRST_DOW = 0;
const DAYS_IN_MONTH = 31;

const PREV_TRAILING = [27, 28, 29, 30];

const NEXT_LEADING = [1, 2, 3, 4];

export default function Calendar() {
  const [tab, setTab] = useState<TabMode>("Calendar");
  const [view, setView] = useState<ViewMode>("Month");
  const TODAY = 5;

  const grid: { day: number; current: boolean }[] = [
    ...PREV_TRAILING.map((d) => ({ day: d, current: false })),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => ({
      day: i + 1,
      current: true,
    })),
    ...NEXT_LEADING.map((d) => ({ day: d, current: false })),

    ...Array.from({ length: 42 - 4 - 31 - 4 }, (_, i) => ({
      day: i + 5,
      current: false,
    })),
  ];

  const eventsForDay = (day: number, current: boolean) =>
    current ? EVENTS.filter((e) => e.day === day) : [];

  return (
    <div className="mt-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition text-gray-500">
              <ChevronLeft size={16} />
            </button>
            <span className="text-base font-semibold text-[#0E2A47] w-40 text-center">
              {MONTH_NAME}
            </span>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition text-gray-500">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm">
            {(["Month", "Week", "Day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 transition text-sm font-medium ${
                  view === v
                    ? "bg-sky-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:grid grid-cols-7 border-b border-gray-100">
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="py-3 text-center text-xs font-semibold text-gray-400 tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-7 auto-rows-[minmax(80px,auto)] sm:auto-rows-[minmax(100px,auto)]">
          {grid.map((cell, idx) => {
            const isToday = cell.current && cell.day === TODAY;
            const events = eventsForDay(cell.day, cell.current);
            const isLastRow = idx >= 35;

            return (
              <div
                key={idx}
                className={`border-r border-b border-gray-100 p-1 sm:p-2 relative ${idx % 7 === 6 ? "border-r-0" : ""} ${isLastRow ? "border-b-0" : ""} ${!cell.current ? "bg-gray-50/40" : "bg-white hover:bg-sky-50/20 transition"}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span
                    className={`text-sm font-medium leading-none ${isToday ? "w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold" : cell.current ? "text-[#0E2A47]" : "text-gray-300"}`}
                  >
                    {cell.day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold text-white bg-sky-400 px-1.5 py-0.5 rounded-full leading-none">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  {events.map((ev) => {
                    const c = COLOR_MAP[ev.color];
                    return (
                      <div
                        key={ev.id}
                        className={`${c.bg} ${c.text} rounded px-1 py-0.5 text-[11px] font-medium leading-snug truncate cursor-pointer`}
                      >
                        {ev.time && (
                          <span className="font-semibold mr-1">{ev.time}</span>
                        )}
                        {ev.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
