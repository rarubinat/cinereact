import React, { useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";

const EditProfileModal = ({ onClose, currentPlan, setCurrentPlan }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthdate: "",
    gender: "",
    language: "English",
    payment: "",
    notifications: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 10);

    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists) {
          setForm({
            name: doc.data().name || "",
            phone: doc.data().phone || "",
            birthdate: doc.data().birthdate || "",
            gender: doc.data().gender || "",
            language: doc.data().language || "English",
            payment: doc.data().payment || "",
            notifications: doc.data().notifications ?? true,
          });
        }
      }
    };
    fetchUser();
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "edit-backdrop") handleClose();
  };

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
      if (!user) return setError("Not authenticated.");
      if (!form.name.trim()) return setError("Name cannot be empty.");

      await db.collection("users").doc(user.uid).update({
        ...form,
        plan: currentPlan,
        updatedAt: new Date(),
      });

      alert("Profile updated successfully.");
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Error updating profile.");
    }
  };

  return (
    <div
      id="edit-backdrop"
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center
        transition-transform duration-300 ease-in-out transform
        ${animateIn ? "opacity-100" : "opacity-0"}`}
    >
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-black text-2xl font-bold hover:text-gray-500"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>English</option>
            <option>Spanish</option>
          </select>
          <select
            name="plan"
            value={currentPlan}
            onChange={(e) => setCurrentPlan(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Standard">Standard</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="VIP">VIP</option>
          </select>
          <input
            type="text"
            name="payment"
            value={form.payment}
            onChange={handleChange}
            placeholder="•••• •••• •••• 1234"
            className="w-full p-2 border rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
            />
            <span>Receive notifications</span>
          </label>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
