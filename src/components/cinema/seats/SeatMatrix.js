import React, { useState, useEffect } from "react";
import Seat from "./Seat";

// Función que genera una fila de asientos con Tailwind
const GenerateSeats = (seatNumbers, onSeatSelected, selectedMovie, selectedTime, selectedDate) => (
  <div className="flex justify-center gap-2 mb-2">
    {seatNumbers.map((seatNumber) => (
      <Seat
        key={seatNumber}
        seatno={seatNumber}
        onSeatSelected={onSeatSelected}
        selectedMovie={selectedMovie}
        selectedTime={selectedTime}
        selectedDate={selectedDate}
      />
    ))}
  </div>
);

const SeatMatrix = ({ onSeatSelection, selectedMovie, selectedTime, selectedDate }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatSelected = (isSelected, seatNumber) => {
    setSelectedSeats(prevSeats =>
      isSelected
        ? [...prevSeats, seatNumber]
        : prevSeats.filter(seat => seat !== seatNumber)
    );
  };

  useEffect(() => {
    onSeatSelection(selectedSeats);
  }, [selectedSeats, onSeatSelection]);

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedMovie, selectedTime, selectedDate]);

  return (
    <div className="px-4 max-w-4xl mx-auto">
      <div className="movie-complex">
        <div className="flex justify-center gap-6 mb-6">
          {/* Column 1 */}
          <div className="flex flex-col">
            {GenerateSeats([1, 2, 3, 4], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([5, 6, 7, 8], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([9, 10, 11, 12], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
          </div>
          {/* Column 2 */}
          <div className="flex flex-col">
            {GenerateSeats([13, 14, 15, 16, 17], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([18, 19, 20, 21, 22], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([23, 24, 25, 26, 27], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([28, 29, 30, 31, 32], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
          </div>
          {/* Column 3 */}
          <div className="flex flex-col">
            {GenerateSeats([33, 34, 35, 36], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([37, 38, 39, 40], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([41, 42], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([43, 44], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
          </div>
        </div>
      </div>

      <div className="bg-gray-600 text-white text-center font-semibold rounded-md py-2 shadow-md max-w-md mx-auto mb-4 tracking-widest">
        Pantalla
      </div>

    
    </div>
  );
};

export default SeatMatrix;
