import React, { useState, useEffect, useCallback } from "react";
import db, { auth } from "../../utils/firebase";
import moviesData from "../../data/moviesData";

const ViewReserve = ({ setPage }) => {
  const [reservations, setReservations] = useState([]);
  const [alert, setAlert] = useState({ message: "", visible: false });
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    reservationId: null,
  });
  const [activeTab, setActiveTab] = useState("upcoming"); // pestaña activa

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
    } catch (error) {
      console.error("Error fetching reservations:", error);
      showAlert("Could not fetch reservations.");
    }
  }, []);

  // Cancelar reserva
  const confirmCancel = async () => {
    const id = confirmModal.reservationId;
    try {
      await db.collection("reservas").doc(id).delete();
      showAlert("Reservation successfully canceled.");
      setReservations((prev) => prev.filter((res) => res.id !== id));
    } catch (error) {
      console.error("Error canceling the reservation:", error);
      showAlert("Error canceling the reservation. Please try again.");
    } finally {
      setConfirmModal({ visible: false, reservationId: null });
    }
  };

  // Cargar reservas al montar el componente
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Filtrar reservas por fecha
  const today = new Date();
  const upcomingReservations = reservations.filter((res) => {
    const [day, month, year] = res.selectedDate.split("/"); // si está en formato DD/MM/YYYY
    const resDate = new Date(`${year}-${month}-${day}`);
    return resDate >= today;
  });

  const pastReservations = reservations.filter((res) => {
    const [day, month, year] = res.selectedDate.split("/");
    const resDate = new Date(`${year}-${month}-${day}`);
    return resDate < today;
  });

  const renderReservationCard = (reservation) => {
    const selectedMovieData = moviesData[reservation.selectedMovie] || {};
    const movieImage = selectedMovieData.image || null;

    return (
      <div
        key={reservation.id}
        className="rounded-xl overflow-hidden shadow-md bg-zinc-900 border border-zinc-700"
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
            <span className="text-zinc-400">Room:</span> {reservation.room}
          </p>
          <p className="text-sm">
            <span className="text-zinc-400">Seats:</span>{" "}
            {reservation.selectedSeats.join(", ")}
          </p>
          <p className="text-sm">
            <span className="text-zinc-400">Total:</span>{" "}
            {reservation.totalPrice} €
          </p>
          {activeTab === "upcoming" && (
            <button
              onClick={() =>
                setConfirmModal({ visible: true, reservationId: reservation.id })
              }
              className="mt-3 w-full text-sm bg-transparent border border-red-500 text-red-400 hover:bg-red-600 hover:text-white py-1.5 rounded-md transition"
            >
              Delete Reserve
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10 relative">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "upcoming"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "past"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          Past Reservations
        </button>
      </div>

      {/* Lista según la pestaña */}
      {activeTab === "upcoming" ? (
        upcomingReservations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingReservations.map(renderReservationCard)}
          </div>
        ) : (
          <p className="text-center text-zinc-500 mt-10">
            No tienes reservas próximas.
          </p>
        )
      ) : pastReservations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pastReservations.map(renderReservationCard)}
        </div>
      ) : (
        <p className="text-center text-zinc-500 mt-10">
          No hay reservas anteriores.
        </p>
      )}
    </div>
  );
};

export default ViewReserve;
