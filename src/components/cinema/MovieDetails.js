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
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
        <p className="text-xl">Movie not found.</p>
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
    <div className="min-h-screen bg-zinc-900 text-white p-8 max-w-6xl mx-auto relative">
      {/* Styled alert */}
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
        {title}
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3 rounded-lg overflow-hidden shadow-lg">
          <img
            src={movie.image}
            alt={title}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="md:w-2/3 space-y-6">
          <p className="text-zinc-300 text-lg leading-relaxed">{movie.sinopsis}</p>

          <div className="my-6">
            <DateBlock
              selectedDate={selectedDate}
              handleDateChange={(date) => {
                setSelectedDate(date);
                setSelectedTime("");
              }}
            />
          </div>

          {selectedDate && (
            <div className="my-6">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">
                Rooms and Showtimes for {selectedDate}
              </h2>
              <div className="flex flex-wrap gap-4">
                {showtimesForDate.length > 0 ? (
                  showtimesForDate.map(({ time, room }, index) => (
                    <div
                      key={index}
                      className={`bg-blue-800 bg-opacity-60 rounded-lg px-5 py-3 shadow-md cursor-pointer transition ${
                        selectedTime === time ? "border-4 border-blue-400" : ""
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      <p className="text-white font-semibold">Room {room}</p>
                      <p className="text-blue-300">{time}</p>
                    </div>
                  ))
                ) : (
                  <p>No showtimes available for this date.</p>
                )}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="mt-4 p-4 bg-blue-800 rounded text-white">
              <p>
                Selected: <strong>{selectedDate}</strong> at{" "}
                <strong>{selectedTime}</strong>
              </p>
              <p>
                Room:{" "}
                {movie.showtimes.find((s) => s.time === selectedTime)?.room}
              </p>
            </div>
          )}

          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold disabled:opacity-50"
            onClick={handleReserve}
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
