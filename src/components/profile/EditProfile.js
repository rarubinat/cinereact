import React, { useState, useEffect } from "react";
import { auth } from "../../utils/firebase"; // Firebase authentication
import db from "../../utils/firebase"; // Firestore database
import { FiPhone, FiCalendar, FiUser, FiMapPin, FiBell } from "react-icons/fi"; // Icons
import useReservationCount from "../hooks/ReservationCount"; // Custom hook for reservation stats
import { useNotification } from "../../context/NotificationContext"; // Notification context
import { useNavigate } from "react-router-dom"; // Router navigation

const EditProfile = () => {
  // Form state for user profile
  const [form, setForm] = useState({
    name: "", // first name
    lastName: "", // last name
    phone: "",
    birthdate: "",
    gender: "",
    language: "English",
    payment: "",
    notifications: true,
    photoURL: "",
    city: "",
    zip: "",
  });

  // State for notifications toggle, error messages, modal edit state, reservations, and plan
  const [savedNotifications, setSavedNotifications] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [currentPlan, setCurrentPlan] = useState("Silver");
  const [showNextReservationNotification, setShowNextReservationNotification] =
    useState(false);

  const { notify } = useNotification(); // custom notify function
  const { totalCount, totalPoints } = useReservationCount(); // reservation stats
  const navigate = useNavigate(); // navigation hook

  // Fetch user profile and reservations on auth state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Fetch user data from Firestore
          const userDoc = await db.collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            // Set form state with user data, fallback to empty strings
            setForm((prev) => ({
              ...prev,
              name: data.name || "",
              lastName: data.lastName || "",
              phone: data.phone || "",
              birthdate: data.birthdate || "",
              gender: data.gender || "",
              photoURL: data.photoURL || "",
              city: data.city || "",
              zip: data.zip || "",
              notifications:
                data.notifications !== undefined ? data.notifications : true,
            }));

            // Save notification preference
            setSavedNotifications(
              data.notifications !== undefined ? data.notifications : true
            );

            // Determine current plan based on points
            setCurrentPlan((data.points || 0) > 250 ? "Gold" : "Silver");
          }

          // Fetch user's reservations from Firestore
          const resSnapshot = await db
            .collection("reservas")
            .where("userId", "==", user.uid)
            .get();

          const allReservations = resSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter upcoming reservations
          const today = new Date();
          const upcoming = allReservations
            .filter((r) => r.selectedDate && new Date(r.selectedDate) >= today)
            .sort(
              (a, b) => new Date(a.selectedDate) - new Date(b.selectedDate)
            );

          setReservations(upcoming);
        } catch (err) {
          console.error("Error fetching user or reservations", err);
          notify("Error loading profile data.", "error");
        }
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [notify]);

  // Show next reservation notification if notifications are enabled
  useEffect(() => {
    if (savedNotifications && reservations.length > 0) {
      setShowNextReservationNotification(true);
    }
  }, [savedNotifications, reservations]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Not authenticated.");
        notify("You must be logged in.", "error");
        return;
      }

      // Update user document in Firestore (name/lastName are read-only)
      await db.collection("users").doc(user.uid).update({
        phone: form.phone,
        birthdate: form.birthdate,
        gender: form.gender,
        city: form.city,
        zip: form.zip,
        notifications: form.notifications,
        plan: currentPlan,
        updatedAt: new Date(),
      });

      setSavedNotifications(form.notifications);
      notify("Profile updated successfully.", "success");
      setEditing(false);
    } catch (err) {
      setError("Error updating profile.");
      notify("Error updating profile.", "error");
      console.error(err);
    }
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-6 sm:px-6">
      {/* Profile Header */}
      <section className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        {/* User avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg border border-gray-200">
          {form.photoURL ? (
            <img
              src={form.photoURL}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <FiUser className="text-gray-400 w-full h-full p-4" />
          )}
        </div>

        {/* User name */}
        <h1 className="text-2xl font-bold mt-4">
          {form.name || "User"} {form.lastName || ""}
        </h1>

        {/* Edit profile button */}
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
          >
            Edit Profile
          </button>
        )}

        {/* User info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
          {/* Full Name */}
          <div className="bg-gray-50 p-3 rounded-lg flex items-center shadow-sm">
            <FiUser className="text-gray-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="font-bold">
                {form.name || "N/A"} {form.lastName || ""}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-gray-50 p-3 rounded-lg flex items-center shadow-sm">
            <FiPhone className="text-gray-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-bold">{form.phone || "N/A"}</p>
            </div>
          </div>

          {/* Birthdate */}
          <div className="bg-gray-50 p-3 rounded-lg flex items-center shadow-sm">
            <FiCalendar className="text-gray-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Birthdate</p>
              <p className="font-bold">
                {form.birthdate
                  ? new Date(form.birthdate).toLocaleDateString("en-US")
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Gender */}
          <div className="bg-gray-50 p-3 rounded-lg flex items-center shadow-sm">
            <FiUser className="text-gray-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="font-bold">{form.gender || "N/A"}</p>
            </div>
          </div>

          {/* City */}
          <div className="bg-gray-50 p-3 rounded-lg flex items-center shadow-sm">
            <FiMapPin className="text-gray-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">City</p>
              <p className="font-bold">{form.city || "N/A"}</p>
            </div>
          </div>

          {/* Postal Code */}
          <div className="bg-gray-50 p-3 rounded-lg flex items-center shadow-sm">
            <FiMapPin className="text-gray-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Postal Code</p>
              <p className="font-bold">{form.zip || "N/A"}</p>
            </div>
          </div>

          {/* Notifications status */}
          <div className="bg-gray-50 p-3 rounded-lg flex items-center shadow-sm col-span-2">
            <FiBell className="text-gray-500 mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Notifications</p>
              <p className="font-bold">
                {savedNotifications ? "Activated" : "Deactivated"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="summary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl w-full mt-8">
        <div className="card bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">{totalPoints}</h3>
          <p>Points accumulated</p>
        </div>
        <div className="card bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">{currentPlan}</h3>
          <p>Current Plan</p>
        </div>
        <div className="card bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">{totalCount}</h3>
          <p>Total Reservations</p>
        </div>
        <div className="card bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">
            {reservations.length > 0
              ? formatDate(reservations[0].selectedDate)
              : "No upcoming reservations"}
          </h3>
          <p>Next Reservation</p>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-95 flex items-center justify-center p-4 overflow-auto">
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
            {/* Close modal button */}
            <button
              onClick={() => setEditing(false)}
              className="absolute top-4 right-4 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            {/* Editable form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* First Name (read-only) */}
              <div>
                <label className="block mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
              </div>

              {/* Last Name (read-only) */}
              <div>
                <label className="block mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Birthdate */}
              <div>
                <label className="block mb-1 font-medium">Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={form.birthdate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block mb-1 font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block mb-1 font-medium">Postal Code</label>
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Notifications toggle */}
              <div className="toggle flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={form.notifications}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label>Receive notifications</label>
              </div>

              {/* Error message */}
              {error && <p className="text-red-600">{error}</p>}

              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Next Reservation Notification Modal */}
      {showNextReservationNotification && reservations.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-black mb-4">
              Upcoming Reservation
            </h2>
            <div className="text-sm text-gray-700 mb-6 space-y-1">
              <p>
                <strong>Date:</strong>{" "}
                {formatDate(reservations[0].selectedDate)}
              </p>
              <p>
                <strong>Time:</strong> {reservations[0].selectedTime || "N/A"}
              </p>
              <p>
                <strong>Room:</strong> {reservations[0].room || "N/A"}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNextReservationNotification(false)}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate("/view-reservations");
                  setShowNextReservationNotification(false);
                }}
                className="px-4 py-2 rounded-full bg-black text-white hover:opacity-90"
              >
                My bookings
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EditProfile;
