import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const formatDate = (date) => date.toISOString().split("T")[0];

const DateTimeline = ({ selectedDate, handleDateChange }) => {
  const [scrollIndex, setScrollIndex] = useState(0);

  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() + index);
    return {
      date: formatDate(day),
      label: day.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    };
  });

  const visibleCount = 4;
  const maxIndex = days.length - visibleCount;

  const handleScroll = (direction) => {
    setScrollIndex((prev) =>
      direction === "left"
        ? Math.max(prev - 1, 0)
        : Math.min(prev + 1, maxIndex)
    );
  };

  const visibleDays = days.slice(scrollIndex, scrollIndex + visibleCount);

  return (
    <div className="flex items-center gap-3 w-full max-w-screen-md mx-auto px-3">
      {/* Left arrow */}
      <button
        onClick={() => handleScroll("left")}
        disabled={scrollIndex === 0}
        className={`p-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition ${
          scrollIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
        }`}
      >
        <FaChevronLeft />
      </button>

      {/* Visible days */}
      <div className="flex flex-grow gap-3">
        {visibleDays.map((day) => (
          <button
            key={day.date}
            onClick={() => handleDateChange(day.date)}
            className={`flex-grow text-center px-4 py-3 rounded-lg border transition font-medium ${
              selectedDate === day.date
                ? "bg-black text-white border-black"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => handleScroll("right")}
        disabled={scrollIndex >= maxIndex}
        className={`p-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition ${
          scrollIndex >= maxIndex ? "opacity-30 cursor-not-allowed" : ""
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default DateTimeline;
