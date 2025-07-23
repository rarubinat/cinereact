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
      label: day.toLocaleDateString("es-ES", {
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
    <div className="flex items-center space-x-3 w-full max-w-screen-md mx-auto px-3">
      {/* Flecha izquierda */}
      <button
        onClick={() => handleScroll("left")}
        disabled={scrollIndex === 0}
        className={`p-3 text-blue-300 bg-zinc-800/90 rounded-lg shadow-md transition hover:bg-blue-600 hover:text-white
          ${scrollIndex === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
      >
        <FaChevronLeft className="text-lg" />
      </button>

      {/* Días visibles */}
      <div className="flex flex-grow space-x-3">
        {visibleDays.map((day) => (
          <button
            key={day.date}
            onClick={() => handleDateChange(day.date)}
            className={`
              flex-grow text-center px-4 py-4 rounded-lg text-base font-semibold transition-all duration-300
              ${
                selectedDate === day.date
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-zinc-800 text-blue-400 hover:bg-blue-600 hover:text-white hover:scale-105"
              }
            `}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={() => handleScroll("right")}
        disabled={scrollIndex >= maxIndex}
        className={`p-3 text-blue-300 bg-zinc-800/90 rounded-lg shadow-md transition hover:bg-blue-600 hover:text-white
          ${scrollIndex >= maxIndex ? "opacity-30 cursor-not-allowed" : ""}`}
      >
        <FaChevronRight className="text-lg" />
      </button>
    </div>
  );
};

export default DateTimeline;
