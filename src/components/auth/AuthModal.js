// src/components/auth/AuthModal.js
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthModal = ({ onClose }) => {
  const [page, setPage] = useState("Login");

  const handleBackdropClick = (e) => {
    if (e.target.id === "auth-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="auth-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
    >
      {/* Botón cerrar en esquina */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black text-3xl font-bold hover:text-gray-300 z-50"
      >
        ×
      </button>

      {/* Login o Register a pantalla completa */}
      {page === "Login" ? (
        <Login embedded={true} onSuccess={onClose} setPage={setPage} />
      ) : (
        <Register embedded={true} onSuccess={onClose} setPage={setPage} />
      )}
    </div>
  );
};

export default AuthModal;
