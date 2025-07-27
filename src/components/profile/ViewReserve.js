import React, { useState, useEffect, useCallback } from "react";
import db, { auth } from "../../utils/firebase";
import moviesData from "../../data/moviesData";

const ViewReserve = ({ setPage }) => {
  const [reservations, setReservations] = useState([]);
  const [firstReservationId, setFirstReservationId] = useState(null);
  const [alert, setAlert] = useState({ message: "", visible: false });
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    reservationId: null,
  });

  // Mostrar alerta temporal
  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => {
      setAlert({ message: "", visible: false });
    }, 3000);
  };

  // Obtener reservas del usuario autenticado
  const fetchReservations = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        showAlert("No hay usuario autenticado.");
        setReservations([]);
        return;
      }

      const querySnapshot = await db
        .collection("reservas")
        .where("userId", "==", currentUser.uid)
        .get();

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

      setReservations(data);
      if (data.length > 0) setFirstReservationId(data[0].id);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      showAlert("No se pudieron obtener las reservas.");
    }
  }, []);

  // Cancelar reserva
  const confirmCancel = async () => {
    const id = confirmModal.reservationId;
    try {
      await db.collection("reservas").doc(id).delete();
      showAlert("Reserva cancelada correctamente.");
      setReservations((prev) => prev.filter((res) => res.id !== id));
      if (firstReservationId === id && reservations.length > 1) {
        setFirstReservationId(reservations[1].id);
      }
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      showAlert("Error al cancelar la reserva. Intenta de nuevo.");
    } finally {
      setConfirmModal({ visible: false, reservationId: null });
    }
  };

  // Cargar reservas al montar el componente
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10 relative">
      {/* Alerta azul */}
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

      {/* Modal de confirmación */}
      {confirmModal.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-blue-900 rounded-xl p-6 max-w-sm w-full text-white shadow-xl border border-blue-700 animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">
              Cancel Reserve
            </h3>
            <p className="text-sm text-blue-100 mb-6">
              ¿Estás seguro que quieres cancelar esta reserva? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ visible: false, reservationId: null })}
                className="px-4 py-2 text-sm rounded-md border border-blue-400 text-blue-200 hover:bg-blue-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Título */}
      <h2 className="text-2xl font-light tracking-wide text-blue-400 mb-6 border-b border-blue-500/20 pb-2">
        Reservas Guardadas
      </h2>

      {/* Lista de reservas */}
      {reservations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reservations.map((reservation) => {
            const selectedMovieData = moviesData[reservation.selectedMovie] || {};
            const movieImage = selectedMovieData.image || null;

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
                    <span className="text-zinc-400">Sala:</span> {reservation.room}
                  </p>
                  <p className="text-sm">
                    <span className="text-zinc-400">Asientos:</span> {reservation.selectedSeats.join(", ")}
                  </p>
                  <p className="text-sm">
                    <span className="text-zinc-400">Total:</span> {reservation.totalPrice} €
                  </p>
                  <button
                    onClick={() => setConfirmModal({ visible: true, reservationId: reservation.id })}
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
        <p className="text-center text-zinc-500 mt-10">
          No hay reservas registradas.
        </p>
      )}
    </div>
  );
};

export default ViewReserve;
