import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import ViewReserve from "./components/profile/ViewReserve";
import EditProfile from "./components/profile/EditProfile";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/NavBar";
import Loading from "./components/layout/Loading"; // ✅ Componente Loading
import Home from "./components/Home";

import Films from "./components/cinema/Films";
import MovieDetails from "./components/cinema/MovieDetails";
import ReserveMovie from "./components/layout/ReserveMovie";
import SnacksPage from "./components/hooks/SnacksPage";
import Payment from "./components/hooks/Payment";

import Promotions from "./components/layout/Promotions";
import Fidelity from "./components/layout/Fidelity";

import AuthModal from "./components/auth/AuthModal";
import Register from "./components/auth/Register";


// ✅ Componente con loading visual separado
const RoutesWithLoading = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) return <Loading />;

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/films" element={<Films />} />
      <Route path="/movie/:title" element={<MovieDetails />} />
      <Route path="/reservemovie" element={<ReserveMovie />} />
      <Route path="/snackspage" element={<SnacksPage />} />
      
      <Route path="/payment" element={<Payment />} />
      <Route path="/view-reservations" element={<ViewReserve />} />
      <Route path="/edit-profile" element={<EditProfile />} />

      <Route path="/promotions" element={<Promotions />} />
      <Route path="/fidelity" element={<Fidelity />} />
    </Routes>
  );
};

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
      <div className="flex flex-col min-h-screen bg-[#fdfcfb] text-black font-sans relative">
        <Navbar onLoginClick={() => setShowAuthModal(true)} />

        <main className="flex-grow px-6 py-8">
          <RoutesWithLoading />
        </main>

        <Footer />
{showScrollTop && (
  <button
    onClick={scrollToTop}
    className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-125 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] z-50 flex items-center justify-center"
    aria-label="Subir"
  >
    <ArrowUp
      className="w-5 h-5 font-bold animate-bounce"
      strokeWidth={3}
      color="white"
    />
  </button>
)}








        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    </Router>
  );
};

export default App;
