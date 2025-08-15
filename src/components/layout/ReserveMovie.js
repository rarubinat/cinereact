import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moviesData from "../../data/moviesData";
import SeatMatrix from "../../components/cinema/seats/SeatMatrix";

const ReserveMovie = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedMovie, selectedDate, selectedTime } = location.state || {};
  const movie = moviesData[selectedMovie];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [alert, setAlert] = useState({ message: "", visible: false });

  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => {
      setAlert({ message, visible: false });
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

  const handleGoToPayment = () => {
    if (!selectedSeats.length) {
      showAlert("Please select at least one seat.");
      return;
    }

    navigate("/payment", {
      state: {
        selectedMovie,
        selectedDate,
        selectedTime,
        selectedSeats,
        room,
        totalPrice,
        image: movie.image
      }
    });
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
        <p className="text-xl font-semibold">Not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8 max-w-5xl mx-auto relative">
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

      <h1 className="text-4xl font-bold mb-8">{selectedMovie}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Poster */}
        <div className="md:w-1/3 rounded-lg overflow-hidden shadow-md">
          <img
            src={movie.image}
            alt={selectedMovie}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Details + Seats */}
        <div className="md:w-2/3 space-y-8">
          <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
            <p>
              <strong>Film:</strong> {selectedMovie}
            </p>
            <p>
              <strong>Date:</strong> {selectedDate}
            </p>
            <p>
              <strong>Time:</strong> {selectedTime}
            </p>
            <p>
              <strong>Room:</strong> {room || "No definida"}
            </p>
          </div>

          {/* Seat selector */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Select your seats</h2>
            <SeatMatrix
              onSeatSelection={handleSeatSelection}
              selectedMovie={selectedMovie}
              selectedTime={selectedTime}
              selectedDate={selectedDate}
              savedReservations={[]}
              room={room}
            />
          </div>

          {/* Summary */}
          {selectedSeats.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 border rounded-lg space-y-4">
              <p>
                <strong>Seats selected:</strong> {selectedSeats.join(", ")}
              </p>
              <p>
                <strong>Price:</strong> {totalPrice.toFixed(2)} €
              </p>
              <button
                onClick={handleGoToPayment}
                className="w-full py-3 px-6 rounded-full font-semibold text-white bg-black hover:bg-gray-800 transition"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReserveMovie;
