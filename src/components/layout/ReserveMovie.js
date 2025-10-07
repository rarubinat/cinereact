import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moviesData from "../../data/moviesData";
import SeatMatrix from "../../components/cinema/seats/SeatMatrix";
import ProgressBar from "./../../context/ProgressBar"; // Component to show multi-step progress
import { useNotification } from "../../context/NotificationContext";

/**
 * ReserveMovie Component
 * -------------------------------------
 * Handles the movie seat reservation step.
 * Displays movie details, seat selection matrix,
 * and a summary before proceeding to the snacks page.
 */
const ReserveMovie = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useNotification();

  // Extract selected movie details from router state
  const { selectedMovie, selectedDate, selectedTime } = location.state || {};
  const movie = moviesData[selectedMovie];

  // Store the selected seats and the row they belong to
  const [selectedSeatsData, setSelectedSeatsData] = useState({ seats: [], row: null });

  // Local alert message (for inline visual notifications)
  const [alert, setAlert] = useState({ message: "", visible: false });

  /**
   * Displays a temporary alert message at the top of the screen
   */
  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  // Base ticket price per seat
  const moviePrice = 7.5;
  const totalPrice = selectedSeatsData.seats.length * moviePrice;

  // Find the selected showtime to get the room number
  const selectedShowtime = movie?.showtimes?.find((s) => s.time === selectedTime);
  const room = selectedShowtime?.room || "";

  /**
   * handleGoToSnacks
   * -----------------
   * Triggered when user presses the "Confirm" button.
   * Validates that at least one seat is selected and
   * all are from the same row before navigating to the next step.
   */
  const handleGoToSnacks = () => {
    if (!selectedSeatsData.seats.length) {
      showAlert("Please select at least one seat.");
      return;
    }
    if (!selectedSeatsData.row) {
      showAlert("Please select seats from the same row.");
      return;
    }

    // Navigate to the snack selection page with reservation details
    navigate("/SnacksPage", {
      state: {
        selectedMovie,
        selectedDate,
        selectedTime,
        selectedSeats: selectedSeatsData.seats,
        selectedRow: selectedSeatsData.row,
        room,
        moviePrice,
        image: movie.image,
      },
    });
  };

  // Disable "Confirm" button if no valid seat selection
  const isConfirmDisabled = !selectedSeatsData.seats.length || !selectedSeatsData.row;

  // Handle invalid or missing movie data
  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 p-6">
        <h3 className="text-3xl font-bold text-black mb-6">Not found.</h3>
      </div>
    );
  }

  /**
   * Helper function to display date in DD/MM/YYYY format
   */
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen text-gray-900 p-8 max-w-5xl mx-auto relative">
      {/* Alert (temporary red banner on top) */}
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      {/* Progress bar showing user step */}
      <ProgressBar currentStep="Seats" />

      {/* Movie title */}
      <h3 className="text-3xl font-bold text-black mb-6">{selectedMovie}</h3>

      <div className="space-y-8">
        {/* --- Movie Info --- */}
        <div className="p-4 bg-gray-50 border rounded-lg flex flex-row-reverse items-start justify-between gap-6">
          <div className="w-32 h-48 rounded-lg overflow-hidden shadow-md shrink-0">
            <img src={movie.image} alt={selectedMovie} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-2 flex-1">
            <p><strong>Film:</strong> {selectedMovie}</p>
            <p><strong>Date:</strong> {formatDateForDisplay(selectedDate)}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Room:</strong> {room || "Not defined"}</p>
          </div>
        </div>

        {/* --- Seat Selection --- */}
        <div>
          <h3 className="text-3xl font-bold text-black mb-6">Select your seats</h3>
          <SeatMatrix
            onSeatSelection={setSelectedSeatsData}
            selectedMovie={selectedMovie}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
          />
        </div>

        {/* --- Summary & Confirm Button --- */}
        {selectedSeatsData.seats.length > 0 ? (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg space-y-4">
            <p>
              <strong>Seats selected:</strong> {selectedSeatsData.seats.join(", ")} (Row {selectedSeatsData.row})
            </p>
            <p>
              <strong>Price:</strong> {totalPrice.toFixed(2)} €
            </p>
            <button
              onClick={handleGoToSnacks}
              disabled={isConfirmDisabled}
              className={`w-full py-3 px-6 rounded-full font-semibold text-white transition ${
                isConfirmDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              Confirm
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReserveMovie;
