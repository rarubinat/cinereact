import React, { useState, useEffect } from "react";
import moviesData from "./data/moviesData";


import "./components/styles/Reserve.css";
import MovieSelector from "./components/cinema/MovieSelector";
import SeatMatrix from "./components/cinema/seats/SeatMatrix";
import PriceCalculator from "./components/hooks/PriceCalculator";
import MovieContext from './contexts/MovieContext';
import TimeBlock from "./components/cinema/TimeBlock";
import DateBlock from "./components/cinema/DateBlock";
import db, { auth } from './utils/firebase'; // Importamos auth para obtener el usuario actual

// Formatea fecha en 'YYYY-MM-DD'
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const Reserve = ({ setPage }) => {
  // Estado para manejar películas, asientos, precios, etc.
  const [movies, EditMovies] = useState({
    movieNames: moviesData,
    selectedMovie: Object.keys(moviesData)[0],
    moviePrice: 7.50,
    totalSeats: 0,
    seatNumbers: [],
    totalPrice: 0
  });

  // Estado para manejar selección de tiempo, fecha, asientos y reservas guardadas
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [savedReservations, setSavedReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reservationSaved, setReservationSaved] = useState(false);

  // Función para actualizar los asientos seleccionados
  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  // Función para obtener las reservas guardadas (aquí sin filtrar por usuario, puedes modificarlo si quieres)
  const updateSavedReservations = () => {
    db.collection("reservas")
      .orderBy('timestamp', 'desc')
      .get()
      .then((querySnapshot) => {
        const updatedReservations = [];
        querySnapshot.forEach((doc) => {
          updatedReservations.push({ id: doc.id, ...doc.data() });
        });
        setSavedReservations(updatedReservations);
      })
      .catch((error) => {
        console.error("Error al obtener las reservas:", error);
        window.alert("Error al obtener las reservas.");
      });
  };

  // Función que retorna la sala (room) según el horario seleccionado
  const getRoomForTime = (time) => {
    const selectedMovieData = movies.movieNames[movies.selectedMovie];
    if (!selectedMovieData) return "";

    const selectedTimeData = selectedMovieData.showtimes.find(showtime => showtime.time === time);
    return selectedTimeData ? selectedTimeData.room || "" : "";
  };

  // Función para guardar la reserva en Firestore asociada al usuario actual
  const handleSaveReservation = () => {
    setLoading(true);

    // Obtenemos el usuario actual desde Firebase Auth
    const currentUser = auth.currentUser;

    // Validamos que el usuario esté logueado antes de guardar
    if (!currentUser) {
      setLoading(false);
      window.alert("Debes iniciar sesión para guardar una reserva.");
      return;
    }

    const room = getRoomForTime(selectedTime);

    // Validaciones básicas antes de guardar
    if (!room) {
      setLoading(false);
      window.alert("Sala no encontrada para el horario seleccionado.");
      return;
    }

    if (!movies.selectedMovie || !selectedTime || selectedSeats.length === 0) {
      setLoading(false);
      window.alert("Por favor, selecciona una película, un horario y al menos un asiento.");
      return;
    }

    // Creamos el objeto reserva, agregando el userId para identificar quién la creó
    const reservation = {
      userId: currentUser.uid,            // <-- Asociamos la reserva con el usuario actual
      selectedMovie: movies.selectedMovie,
      selectedTime,
      selectedDate: formatDate(selectedDate),
      selectedSeats,
      room,
      timestamp: new Date(),
      totalPrice: selectedSeats.length * movies.moviePrice
    };

    // Guardamos la reserva en Firestore
    db.collection("reservas")
      .add(reservation)
      .then(() => {
        // Reseteamos estados y mostramos mensaje de éxito
        setSelectedTime("");
        setSelectedSeats([]);
        setReservationSaved(true);

        setTimeout(() => {
          setLoading(false);
          alert('Reserva guardada correctamente!');
          updateSavedReservations();       // Actualizamos reservas guardadas
          setPage("ViewReservations");     // Redirigimos a la vista de reservas
        }, 1000);
      })
      .catch((error) => {
        console.error("Error al guardar la reserva:", error);
        setLoading(false);
        window.alert("Error al guardar la reserva. Por favor, intenta nuevamente.");
      });
  };

  // Al montar el componente cargamos las reservas guardadas (puedes modificar para que solo cargue las del usuario actual)
  useEffect(() => {
    updateSavedReservations();
  }, []);

  return (
    <div className="reserve-page">
      <MovieContext.Provider value={{ movies, changeState: EditMovies }}>
        <MovieSelector />

        {movies.selectedMovie && (
          <DateBlock selectedDate={selectedDate} handleDateChange={setSelectedDate} />
        )}

        {movies.selectedMovie && (
          <TimeBlock selectedTime={selectedTime} handleTimeChange={setSelectedTime} />
        )}

        {movies.selectedMovie && selectedTime && (
          <SeatMatrix
            onSeatSelection={handleSeatSelection}
            selectedMovie={movies.selectedMovie}
            selectedTime={selectedTime}
            selectedDate={formatDate(selectedDate)}
            savedReservations={savedReservations}
            room={getRoomForTime(selectedTime)}
          />
        )}

        {selectedSeats.length > 0 && (
          <>
            <PriceCalculator
              selectedTime={selectedTime}
              selectedSeats={selectedSeats}
              moviePrice={movies.moviePrice}
            />
            <button className="btn-save" onClick={handleSaveReservation}>Guardar Reserva</button>
          </>
        )}

      </MovieContext.Provider>

      {/* Overlay de carga cuando está guardando */}
      <div className={`loading-overlay ${loading ? "show" : ""}`}>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default Reserve;
