// src/hooks/useReservationCount.js
import { useState, useEffect, useCallback } from "react";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";

const POINTS_PER_RESERVATION = 20;

const useReservationCount = () => {
  const [totalCount, setTotalCount] = useState(0);        // Total de reservas
  const [last30DaysCount, setLast30DaysCount] = useState(0); // Reservas últimos 30 días
  const [totalPoints, setTotalPoints] = useState(0);      // Puntos acumulados
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setTotalCount(0);
        setLast30DaysCount(0);
        setTotalPoints(0);
        setLoading(false);
        return;
      }

      // 🔹 Consultar todas las reservas del usuario (SDK vieja)
      const querySnapshot = await db
        .collection("reservas")
        .where("userId", "==", currentUser.uid)
        .get();

      const reservations = querySnapshot.docs.map((doc) => doc.data());

      // Total de reservas
      setTotalCount(reservations.length);

      // 🔹 Calcular fecha de corte (últimos 30 días)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      // 🔹 Contar reservas en últimos 30 días
      const last30 = reservations.filter((r) => {
        if (!r.date) return false;
        const reservationDate = r.date.toDate ? r.date.toDate() : new Date(r.date);
        return reservationDate >= cutoffDate;
      }).length;

      setLast30DaysCount(last30);

      // Calcular puntos totales
      const points = reservations.length * POINTS_PER_RESERVATION;
      setTotalPoints(points);

      // 🔹 Actualizar puntos en Firestore
      await db.collection("users").doc(currentUser.uid).update({ points });

    } catch (error) {
      console.error("Error fetching reservations:", error);
      setTotalCount(0);
      setLast30DaysCount(0);
      setTotalPoints(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return { 
    totalCount, 
    last30DaysCount, 
    totalPoints, 
    loading, 
    refetch: fetchReservations 
  };
};

export default useReservationCount;