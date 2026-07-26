/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Users,
} from "lucide-react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(s: string): string {
  const d = fromISODate(s);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function addDays(s: string, n: number): string {
  const d = fromISODate(s);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  onOutside: () => void,
) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

interface CalendarProps {
  selected: string;
  minDate?: string;
  onSelect: (date: string) => void;
}

function Calendar({ selected, minDate, onSelect }: CalendarProps) {
  const initial = selected ? fromISODate(selected) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const first = new Date(viewYear, viewMonth, 1);
  const firstWeekday = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(fromISODate(minDate)) : today;

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  function goMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  return (
    <div className="p-4 w-[280px] bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={() => goMonth(1)}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const cellDate = new Date(viewYear, viewMonth, day);
          const iso = toISODate(cellDate);
          const isSelected = selected === iso;
          const isDisabled = startOfDay(cellDate) < min;
          const isToday = startOfDay(cellDate).getTime() === today.getTime();

          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(iso)}
              className={`
                h-9 w-9 mx-auto flex items-center justify-center text-sm rounded-full transition-colors
                ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-[#caa05c1a]"}
                ${isSelected ? "bg-[#caa05c] text-white font-semibold" : "text-gray-700"}
                ${isToday && !isSelected ? "border-2 border-[#caa05c]" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface GuestCounterProps {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}

function GuestCounter({
  label,
  sublabel,
  value,
  min,
  onChange,
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{sublabel}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-8 w-8 rounded-full border-2 border-[#caa05c] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#caa05c1a] transition-colors"
        >
          <Minus className="h-4 w-4 text-[#caa05c]" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-gray-900">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-8 w-8 rounded-full border-2 border-[#caa05c] flex items-center justify-center hover:bg-[#caa05c1a] transition-colors"
        >
          <Plus className="h-4 w-4 text-[#caa05c]" />
        </button>
      </div>
    </div>
  );
}

export default function BookingWidget() {
  const today = new Date();
  const defaultCheckIn = toISODate(today);
  const defaultCheckOut = toISODate(
    new Date(today.setDate(today.getDate() + 1)),
  );

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [openPanel, setOpenPanel] = useState<
    "checkin" | "checkout" | "guests" | null
  >(null);

  const wrapperRef = useRef<HTMLDivElement>(null!);

  useClickOutside(wrapperRef, () => setOpenPanel(null));

  function selectCheckIn(iso: string) {
    setCheckIn(iso);
    if (fromISODate(checkOut) <= fromISODate(iso)) {
      setCheckOut(addDays(iso, 1));
    }
    setOpenPanel("checkout");
  }

  function selectCheckOut(iso: string) {
    setCheckOut(iso);
    setOpenPanel(null);
  }

  const totalGuests = adults + children;

  return (
    <div className="w-full flex justify-center py-10 px-4" ref={wrapperRef}>
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Check In */}
          <div className="relative flex-1 border-b sm:border-b-0 sm:border-r border-gray-200">
            <button
              type="button"
              onClick={() =>
                setOpenPanel(openPanel === "checkin" ? null : "checkin")
              }
              className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors rounded-t-2xl sm:rounded-tl-2xl sm:rounded-tr-none"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#ab8965] mb-1">
                <CalendarIcon className="h-4 w-4" />
                Check In
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatDisplay(checkIn)}
              </div>
            </button>
            {openPanel === "checkin" && (
              <div className="absolute z-20 mt-2 left-0">
                <Calendar selected={checkIn} onSelect={selectCheckIn} />
              </div>
            )}
          </div>

          {/* Check Out */}
          <div className="relative flex-1 border-b sm:border-b-0 sm:border-r border-gray-200">
            <button
              type="button"
              onClick={() =>
                setOpenPanel(openPanel === "checkout" ? null : "checkout")
              }
              className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#ab8965] mb-1">
                <CalendarIcon className="h-4 w-4" />
                Check Out
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatDisplay(checkOut)}
              </div>
            </button>
            {openPanel === "checkout" && (
              <div className="absolute z-20 mt-2 left-0 sm:left-auto sm:right-0">
                <Calendar
                  selected={checkOut}
                  minDate={addDays(checkIn, 1)}
                  onSelect={selectCheckOut}
                />
              </div>
            )}
          </div>

          {/* Guests */}
          <div className="relative flex-1 border-b sm:border-b-0 border-gray-200">
            <button
              type="button"
              onClick={() =>
                setOpenPanel(openPanel === "guests" ? null : "guests")
              }
              className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#ab8965] mb-1">
                <Users className="h-4 w-4" />
                Guests
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
              </div>
            </button>
            {openPanel === "guests" && (
              <div className="absolute z-20 mt-2 left-0 sm:left-auto sm:right-0 w-[280px] bg-white rounded-xl shadow-lg border border-gray-200 px-5 py-3">
                <GuestCounter
                  label="Adults"
                  sublabel="Ages 13+"
                  value={adults}
                  min={1}
                  onChange={setAdults}
                />
                <div className="border-t border-gray-100"></div>
                <GuestCounter
                  label="Children"
                  sublabel="Ages 0-12"
                  value={children}
                  min={0}
                  onChange={setChildren}
                />
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="p-3 sm:flex sm:items-center sm:justify-center">
            <button
              type="button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#caa05c] hover:bg-[#ab8965] transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
