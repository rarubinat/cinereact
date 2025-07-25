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
      showAlert("Por favor selecciona al menos un asiento.");
      return;
    }

    setLoading(true);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setLoading(false);
      showAlert("Debes iniciar sesión para guardar una reserva.");
      return;
    }

    const reservation = {
      userId: currentUser.uid,
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
        showAlert("¡Reserva guardada correctamente!");
        setTimeout(() => navigate("/view-reservations"), 1000);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error guardando reserva:", error);
        showAlert("Error al guardar la reserva. Intenta de nuevo.");
      });
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
        <p className="text-xl">Película no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8 max-w-6xl mx-auto relative">
      {/* Alerta azul estilizada */}
      {alert.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <div className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl border border-blue-400 animate-fade-in">
            <svg
              className="w-6 h-6 text-white shrink-0"
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

      <h1 className="text-5xl font-extrabold text-blue-500 mb-10 tracking-wide">
        {selectedMovie}
      </h1>

      <div className="bg-blue-800 bg-opacity-40 rounded-lg p-6 mb-10">
        <p className="text-lg">
          <strong>Película:</strong> {selectedMovie}
        </p>
        <p className="text-lg">
          <strong>Fecha:</strong> {selectedDate}
        </p>
        <p className="text-lg">
          <strong>Hora:</strong> {selectedTime}
        </p>
        <p className="text-lg">
          <strong>Sala:</strong> {room || "No definida"}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4 text-blue-500">
          Selecciona tus Asientos
        </h2>
        <SeatMatrix
          onSeatSelection={handleSeatSelection}
          selectedMovie={selectedMovie}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          savedReservations={[]} // Puedes conectar con reservas reales aquí
          room={room}
        />
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-10 bg-blue-700 bg-opacity-30 rounded p-6">
          <p className="text-lg mb-2">
            <strong>Asientos seleccionados:</strong>{" "}
            {selectedSeats.join(", ")}
          </p>
          <p className="text-lg mb-6">
            <strong>Total a pagar:</strong> {totalPrice.toFixed(2)} €
          </p>
          <button
            onClick={handleSaveReservation}
            disabled={loading}
            className={`py-3 px-6 rounded font-bold text-white ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Guardando..." : "Guardar Reserva"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReserveMovie;
