// src/pages/cinema/Payment.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import db, { auth } from "../../utils/firebase";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedMovie, selectedDate, selectedTime, selectedSeats, room, totalPrice } = location.state || {};

  // Campos prellenados para demo
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/34");
  const [cvv, setCvv] = useState("123");
  const [name, setName] = useState("John Doe");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", visible: false });

  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{1,2})?/, (_, m1, m2) => m2 ? `${m1}/${m2}` : m1);
  };

  const handlePayment = () => {
    if (!name || !cardNumber || !expiry || !cvv) {
      showAlert("Please fill in all payment details.");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      showAlert("Card number must be 16 digits.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      showAlert("Expiry must be in MM/YY format.");
      return;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      showAlert("CVV must be 3 or 4 digits.");
      return;
    }

    setLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      showAlert("You must be logged in to make a payment.");
      return;
    }

    const reservation = {
      userId: currentUser.uid,
      email: currentUser.email,
      selectedMovie,
      selectedDate,
      selectedTime,
      selectedSeats,
      room,
      timestamp: new Date(),
      totalPrice,
    };

    // Simulación de pago
    setTimeout(() => {
      db.collection("reservas")
        .add(reservation)
        .then(() => {
          setLoading(false);
          navigate("/view-reservations", { state: { paymentSuccess: true } });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error saving reservation:", error);
          showAlert("Error saving the reservation. Please try again.");
        });
    }, 1500);
  };

  if (!selectedMovie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
        <p className="text-xl font-semibold">No reservation data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 max-w-3xl mx-auto relative">
      {/* Alert */}
      {alert.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <div className="flex items-center gap-3 bg-red-100 text-red-800 px-4 py-3 rounded-lg shadow-md border border-red-300">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8">Payment</h1>

      {/* Reservation Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reservation Summary</h2>
        <p><strong>Movie:</strong> {selectedMovie}</p>
        <p><strong>Date:</strong> {selectedDate}</p>
        <p><strong>Time:</strong> {selectedTime}</p>
        <p><strong>Room:</strong> {room}</p>
        <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
        <p className="mt-2 text-xl font-bold">
          Total: {totalPrice.toFixed(2)} €
        </p>
      </div>

      {/* Payment Form */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
          type="text"
          placeholder="Cardholder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        />
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength={19}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 tracking-widest"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={5}
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-3"
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            maxLength={4}
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full mt-6 py-3 px-6 rounded-full font-bold text-white transition ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {loading ? "Processing..." : "Confirm and Pay"}
      </button>
    </div>
  );
};

export default Payment;
