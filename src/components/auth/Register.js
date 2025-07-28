import React, { useState } from "react";
import { auth } from "../../utils/firebase";
import db from "../../utils/firebase";
import firebase from "firebase/app";

const Register = ({ embedded = false, onSuccess, setPage }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthdate: "",
    gender: "",
    acceptedTerms: false,
  });

  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      birthdate,
      gender,
      acceptedTerms,
    } = form;

    if (!acceptedTerms) return setError("Debes aceptar los términos y condiciones.");
    if (!isOldEnough(birthdate)) return setError("Debes tener al menos 13 años para registrarte.");
    if (password !== confirmPassword) return setError("Las contraseñas no coinciden.");
    if (phone && !/^\d+$/.test(phone)) return setError("El teléfono solo debe contener números.");

    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection("users").doc(user.uid).set({
        name,
        email,
        phone,
        birthdate,
        gender,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      if (embedded && onSuccess) {
        onSuccess();
      } else if (setPage) {
        setPage("Login");
      } else {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-[#0a1e3f] mb-6">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
          />

          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] text-black"
          >
            <option value="">Select gender (optional)</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          <div className="flex items-start">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
              className="mt-1 mr-2"
            />
            <label className="text-sm">
              I accept the{" "}
              <a
                href="/terminos"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                terms and conditions
              </a>
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Sign up
          </button>
        </form>

        {!embedded && (
          <p className="mt-6 text-center text-black">
            Already have an account?{" "}
            <span
              onClick={() => setPage("Login")}
              className="text-blue-600 cursor-pointer underline"
            >
              Sign in
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
