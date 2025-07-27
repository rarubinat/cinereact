import React, { useContext } from "react";
import MovieContext from "../../contexts/MovieContext"; // Import MovieContext

const PriceCalculator = ({ selectedTime, selectedSeats }) => {
  const { movies } = useContext(MovieContext); // Get the state from MovieContext

  return (
    <div>
      <p>
        Selected {movies.totalSeats} seats and the total price is{" "}
        {movies.totalSeats * movies.moviePrice} €
      </p>
      {/* Calculates and displays the total price based on the number of selected seats
          and the movie price obtained from MovieContext */}
    </div>
  );
};

export default PriceCalculator; // Export PriceCalculator component
