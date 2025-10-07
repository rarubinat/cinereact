import React, { useState, useEffect } from "react";
import db from "../../../utils/firebase";

/**
 * normalizeDate
 * Converts a date string into a normalized "YYYY-MM-DD" format
 * for querying the database.
 * @param {string} dateStr - The input date string
 * @returns {string} - Normalized date string or empty if invalid
 */
const normalizeDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0];
};

/**
 * Seat Component
 * Represents a single cinema seat and its selection/registration state.
 *
 * Props:
 * - seatno: number|string - The seat number
 * - onSeatSelected: function - Callback when the seat is selected/deselected
 * - selectedMovie: string - The currently selected movie
 * - selectedTime: string - The currently selected show time
 * - selectedDate: string - The currently selected date
 * - isSelected: boolean - Indicates if this seat is currently selected
 */
const Seat = ({ seatno, onSeatSelected, selectedMovie, selectedTime, selectedDate, isSelected }) => {
  // State to track if this seat is already booked in the database
  const [isRegistered, setIsRegistered] = useState(false);

  /**
   * seatClickHandler
   * Handles clicks on the seat.
   * - Does nothing if the seat is already booked.
   * - Toggles the selection state and informs parent via callback.
   */
  const seatClickHandler = () => {
    if (isRegistered) return; // Ignore clicks on reserved seats
    onSeatSelected(!isSelected, seatno); // Toggle selection
  };

  /**
   * useEffect
   * Runs whenever the seat or show info changes.
   * Queries Firebase to check if this seat is already booked.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const normalizedDate = normalizeDate(selectedDate);

        // Query Firestore for reservations matching this seat, movie, time, and date
        const snapshot = await db
          .collection("reservas")
          .where("selectedSeats", "array-contains", seatno)
          .where("selectedMovie", "==", selectedMovie)
          .where("selectedTime", "==", selectedTime)
          .where("selectedDate", "==", normalizedDate)
          .get();

        // If snapshot is not empty, seat is already registered
        setIsRegistered(!snapshot.empty);
      } catch (error) {
        console.error("Error checking registered seat:", error);
      }
    };
    fetchData();
  }, [seatno, selectedMovie, selectedTime, selectedDate]);

  // Define CSS classes based on seat state
  const seatClasses = `
    flex items-center justify-center
    w-5 h-5 sm:w-6 sm:h-6
    text-[9px] sm:text-[10px] font-medium
    rounded-sm
    transition-colors transition-transform duration-150
    ${
      isRegistered
        ? "bg-gray-200 cursor-not-allowed" // Already booked
        : isSelected
        ? "bg-gray-800 text-white scale-105" // Currently selected
        : "bg-gray-500 hover:bg-gray-800 hover:text-white hover:scale-105 cursor-pointer" // Available
    }
  `;

  return (
    <div className="p-[2px]">
      <div
        className={seatClasses}
        onClick={seatClickHandler}
        style={isRegistered ? { pointerEvents: "none" } : {}}
      >
        {/* Show seat number only if selected */}
        {isSelected && seatno}
      </div>
    </div>
  );
};

export default Seat;
