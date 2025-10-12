import React, { useContext } from "react";
import MovieContext from "../../contexts/MovieContext";

/**
 * PriceCalculator component
 * Calculates the total price of selected seats and snacks.
 *
 * @param {Array} selectedSeats - Array of selected seat numbers
 * @param {Array} selectedFood - Array of selected food items ({name, price, quantity})
 * @param {Array} freeSnacks - Array of free snacks included ({name})
 */
const PriceCalculator = ({ selectedSeats = [], selectedFood = [], freeSnacks = [] }) => {
  const { movies } = useContext(MovieContext);

  // Calculate the total price of seats
  const seatPrice = movies.moviePrice * selectedSeats.length;

  // Calculate total price of selected snacks (price * quantity)
  const foodPrice = selectedFood.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Total price = seats + selected snacks
  const totalPrice = seatPrice + foodPrice;

  return (
    <div>
      {/* Display total seats and total price */}
      <p>
        Selected {selectedSeats.length} seats. Total price: {totalPrice.toFixed(2)} €
      </p>

      {/* Display selected snacks if any */}
      {selectedFood.length > 0 && (
        <p>
          Selected snacks: {selectedFood.map(f => `${f.name} x${f.quantity}`).join(", ")}
        </p>
      )}

      {/* Display free snacks if any */}
      {freeSnacks.length > 0 && (
        <p>
          Free snacks included: {freeSnacks.map(f => f.name).join(", ")}
        </p>
      )}
    </div>
  );
};

export default PriceCalculator;
