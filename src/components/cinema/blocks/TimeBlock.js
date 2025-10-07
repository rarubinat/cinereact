// TimeBlock.js
// Component to display showtimes for a selected movie and allow the user to choose one

import React, { useContext } from 'react';
import MovieContext from '../../../contexts/MovieContext';

/**
 * TimeBlock Component
 * Props:
 *  - selectedTime: currently selected showtime string (e.g., "10:00 AM")
 *  - handleTimeChange: callback function when a time is clicked
 */
const TimeBlock = ({ selectedTime, handleTimeChange }) => {
  // Access movie data from MovieContext
  const { movies } = useContext(MovieContext);

  // Currently selected movie name
  const selectedMovie = movies.selectedMovie;

  // Retrieve showtimes for the selected movie or empty array if none selected
  const showtimes = selectedMovie ? movies.movieNames[selectedMovie].showtimes : [];

  return (
    <div>
      {/* Section title */}
      <h4>Select a film</h4>

      {/* Showtimes buttons */}
      <div className="time-buttons">
        {showtimes.map((showtime, index) => (
          <button
            key={index} // unique key for each button
            className={`time-button ${selectedTime === showtime.time ? 'selected' : ''}`} // highlight button if selected
            onClick={() => handleTimeChange(showtime.time)} // notify parent component of selection
          >
            {showtime.time} - ROOM {showtime.room} {/* Display time and room */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeBlock;
