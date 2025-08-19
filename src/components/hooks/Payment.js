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

  // Descuentos
  const availableDiscounts = [
    { id: 1, name: "10% Off", value: 0.1 },
    { id: 2, name: "20% Off", value: 0.2 },
    { id: 3, name: "Student 15% Off", value: 0.15 },
  ];
  const [selectedDiscount, setSelectedDiscount] = useState(null);

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

  // Precios con descuento
  const seatPrice = totalPrice - (foodPrice || 0);
  const discountedSeatPrice = selectedDiscount
    ? seatPrice * (1 - selectedDiscount.value)
    : seatPrice;
  const discountedTotalPrice = discountedSeatPrice + (foodPrice || 0);

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

    const reservation = {
      userId: currentUser.uid,
      email: currentUser.email,
      selectedMovie,
      selectedDate,
      selectedTime,
      selectedSeats,
      room,
      timestamp: new Date(),
      totalPrice: discountedTotalPrice,
      seatPrice: discountedSeatPrice,
      foodPrice: foodPrice || 0,
      ticketId: generateTicketId(),
      billingEmail,
      billingCountry,
      snacks: selectedFood || [],
      appliedDiscount: selectedDiscount || null,
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

          {reservationData.appliedDiscount && (
            <p>
              <strong>Discount:</strong> {reservationData.appliedDiscount.name}
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
          <strong>Seat Price:</strong> {discountedSeatPrice.toFixed(2)} €
        </p>
        {foodPrice > 0 && (
          <p>
            <strong>Food Price:</strong> {foodPrice.toFixed(2)} €
          </p>
        )}

        {/* Selector de descuentos */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Discount</label>
          <select
            value={selectedDiscount?.id || ""}
            onChange={(e) =>
              setSelectedDiscount(
                availableDiscounts.find((d) => d.id === parseInt(e.target.value)) ||
                  null
              )
            }
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black mb-4"
          >
            <option value="">No discount</option>
            {availableDiscounts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-2 text-xl font-bold">
          Total: {discountedTotalPrice.toFixed(2)} €
        </p>
      </div>

      {/* Formulario de pago */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name on Card"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
        <input
          type="text"
          value={formatCardNumber(cardNumber)}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="Card Number"
          maxLength={19}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
        <div className="flex gap-4">
          <input
            type="text"
            value={formatExpiry(expiry)}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
          />
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="CVV"
            maxLength={4}
            className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
          />
        </div>
        <input
          type="email"
          value={billingEmail}
          onChange={(e) => setBillingEmail(e.target.value)}
          placeholder="Billing Email"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
        <input
          type="text"
          value={billingCountry}
          onChange={(e) => setBillingCountry(e.target.value)}
          placeholder="Billing Country"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 text-white rounded-full font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Processing..." : `Pay ${discountedTotalPrice.toFixed(2)} €`}
        </button>
      </div>
    </div>
  );
};

export default Payment;
