import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for mobile menu toggle
import { Link, useNavigate } from "react-router-dom"; // Router links and navigation
import { auth, default as firebase } from "../../utils/firebase"; // Firebase auth and firestore
import { useNotification } from "../../context/NotificationContext"; // Custom notification context

const Navbar = ({ onLoginClick, transparent = false }) => {
  const [menuOpen, setMenuOpen] = useState(false); // State to track mobile menu open/close
  const [user, setUser] = useState(null); // Current user object
  const [userName, setUserName] = useState("User"); // User display name
  const navigate = useNavigate(); // Programmatic navigation
  const { notify } = useNotification(); // Notification function

  const closeMenu = () => setMenuOpen(false); // Close mobile menu

  // Firebase authentication listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser); // Set current user

      if (currentUser) {
        // Set user display name from Firebase Auth or Firestore
        setUserName(currentUser.displayName || "User");

        try {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid)
            .get();

          if (userDoc.exists) {
            const data = userDoc.data();
            setUserName(data.name || currentUser.displayName || "User");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName("User"); // Reset name if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
      notify("Logged out successfully!", "success"); // Show success notification
      closeMenu();
      navigate("/"); // Redirect to home
    } catch (err) {
      notify("Error logging out. Try again.", "error"); // Show error notification
      console.error(err);
    }
  };

  return (
    <>
      {/* Navbar container */}
      <nav
        className={`w-full z-50 px-4 ${
          transparent ? "absolute top-0" : "fixed top-4"
        }`}
      >
        <div
          className={`max-w-5xl mx-auto rounded-md px-6 py-3 flex justify-between items-center
          transition-colors duration-300 ${
            transparent
              ? "bg-transparent text-white"
              : "bg-black/90 backdrop-blur-md text-white shadow-lg"
          }`}
        >
          {/* Logo */}
          <Link
            to="/home"
            onClick={closeMenu}
            className="text-xl md:text-2xl font-bold tracking-wide uppercase no-underline hover:no-underline text-gray-200"
          >
            CINEREACT
          </Link>

          {/* Desktop menu */}
          <ul className="hidden md:flex gap-8 text-sm font-medium">
            <li>
              <Link
                to="/films"
                className="text-gray-300 hover:text-white transition-colors no-underline hover:no-underline"
              >
                Films
              </Link>
            </li>
            <li>
              <Link
                to="/promotions"
                className="text-gray-300 hover:text-white transition-colors no-underline hover:no-underline"
              >
                Promotions
              </Link>
            </li>

            {/* Show these links only if user is logged in */}
            {user && (
              <>
                <li>
                  <Link
                    to="/fidelity"
                    className="text-gray-300 hover:text-white transition-colors no-underline hover:no-underline"
                  >
                    Fidelity
                  </Link>
                </li>
                <li>
                  <Link
                    to="/view-reservations"
                    className="text-gray-300 hover:text-white transition-colors no-underline hover:no-underline"
                  >
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/edit-profile"
                    className="text-gray-300 hover:text-white transition-colors no-underline hover:no-underline"
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Desktop user info / login */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-300">
                  Hi, {userName}!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-300 hover:text-white transition-colors no-underline hover:no-underline"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-sm text-gray-300 hover:text-white transition-colors no-underline hover:no-underline"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div
            className="md:hidden text-xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Mobile menu */}
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

          {/* Mobile menu links */}
          <ul className="flex flex-col justify-center items-center h-full gap-10 text-2xl font-bold uppercase">
            <li>
              <Link
                to="/films"
                onClick={closeMenu}
                className="px-6 py-4 w-full text-center text-gray-500 hover:text-black transition-colors rounded-md no-underline hover:no-underline"
              >
                Films
              </Link>
            </li>
            <li>
              <Link
                to="/promotions"
                onClick={closeMenu}
                className="px-6 py-4 w-full text-center text-gray-500 hover:text-black transition-colors rounded-md no-underline hover:no-underline"
              >
                Promotions
              </Link>
            </li>

            {/* Conditional mobile links for logged-in users */}
            {user && (
              <>
                <li>
                  <Link
                    to="/fidelity"
                    onClick={closeMenu}
                    className="px-6 py-4 w-full text-center text-gray-500 hover:text-black transition-colors rounded-md no-underline hover:no-underline"
                  >
                    Fidelity
                  </Link>
                </li>
                <li>
                  <Link
                    to="/view-reservations"
                    onClick={closeMenu}
                    className="px-6 py-4 w-full text-center text-gray-500 hover:text-black transition-colors rounded-md no-underline hover:no-underline"
                  >
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/edit-profile"
                    onClick={closeMenu}
                    className="px-6 py-4 w-full text-center text-gray-500 hover:text-black transition-colors rounded-md no-underline hover:no-underline"
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}

            {/* Mobile login/logout button */}
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-4 w-full text-center text-gray-500 hover:text-black transition-colors rounded-md no-underline hover:no-underline"
                >
                  LOG OUT
                </button>
              ) : (
                <button
                  onClick={() => {
                    closeMenu();
                    onLoginClick();
                  }}
                  className="px-6 py-4 w-full text-center text-gray-500 hover:text-black transition-colors rounded-md no-underline hover:no-underline"
                >
                  Sign in
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Spacer div if navbar is not transparent */}
      {!transparent && <div className="h-20"></div>}
    </>
  );
};

export default Navbar;
