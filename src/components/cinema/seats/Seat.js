import React, { useState, useEffect } from 'react';
import db from '../../../utils/firebase';
import '../../styles/Seat.css';

// Función para normalizar fecha
const normalizeDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};

const Seat = ({ seatno, onSeatSelected, selectedMovie, selectedTime, selectedDate }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Manejo de selección de asiento
  const seatClickHandler = () => {
    if (isRegistered) return; // No permitir clic si está ocupado

    const newState = !isSelected;
    setIsSelected(newState);
    onSeatSelected(newState, seatno);
  };

  // Verificar si el asiento está registrado en Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const normalizedDate = normalizeDate(selectedDate);
        const snapshot = await db.collection('reservas')
          .where('selectedSeats', 'array-contains', seatno)
          .where('selectedMovie', '==', selectedMovie)
          .where('selectedTime', '==', selectedTime)
          .where('selectedDate', '==', normalizedDate)
          .get();

        setIsRegistered(!snapshot.empty);
      } catch (error) {
        console.error('Error al verificar el asiento registrado:', error);
      }
    };
    fetchData();
  }, [seatno, selectedMovie, selectedTime, selectedDate]);

  // Clases CSS basadas en estado
  const seatStatus = isSelected ? 'seat-blue' : isRegistered ? 'seat-red' : 'seat-grey';
  const seatStyle = isRegistered ? { pointerEvents: 'none' } : {};

  return (
    <div className="col-2 col-md-2">
      <div
        className={`seat seat-${seatno} ${seatStatus}`}
        onClick={seatClickHandler}
        style={seatStyle}
      >
        {isSelected && `${seatno}`}
      </div>
    </div>
  );
};

export default Seat;
