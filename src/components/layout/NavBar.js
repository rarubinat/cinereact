import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";

const Navbar = ({ onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="bg-zinc-950 text-white w-full border-b border-blue-500/20 shadow-inner shadow-blue-500/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/home"
          onClick={closeMenu}
          className="text-xl md:text-2xl font-light tracking-widest text-blue-400 cursor-pointer uppercase"
        >
          CineReact
        </Link>

        <ul className="hidden md:flex space-x-10 text-sm font-light tracking-wide">
          <li>
            <Link to="/films" className="hover:text-blue-400 transition-colors">Films</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/view-reservations" className="hover:text-blue-400 transition-colors">My Bookings</Link>
              </li>
              <li>
                <Link to="/edit-profile" className="hover:text-blue-400 transition-colors">Profile</Link>
              </li>
            </>
          )}
        </ul>

        {/* Desktop login/logout button */}
        {user ? (
          <button
            onClick={handleLogout}
            className="hidden md:inline-block border border-red-500/30 text-red-300 hover:text-white hover:border-red-400 px-4 py-1.5 rounded-md text-sm transition-all"
          >
            Log Out
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="hidden md:inline-block border border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400 px-4 py-1.5 rounded-md text-sm transition-all"
          >
            Sign in
          </button>
        )}

        {/* Mobile menu icon */}
        <div className="md:hidden text-xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-zinc-950 px-6 pb-4 pt-2 space-y-4 text-sm font-light tracking-wide border-t border-blue-500/10">
          <li>
            <Link to="/films" onClick={closeMenu} className="hover:text-blue-400">Films</Link>
          </li>

          {user && (
            <>
              <li>
                <Link to="/view-reservations" onClick={closeMenu} className="hover:text-blue-400">My Bookings</Link>
              </li>
              <li>
                <Link to="/edit-profile" onClick={closeMenu} className="hover:text-blue-400">Profile</Link>
              </li>
            </>
          )}

          <li>
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-center border border-red-500/30 text-red-300 hover:text-white hover:border-red-400 px-4 py-2 rounded-md transition"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => {
                  closeMenu();
                  onLoginClick();
                }}
                className="block w-full text-center border border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400 px-4 py-2 rounded-md transition"
              >
                Sign in
              </button>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
