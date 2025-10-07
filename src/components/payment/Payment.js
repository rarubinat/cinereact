import { useLocation, useNavigate } from "react-router-dom"; // Hooks to access location and navigate programmatically
import { useState, useEffect } from "react";
import db, { auth } from "../../utils/firebase"; // Firebase Firestore and auth
import ProgressBar from "./../../context/ProgressBar"; // Component to show multi-step progress

// --- Generate a unique ticket ID ---
const generateTicketId = () => {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36
  const random = Math.random().toString(36).substring(2, 6); // Generate random string
  return `T-${timestamp}-${random}`.toUpperCase(); // Format as ticket ID
};

// --- Helper to parse birthdate into day and month ---
const parseBirthdateToDayMonth = (raw) => {
  if (!raw) return null;

  // Handle Firestore Timestamp objects
  if (typeof raw?.toDate === "function") {
    const d = raw.toDate();
    return { day: d.getDate(), month: d.getMonth() + 1 };
  }

  // Handle Date objects
  if (raw instanceof Date && !isNaN(raw)) {
    return { day: raw.getDate(), month: raw.getMonth() + 1 };
  }

  // Handle string formats
  if (typeof raw === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [y, m, d] = raw.split("-").map(Number);
      return { day: d, month: m };
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
      const [d, m] = raw.split("/").map(Number);
      return { day: d, month: m };
    }
    const t = new Date(raw);
    if (!isNaN(t)) return { day: t.getDate(), month: t.getMonth() + 1 };
  }

  return null;
};

const Payment = () => {
  const location = useLocation(); // Access state passed from previous page
  const navigate = useNavigate(); // Programmatic navigation

  // Destructure reservation data from location state
  const {
    selectedMovie,
    selectedDate,
    selectedTime,
    selectedSeats = [],
    selectedRow, // ✅ Row number selected
    room,
    totalPrice = 0,
    selectedFood = [],
    foodPrice = 0,
  } = location.state || {};

  // --- Payment form state ---
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/34");
  const [cvv, setCvv] = useState("123");
  const [name, setName] = useState("John Doe");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingCountry, setBillingCountry] = useState("Spain");
  const [loading, setLoading] = useState(false); // Loading state for async payment
  const [alert, setAlert] = useState({ message: "", visible: false }); // Alert message state
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirmation modal
  const [paymentCompleted, setPaymentCompleted] = useState(false); // Payment success flag
  const [reservationData, setReservationData] = useState(null); // Store reservation info after payment

  const seatPrice = totalPrice - foodPrice; // Calculate seat-only price
  const snacksString = selectedFood.map((s) => s.snack).join(", "); // Join selected snacks into string

  // --- Show alert messages temporarily ---
  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  // --- Format credit card input ---
  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim(); // Add space every 4 digits
  const formatExpiry = (value) =>
    value.replace(/\D/g, "").replace(/(\d{2})(\d{1,2})?/, (_, m1, m2) =>
      m2 ? `${m1}/${m2}` : m1
    ); // Format as MM/YY

  // --- Handle payment submission ---
  const handlePayment = async () => {
    // Validate required fields
    if (!name || !cardNumber || !expiry || !cvv || !billingEmail)
      return showAlert("Please fill all payment details.");

    setLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return showAlert("You must be logged in to pay.");
    }

    // Prepare reservation object
    const reservation = {
      userId: currentUser.uid,
      email: currentUser.email,
      selectedMovie,
      selectedDate,
      selectedTime,
      selectedSeats,
      row: selectedRow || null, // ✅ Save selected row
      room,
      timestamp: new Date(),
      totalPrice,
      seatPrice,
      foodPrice,
      ticketId: generateTicketId(),
      billingEmail,
      billingCountry,
      snacks: snacksString,
    };

    try {
      await db.collection("reservas").add(reservation); // Save reservation in Firestore
      setReservationData(reservation); // Store locally
      localStorage.setItem("lastReservation", JSON.stringify(reservation)); // Persist locally
      setPaymentCompleted(true);
    } catch (error) {
      console.error(error);
      showAlert("Error saving reservation. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Guard for missing reservation data ---
  if (!selectedMovie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-8">
        <p className="text-xl font-semibold">No reservation data found.</p>
      </div>
    );
  }

  // --- Navigate to confirmation page after payment ---
  if (paymentCompleted && reservationData) {
    navigate("/confirmation", { state: { reservationData } });
    return null;
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto text-gray-900">
      {/* Progress bar for multi-step reservation */}
      <ProgressBar currentStep="Payment" />

      {/* Alert message */}
      {alert.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
          <div className="flex items-center gap-3 bg-red-100 text-red-800 px-4 py-3 rounded-2xl shadow-sm border border-red-300">
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      {/* Reservation summary */}
      <h3 className="text-3xl font-bold text-black mb-6">Reservation Summary</h3>
      <div className="p-3 md:p-4 bg-gray-50 border rounded-lg space-y-4 text-sm mb-8">
        <h4 className="text-xs md:text-sm font-semibold tracking-wide border-b pb-1 mb-2">
          Tickets
        </h4>

        {/* Show row number */}
        <p className="text-xs text-gray-600 mb-1">
          Row: <strong>{selectedRow || "-"}</strong>
        </p>

        {/* List selected seats */}
        {selectedSeats.map((seat, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-xs md:text-sm py-1"
          >
            <span>
              Seat {seat} {selectedRow && <span className="text-gray-500">(Row {selectedRow})</span>}
            </span>
            <span>{(seatPrice / selectedSeats.length).toFixed(2)} €</span>
          </div>
        ))}

        {/* Snacks summary */}
        {selectedFood.length > 0 && (
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-wide border-b pb-1 mb-2">
              Snacks
            </h4>
            {selectedFood.map((s) => (
              <div
                key={s.id}
                className="flex justify-between text-xs md:text-sm py-1"
              >
                <span>
                  {s.snack} x{s.quantity}
                </span>
                <span>{(s.quantity * s.price).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}

        {/* Total price */}
        <div className="border-t pt-2 flex justify-between font-bold text-base uppercase">
          <span>Total</span>
          <span>{totalPrice.toFixed(2)} €</span>
        </div>
      </div>

      {/* Payment form */}
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
          {loading ? "Processing..." : `Pay ${totalPrice.toFixed(2)} €`}
        </button>
      </div>

      {/* Confirm payment modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-black mb-4">Confirm Payment</h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to proceed with the payment of{" "}
              <strong>{totalPrice.toFixed(2)} €</strong>?
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
                  handlePayment(); // Trigger payment logic
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
