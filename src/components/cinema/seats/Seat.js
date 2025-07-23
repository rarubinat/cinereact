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
    flex items-center justify-center rounded-t-full
    text-[10px] sm:text-xs font-bold shadow-md
    w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 
    transition-transform duration-200
    ${isRegistered ? 'bg-red-700 opacity-70 cursor-not-allowed' :
      isSelected ? 'bg-blue-600 text-white scale-110' :
      'bg-gray-400 hover:bg-blue-400 hover:scale-105 cursor-pointer'}
  `;

  return (
    <div className="p-1">
      <div className={seatClasses} onClick={seatClickHandler} style={isRegistered ? { pointerEvents: 'none' } : {}}>
        {isSelected && seatno}
      </div>
    </div>
  );
};

export default Seat;
