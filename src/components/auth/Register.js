// Component for user registration using Firebase Authentication and Firestore.
// Can be used as a full page or embedded modal with embedded prop.

import React, { useState } from "react";
import { auth } from "../../utils/firebase"; // Firebase auth
import db from "../../utils/firebase";       // Firestore database
import firebase from "firebase/app";
import { useNotification } from "../../context/NotificationContext"; 
import Loading from "../layout/Loading";

const Register = ({ embedded = false, onSuccess, setPage }) => {
  const { notify } = useNotification();

  // Form state for user inputs
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthdate: "",
    gender: "",
    acceptedTerms: false,
  });

  const [loading, setLoading] = useState(false);

  // ----------------- Helper: Check minimum age (13) -----------------
  const isOldEnough = (birthdate) => {
    if (!birthdate) return false;
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 13;
  };

  // ----------------- Handle form input changes -----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ----------------- Handle registration -----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    const {
      name,
      lastname,
      email,
      password,
      confirmPassword,
      phone,
      birthdate,
      gender,
      acceptedTerms,
    } = form;

    // --- Validation ---
    if (!name || !lastname || !email || !password || !confirmPassword || !birthdate) {
      return notify("All required fields must be completed.", "error");
    }
    if (!acceptedTerms) return notify("You must accept the terms and conditions.", "error");
    if (!isOldEnough(birthdate)) return notify("You must be at least 13 years old.", "error");
    if (password !== confirmPassword) return notify("Passwords do not match.", "error");
    if (phone && !/^\d+$/.test(phone)) return notify("Phone can only contain numbers.", "error");

    setLoading(true);
    try {
      // Create user with Firebase Auth
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await user.updateProfile({ displayName: name }); // set display name

      // Add user data to Firestore
      await db.collection("users").doc(user.uid).set({
        name,
        lastname,
        email,
        phone,
        birthdate,
        gender,
        plan: "Silver", // default plan
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      notify("Registration successful!", "success");

      // Redirect or call embedded success handler
      if (embedded && onSuccess) onSuccess();
      else if (setPage) setPage("Login");

    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Form validation for button activation -----------------
  const isFormValid = () => {
    const { name, lastname, email, password, confirmPassword, birthdate, acceptedTerms } = form;
    return (
      name &&
      lastname &&
      email &&
      password &&
      confirmPassword &&
      birthdate &&
      acceptedTerms
    );
  };

  // ----------------- Render -----------------
  if (loading) return <Loading />;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm fixed inset-0 z-50">
      {/* Modal container */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl relative">
        {/* Close button for embedded modal */}
        {embedded && onSuccess && (
          <div
            className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-700 hover:text-black"
            onClick={onSuccess}
          >
            &times;
          </div>
        )}

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Register
        </h2>

        {/* Registration form */}
        <form onSubmit={handleRegister} className="space-y-3">
          {/* Personal info */}
          <input type="text" name="name" placeholder="Name *" value={form.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black" required />
          <input type="text" name="lastname" placeholder="Lastname *" value={form.lastname} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black" required />
          <input type="email" name="email" placeholder="Email *" value={form.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black" required />
          
          {/* Password fields */}
          <input type="password" name="password" placeholder="Password *" value={form.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password *" value={form.confirmPassword} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black" required />
          
          {/* Optional phone */}
          <input type="tel" name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black" />

          {/* Birthdate */}
          <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black" required />

          {/* Gender selection */}
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black">
            <option value="">Select gender (optional)</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          {/* Terms acceptance */}
          <div className="flex items-start">
            <input type="checkbox" name="acceptedTerms" checked={form.acceptedTerms} onChange={handleChange} className="mt-1 mr-2" />
            <label className="text-sm text-black">
              I accept the{" "}
              <a href="/terminos" target="_blank" rel="noreferrer" className="text-black font-semibold hover:underline">
                terms and conditions
              </a>
            </label>
          </div>

          {/* Submit button */}
          <button type="submit" disabled={!isFormValid()} className={`w-full py-3 rounded-full text-white font-semibold transition ${isFormValid() ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"}`}>
            Sign up
          </button>

          {/* Link to login */}
          <p className="mt-6 text-center text-black text-sm">
            Already have an account?{" "}
            <span onClick={() => setPage("Login")} className="text-black font-semibold cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
