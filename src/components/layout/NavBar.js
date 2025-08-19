import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth, default as firebase } from "../../utils/firebase";

const Navbar = ({ onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await firebase.firestore().collection("users").doc(currentUser.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserName(data.name || "User");
          } else {
            setUserName("User");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserName("User");
        }
      } else {
        setUserName("User");
      }
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
        <div className="max-w-5xl mx-auto bg-black/90 backdrop-blur-md text-white rounded-md shadow-lg px-6 py-3 flex justify-between items-center">
          <Link
            to="/home"
            onClick={closeMenu}
            className="text-xl md:text-2xl font-bold tracking-wide uppercase no-underline hover:no-underline"
          >
            CINEMA
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 text-sm font-medium">
            <li>
              <Link
                to="/films"
                className="hover:text-gray-300 transition-colors no-underline hover:no-underline"
              >
                Films
              </Link>
            </li>
            <li>
              <Link
                to="/promotions"
                className="hover:text-gray-300 transition-colors no-underline hover:no-underline"
              >
                Promotions
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/fidelity"
                  className="hover:text-gray-300 transition-colors no-underline hover:no-underline"
                >
                  Fidelity
                </Link>
              </li>
            )}
            {user && (
              <>
                <li>
                  <Link
                    to="/view-reservations"
                    className="hover:text-gray-300 transition-colors no-underline hover:no-underline"
                  >
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/edit-profile"
                    className="hover:text-gray-300 transition-colors no-underline hover:no-underline"
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-sm hover:text-gray-300 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>

          <div
            className="md:hidden text-xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Mobile Menu Fullscreen */}
        <div
          className={`md:hidden fixed inset-0 bg-white text-black z-40 overflow-y-auto transition-all duration-500 ease-in-out transform ${
            menuOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div
            className="absolute top-6 right-6 text-3xl cursor-pointer"
            onClick={closeMenu}
          >
            <FaTimes />
          </div>

          <ul className="flex flex-col justify-center items-center h-full gap-10 text-2xl font-bold uppercase">
            <li>
              <Link
                to="/films"
                onClick={closeMenu}
                className="px-6 py-4 w-full text-center hover:bg-gray-200 transition-colors rounded-md no-underline hover:no-underline"
              >
                Films
              </Link>
            </li>
            <li>
              <Link
                to="/promotions"
                onClick={closeMenu}
                className="px-6 py-4 w-full text-center hover:bg-gray-200 transition-colors rounded-md no-underline hover:no-underline"
              >
                Promotions
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/fidelity"
                  onClick={closeMenu}
                  className="px-6 py-4 w-full text-center hover:bg-gray-200 transition-colors rounded-md no-underline hover:no-underline"
                >
                  Fidelity
                </Link>
              </li>
            )}
            {user && (
              <li className="px-6 py-4 w-full text-center">
                <span className="font-medium">{userName}</span>
              </li>
            )}
            {user && (
              <li>
                <Link
                  to="/view-reservations"
                  onClick={closeMenu}
                  className="px-6 py-4 w-full text-center hover:bg-gray-200 transition-colors rounded-md no-underline hover:no-underline"
                >
                  My Bookings
                </Link>
              </li>
            )}
            {user && (
              <li>
                <Link
                  to="/edit-profile"
                  onClick={closeMenu}
                  className="px-6 py-4 w-full text-center hover:bg-gray-200 transition-colors rounded-md no-underline hover:no-underline"
                >
                  Profile
                </Link>
              </li>
            )}
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-4 w-full text-center hover:bg-gray-200 transition-colors rounded-md no-underline hover:no-underline"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    closeMenu();
                    onLoginClick();
                  }}
                  className="px-6 py-4 w-full text-center hover:bg-gray-200 transition-colors rounded-md no-underline hover:no-underline"
                >
                  Sign in
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
