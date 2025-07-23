import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ViewReserve from "./components/profile/ViewReserve";
import EditProfile from "./components/profile/EditProfile";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/NavBar";
import Home from "./Home";

import Films from "./Films";
import MovieDetails from "./components/cinema/MovieDetails";
import ReserveMovie from "./components/layout/ReserveMovie";


const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black text-white font-sans">
        <Navbar />
        <main className="flex-grow px-6 py-8">
          <Routes>
            <Route path="/" element={<Films />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/films" element={<Films />} />

            <Route path="/movie/:title" element={<MovieDetails />} />
            <Route path="/reservemovie" element={<ReserveMovie />} />

            <Route path="/view-reservations" element={<ViewReserve />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
