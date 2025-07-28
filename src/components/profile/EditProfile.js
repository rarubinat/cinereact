import React, { useState, useEffect } from "react";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";

const EditProfile = ({ setPage }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthdate: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await db.collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setForm({
              name: data.name || "",
              phone: data.phone || "",
              birthdate: data.birthdate || "",
              gender: data.gender || "",
            });
            setError("");
          } else {
            setError("User profile not found.");
          }
        } catch {
          setError("Error loading data.");
        }
      } else {
        setError("You are not authenticated.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You are not authenticated.");
        return;
      }
      if (!form.name.trim()) {
        setError("Name cannot be empty.");
        return;
      }

      await db.collection("users").doc(user.uid).update({
        name: form.name,
        phone: form.phone,
        birthdate: form.birthdate, // Guardamos como string
        gender: form.gender,
        updatedAt: db.FieldValue.serverTimestamp(),
      });

      alert("Profile updated successfully.");
      setPage("Profile");
    } catch (err) {
      setError("Error updating profile.");
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-zinc-400 mt-10 px-6">Loading data...</p>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 rounded-xl p-8 shadow-xl border border-zinc-700"
      >
        <h2 className="text-2xl font-semibold text-blue-400 mb-8 tracking-wide">
          Edit Profile
        </h2>

        {/* Name */}
        <label className="block mb-2 text-sm font-semibold text-zinc-300">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Phone */}
        <label className="block mb-2 text-sm font-semibold text-zinc-300">
          Phone (optional)
        </label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          pattern="\d*"
          placeholder="Numbers only"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Birthdate */}
        <label className="block mb-2 text-sm font-semibold text-zinc-300">
          Birthdate
        </label>
        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Gender */}
        <label className="block mb-2 text-sm font-semibold text-zinc-300">
          Gender
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="" className="text-zinc-400">
            Select gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>

        {error && (
          <p className="mb-6 text-center text-red-500 font-semibold select-none">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md transition-transform active:scale-95"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
