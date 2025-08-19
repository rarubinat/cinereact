import React, { useState, useEffect } from "react";
import Seat from "./Seat";
import "./seatmatrix.css";

const GenerateSeats = (seatNumbers, onSeatSelected, selectedMovie, selectedTime, selectedDate) => (
  <div className="flex justify-center gap-2 mb-2">
    {seatNumbers.map((seatNumber, idx) =>
      seatNumber === null ? (
        <div key={`empty-${idx}`} className="w-5 h-5"></div> // hueco
      ) : (
        <Seat
          key={seatNumber}
          seatno={seatNumber}
          onSeatSelected={onSeatSelected}
          selectedMovie={selectedMovie}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
        />
      )
    )}
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

  // Distribución exacta con 7 filas y longitudes desiguales
  const seatLayout = [
    [null, null, null, 1, 2, 3, null, null, null],                     // Fila 1
    [null, null, 4, 5, 6, 7, 8, null, null],                           // Fila 2
    [null, 9, 10, 11, 12, 13, 14, 15, null],                           // Fila 3
    [16, 17, 18, 19, 20, 21, 22, 23, 24],                              // Fila 4
    [25, 26, 27, 28, 29, 30, 31, 32, 33],                              // Fila 5
    [null, 34, 35, 36, 37, 38, 39, 40, null],                          // Fila 6
    [null, null, 41, 42, 43, 44, 45, null, null]                       // Fila 7
  ];

  return (
    <div className="rounded-xl p-6 max-w-lg mx-auto">
      {/* Leyenda */}
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

     {/* Pantalla curva */}
    <div className="mt-4 flex justify-center">
      <div className="screen-shape text-center text-sm">
        screen
      </div>
    </div>


      {/* Asientos */}
      <div className="mt-4 flex flex-col items-center">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {GenerateSeats(row, handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMatrix;
