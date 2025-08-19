import React, { useContext } from "react";
import MovieContext from "../../contexts/MovieContext";

const PriceCalculator = ({ selectedSeats = [], selectedFood = [], freeSnacks = [] }) => {
  const { movies } = useContext(MovieContext);

  // Precio base por asientos
  const seatPrice = movies.moviePrice * selectedSeats.length;

  // Precio de snacks seleccionados
  const foodPrice = selectedFood.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const totalPrice = seatPrice + foodPrice;

  return (
    <div>
      <p>
        Selected {selectedSeats.length} seats. Total price: {totalPrice.toFixed(2)} €
      </p>

      {selectedFood.length > 0 && (
        <p>
          Selected snacks: {selectedFood.map(f => `${f.name} x${f.quantity}`).join(", ")}
        </p>
      )}

      {freeSnacks.length > 0 && (
        <p>
          Free snacks included: {freeSnacks.map(f => f.name).join(", ")}
        </p>
      )}
    </div>
  );
};

export default PriceCalculator;
