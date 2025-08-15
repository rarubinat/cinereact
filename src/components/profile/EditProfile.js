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
  const [submitted, setSubmitted] = useState(false);

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
          }
        } catch (err) {
          console.error("User profile not found.", err);
        }
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
    setSubmitted(true);

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
        birthdate: form.birthdate,
        gender: form.gender,
        updatedAt: new Date(),
      });

      alert("Profile updated successfully.");
      setPage("Profile");
    } catch (err) {
      setError("Error updating profile.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-black px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-8 tracking-wide">Edit Profile</h2>

        {/* Name */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition"
        />

        {/* Phone */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Phone (optional)
        </label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          pattern="\d*"
          placeholder="Numbers only"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition"
        />

        {/* Birthdate */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Birthdate
        </label>
        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black transition"
        />

        {/* Gender */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black transition"
        >
          <option value="" className="text-gray-400">
            Select gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-black hover:bg-gray-800 rounded-full text-white font-semibold shadow-md transition-transform active:scale-95"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
