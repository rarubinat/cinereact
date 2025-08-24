import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import db, { auth } from "../../utils/firebase";

// Generar ID único de ticket
const generateTicketId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `T-${timestamp}-${random}`.toUpperCase();
};

// --- Helpers ---
const parseBirthdateToDayMonth = (raw) => {
  if (!raw) return null;

  if (typeof raw?.toDate === "function") {
    const d = raw.toDate();
    return { day: d.getDate(), month: d.getMonth() + 1 };
  }

  if (raw instanceof Date && !isNaN(raw)) {
    return { day: raw.getDate(), month: raw.getMonth() + 1 };
  }

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
    if (!isNaN(t)) {
      return { day: t.getDate(), month: t.getMonth() + 1 };
    }
  }

  return null;
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

  const [bday, setBday] = useState(null);
  const [bdayLoaded, setBdayLoaded] = useState(false);
  const [bdayHasValue, setBdayHasValue] = useState(false);

  useEffect(() => {
    const fetchUserBirthday = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setBdayLoaded(true);
          return;
        }
        const snap = await db.collection("users").doc(currentUser.uid).get();
        const data = snap.data() || {};
        const raw = data.birthdate ?? data.birthday ?? null;
        const parsed = parseBirthdateToDayMonth(raw);
        setBday(parsed);
        setBdayHasValue(!!parsed);
      } catch (e) {
        console.error("Error fetching user birthdate:", e);
      } finally {
        setBdayLoaded(true);
      }
    };
    fetchUserBirthday();
  }, []);

  // ----------------- Descuentos -----------------
  const fixedDiscounts = [
    { id: "none", name: "No discount", value: 0, available: true },
    { id: "d3", name: "Student Discount", value: 0.15, available: true },
  ];

  const [availableDiscounts, setAvailableDiscounts] = useState(fixedDiscounts);
  // Seleccionado por defecto: "No discount"
  const [selectedDiscount, setSelectedDiscount] = useState(fixedDiscounts[0]);

  useEffect(() => {
    if (!selectedDate) return;

    const movieDay = new Date(selectedDate);
    const dayOfWeek = movieDay.getDay(); // 0 = Sunday, 6 = Saturday

    const extraDiscounts = [];

    // 🎉 Weekend Deal
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
    extraDiscounts.push({
      id: "weekend",
      name: "Weekend Deal",
      value: 0.2,
      available: isWeekend && (foodPrice && foodPrice > 0),
      reason: !isWeekend
        ? "Only available on Saturdays and Sundays"
        : !foodPrice
        ? "No food items selected"
        : "",
    });

    // 🎂 Birthday
    const today = new Date();
    const isBirthdayToday =
      !!(bday && bday.day === today.getDate() && bday.month === today.getMonth() + 1);
    extraDiscounts.push({
      id: "bday",
      name: "Birthday Special",
      value: 1,
      available: isBirthdayToday,
      reason: !bdayLoaded
        ? "Checking birthday…"
        : bdayHasValue
        ? isBirthdayToday
          ? ""
          : "Only available on your birthday"
        : "Birthdate not set in profile",
    });

    // 🎟️ 2x1 Tuesday
    if (movieDay.getDay() === 2) {
      extraDiscounts.push({
        id: "tue",
        name: "2x1 Tuesday",
        value: 0.5,
        available: true,
      });
    }

    setAvailableDiscounts([...fixedDiscounts, ...extraDiscounts]);
  }, [selectedDate, bday, bdayLoaded, bdayHasValue, foodPrice]);

  // ----------------- Alertas -----------------
  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  // ----------------- Formateo -----------------
  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (value) =>
    value.replace(/\D/g, "").replace(/(\d{2})(\d{1,2})?/, (_, m1, m2) =>
      m2 ? `${m1}/${m2}` : m1
    );

  // ----------------- Cálculo de precios -----------------
  const seatPrice = totalPrice - (foodPrice || 0);

  let discountedFoodPrice = foodPrice || 0;
  let discountedSeatPrice = seatPrice;

  if (selectedDiscount && selectedDiscount.id !== "none") {
    switch (selectedDiscount.id) {
      case "bday":
        const seatUnitPrice = seatPrice / selectedSeats.length;
        discountedSeatPrice = seatPrice - seatUnitPrice;
        break;
      case "tue":
        const pairs = Math.floor(selectedSeats.length / 2);
        const rest = selectedSeats.length % 2;
        const seatUnit = seatPrice / selectedSeats.length;
        discountedSeatPrice = (pairs + rest) * seatUnit;
        break;
      case "weekend":
        discountedFoodPrice = foodPrice * (1 - selectedDiscount.value);
        break;
      default:
        discountedSeatPrice = seatPrice * (1 - selectedDiscount.value);
        break;
    }
  }

  const discountedTotalPrice = discountedSeatPrice + discountedFoodPrice;

  // ----------------- Pago -----------------
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
      foodPrice: discountedFoodPrice,
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6">
        <p className="text-xl font-semibold">No reservation data found.</p>
      </div>
    );
  }

  if (paymentCompleted && reservationData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-8">
        <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-green-100 shadow-md">
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

        <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Your reservation has been confirmed.</p>

        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-2 border border-gray-200">
          <p><strong>Ticket ID:</strong> {reservationData.ticketId}</p>
          <p><strong>Movie:</strong> {reservationData.selectedMovie}</p>
          <p><strong>Date:</strong> {reservationData.selectedDate}</p>
          <p><strong>Time:</strong> {reservationData.selectedTime}</p>
          <p><strong>Room:</strong> {reservationData.room}</p>
          <p><strong>Seats:</strong> {reservationData.selectedSeats.join(", ")}</p>
          <p><strong>Seat Price:</strong> {reservationData.seatPrice.toFixed(2)} €</p>
          {reservationData.foodPrice > 0 && (
            <p><strong>Food Price:</strong> {reservationData.foodPrice.toFixed(2)} €</p>
          )}
          {reservationData.appliedDiscount && (
            <p><strong>Discount:</strong> {reservationData.appliedDiscount.name}</p>
          )}
          {reservationData.snacks?.length > 0 && (
            <div>
              <strong>Snacks:</strong>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {reservationData.snacks.map((s, index) => (
                  <li key={index}>
                    {s.name} x{s.quantity} — {(s.price * s.quantity).toFixed(2)} €
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-2xl font-bold text-black">
            Total: {reservationData.totalPrice.toFixed(2)} €
          </p>
        </div>

        <button
          onClick={() => navigate("/cinema")}
          className="mt-6 bg-black text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-800 transition"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto relative">
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
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Reservation Summary</h2>
        <div className="space-y-1 text-gray-700">
          <p><strong>Movie:</strong> {selectedMovie}</p>
          <p><strong>Date:</strong> {selectedDate}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <p><strong>Room:</strong> {room}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
          <p><strong>Seat Price:</strong> {seatPrice.toFixed(2)} €</p>
          {foodPrice > 0 && <p><strong>Food:</strong> {foodPrice.toFixed(2)} €</p>}
          <p className="mt-2 text-xl font-bold">Total: {discountedTotalPrice.toFixed(2)} €</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Available Discounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableDiscounts.map((d) => {
            const disabled = !d.available;

            return (
              <div
                key={d.id}
                onClick={() => !disabled && setSelectedDiscount(d)}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition shadow-sm
                  ${selectedDiscount?.id === d.id ? "border-black ring-2 ring-black" : "border-gray-300 hover:border-black"}
                  ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <p className="text-lg font-bold">{d.name}</p>
                <p className="text-sm text-gray-500">
                  {d.id === "bday"
                    ? d.available
                      ? "1 Free ticket"
                      : `Unavailable${d.reason ? ` — ${d.reason}` : ""}`
                    : d.id === "tue"
                    ? "2x1 ticket"
                    : d.id === "weekend"
                    ? "20% off on snacks"
                    : d.id === "none"
                    ? "No discount applied"
                    : `${d.value * 100}% off`}
                </p>
                {selectedDiscount?.id === d.id && !disabled && (
                  <span className="mt-2 text-green-600 font-semibold">✔ Selected</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Card Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Cardholder Name"
            className="p-3 border rounded-xl w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Card Number"
            className="p-3 border rounded-xl w-full"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          />
          <input
            placeholder="MM/YY"
            className="p-3 border rounded-xl w-full"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
          />
          <input
            placeholder="CVV"
            className="p-3 border rounded-xl w-full"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <input
          type="email"
          placeholder="Billing Email"
          className="p-3 border rounded-xl w-full"
          value={billingEmail}
          onChange={(e) => setBillingEmail(e.target.value)}
        />
        <input
          placeholder="Billing Country"
          className="p-3 border rounded-xl w-full"
          value={billingCountry}
          onChange={(e) => setBillingCountry(e.target.value)}
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-full text-white font-semibold shadow-md transition ${
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