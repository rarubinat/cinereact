import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { foodData } from "../../data/foodData";

const SnacksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedMovie,
    selectedDate,
    selectedTime,
    selectedSeats = [],
    room,
    moviePrice = 0,
    image,
  } = location.state || {};

  const [snacks, setSnacks] = useState([]);

  const handleAddSnack = (item) => {
    setSnacks((prev) => {
      const existing = prev.find((s) => s.id === item.id);
      if (existing) {
        return prev; // ya agregado
      } else {
        return [
          ...prev,
          {
            id: item.id,
            snack: item.name,
            price: item.price,
            quantity: 1,
            foodPrice: item.price,
            QuantitySnack: 1,
          },
        ];
      }
    });
  };

  const handleIncrease = (id) => {
    setSnacks((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              quantity: s.quantity + 1,
              foodPrice: (s.quantity + 1) * s.price,
              QuantitySnack: s.quantity + 1,
            }
          : s
      )
    );
  };

  const handleDecrease = (id) => {
    setSnacks((prev) =>
      prev
        .map((s) =>
          s.id === id
            ? {
                ...s,
                quantity: s.quantity - 1,
                foodPrice: (s.quantity - 1) * s.price,
                QuantitySnack: s.quantity - 1,
              }
            : s
        )
        .filter((s) => s.quantity > 0)
    );
  };

  const snacksTotal = snacks.reduce((acc, s) => acc + s.foodPrice, 0);
  const seatsTotal = selectedSeats.length * moviePrice;
  const grandTotal = seatsTotal + snacksTotal;

  const handleProceedToPayment = () => {
    navigate("/Payment", {
      state: {
        selectedMovie,
        selectedDate,
        selectedTime,
        selectedSeats,
        room,
        image,
        snacks: snacks.length > 0 ? snacks : [],
        foodPrice: snacksTotal,
        totalPrice: grandTotal,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Snacks & Drinks</h1>

      {/* Snacks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {foodData.map((item) => {
          const snackItem = snacks.find((s) => s.id === item.id);
          return (
            <div
              key={item.id}
              className="bg-gray-50 border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <p className="text-black font-semibold mt-2">
                {item.price.toFixed(2)} €
              </p>

              {/* Controles de cantidad */}
              {!snackItem ? (
                <button
                  onClick={() => handleAddSnack(item)}
                  className="mt-4 w-full py-2 rounded-full text-white bg-black hover:bg-gray-800 transition"
                >
                  Add
                </button>
              ) : (
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="bg-gray-300 px-3 py-1 rounded-full hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span className="font-semibold">{snackItem.QuantitySnack}</span>
                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="bg-gray-300 px-3 py-1 rounded-full hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Opción de continuar sin snacks */}
      <div className="mb-6 text-center">
        <button
          onClick={() =>
            navigate("/Payment", {
              state: {
                selectedMovie,
                selectedDate,
                selectedTime,
                selectedSeats,
                room,
                image,
                snacks: [],
                foodPrice: 0,
                totalPrice: seatsTotal,
              },
            })
          }
          className="mt-2 w-full py-3 px-6 rounded-full font-semibold text-white bg-gray-500 hover:bg-gray-600 transition"
        >
          No quiero snacks, continuar
        </button>
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <p>
          <strong>Seats:</strong> {selectedSeats.join(", ")} ({seatsTotal.toFixed(2)} €)
        </p>

        {snacks.length > 0 && (
          <ul>
            {snacks.map((s) => (
              <li key={s.id} className="flex justify-between items-center my-1">
                <span>
                  {s.snack} x{s.QuantitySnack} — {s.foodPrice.toFixed(2)} €
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDecrease(s.id)}
                    className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleIncrease(s.id)}
                    className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="font-bold text-lg mt-2">Total: {grandTotal.toFixed(2)} €</p>

        <button
          onClick={handleProceedToPayment}
          className="mt-4 w-full py-3 px-6 rounded-full font-semibold text-white bg-black hover:bg-gray-800 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default SnacksPage;
