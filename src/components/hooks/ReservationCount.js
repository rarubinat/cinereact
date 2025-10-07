import { useState, useEffect, useCallback } from "react";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";

const POINTS_PER_RESERVATION = 20;

/**
 * Custom hook to track reservation counts and points for the current user.
 */
const useReservationCount = () => {
  const [totalCount, setTotalCount] = useState(0);         // Total reservations (including cancelled)
  const [last30DaysCount, setLast30DaysCount] = useState(0); // Reservations in the last 30 days
  const [totalPoints, setTotalPoints] = useState(0);       // Loyalty points
  const [loading, setLoading] = useState(true);            // Loading state

  /**
   * Fetch reservations from Firestore and calculate counts and points
   */
  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        // Reset state if no user is logged in
        setTotalCount(0);
        setLast30DaysCount(0);
        setTotalPoints(0);
        setLoading(false);
        return;
      }

      // Fetch all reservations of the current user
      const querySnapshot = await db
        .collection("reservas")
        .where("userId", "==", currentUser.uid)
        .get();

      const reservations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Total reservations (including cancelled)
      setTotalCount(reservations.length);

      // Filter active reservations (not cancelled)
      const activeReservations = reservations.filter(
        (r) => r.status !== "cancelled"
      );

      // Calculate reservations made in the last 30 days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      const last30 = activeReservations.filter((r) => {
        if (!r.date) return false;
        // Convert Firestore timestamp to Date if needed
        const reservationDate = r.date.toDate ? r.date.toDate() : new Date(r.date);
        return reservationDate >= cutoffDate;
      }).length;

      setLast30DaysCount(last30);

      // Calculate loyalty points based on active reservations
      const points = activeReservations.length * POINTS_PER_RESERVATION;
      setTotalPoints(points);

      // Update points in Firestore
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

  // Fetch reservations on mount
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Return data and a refetch function
  return { 
    totalCount, 
    last30DaysCount, 
    totalPoints, 
    loading, 
    refetch: fetchReservations 
  };
};

export default useReservationCount;
