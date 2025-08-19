import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import db, { auth } from "../../utils/firebase";

// Generar ID único de ticket
const generateTicketId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `T-${timestamp}-${random}`.toUpperCase();
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedMovie,
    selectedDate,
    selectedTime,
    selectedSeats,
    room,
    totalPrice,
    selectedFood,
    foodPrice,
  } = location.state || {};

  // Estados del formulario
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/34");
  const [cvv, setCvv] = useState("123");
  const [name, setName] = useState("John Doe");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingCountry, setBillingCountry] = useState("Spain");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", visible: false });
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  // Mostrar alerta temporal
  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  // Formateos
  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (value) =>
    value.replace(/\D/g, "").replace(/(\d{2})(\d{1,2})?/, (_, m1, m2) =>
      m2 ? `${m1}/${m2}` : m1
    );

  // Manejo del pago
  const handlePayment = async () => {
    if (!name || !cardNumber || !expiry || !cvv || !billingEmail)
      return showAlert("Please fill in all payment details.");
    if (cardNumber.replace(/\s/g, "").length !== 16)
      return showAlert("Card number must be 16 digits.");
    if (!/^\d{2}\/\d{2}$/.test(expiry))
      return showAlert("Expiry must be in MM/YY format.");
    if (cvv.length < 3 || cvv.length > 4)
      return showAlert("CVV must be 3 or 4 digits.");

    setLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return showAlert("You must be logged in to make a payment.");
    }

    // Calculamos seatPrice por separado
    const seatPrice = totalPrice - (foodPrice || 0);

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
      seatPrice,
      foodPrice: foodPrice || 0,
      ticketId: generateTicketId(),
      billingEmail,
      billingCountry,
      snacks: selectedFood || [],
    };

    try {
      await db.collection("reservas").add(reservation);
      setReservationData(reservation);
      setPaymentCompleted(true);
    } catch (error) {
      console.error("Error saving reservation:", error);
      showAlert("Error saving the reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedMovie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
        <p className="text-xl font-semibold">No reservation data found.</p>
      </div>
    );
  }

  // ------------------------- Confirmación -------------------------
  if (paymentCompleted && reservationData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-8">
        <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-green-100">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg mb-6">Your reservation has been confirmed.</p>

        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-2 border border-gray-200">
          <p>
            <strong>Ticket ID:</strong> {reservationData.ticketId}
          </p>
          <p>
            <strong>Movie:</strong> {reservationData.selectedMovie}
          </p>
          <p>
            <strong>Date:</strong> {reservationData.selectedDate}
          </p>
          <p>
            <strong>Time:</strong> {reservationData.selectedTime}
          </p>
          <p>
            <strong>Room:</strong> {reservationData.room}
          </p>
          <p>
            <strong>Seats:</strong> {reservationData.selectedSeats.join(", ")}
          </p>

          <p>
            <strong>Seat Price:</strong> {reservationData.seatPrice.toFixed(2)} €
          </p>
          {reservationData.foodPrice > 0 && (
            <p>
              <strong>Food Price:</strong> {reservationData.foodPrice.toFixed(2)} €
            </p>
          )}

          {reservationData.snacks?.length > 0 && (
            <div>
              <strong>Snacks:</strong>
              <ul className="list-disc list-inside">
                {reservationData.snacks.map((s, index) => (
                  <li key={index}>
                    {s.name} x{s.quantity} — {(s.price * s.quantity).toFixed(2)} €
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-2 text-xl font-bold">
            Total: {reservationData.totalPrice.toFixed(2)} €
          </p>
        </div>

        <button
          onClick={() => navigate("/cinema")}
          className="mt-6 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  // ------------------------- Formulario de pago -------------------------
  return (
    <div className="min-h-screen text-gray-900 p-8 max-w-3xl mx-auto relative">
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

      <h3 className="text-3xl font-bold text-black mb-6">Payment</h3>

      {/* Resumen de reserva */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reservation Summary</h2>
        <p>
          <strong>Movie:</strong> {selectedMovie}
        </p>
        <p>
          <strong>Date:</strong> {selectedDate}
        </p>
        <p>
          <strong>Time:</strong> {selectedTime}
        </p>
        <p>
          <strong>Room:</strong> {room}
        </p>
        <p>
          <strong>Seats:</strong> {selectedSeats.join(", ")}
        </p>

        <p>
          <strong>Seat Price:</strong> {(totalPrice - (foodPrice || 0)).toFixed(2)} €
        </p>
        {foodPrice > 0 && (
          <p>
            <strong>Food Price:</strong> {foodPrice.toFixed(2)} €
          </p>
        )}

        {selectedFood?.length > 0 && (
          <div>
            <strong>Snacks:</strong>
            <ul className="list-disc list-inside">
              {selectedFood.map((s, index) => (
                <li key={index}>
                  {s.name} x{s.quantity} — {(s.price * s.quantity).toFixed(2)} €
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-2 text-xl font-bold">Total: {totalPrice.toFixed(2)} €</p>
      </div>

      {/* Formulario de pago */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
            alt="Visa"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
            alt="MasterCard"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg"
            alt="Amex"
            className="h-6"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Cardholder Name</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Expiry</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              maxLength={5}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">CVV</label>
            <input
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Billing Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Billing Country</label>
          <input
            type="text"
            placeholder="Spain"
            value={billingCountry}
            onChange={(e) => setBillingCountry(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 text-white rounded-full font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Processing..." : `Pay ${totalPrice.toFixed(2)} €`}
        </button>
      </div>
    </div>
  );
};

export default Payment;