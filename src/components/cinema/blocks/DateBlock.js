// Component to display a scrollable week of dates and allow the user to select a date

import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * Helper function to format Date object as YYYY-MM-DD
 */
const formatDate = (date) => date.toISOString().split("T")[0];

/**
 * DateTimeline Component
 * Props:
 *  - selectedDate: currently selected date (YYYY-MM-DD)
 *  - handleDateChange: callback when a date is clicked
 */
const DateTimeline = ({ selectedDate, handleDateChange }) => {
  const [scrollIndex, setScrollIndex] = useState(0); // index of first visible date
  const [visibleCount, setVisibleCount] = useState(4); // number of dates visible at once (desktop default)

  // Update visibleCount depending on window width (responsive)
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(2); // mobile: 2 visible dates
      else setVisibleCount(4); // desktop/tablet: 4 visible dates
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Generate 7 days starting from today
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() + index);
    return {
      date: formatDate(day), // format as YYYY-MM-DD
      label: day.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }), // short human-readable label
    };
  });

  // Determine the maximum scroll index to avoid empty space
  const maxIndex = days.length - visibleCount;
  const visibleDays = days.slice(scrollIndex, scrollIndex + visibleCount);

  /**
   * Handle scroll via arrows
   * @param {"left"|"right"} direction
   */
  const handleScroll = (direction) => {
    setScrollIndex((prev) =>
      direction === "left"
        ? Math.max(prev - 1, 0)
        : Math.min(prev + 1, maxIndex)
    );
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full max-w-screen-md mx-auto px-2 sm:px-3">
      {/* Left arrow for scrolling */}
      <button
        onClick={() => handleScroll("left")}
        disabled={scrollIndex === 0}
        className={`p-1.5 sm:p-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition ${
          scrollIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
        }`}
      >
        <FaChevronLeft className="text-sm sm:text-base" />
      </button>

      {/* Render visible dates as buttons */}
      <div className="flex flex-grow gap-2 sm:gap-3">
        {visibleDays.map((day) => (
          <button
            key={day.date}
            onClick={() => handleDateChange(day.date)}
            className={`flex-grow text-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition font-medium text-sm sm:text-base ${
              selectedDate === day.date
                ? "bg-black text-white border-black"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Right arrow for scrolling */}
      <button
        onClick={() => handleScroll("right")}
        disabled={scrollIndex >= maxIndex}
        className={`p-1.5 sm:p-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition ${
          scrollIndex >= maxIndex ? "opacity-30 cursor-not-allowed" : ""
        }`}
      >
        <FaChevronRight className="text-sm sm:text-base" />
      </button>
    </div>
  );
};

export default DateTimeline;
