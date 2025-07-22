import React, { useContext } from 'react';
import MovieContext from '../../contexts/MovieContext';

const TimeBlock = ({ selectedTime, handleTimeChange }) => {
  const { movies } = useContext(MovieContext);

  const selectedMovie = movies.selectedMovie;
  const showtimes = selectedMovie ? movies.movieNames[selectedMovie].showtimes : [];

  return (
    <div>
      <h4>Selecciona un horario</h4>
      <div className="time-buttons">
        {showtimes.map((showtime, index) => (
          <button
            key={index}
            className={`time-button ${selectedTime === showtime.time ? 'selected' : ''}`}
            onClick={() => handleTimeChange(showtime.time)}
          >
            {showtime.time} - Sala {showtime.room}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeBlock;

