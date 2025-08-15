import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moviesData from "../../data/moviesData";
import SeatMatrix from "../../components/cinema/seats/SeatMatrix";
import db, { auth } from "../../utils/firebase";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

const ReserveMovie = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedMovie, selectedDate, selectedTime } = location.state || {};
  const movie = moviesData[selectedMovie];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", visible: false });

  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => {
      setAlert({ message: "", visible: false });
    }, 3000);
  };

  const selectedShowtime = movie?.showtimes?.find(
    (s) => s.time === selectedTime
  );
  const room = selectedShowtime?.room || "";

  const moviePrice = 7.5;
  const totalPrice = selectedSeats.length * moviePrice;

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  const handleSaveReservation = () => {
    if (!selectedSeats.length) {
      showAlert("Please select at least one seat.");
      return;
    }

    setLoading(true);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setLoading(false);
      showAlert("You must log in to save a reservation.");
      return;
    }

    const reservation = {
      userId: currentUser.uid,
      email: currentUser.email,
      selectedMovie,
      selectedDate: formatDate(selectedDate),
      selectedTime,
      selectedSeats,
      room,
      timestamp: new Date(),
      totalPrice,
    };

    db.collection("reservas")
      .add(reservation)
      .then(() => {
        setLoading(false);
        showAlert("Reservation saved successfully!");
        setTimeout(() => navigate("/view-reservations"), 1000);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error saving reservation:", error);
        showAlert("Error saving the reservation. Please try again.");
      });
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
        <p className="text-xl">Not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-gray-900 p-6 sm:p-10 max-w-5xl mx-auto relative">
      {/* Alerta estilizada */}
      {alert.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <div className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-xl shadow-lg border border-gray-300">
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8">{selectedMovie}</h1>

      {/* Info película */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
        <p className="text-lg">
          <strong>Film:</strong> {selectedMovie}
        </p>
        <p className="text-lg">
          <strong>Date:</strong> {selectedDate}
        </p>
        <p className="text-lg">
          <strong>Time:</strong> {selectedTime}
        </p>
        <p className="text-lg">
          <strong>Room:</strong> {room || "No definida"}
        </p>
      </div>

      {/* Selector de asientos */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Select your seats</h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <SeatMatrix
            onSeatSelection={handleSeatSelection}
            selectedMovie={selectedMovie}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            savedReservations={[]}
            room={room}
          />
        </div>
      </div>

      {/* Resumen y botón */}
      {selectedSeats.length > 0 && (
        <div className="mt-10 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <p className="text-lg mb-2">
            <strong>Seats selected:</strong> {selectedSeats.join(", ")}
          </p>
          <p className="text-lg mb-6">
            <strong>Total:</strong> {totalPrice.toFixed(2)} €
          </p>
          <button
            onClick={handleSaveReservation}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-full font-semibold text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 transition"
            }`}
          >
            {loading ? "Saving..." : "Save Reservation"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReserveMovie;
