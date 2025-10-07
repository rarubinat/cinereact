// Main entry point of the application, sets up routing, layouts, global context, and UI helpers.
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { ArrowUp } from "lucide-react";

// Context provider for notifications
import { NotificationProvider } from "./context/NotificationContext";

// Layout
import Loading from "./components/layout/Loading";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/NavBar";

// Pages
import Home from "./components/pages/Home";
import Films from "./components/pages/Films";
import Fidelity from "./components/pages/Fidelity";
import Promotions from "./components/pages/Promotions";

//Profile
import ViewReserve from "./components/profile/ViewReserve";
import EditProfile from "./components/profile/EditProfile";

//Booking
import MovieDetails from "./components/cinema/MovieDetails";
import ReserveMovie from "./components/layout/ReserveMovie";
import SnacksPage from "./components/hooks/SnacksPage";
import Payment from "./components/payment/Payment";
import Confirmation from "./components/cinema/Confirmation";

//Login
import AuthModal from "./components/auth/AuthModal";
import Register from "./components/auth/Register";

// ------------------ Layouts ------------------

// Main layout for most pages: Navbar + main content + Footer
const MainLayout = ({ onLoginClick }) => (
  <div className="flex flex-col min-h-screen bg-[#fdfcfb] text-black font-sans relative">
    <Navbar onLoginClick={onLoginClick} />
    <main className="flex-grow px-6 py-8">
      <Outlet /> {/* Render nested route content */}
    </main>
    <Footer />
  </div>
);

// Special layout for Home page: transparent Navbar over Hero + Footer
const HomeLayout = ({ onLoginClick }) => (
  <div className="flex flex-col min-h-screen bg-[#fdfcfb] text-black font-sans relative">
    <Navbar onLoginClick={onLoginClick} transparent />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ------------------ Routes with Loading ------------------

// Handles route changes and shows a loading indicator briefly
const RoutesWithLoading = ({ onLoginClick }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Trigger loading state on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) return <Loading />; // Show loading spinner

  return (
    <Routes location={location} key={location.pathname}>
      {/* Home routes with special layout */}
      <Route element={<HomeLayout onLoginClick={onLoginClick} />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Route>

      {/* Register route without any layout */}
      <Route path="/register" element={<Register />} />

      {/* Other routes using the main layout */}
      <Route element={<MainLayout onLoginClick={onLoginClick} />}>
        <Route path="/films" element={<Films />} />
        <Route path="/movie/:title" element={<MovieDetails />} />
        <Route path="/reservemovie" element={<ReserveMovie />} />
        <Route path="/snackspage" element={<SnacksPage />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/payment" element={<Payment />} />

        {/* Profile pages */}
        <Route path="/view-reservations" element={<ViewReserve />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* Extra pages */}
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/fidelity" element={<Fidelity />} />
      </Route>
    </Routes>
  );
};

// ------------------ Main App Component ------------------

// Handles global app state: auth modal, scroll-to-top button, notifications
const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll position to toggle scroll-to-top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll smoothly to top
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Router>
      <NotificationProvider>
        {/* App routes with loading indicator */}
        <RoutesWithLoading onLoginClick={() => setShowAuthModal(true)} />

        {/* Scroll-to-top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-125 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] z-50 flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp
              className="w-5 h-5 font-bold animate-bounce"
              strokeWidth={3}
              color="white"
            />
          </button>
        )}

        {/* Authentication modal */}
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </NotificationProvider>
    </Router>
  );
};

export default App;
