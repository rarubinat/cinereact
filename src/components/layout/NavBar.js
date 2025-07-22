import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase"; // Importa Firebase Auth

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Estado para el usuario
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  // Verificar si el usuario está logueado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-zinc-950 text-white w-full border-b border-blue-500/20 shadow-inner shadow-blue-500/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/home"
          onClick={closeMenu}
          className="text-xl md:text-2xl font-light tracking-widest text-blue-400 cursor-pointer uppercase"
        >
          CineReact
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-10 text-sm font-light tracking-wide">
          <li>
            <Link to="/home" className="hover:text-blue-400 transition-colors">Films</Link>
          </li>
          <li>
            <Link to="/view-reservations" className="hover:text-blue-400 transition-colors">My Bookings</Link>
          </li>
          <li>
            <Link to="/edit-profile" className="hover:text-blue-400 transition-colors">Profile</Link>
          </li>
        </ul>

        {/* Botón Sign in / Log out */}
        {user ? (
          <button
            onClick={handleLogout}
            className="hidden md:inline-block border border-red-500/30 text-red-300 hover:text-white hover:border-red-400 px-4 py-1.5 rounded-md text-sm transition-all"
          >
            Log Out
          </button>
        ) : (
          <Link
            to="/login"
            className="hidden md:inline-block border border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400 px-4 py-1.5 rounded-md text-sm transition-all"
          >
            Sign in
          </Link>
        )}

        {/* Icono móvil */}
        <div className="md:hidden text-xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <ul className="md:hidden bg-zinc-950 px-6 pb-4 pt-2 space-y-4 text-sm font-light tracking-wide border-t border-blue-500/10">
          <li><Link to="/home" onClick={closeMenu} className="hover:text-blue-400">Films</Link></li>
          <li><Link to="/view-reservations" onClick={closeMenu} className="hover:text-blue-400">My Bookings</Link></li>
          <li><Link to="/edit-profile" onClick={closeMenu} className="hover:text-blue-400">Profile</Link></li>
          <li>
            {user ? (
              <button
                onClick={() => { handleLogout(); closeMenu(); }}
                className="block w-full text-center border border-red-500/30 text-red-300 hover:text-white hover:border-red-400 px-4 py-2 rounded-md transition"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center border border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400 px-4 py-2 rounded-md transition"
              >
                Sign in
              </Link>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
