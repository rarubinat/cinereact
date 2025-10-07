import React, { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthModal = ({ onClose }) => {
  // State to track which page to show: "Login" or "Register"
  const [page, setPage] = useState("Login");
  // State to control slide-in animation (true = visible, false = hidden)
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger the slide-in animation after the component mounts
    setTimeout(() => setAnimateIn(true), 10);
  }, []);

  // Handle closing the modal with exit animation
  const handleClose = () => {
    setAnimateIn(false); // start slide-out animation
    setTimeout(onClose, 300); // wait for animation to finish (300ms) before removing modal
  };

  // Handle click on backdrop (outside modal content)
  const handleBackdropClick = (e) => {
    // Only close if the click is directly on the backdrop, not on children
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
      {/* Close button in the top-right corner */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-black text-3xl font-bold hover:text-gray-300 z-50"
      >
        ×
      </button>

      {/* Show either Login or Register screen depending on `page` state */}
      {page === "Login" ? (
        <Login 
          embedded={true} 
          onSuccess={handleClose} 
          setPage={setPage} // allows switching to Register
        />
      ) : (
        <Register 
          embedded={true} 
          onSuccess={handleClose} 
          setPage={setPage} // allows switching back to Login
        />
      )}
    </div>
  );
};

export default AuthModal;
