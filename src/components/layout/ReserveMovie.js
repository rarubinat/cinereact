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

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
        <p className="text-xl">Película no encontrada.</p>
      </div>
    );
  }

  const selectedShowtime = movie.showtimes.find((s) => s.time === selectedTime);
  const room = selectedShowtime?.room || "";

  const moviePrice = 7.5;
  const totalPrice = selectedSeats.length * moviePrice;

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  const handleSaveReservation = () => {
    if (!selectedSeats.length) {
      alert("Por favor selecciona al menos un asiento.");
      return;
    }

    setLoading(true);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setLoading(false);
      alert("Debes iniciar sesión para guardar una reserva.");
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
        alert("Reserva guardada correctamente!");
        navigate("/view-reservations"); // Ajusta esta ruta según tu app
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error guardando reserva:", error);
        alert("Error al guardar la reserva. Intenta de nuevo.");
      });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-extrabold text-blue-500 mb-10 tracking-wide">{selectedMovie}</h1>

      <div className="bg-blue-800 bg-opacity-40 rounded-lg p-6 mb-10">
        <p className="text-lg"><strong>Película:</strong> {selectedMovie}</p>
        <p className="text-lg"><strong>Fecha:</strong> {selectedDate}</p>
        <p className="text-lg"><strong>Hora:</strong> {selectedTime}</p>
        <p className="text-lg"><strong>Sala:</strong> {room || "No definida"}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4 text-blue-500">Selecciona tus Asientos</h2>
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
            <strong>Asientos seleccionados:</strong> {selectedSeats.join(", ")}
          </p>
          <p className="text-lg mb-6">
            <strong>Total a pagar:</strong> {totalPrice.toFixed(2)} €
          </p>
          <button
            onClick={handleSaveReservation}
            disabled={loading}
            className={`py-3 px-6 rounded font-bold text-white ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
