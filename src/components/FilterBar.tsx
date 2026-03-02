import React from "react";
import type { FilterBarProps } from "../types/dashboard";

const FILTERS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Custom", value: "custom" },
];

export const FilterBar: React.FC<FilterBarProps> = ({ filter, startDate, endDate, onFilterChange, onDateRangeChange }) => (
  <div className="flex flex-wrap items-center gap-2 mb-4">
    {FILTERS.map(f => (
      <button
        key={f.value}
        className={`px-3 py-1 rounded ${filter === f.value ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => onFilterChange(f.value as any)}
        type="button"
      >
        {f.label}
      </button>
    ))}
    {filter === "custom" && (
      <>
        <input
          type="date"
          value={startDate}
          onChange={e => onDateRangeChange(e.target.value, endDate)}
          className="border rounded px-2 py-1"
        />
        <span>–</span>
        <input
          type="date"
          value={endDate}
          onChange={e => onDateRangeChange(startDate, e.target.value)}
          className="border rounded px-2 py-1"
        />
      </>
    )}
  </div>
);
