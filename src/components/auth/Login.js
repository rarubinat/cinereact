// Component for user authentication (email/password) using Firebase.
// Can be embedded in a modal or used as a standalone page.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import { auth } from "../../utils/firebase"; // Firebase auth
import db from "../../utils/firebase";       // Firestore database
import { useNotification } from "../../context/NotificationContext"; 
import Loading from "../layout/Loading";

const Login = ({ embedded = false, onSuccess, setPage }) => {
  // Local state for email, password, and loading indicator
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test1234");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { notify } = useNotification(); // Custom hook to show notifications

  // ----------------- Handle Login -----------------
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Sign in with Firebase auth
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Check if user exists in Firestore "users" collection
      const doc = await db.collection("users").doc(user.uid).get();
      if (!doc.exists) {
        await auth.signOut();
        notify("Your account is not allowed to log in.", "error"); 
        return;
      }

      // Show success notification
      notify("Login successful!", "success");

      // Redirect or call embedded success callback after short delay
      setTimeout(() => {
        if (embedded && onSuccess) onSuccess();
        else navigate("/films");
      }, 800);

    } catch (err) {
      // Handle Firebase auth errors with custom messages
      let message = "Incorrect email or password.";
      if (err.code === "auth/user-not-found") message = "User not found.";
      else if (err.code === "auth/wrong-password") message = "Wrong password.";
      else if (err.code === "auth/invalid-email") message = "Invalid email.";

      notify(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Handle Password Reset -----------------
  const handleResetPassword = async () => {
    if (!email) return notify("Please enter your email to reset password.", "error");

    setLoading(true);
    try {
      // Send password reset email via Firebase
      await auth.sendPasswordResetEmail(email);
      notify("Password reset email sent!", "success");
    } catch (err) {
      let message = "Error sending password reset email.";
      if (err.code === "auth/user-not-found") message = "User not found.";
      else if (err.code === "auth/invalid-email") message = "Invalid email.";

      notify(message, "error");
    } finally {
      setLoading(false);
    }
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
          Log In
        </h2>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-black"
        />

        {/* Login button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-full text-white font-semibold transition bg-black hover:bg-gray-800 mt-2"
        >
          Log In
        </button>

        {/* Password reset link */}
        <p
          onClick={handleResetPassword}
          className="mt-4 text-center text-gray-700 cursor-pointer hover:text-black text-sm underline"
        >
          Forgot your password?
        </p>

        {/* Sign up link */}
        <p className="mt-6 text-center text-black text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => {
              if (embedded && setPage) setPage("Register");
              else navigate("/register");
            }}
            className="text-black font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
