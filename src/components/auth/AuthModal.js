import React, { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthModal = ({ onClose }) => {
  const [page, setPage] = useState("Login");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Activar animación después del montaje
    setTimeout(() => setAnimateIn(true), 10);
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300); // esperar que termine la animación
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "auth-backdrop") {
      handleClose();
    }
  };

  return (
    <div
      id="auth-backdrop"
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-hidden
        transition-transform duration-300 ease-in-out transform 
        ${animateIn ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Botón cerrar en esquina */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-black text-3xl font-bold hover:text-gray-300 z-50"
      >
        ×
      </button>

      {/* Login o Register a pantalla completa */}
      {page === "Login" ? (
        <Login embedded={true} onSuccess={handleClose} setPage={setPage} />
      ) : (
        <Register embedded={true} onSuccess={handleClose} setPage={setPage} />
      )}
    </div>
  );
};

export default AuthModal;
