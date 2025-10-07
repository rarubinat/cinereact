import React, { useState, useEffect } from "react";
import Seat from "./Seat";
import { useNotification } from "../../../context/NotificationContext";
import "./seatmatrix.css";

/**
 * GenerateSeats Component
 * Renders a single row of seats and handles individual seat selection.
 *
 * Props:
 * - rowSeats: array - List of seat numbers (or null for empty spots)
 * - rowLabel: string - Row identifier (e.g., "A")
 * - onSeatSelected: function - Callback when a seat is selected/deselected
 * - selectedMovie, selectedTime, selectedDate: show info
 * - selectedSeatsData: object - Current selected seats and row
 */
const GenerateSeats = ({
  rowSeats,
  rowLabel,
  onSeatSelected,
  selectedMovie,
  selectedTime,
  selectedDate,
  selectedSeatsData,
}) => (
  <div className="flex justify-center gap-2 mb-2">
    {rowSeats.map((seatNumber, idx) =>
      seatNumber === null ? (
        // Render empty space for alignment
        <div key={`empty-${idx}`} className="w-5 h-5"></div>
      ) : (
        <Seat
          key={seatNumber}
          seatno={seatNumber}
          onSeatSelected={(isSelected, seatNo) =>
            onSeatSelected(isSelected, seatNo, rowLabel)
          }
          selectedMovie={selectedMovie}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          // Highlight seat if selected and in the current row
          isSelected={
            selectedSeatsData.row === rowLabel &&
            selectedSeatsData.seats.includes(seatNumber)
          }
        />
      )
    )}
  </div>
);

/**
 * SeatMatrix Component
 * Manages the full seating layout and enforces seat selection rules.
 *
 * Props:
 * - onSeatSelection: function - Callback to pass selected seats back to parent
 * - selectedMovie, selectedTime, selectedDate: show info
 */
const SeatMatrix = ({ onSeatSelection, selectedMovie, selectedTime, selectedDate }) => {
  const { notify } = useNotification(); // Notification function for errors
  const [selectedSeatsData, setSelectedSeatsData] = useState({ seats: [], row: null });
  const [shakeRow, setShakeRow] = useState(null); // Row to apply "shake" animation if selection fails

  // Predefined cinema seating layout
  const seatLayout = [
    { row: "A", seats: [null, null, null, 1, 2, 3, null, null, null] },
    { row: "B", seats: [null, null, 4, 5, 6, 7, 8, null, null] },
    { row: "C", seats: [null, 9, 10, 11, 12, 13, 14, 15, null] },
    { row: "D", seats: [16, 17, 18, 19, 20, 21, 22, 23, 24] },
    { row: "E", seats: [25, 26, 27, 28, 29, 30, 31, 32, 33] },
    { row: "F", seats: [null, 34, 35, 36, 37, 38, 39, 40, null] },
    { row: "G", seats: [null, null, 41, 42, 43, 44, 45, null, null] },
  ];

  /**
   * handleSeatSelected
   * Handles selection logic:
   * - If no seats are selected or selecting in the same row, update selection
   * - If trying to select a seat in a different row, show error and shake row
   */
  const handleSeatSelected = (isSelected, seatNumber, rowLabel) => {
    if (!selectedSeatsData.seats.length || selectedSeatsData.row === rowLabel) {
      const newSeats = isSelected
        ? [...selectedSeatsData.seats, seatNumber]
        : selectedSeatsData.seats.filter((s) => s !== seatNumber);
      const newRow = newSeats.length > 0 ? rowLabel : null;
      const newData = { seats: newSeats, row: newRow };
      setSelectedSeatsData(newData);
      onSeatSelection(newData); // Pass selection to parent
    } else {
      // User tried selecting a seat in a different row
      notify("Seats must be in the same row.", "error");

      // Apply a brief "shake" animation to the row
      setShakeRow(rowLabel);
      setTimeout(() => setShakeRow(null), 600);
    }
  };

  // Reset selected seats when movie, time, or date changes
  useEffect(() => {
    const resetData = { seats: [], row: null };
    setSelectedSeatsData(resetData);
    onSeatSelection(resetData);
  }, [selectedMovie, selectedTime, selectedDate]);

  return (
    <div className="rounded-xl p-6 max-w-lg mx-auto">
      {/* Legend for seat types */}
      <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-500 rounded"></div> Available
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-800 rounded"></div> Selected
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded"></div> Unavailable
        </div>
      </div>

      {/* Cinema screen */}
      <div className="mt-4 flex justify-center">
        <div className="screen-shape text-center text-sm">screen</div>
      </div>

      {/* Render all rows */}
      <div className="mt-4 flex flex-col items-center">
        {seatLayout.map(({ row, seats }) => (
          <div
            key={row}
            className={`flex items-center gap-3 transition ${
              shakeRow === row ? "animate-shake" : ""
            }`} // Apply shake animation if row was incorrectly selected
          >
            <div className="text-[10px] w-4 text-center">{row}</div>
            <GenerateSeats
              rowSeats={seats}
              rowLabel={row}
              onSeatSelected={handleSeatSelected}
              selectedMovie={selectedMovie}
              selectedTime={selectedTime}
              selectedDate={selectedDate}
              selectedSeatsData={selectedSeatsData}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMatrix;
