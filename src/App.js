import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import ViewReserve from "./components/profile/ViewReserve";
import EditProfile from "./components/profile/EditProfile";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/NavBar";
import Home from "./components/Home";

import Films from "./components/cinema/Films";
import MovieDetails from "./components/cinema/MovieDetails";
import ReserveMovie from "./components/layout/ReserveMovie";

import AuthModal from "./components/auth/AuthModal"; // ✅ Nuevo import
import Register from "./components/auth/Register";

const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black text-white font-sans relative">
        <Navbar onLoginClick={() => setShowAuthModal(true)} />

        <main className="flex-grow px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            <Route path="/register" element={<Register />} />
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
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white p-3 rounded-lg shadow-lg transition transform hover:scale-110 z-50"
            aria-label="Subir"
          >
            <ArrowUp className="w-6 h-6 animate-bounce" />
          </button>
        )}

        {/* Modal Unificado de Login/Register */}
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    </Router>
  );
};

export default App;
