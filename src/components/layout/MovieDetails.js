import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moviesData from "../../data/moviesData";
import DateBlock from "../../components/cinema/DateBlock";


const MovieDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate(); // <-- aquí
  const movie = moviesData[decodeURIComponent(title)];

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
        <p className="text-xl">Película no encontrada.</p>
      </div>
    );
  }

  const showtimesForDate = selectedDate ? movie.showtimes : [];

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8 max-w-6xl mx-auto">
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
                Salas y Horarios para {selectedDate}
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
                      <p className="text-white font-semibold">Sala {room}</p>
                      <p className="text-blue-300">{time}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay horarios disponibles para esta fecha.</p>
                )}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="mt-4 p-4 bg-blue-800 rounded text-white">
              <p>
                Has seleccionado: <strong>{selectedDate}</strong> a las{" "}
                <strong>{selectedTime}</strong>
              </p>
              <p>Sala: {movie.showtimes.find((s) => s.time === selectedTime)?.room}</p>
            </div>
          )}

          {selectedDate && selectedTime && (
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold"
              onClick={() => {
                navigate("/reserveMovie", {
                  state: {
                    selectedMovie: decodeURIComponent(title),
                    selectedDate,
                    selectedTime,
                  },
                });
              }}
            >
              Reservar ahora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
