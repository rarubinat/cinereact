import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Hooks for route params and programmatic navigation
import moviesData from "../../data/moviesData"; // Local data for movies
import DateBlock from "../cinema/blocks/DateBlock"; // Component for selecting dates
import ProgressBar from "./../../context/ProgressBar"; // Component to show multi-step progress

const MovieDetails = () => {
  const { title } = useParams(); // Get movie title from URL
  const navigate = useNavigate(); // Navigation hook
  const movie = moviesData[decodeURIComponent(title)]; // Decode URL and find movie data

  // --- Local state ---
  const [selectedDate, setSelectedDate] = useState(""); // Chosen date
  const [selectedTime, setSelectedTime] = useState(""); // Chosen time
  const [alert, setAlert] = useState({ message: "", visible: false }); // Alert messages

  // --- Show temporary alerts ---
  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  // --- Guard: if movie not found ---
  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
        <p className="text-xl font-semibold">Movie not found.</p>
      </div>
    );
  }

  // --- Format release date ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  // --- Showtimes for selected date ---
  const showtimesForDate = selectedDate ? movie.showtimes : [];

  // --- Handle navigation to reservation ---
  const handleReserve = () => {
    if (!selectedDate || !selectedTime) {
      showAlert("Please select a date and time before continuing.");
      return;
    }

    navigate("/reserveMovie", {
      state: {
        selectedMovie: decodeURIComponent(title),
        selectedDate,
        selectedTime,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto relative">
      {/* Alert */}
      {alert.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <div className="flex items-center gap-3 bg-red-100 text-red-800 px-4 py-3 rounded-lg shadow-md border border-red-300">
            {/* Warning icon */}
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

      {/* Progress bar for booking steps */}
      <ProgressBar currentStep="Time" />

      {/* MOBILE VIEW: Title + genre tags */}
      <div className="md:hidden mb-4">
        <h3 className="text-xl sm:text-2xl font-bold break-words">{title}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {movie.genre.split(",").map((g, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs sm:text-sm font-medium"
            >
              {g.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* MOBILE VIEW: Image left, details right */}
      <div className="flex items-start gap-4 mb-6 md:hidden">
        {/* Movie poster */}
        <div className="flex-shrink-0">
          <div className="rounded-lg overflow-hidden shadow-md w-28 sm:w-32">
            <img src={movie.image} alt={title} className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Details column */}
        <div className="flex flex-col justify-start text-xs sm:text-sm space-y-1">
          <p><strong>Release Date:</strong> {formatDate(movie.releaseDate)}</p>
          <p><strong>Duration:</strong> {movie.duration} min</p>
          <p><strong>Writers:</strong> {movie.writers.join(", ")}</p>
          <p><strong>Directors:</strong> {movie.directors.join(", ")}</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* DESKTOP: Movie image */}
        <div className="hidden md:block flex-shrink-0">
          <div className="rounded-lg overflow-hidden shadow-md w-40 sm:w-52 md:w-64 lg:w-72">
            <img src={movie.image} alt={title} className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* RIGHT COLUMN: Details + booking */}
        <div className="flex-1 flex flex-col gap-6">
          {/* DESKTOP: Title + genres */}
          <div className="hidden md:block">
            <h3 className="text-2xl md:text-3xl font-bold break-words">{title}</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {movie.genre.split(",").map((g, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium"
                >
                  {g.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Synopsis</h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{movie.synopsis}</p>
          </div>

          {/* DESKTOP: Movie details */}
          <div className="hidden md:block space-y-2 text-sm sm:text-base">
            <p><strong>Release Date:</strong> {formatDate(movie.releaseDate)}</p>
            <p><strong>Duration:</strong> {movie.duration} min</p>
            <p><strong>Writers:</strong> {movie.writers.join(", ")}</p>
            <p><strong>Directors:</strong> {movie.directors.join(", ")}</p>
          </div>

          {/* Date selection */}
          <div>
            <h3 className="text-3xl font-bold text-black mb-6">Select your date</h3>
            <DateBlock
              selectedDate={selectedDate}
              handleDateChange={(date) => {
                setSelectedDate(date);
                setSelectedTime(""); // Reset time when changing date
              }}
            />
          </div>

          {/* Showtime selection */}
          {selectedDate && (
            <div>
              <h3 className="text-3xl font-bold text-black mb-6">Select your showtime</h3>
              <div className="flex flex-wrap gap-2">
                {showtimesForDate.length > 0 ? (
                  showtimesForDate.map(({ time, room }, index) => (
                    <button
                      key={index}
                      className={`px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm transition font-medium ${
                        selectedTime === time
                          ? "bg-black text-white border-black"
                          : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time} - ROOM {room}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No showtimes available for this date.</p>
                )}
              </div>
            </div>
          )}

          {/* Display selected date and time */}
          {selectedDate && selectedTime && (
            <div className="mt-2 p-3 bg-gray-50 border rounded-lg text-sm">
              <p><strong>Date:</strong> {formatDate(selectedDate)} at {selectedTime}</p>
              <p>
                <strong>Room:</strong>{" "}
                {movie.showtimes.find((s) => s.time === selectedTime)?.room}
              </p>
            </div>
          )}

          {/* Confirm button */}
          <div>
            <button
              className="w-full mt-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition text-sm sm:text-base"
              onClick={handleReserve}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
