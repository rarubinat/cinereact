// Component to select snacks and drinks during movie booking and proceed to payment.
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { foodData } from "../../data/foodData"; // Array of snack items
import ProgressBar from "./../../context/ProgressBar"; // Component to show multi-step progress

const SnacksPage = () => {
  // ----------------- Access navigation state -----------------
  const location = useLocation(); // Previous page state (movie, seats, etc.)
  const navigate = useNavigate();

  // Destructure relevant data from location.state, with defaults
  const {
    selectedMovie,
    selectedDate,
    selectedTime,
    selectedSeats = [],
    selectedRow, // The row user selected for seats
    room,
    moviePrice = 0,
    image,
  } = location.state || {};

  // ----------------- Local state -----------------
  const [snacks, setSnacks] = useState([]); // Selected snacks
  const [skipModal, setSkipModal] = useState(false); // Modal if user skips snacks

  // ----------------- Handlers for snack selection -----------------

  // Add a snack (with initial quantity 1)
  const handleAddSnack = (item) => {
    setSnacks((prev) => {
      const existing = prev.find((s) => s.id === item.id);
      if (existing) return prev; // Do not add duplicate
      return [
        ...prev,
        {
          id: item.id,
          snack: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  // Increase quantity of a selected snack
  const handleIncrease = (id) => {
    setSnacks((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: s.quantity + 1 } : s
      )
    );
  };

  // Decrease quantity or remove snack if quantity reaches 0
  const handleDecrease = (id) => {
    setSnacks((prev) =>
      prev
        .map((s) =>
          s.id === id ? { ...s, quantity: s.quantity - 1 } : s
        )
        .filter((s) => s.quantity > 0)
    );
  };

  // ----------------- Calculate totals -----------------
  const snacksTotal = snacks.reduce((acc, s) => acc + s.quantity * s.price, 0);
  const seatsTotal = selectedSeats.length * moviePrice;
  const grandTotal = seatsTotal + snacksTotal;

  // ----------------- Navigation to payment -----------------

  // Proceed with snacks selected
  const handleProceedToPayment = () => {
    if (snacks.length === 0) {
      // Show confirmation modal if no snacks
      setSkipModal(true);
    } else {
      // Navigate to Payment page with snacks and totals
      navigate("/Payment", {
        state: {
          selectedMovie,
          selectedDate,
          selectedTime,
          selectedSeats,
          selectedRow, // Pass selected row
          room,
          image,
          selectedFood: snacks,
          foodPrice: snacksTotal,
          totalPrice: grandTotal,
        },
      });
    }
  };

  // Confirm skipping snacks
  const handleConfirmSkipSnacks = () => {
    navigate("/Payment", {
      state: {
        selectedMovie,
        selectedDate,
        selectedTime,
        selectedSeats,
        selectedRow, // Include row
        room,
        image,
        selectedFood: [],
        foodPrice: 0,
        totalPrice: seatsTotal,
      },
    });
  };

  // Style for headers in order summary
  const smallCapsStyle = { fontVariantCaps: "small-caps" };

  // ----------------- Render -----------------
  return (
    <div className="min-h-screen text-gray-900 p-8 max-w-5xl mx-auto">
      {/* Progress bar shows current step */}
      <ProgressBar currentStep="Snacks" />

      <h3 className="text-3xl font-bold text-black mb-6">
        Get your snacks or drinks
      </h3>

      {/* ----------------- Snack selection grid ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {foodData.map((item) => {
          const snackItem = snacks.find((s) => s.id === item.id); // check if already selected
          return (
            <div
              key={item.id}
              className="bg-gray-50 border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition flex flex-col"
            >
              {/* Snack info */}
              <div className="flex-grow">
                <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-black font-semibold mt-2">{item.price.toFixed(2)} €</p>
              </div>

              {/* Add or adjust quantity */}
              <div className="mt-4">
                {!snackItem ? (
                  <button
                    onClick={() => handleAddSnack(item)}
                    className="w-full py-2 rounded-full text-white bg-black hover:bg-gray-800 transition"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center justify-center space-x-4">
                    <button onClick={() => handleDecrease(item.id)} className="bg-gray-300 px-3 py-1 rounded-full hover:bg-gray-400">-</button>
                    <span className="font-semibold">{snackItem.quantity}</span>
                    <button onClick={() => handleIncrease(item.id)} className="bg-gray-300 px-3 py-1 rounded-full hover:bg-gray-400">+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Option to skip snacks */}
        <div className="bg-gray-200 border rounded-2xl p-6 text-center flex flex-col justify-center items-center shadow-sm hover:shadow-lg transition">
          <div className="flex-grow flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-2">No snacks?</h3>
            <p className="text-gray-600 text-sm">Continue directly to payment.</p>
          </div>
          <button
            onClick={() => setSkipModal(true)}
            className="mt-4 w-full py-2 rounded-full font-semibold text-white bg-gray-700 hover:bg-black transition"
          >
            Continue to Payment
          </button>
        </div>
      </div>

      {/* ----------------- Order summary ----------------- */}
      <h3 className="text-xl md:text-2xl font-bold text-black mb-4">Order Summary</h3>
      <div className="p-3 md:p-4 bg-gray-50 border rounded-lg space-y-4 text-sm">
        {/* Tickets */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold tracking-wide border-b pb-1 mb-2" style={smallCapsStyle}>tickets</h4>
          <p className="text-xs text-gray-600 mb-1">Row: <strong>{selectedRow || "-"}</strong></p>
          {selectedSeats.map((seat, idx) => (
            <div key={idx} className="flex justify-between text-xs md:text-sm py-1">
              <span>Seat {seat}</span>
              <span>{moviePrice.toFixed(2)} €</span>
            </div>
          ))}
        </div>

        {/* Snacks */}
        {snacks.length > 0 && (
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-wide border-b pb-1 mb-2" style={smallCapsStyle}>snacks</h4>
            {snacks.map((s) => (
              <div key={s.id} className="flex justify-between text-xs md:text-sm py-1">
                <span>{s.snack} x{s.quantity}</span>
                <span>{(s.quantity * s.price).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}

        {/* Grand total */}
        <div className="border-t pt-2 flex justify-between font-bold text-base uppercase">
          <span>Total</span>
          <span>{grandTotal.toFixed(2)} €</span>
        </div>
      </div>

      {/* ----------------- Proceed button ----------------- */}
      <button onClick={handleProceedToPayment} className="mt-6 w-full py-3 px-6 rounded-full font-semibold text-white bg-black hover:bg-gray-800 transition">
        Proceed to Payment
      </button>

      {/* ----------------- Skip snacks modal ----------------- */}
      {skipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-black mb-2">Skip snacks?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to continue without adding snacks?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSkipModal(false)} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800">Go back</button>
              <button onClick={handleConfirmSkipSnacks} className="px-4 py-2 rounded-full bg-black text-white hover:opacity-90">Yes, continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnacksPage;
