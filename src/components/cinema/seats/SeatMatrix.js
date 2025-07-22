import React, { useState, useEffect } from "react";
import Seat from "./Seat";
import '../../styles/Seat.css';


// Función que genera una fila de asientos
const GenerateSeats = (seatNumbers, onSeatSelected, selectedMovie, selectedTime, selectedDate) => (
  <div className="row">
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

  // Maneja el cambio en la selección de asientos
  const handleSeatSelected = (isSelected, seatNumber) => {
    setSelectedSeats(prevSeats =>
      isSelected
        ? [...prevSeats, seatNumber]
        : prevSeats.filter(seat => seat !== seatNumber)
    );
  };

  // Notifica al componente padre los asientos seleccionados
  useEffect(() => {
    onSeatSelection(selectedSeats);
  }, [selectedSeats, onSeatSelection]);

  // Reset de selección al cambiar película, hora o fecha
  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedMovie, selectedTime, selectedDate]);

  return (
    <div>
      <h4>Selecciona el asiento</h4>
      <div className="movie-complex">
        <div className="container row movie-layout">
          <div className="movie-column-1">
            {GenerateSeats([1, 2, 3, 4], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([5, 6, 7, 8], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([9, 10, 11, 12], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
          </div>
          <div className="movie-column-2">
            {GenerateSeats([13, 14, 15, 16, 17], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([18, 19, 20, 21, 22], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([23, 24, 25, 26, 27], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([28, 29, 30, 31, 32], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
          </div>
          <div className="movie-column-3">
            {GenerateSeats([33, 34, 35, 36], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([37, 38, 39, 40], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([41, 42], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
            {GenerateSeats([43, 44], handleSeatSelected, selectedMovie, selectedTime, selectedDate)}
          </div>
        </div>
      </div>
      <div className="cinema-screen">Pantalla</div>
      <p>Asientos seleccionados: {selectedSeats.join(", ")}</p>
    </div>
  );
};

export default SeatMatrix;
