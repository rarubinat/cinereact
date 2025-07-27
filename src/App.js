import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ViewReserve from "./components/profile/ViewReserve";
import EditProfile from "./components/profile/EditProfile";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/NavBar";
import Home from "./components/Home";

import Films from "./components/cinema/Films";
import MovieDetails from "./components/cinema/MovieDetails";
import ReserveMovie from "./components/layout/ReserveMovie";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target.id === "login-backdrop") {
      setShowLogin(false);
    }
  };

  // Mostrar botón cuando el scroll pasa de 200px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para subir al inicio
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black text-white font-sans relative">
        <Navbar onLoginClick={() => setShowLogin(true)} />

        <main className="flex-grow px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/films" element={<Films />} />
            <Route path="/movie/:title" element={<MovieDetails />} />
            <Route path="/reservemovie" element={<ReserveMovie />} />
            <Route path="/view-reservations" element={<ViewReserve />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </main>

        <Footer />

        {/* Botón Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition z-50"
            aria-label="Subir"
          >
            ↑
          </button>
        )}

        {/* Modal de Login */}
        {showLogin && (
          <div
            id="login-backdrop"
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center"
          >
            <div className="relative w-full max-w-md p-4">
              <Login onClose={() => setShowLogin(false)} />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
