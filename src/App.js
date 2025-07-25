import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ViewReserve from "./components/profile/ViewReserve";
import EditProfile from "./components/profile/EditProfile";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/NavBar";

import Films from "./components/cinema/Films";
import MovieDetails from "./components/cinema/MovieDetails";
import ReserveMovie from "./components/layout/ReserveMovie";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target.id === "login-backdrop") {
      setShowLogin(false);
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black text-white font-sans relative">
        <Navbar onLoginClick={() => setShowLogin(true)} />

        <main className="flex-grow px-6 py-8">
          <Routes>
            <Route path="/" element={<Films />} />
            <Route path="/register" element={<Register />} />
            <Route path="/films" element={<Films />} />
            <Route path="/movie/:title" element={<MovieDetails />} />
            <Route path="/reservemovie" element={<ReserveMovie />} />
            <Route path="/view-reservations" element={<ViewReserve />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </main>

        <Footer />

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
