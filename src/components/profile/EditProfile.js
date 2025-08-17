import React, { useState, useEffect } from "react";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";
import { FiPhone, FiCalendar, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; 

const EditProfile = ({ setPage }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthdate: "",
    gender: "",
    language: "English",
    payment: "",
    notifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [reservations, setReservations] = useState([]);

   const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await db.collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setForm((prev) => ({
              ...prev,
              name: data.name || "",
              phone: data.phone || "",
              birthdate: data.birthdate || "",
              gender: data.gender || "",
            }));
          }

          const resSnapshot = await db
            .collection("past-reservations")
            .where("userId", "==", user.uid)
            .orderBy("date", "desc")
            .limit(2)
            .get();

          const pastReservations = resSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReservations(pastReservations);
        } catch (err) {
          console.error("Error fetching user or reservations", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Not authenticated.");
        return;
      }
      if (!form.name.trim()) {
        setError("Name cannot be empty.");
        return;
      }
      await db.collection("users").doc(user.uid).update({
        name: form.name,
        phone: form.phone,
        birthdate: form.birthdate,
        gender: form.gender,
        updatedAt: new Date(),
      });
      alert("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError("Error updating profile.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 space-y-12 bg-gray-50">
      {/* Profile Section */}
      <section className="profile-header text-center space-y-3 max-w-md w-full">
        <div className="avatar w-24 h-24 mx-auto rounded-full bg-gray-300"></div>
        <h1 className="text-2xl font-bold">{form.name || "User"}</h1>

        {/* User summary with icons */}
        <div className="user-summary text-sm text-gray-600 space-y-1">
          {form.phone && (
            <div className="flex items-center justify-center space-x-1">
              <FiPhone />
              <span>{form.phone}</span>
            </div>
          )}
          {form.birthdate && (
            <div className="flex items-center justify-center space-x-1">
              <FiCalendar />
              <span>{new Date(form.birthdate).toLocaleDateString("en-US")}</span>
            </div>
          )}
          {form.gender && (
            <div className="flex items-center justify-center space-x-1">
              <FiUser />
              <span>{form.gender}</span>
            </div>
          )}
        </div>

        {/* Edit Profile Button */}
        {!editing && (
          <button
            className="btn mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        )}

        {/* Profile Form */}
        {editing && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 text-left max-w-md mx-auto bg-white p-6 rounded-lg shadow"
          >
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 font-medium">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="birthdate" className="block mb-1 font-medium">
                Birthdate
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block mb-1 font-medium">
                Gender
              </label>
              <select
                id="gender"
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
            <div>
              <label htmlFor="language" className="block mb-1 font-medium">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                <option>English</option>
                <option>Spanish</option>
              </select>
            </div>
            <div>
              <label htmlFor="payment" className="block mb-1 font-medium">
                Payment Method
              </label>
              <input
                type="text"
                id="payment"
                name="payment"
                value={form.payment}
                onChange={handleChange}
                placeholder="•••• •••• •••• 1234"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="toggle flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={form.notifications}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label htmlFor="notifications">Receive notifications</label>
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <button
              type="submit"
              className="btn px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
            >
              Save Changes
            </button>
          </form>
        )}
      </section>

      {/* Summary Section */}
      <section className="summary grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl w-full">
        <div className="card bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">5</h3>
          <p>Tickets this month</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">1200</h3>
          <p>Points accumulated</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">Family</h3>
          <p>Current Plan</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">
            {reservations[0] ? new Date(reservations[0].date).toLocaleDateString("en-US") : "Aug 18"}
          </h3>
          <p>Next Reservation</p>
        </div>
      </section>

      {/* Reservation History */}
      <section className="history max-w-4xl w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Reservation History</h2>
        <div className="history-list space-y-4 flex flex-col items-center">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="history-item flex items-center space-x-4 bg-white p-4 rounded-lg shadow w-full max-w-md"
            >
              <div className="thumb w-16 h-16 bg-gray-300 rounded"></div>
              <div className="info text-left">
                <strong>{res.movieTitle}</strong>
                <br />
                <span className="status text-gray-500 text-sm">
                  {new Date(res.date).toLocaleDateString("en-US")} • {res.room} • {res.status}
                </span>
              </div>
            </div>
          ))}
        </div>
         <button
            onClick={() => navigate("/ViewReserve")}
            className="btn px-4 py-1 bg-black text-white rounded-full hover:bg-gray-800"
          >
            See More
          </button>
      </section>

      {/* Benefits Section */}
      <section className="benefits max-w-4xl w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Available Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
          <div className="benefit bg-white p-4 rounded-lg shadow w-full max-w-xs">
            <h4 className="font-semibold">Free Popcorn</h4>
            <p>Valid on your next visit.</p>
          </div>
          <div className="benefit bg-white p-4 rounded-lg shadow w-full max-w-xs">
            <h4 className="font-semibold">Exclusive Premiere</h4>
            <p>Access special premieres.</p>
          </div>
          <div className="benefit bg-white p-4 rounded-lg shadow w-full max-w-xs">
            <h4 className="font-semibold">Early Ticket Sale</h4>
            <p>Buy tickets before anyone else.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EditProfile;
