import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import db, { auth } from "../../utils/firebase";
import ProgressBar from "./../../context/ProgressBar";
import ApplyOffers from "./../hooks/DiscountSelector";

// --- Generar ID único de ticket ---
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
    selectedSeats = [],
    selectedRow,
    room,
    totalPrice = 0,
    selectedFood = [],
    foodPrice = 0,
  } = location.state || {};

  // --- Estados de formulario ---
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/34");
  const [cvv, setCvv] = useState("123");
  const [name, setName] = useState("John Doe");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingCountry, setBillingCountry] = useState("Spain");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", visible: false });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  // --- Descuento ---
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // --- Precios ---
  const seatsTotal = selectedSeats.length > 0 ? totalPrice - foodPrice : 0;

  const snacksItems = selectedFood.map((s) => ({
    id: s.id,
    name: s.snack,
    price: s.price,
    quantity: s.quantity,
    total: s.price * s.quantity,
  }));

  const snacksPrice = snacksItems.reduce((sum, item) => sum + item.total, 0);

  const discountValue = selectedDiscount ? selectedDiscount.value : 0;
  const totalBeforeDiscount = seatsTotal + snacksPrice;
  const totalAfterDiscount = Math.max(totalBeforeDiscount * (1 - discountValue), 0);

  // --- Alert helper ---
  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  // --- Input formatters ---
  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (value) =>
    value.replace(/\D/g, "").replace(/(\d{2})(\d{1,2})?/, (_, m1, m2) =>
      m2 ? `${m1}/${m2}` : m1
    );

  // --- Procesar pago ---
  const handlePayment = async () => {
    if (!name || !cardNumber || !expiry || !cvv || !billingEmail)
      return showAlert("Please fill all payment details.");

    setLoading(true);
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return showAlert("You must be logged in to pay.");
    }

    const reservation = {
      userId: currentUser.uid,
      email: currentUser.email,
      selectedMovie,
      selectedDate,
      selectedTime,
      selectedSeats,
      row: selectedRow || null,
      room,
      timestamp: new Date(),
      originalPrice: totalBeforeDiscount,
      seatsTotal,
      snacks: snacksItems,
      discountApplied: selectedDiscount ? selectedDiscount.name : null,
      discountValue,
      totalPrice: totalAfterDiscount,
      ticketId: generateTicketId(),
      billingEmail,
      billingCountry,
    };

    try {
      await db.collection("reservas").add(reservation);
      setReservationData(reservation);
      localStorage.setItem("lastReservation", JSON.stringify(reservation));
      setPaymentCompleted(true);
    } catch (error) {
      console.error(error);
      showAlert("Error saving reservation. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Guard ---
  if (!selectedMovie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-8">
        <p className="text-xl font-semibold">No reservation data found.</p>
      </div>
    );
  }

  if (paymentCompleted && reservationData) {
    navigate("/confirmation", { state: { reservationData } });
    return null;
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto text-gray-900">
      <ProgressBar currentStep="Payment" />

      {alert.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
          <div className="flex items-center gap-3 bg-red-100 text-red-800 px-4 py-3 rounded-2xl shadow-sm border border-red-300">
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      {/* Resumen */}
      <h3 className="text-3xl font-bold text-black mb-6">Reservation Summary</h3>
      <div className="p-3 md:p-4 bg-gray-50 border rounded-lg space-y-4 text-sm mb-8">
        <h4 className="text-xs md:text-sm font-semibold tracking-wide border-b pb-1 mb-2">Tickets</h4>
        <p className="text-xs text-gray-600 mb-1">Row: <strong>{selectedRow || "-"}</strong></p>
        {selectedSeats.map((seat, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs md:text-sm py-1">
            <span>Seat {seat}</span>
            <span>{(seatsTotal / selectedSeats.length).toFixed(2)} €</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-sm border-t pt-1">
          <span>Seats Total</span>
          <span>{seatsTotal.toFixed(2)} €</span>
        </div>

        {snacksItems.length > 0 && (
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-wide border-b pb-1 mb-2">Snacks</h4>
            {snacksItems.map((s) => (
              <div key={s.id} className="flex justify-between text-xs md:text-sm py-1">
                <span>{s.name} x{s.quantity}</span>
                <span>{s.total.toFixed(2)} €</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-sm border-t pt-1">
              <span>Snacks Total</span>
              <span>{snacksPrice.toFixed(2)} €</span>
            </div>
          </div>
        )}

        {/* Descuentos */}
        <ApplyOffers
          selectedDate={selectedDate}
          selectedSeats={selectedSeats}
          onSelectDiscount={setSelectedDiscount}
        />

        {/* Total final */}
        <div className="border-t pt-2 font-bold text-base uppercase space-y-1">
          {selectedDiscount ? (
            <>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Discount ({selectedDiscount.name})</span>
                <span>-{(totalBeforeDiscount * discountValue).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-black text-lg mt-1">
                <span>Final Total</span>
                <span>{totalAfterDiscount.toFixed(2)} €</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-black text-lg mt-1">
              <span>Total</span>
              <span>{totalBeforeDiscount.toFixed(2)} €</span>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de pago */}
      <h3 className="text-3xl font-bold text-black mb-6">Payment details</h3>
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Cardholder Name"
            className="p-3 border rounded-2xl w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Card Number"
            className="p-3 border rounded-2xl w-full"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          />
          <input
            placeholder="MM/YY"
            className="p-3 border rounded-2xl w-full"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
          />
          <input
            placeholder="CVV"
            className="p-3 border rounded-2xl w-full"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <input
          type="email"
          placeholder="Billing Email"
          className="p-3 border rounded-2xl w-full"
          value={billingEmail}
          onChange={(e) => setBillingEmail(e.target.value)}
        />
        <input
          placeholder="Billing Country"
          className="p-3 border rounded-2xl w-full"
          value={billingCountry}
          onChange={(e) => setBillingCountry(e.target.value)}
        />
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={loading}
          className={`w-full py-3 rounded-full text-white font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Processing..." : `Pay ${totalAfterDiscount.toFixed(2)} €`}
        </button>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-black mb-4">Confirm Payment</h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to proceed with the payment of{" "}
              <strong>{totalAfterDiscount.toFixed(2)} €</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handlePayment();
                }}
                className="px-4 py-2 rounded-full bg-black text-white hover:opacity-90"
              >
                Yes, Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
