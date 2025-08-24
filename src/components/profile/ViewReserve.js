import React, { useState, useEffect, useCallback } from "react";
import db, { auth } from "../../utils/firebase";
import { QRCodeCanvas } from "qrcode.react";

const ViewReserve = ({ setPage }) => {
  const [reservations, setReservations] = useState([]);
  const [setAlert] = useState({ message: "", visible: false });
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    reservationId: null,
  });
  const [activeTab, setActiveTab] = useState("upcoming");

  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

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

      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ticketId: docData.ticketId, // <-- traemos ticketId
          ...docData,
        };
      });

      data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      showAlert("Could not fetch reservations.");
    }
  }, []);

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

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Filtrado por fecha
  const today = new Date();
  const toDate = (ddmmyyyy) => {
    const [d, m, y] = ddmmyyyy.split("/");
    return new Date(`${y}-${m}-${d}`);
  };
  const upcomingReservations = reservations.filter(
    (r) => toDate(r.selectedDate) >= today
  );
  const pastReservations = reservations.filter(
    (r) => toDate(r.selectedDate) < today
  );

  const renderReservationCard = (reservation) => {
    // 🔹 Datos que van dentro del QR
    const qrData = JSON.stringify({
      movie: reservation.selectedMovie,
      date: reservation.selectedDate,
      time: reservation.selectedTime,
      room: reservation.room,
      seats: reservation.selectedSeats,
      total: reservation.totalPrice,
      ticketId: reservation.ticketId, // <-- incluimos ticketId en el QR
    });

    return (
      <div
        key={reservation.id}
        className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full"
      >
        {/* Código QR */}
        <div className="flex items-center justify-center p-4 bg-gray-100">
          <QRCodeCanvas
            value={qrData}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="p-4 space-y-1 flex-grow">
          <h3 className="text-lg font-semibold text-black">
            {reservation.selectedMovie}
          </h3>
          <p className="text-sm text-gray-600">
            {reservation.selectedDate} • {reservation.selectedTime}
          </p>
          <p className="text-sm text-gray-600">Room: {reservation.room}</p>
          <p className="text-sm text-gray-600">
            Seats:{" "}
            {Array.isArray(reservation.selectedSeats)
              ? reservation.selectedSeats.join(", ")
              : "-"}
          </p>
          <p className="text-sm font-medium text-gray-900">
            Total: {reservation.totalPrice} €
          </p>
          <p className="text-sm text-gray-600">
            Ticket ID: {reservation.ticketId} {/* <-- mostramos ticketId */}
          </p>

          {activeTab === "upcoming" && (
            <button
              onClick={() =>
                setConfirmModal({ visible: true, reservationId: reservation.id })
              }
              className="mt-3 w-full text-sm rounded-full border border-red-300 text-red-600 hover:bg-red-50 py-2 transition"
            >
              Cancel reservation
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-black px-6 md:px-12 py-10">
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>

      {/* Tabs estilo “pills” */}
      <div className="flex gap-3 mb-8">
        {[
          { key: "upcoming", label: "Upcoming" },
          { key: "past", label: "Past Reservations" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition
              ${
                activeTab === tab.key
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listado */}
      {activeTab === "upcoming" ? (
        upcomingReservations.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingReservations.map(renderReservationCard)}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            You have no upcoming reservations.
          </p>
        )
      ) : pastReservations.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {pastReservations.map(renderReservationCard)}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          There are no past reservations.
        </p>
      )}

      {/* Modal de confirmación */}
      {confirmModal.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-black mb-2">
              Cancel reservation
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this reservation? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ visible: false, reservationId: null })
                }
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Keep
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded-full bg-black text-white hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReserve;