import React, { useState, useEffect } from 'react';
import db from '../../../utils/firebase';

const normalizeDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};

const Seat = ({ seatno, onSeatSelected, selectedMovie, selectedTime, selectedDate }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const seatClickHandler = () => {
    if (isRegistered) return;
    const newState = !isSelected;
    setIsSelected(newState);
    onSeatSelected(newState, seatno);
  };

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

  const seatClasses = `
    flex items-center justify-center
    w-5 h-5 sm:w-6 sm:h-6
    text-[9px] sm:text-[10px] font-medium
    rounded-sm
    transition-colors transition-transform duration-150
    ${isRegistered
      ? 'bg-gray-200 cursor-not-allowed'
      : isSelected
        ? 'bg-gray-800 text-white scale-105'
        : 'bg-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 cursor-pointer'}
  `;

  return (
    <div className="p-[2px]">
      <div
        className={seatClasses}
        onClick={seatClickHandler}
        style={isRegistered ? { pointerEvents: 'none' } : {}}
      >
        {isSelected && seatno}
      </div>
    </div>
  );
};

export default Seat;
