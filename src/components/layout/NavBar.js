import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
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
    <>
      {/* Navbar */}
      <nav className="w-full fixed top-4 z-50 px-4">
        <div
          className="
            max-w-5xl mx-auto 
            bg-black/90 backdrop-blur-md 
            text-white 
            rounded-md 
            shadow-lg 
            px-6 py-3 
            flex justify-between items-center
          "
        >
          {/* Logo */}
          <Link
            to="/home"
            onClick={closeMenu}
            className="text-xl md:text-2xl font-bold tracking-wide uppercase"
          >
            CINEMA
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 text-sm font-medium">
            <li>
              <Link to="/films" className="hover:text-gray-300 transition-colors">
                Films
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/view-reservations" className="hover:text-gray-300 transition-colors">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/edit-profile" className="hover:text-gray-300 transition-colors">
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Auth Buttons + Search */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm hover:text-gray-300 transition-colors"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-sm hover:text-gray-300 transition-colors"
              >
                Sign in
              </button>
            )}
            <button className="p-2 hover:bg-gray-800 rounded-md transition-colors">
              <FaSearch size={16} />
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div
            className="md:hidden text-xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Mobile Menu Fullscreen */}
        <div
          className={`md:hidden fixed inset-0 bg-black/95 text-white z-40 overflow-y-auto transition-all duration-500 ease-in-out ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Botón de cerrar */}
          <div className="absolute top-6 right-6 text-3xl cursor-pointer" onClick={closeMenu}>
            <FaTimes />
          </div>

          <ul className="flex flex-col justify-center items-center h-full gap-6 text-2xl font-bold uppercase">
            <li>
              <Link
                to="/films"
                onClick={closeMenu}
                className="px-6 py-2 hover:bg-white hover:text-black transition-colors rounded-md"
              >
                Films
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/view-reservations"
                    onClick={closeMenu}
                    className="px-6 py-2 hover:bg-white hover:text-black transition-colors rounded-md"
                  >
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/edit-profile"
                    onClick={closeMenu}
                    className="px-6 py-2 hover:bg-white hover:text-black transition-colors rounded-md"
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 hover:bg-white hover:text-black transition-colors rounded-md"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    closeMenu();
                    onLoginClick();
                  }}
                  className="px-6 py-2 hover:bg-white hover:text-black transition-colors rounded-md"
                >
                  Sign in
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Espaciador para que el contenido no quede debajo del navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
