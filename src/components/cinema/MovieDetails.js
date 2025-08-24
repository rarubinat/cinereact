import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moviesData from "../../data/moviesData";
import DateBlock from "../cinema/blocks/DateBlock";

const MovieDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const movie = moviesData[decodeURIComponent(title)];

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [alert, setAlert] = useState({ message: "", visible: false });

  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
        <p className="text-xl font-semibold">Movie not found.</p>
      </div>
    );
  }

  const showtimesForDate = selectedDate ? movie.showtimes : [];

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

      {/* Title and Genres */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <div className="flex flex-wrap gap-2">
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column: Poster + metadata */}
        <div className="md:w-1/3 flex flex-col gap-4">
          <div className="rounded-lg overflow-hidden shadow-md max-w-[200px] mx-auto md:mx-0">
            <img
              src={movie.image}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-2 text-sm md:text-base">
            <p><strong>Release Date:</strong> {movie.releaseDate}</p>
            <p><strong>Duration:</strong> {movie.duration} min</p>
            <p><strong>Writers:</strong> {movie.writers.join(", ")}</p>
            <p><strong>Directors:</strong> {movie.directors.join(", ")}</p>
          </div>
        </div>

        {/* Right column: Synopsis + date/time + reserve */}
        <div className="md:w-2/3 flex flex-col gap-6">
          <div className="p-4 bg-gray-50 border rounded-lg max-h-[200px] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-2">Synopsis</h2>
            <p className="text-gray-700 leading-relaxed">{movie.synopsis}</p>
          </div>

          <DateBlock
            selectedDate={selectedDate}
            handleDateChange={(date) => {
              setSelectedDate(date);
              setSelectedTime("");
            }}
          />

          {selectedDate && (
            <div>
              <h2 className="text-xl font-semibold mb-3">
                Rooms and Showtimes for {selectedDate}
              </h2>
              <div className="flex flex-wrap gap-2">
                {showtimesForDate.length > 0 ? (
                  showtimesForDate.map(({ time, room }, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg border text-sm transition font-medium ${
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
                  <p className="text-gray-500">No showtimes available for this date.</p>
                )}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="mt-2 p-3 bg-gray-50 border rounded-lg text-sm">
              <p>
                Selected: <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>
              </p>
              <p>
                Room: {movie.showtimes.find((s) => s.time === selectedTime)?.room}
              </p>
            </div>
          )}

          <button
            className="w-full mt-4 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition"
            onClick={handleReserve}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
