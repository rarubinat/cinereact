import React, { useState, useEffect, useCallback } from "react";
import db, { auth } from "../../utils/firebase";
import { QRCodeCanvas } from "qrcode.react";
import { useNotification } from "../../context/NotificationContext";

const ViewReserve = ({ setPage }) => {
  const [reservations, setReservations] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    step: 0,
    reservationId: null,
  });
  const [qrModal, setQrModal] = useState({
    visible: false,
    data: null,
  });
  const [activeTab, setActiveTab] = useState("upcoming");

  const { notify } = useNotification();

  // ------------------ Helpers ------------------
  const parseReservationDate = (raw) => {
    if (!raw && raw !== 0) return null;
    if (raw && typeof raw.toDate === "function") return raw.toDate();
    if (raw instanceof Date && !isNaN(raw)) return raw;
    if (typeof raw === "number") return new Date(raw);

    if (typeof raw === "string") {
      const s = raw.trim();
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
        const [d, m, y] = s.split("/").map((x) => parseInt(x, 10));
        return new Date(y, m - 1, d);
      }
      if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(s)) {
        const [d, m, y] = s.split("-").map((x) => parseInt(x, 10));
        return new Date(y, m - 1, d);
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s);
      const parsed = new Date(s);
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  };

  const formatDate = (raw) => {
    const d = parseReservationDate(raw);
    if (!d || isNaN(d)) return raw || "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const formatSnacks = (raw) => {
    if (raw == null) return "None";
    if (Array.isArray(raw)) {
      if (raw.length === 0) return "None";
      return raw
        .map((s) => {
          if (typeof s === "string") return s;
          const name = s.name ?? s.snack ?? s.snackName ?? s.title ?? "Snack";
          const qty = s.qty ?? s.quantity ?? s.count ?? 1;
          const price = s.price ?? s.unitPrice;
          const qtyPart = qty && Number(qty) > 1 ? ` x${qty}` : "";
          const pricePart =
            typeof price === "number" ? ` (${price.toFixed(2)} €)` : "";
          return `${name}${qtyPart}${pricePart}`;
        })
        .join(", ");
    }
    if (typeof raw === "string") return raw || "None";
    if (typeof raw === "object") {
      const name = raw.name ?? raw.snack ?? "Snack";
      const qty = raw.qty ?? raw.quantity ?? 1;
      const price = raw.price ?? raw.unitPrice;
      const qtyPart = qty && Number(qty) > 1 ? ` x${qty}` : "";
      const pricePart =
        typeof price === "number" ? ` (${price.toFixed(2)} €)` : "";
      return `${name}${qtyPart}${pricePart}`;
    }
    return String(raw);
  };

  // ------------------ Fetch reservations ------------------
  const fetchReservations = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setReservations([]);
        return;
      }
      const querySnapshot = await db
        .collection("reservas")
        .where("userId", "==", currentUser.uid)
        .get();
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ticketId: doc.data().ticketId,
        ...doc.data(),
      }));
      data.sort(
        (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
      );
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      notify("Error fetching reservations.", "error");
    }
  }, [notify]);

  // ------------------ Cancel reservation ------------------
  const handleFirstConfirm = (reservationId) => {
    setConfirmModal({ visible: true, step: 1, reservationId });
  };
  const handleSecondConfirm = () =>
    setConfirmModal((prev) => ({ ...prev, step: 2 }));
  const confirmCancel = async () => {
    const id = confirmModal.reservationId;
    try {
      await db.collection("reservas").doc(id).delete();
      setReservations((prev) => prev.filter((res) => res.id !== id));
      notify("Reservation cancelled successfully.", "success");
    } catch (error) {
      console.error("Error canceling the reservation:", error);
      notify("Error cancelling the reservation.", "error");
    } finally {
      setConfirmModal({ visible: false, step: 0, reservationId: null });
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // ------------------ Filter reservations ------------------
  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const reservationDateOnly = (r) => {
    const d = parseReservationDate(r.selectedDate ?? r.selectedDay ?? r.date);
    if (!d || isNaN(d)) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  const upcomingReservations = reservations
    .filter((r) => {
      const d = reservationDateOnly(r);
      return d && d >= todayDateOnly;
    })
    .sort((a, b) => reservationDateOnly(a) - reservationDateOnly(b));
  const pastReservations = reservations
    .filter((r) => {
      const d = reservationDateOnly(r);
      return d && d < todayDateOnly;
    })
    .sort((a, b) => reservationDateOnly(b) - reservationDateOnly(a));

  // ------------------ Render card ------------------
  const renderReservationCard = (reservation, isPast = false) => {
    const row = reservation.row;
    return (
      <div
        key={reservation.id}
        className={`bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition flex w-full h-52 md:h-auto md:flex-col relative ${
          isPast ? "bg-gray-50" : ""
        }`}
      >
        {isPast && (
          <div className="absolute top-2 right-2 bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded z-10">
            Expired
          </div>
        )}

        {/* QR */}
        <div
          className={`flex flex-col items-center justify-center w-28 h-full bg-gray-100 md:w-full md:h-48 ${
            isPast ? "opacity-40" : "cursor-pointer"
          }`}
          onClick={() =>
            !isPast && setQrModal({ visible: true, data: reservation })
          }
        >
          <QRCodeCanvas
            value={JSON.stringify(reservation)}
            size={95}
            level="H"
            includeMargin={true}
          />
          <p className="mt-1 text-xs text-gray-700 hidden md:block">
            Ticket ID: {reservation.ticketId}
          </p>
        </div>

        {/* Info */}
        <div
          className={`flex flex-col justify-between px-3 py-2 md:p-4 flex-grow ${
            isPast ? "text-gray-500" : "text-black"
          }`}
        >
          <h3
            className={`text-base md:text-lg font-bold mb-1 ${
              isPast ? "text-gray-600" : "text-black"
            }`}
          >
            {reservation.selectedMovie}
          </h3>

          <p className="text-xs md:text-sm">
            <strong>Date:</strong> {formatDate(reservation.selectedDate)} •{" "}
            <strong>Time:</strong> {reservation.selectedTime || "N/A"}
          </p>

          <p className="text-xs md:text-sm">
            <strong>Room:</strong> {reservation.room} — <strong>Seats:</strong>{" "}
            {Array.isArray(reservation.selectedSeats)
              ? reservation.selectedSeats.join(", ")
              : reservation.selectedSeats || "-"}
          </p>

          {row && (
            <p className="text-xs md:text-sm">
              <strong>Row:</strong> {row}
            </p>
          )}

          <p className="text-xs md:text-sm">
            <strong>Snacks:</strong>{" "}
            {formatSnacks(
              reservation.snacks ?? reservation.selectedFood ?? reservation.food
            )}
          </p>

          <div className="mt-2 bg-gray-100 rounded-lg px-2 py-1 w-fit text-sm font-semibold">
            <strong>Payed:</strong>{" "}
            {Number(
              reservation.totalPrice ||
                reservation.total ||
                reservation.price ||
                0
            ).toFixed(2)}{" "}
            €
          </div>

          {!isPast && activeTab === "upcoming" && (
            <button
              onClick={() => handleFirstConfirm(reservation.id)}
              className="mt-3 w-full text-[11px] md:text-sm rounded-full border border-red-300 text-red-600 hover:bg-red-50 py-1.5 transition"
            >
              Cancel reservation
            </button>
          )}
        </div>
      </div>
    );
  };

  // ------------------ Render principal ------------------
  return (
    <div className="min-h-screen bg-[#fdfcfb] text-black px-6 md:px-12 py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        {[
          { key: "upcoming", label: "Upcoming" },
          { key: "past", label: "Past Reservations" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
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
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 xl:grid-cols-4 md:gap-6">
            {upcomingReservations.map((res) => renderReservationCard(res))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            You have no upcoming reservations.
          </p>
        )
      ) : pastReservations.length ? (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {pastReservations.map((res) => renderReservationCard(res, true))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          There are no past reservations.
        </p>
      )}

      {/* MODAL QR MEJORADO */}
      {qrModal.visible && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-auto">
          {/* Cerrar */}
          <button
            onClick={() => setQrModal({ visible: false, data: null })}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
          >
            &times;
          </button>

          <div className="flex flex-col items-center mt-16 px-6 pb-12">
            <div className="bg-gray-100 rounded-2xl p-4 shadow-inner">
              <QRCodeCanvas
                value={JSON.stringify(qrModal.data)}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
        
            <div className="bg-gray-200 text-center py-2 px-6 rounded-full mt-6 mb-6 shadow-sm">
              <span className="text-sm font-medium text-gray-800">
                {formatDate(qrModal.data.selectedDate)} •{" "}
                {qrModal.data.selectedTime}
              </span>
            </div>

            {/* Ticket */}
            <div className="relative w-full max-w-md rounded-2xl shadow-lg bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-300 overflow-hidden">
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gray-200 border-dashed border-t border-gray-400 opacity-60"></div>

              <div className="px-6 py-4 border-b border-gray-300 text-center">
                <h2 className="text-lg font-bold text-gray-800">
                  {qrModal.data.selectedMovie}
                </h2>
              </div>

              <div className="divide-y divide-gray-300 text-sm">
                <div className="flex justify-between px-6 py-3 bg-white">
                  <span className="font-semibold text-gray-500">ROOM</span>
                  <span className="text-gray-800">{qrModal.data.room}</span>
                </div>

                <div className="flex justify-between px-6 py-3 bg-gray-50">
                  <span className="font-semibold text-gray-500">ROW</span>
                  <span className="text-gray-800">
                    {qrModal.data.row || "-"}
                  </span>
                </div>

                <div className="flex justify-between px-6 py-3 bg-white">
                  <span className="font-semibold text-gray-500">SEATS</span>
                  <span className="text-gray-800">
                    {Array.isArray(qrModal.data.selectedSeats)
                      ? qrModal.data.selectedSeats.join(", ")
                      : qrModal.data.selectedSeats || "-"}
                  </span>
                </div>

                <div className="flex justify-between px-6 py-3 bg-gray-50">
                  <span className="font-semibold text-gray-500">SNACKS</span>
                  <span className="text-gray-800 text-right">
                    {formatSnacks(
                      qrModal.data.snacks ??
                        qrModal.data.selectedFood ??
                        qrModal.data.food
                    )}
                  </span>
                </div>

                <div className="flex justify-between px-6 py-3 bg-white">
                  <span className="font-semibold text-gray-500">TOTAL</span>
                  <span className="font-bold text-gray-900">
                    {Number(
                      qrModal.data.totalPrice || qrModal.data.total || 0
                    ).toFixed(2)}{" "}
                    €
                  </span>
                </div>
              </div>

              <div className="bg-gray-200 text-center py-3">
                <p className="text-xs text-gray-700 tracking-wide">
                  ID:{" "}
                  <span className="font-semibold text-gray-900">
                    {qrModal.data.ticketId}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmaciones */}
      {confirmModal.visible && confirmModal.step === 1 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-black mb-2">
              Cancel reservation
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this reservation?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ visible: false, step: 0, reservationId: null })
                }
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Keep
              </button>
              <button
                onClick={handleSecondConfirm}
                className="px-4 py-2 rounded-full bg-black text-white hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.visible && confirmModal.step === 2 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
            <h2 className="text-lg font-semibold text-black mb-4">
              Final confirmation
            </h2>
            <p className="text-gray-600 mb-4">Please review your reservation:</p>
            {reservations
              .filter((r) => r.id === confirmModal.reservationId)
              .map((res) => (
                <div key={res.id} className="text-sm space-y-1 mb-6">
                  <p>
                    <strong>Movie:</strong> {res.selectedMovie}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(res.selectedDate)}
                  </p>
                  <p>
                    <strong>Time:</strong> {res.selectedTime}
                  </p>
                  <p>
                    <strong>Room:</strong> {res.room}
                  </p>
                  {res.row && (
                    <p>
                      <strong>Row:</strong> {res.row}
                    </p>
                  )}
                  <p>
                    <strong>Seats:</strong>{" "}
                    {Array.isArray(res.selectedSeats)
                      ? res.selectedSeats.join(", ")
                      : res.selectedSeats || "-"}
                  </p>
                </div>
              ))}
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ visible: false, step: 0, reservationId: null })
                }
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Back
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                Confirm cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReserve;
