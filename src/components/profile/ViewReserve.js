import React, { useState, useEffect } from "react";
import db, { auth } from "../../utils/firebase";
import moviesData from "../../data/moviesData";

const ViewReserve = ({ setPage }) => {
  const [reservations, setReservations] = useState([]);
  const [firstReservationId, setFirstReservationId] = useState(null);

  const fetchReservations = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("No hay usuario autenticado.");
        setReservations([]);
        return;
      }

      const querySnapshot = await db
        .collection("reservas")
        .where("userId", "==", currentUser.uid)
        .get();

      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

      setReservations(data);
      if (data.length > 0) {
        setFirstReservationId(data[0].id);
      }
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      alert("No se pudieron obtener las reservas.");
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm("¿Estás seguro que quieres cancelar esta reserva?")) return;

    try {
      await db.collection("reservas").doc(id).delete();
      alert("Reserva cancelada correctamente.");
      setReservations((prev) => prev.filter((res) => res.id !== id));
      if (firstReservationId === id && reservations.length > 1) {
        setFirstReservationId(reservations[1].id);
      }
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      alert("Error al cancelar la reserva. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <h2 className="text-2xl font-light tracking-wide text-blue-400 mb-6 border-b border-blue-500/20 pb-2">
        Reservas Guardadas</h2>

      {reservations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reservations.map((reservation) => {
            const selectedMovieData = moviesData[reservation.selectedMovie];
            const movieImage = selectedMovieData?.image;

            return (
              <div
                key={reservation.id}
                className={`rounded-xl overflow-hidden shadow-md bg-zinc-900 border ${
                  reservation.id === firstReservationId
                    ? "border-blue-500/40 shadow-blue-500/20"
                    : "border-zinc-700"
                }`}
              >
                {movieImage && (
                  <img
                    src={movieImage}
                    alt={`Imagen de ${reservation.selectedMovie}`}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-blue-300">
                    {reservation.selectedMovie}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {reservation.selectedDate}, {reservation.selectedTime}
                  </p>
                  <p className="text-sm">
                    <span className="text-zinc-400">Sala:</span>{" "}
                    {reservation.room}
                  </p>
                  <p className="text-sm">
                    <span className="text-zinc-400">Asientos:</span>{" "}
                    {reservation.selectedSeats.join(", ")}
                  </p>
                  <p className="text-sm">
                    <span className="text-zinc-400">Total:</span>{" "}
                    {reservation.totalPrice} €
                  </p>
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="mt-3 w-full text-sm bg-transparent border border-red-500 text-red-400 hover:bg-red-600 hover:text-white py-1.5 rounded-md transition"
                  >
                    Cancelar Reserva
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-zinc-500 mt-10">No hay reservas registradas.</p>
      )}
    </div>
  );
};

export default ViewReserve;
