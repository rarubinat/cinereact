import { useLocation, useNavigate } from "react-router-dom"; // Hooks to access router state and navigate programmatically
import ProgressBar from "../../context/ProgressBar"; // Component to show multi-step progress

const Confirmation = () => {
  // Get state passed from previous page (usually reservation data)
  const { state } = useLocation();
  const navigate = useNavigate();
  const { reservationData } = state || {}; // Extract reservation data safely

  // If no reservation data is found, display a fallback message
  if (!reservationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No reservation found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto p-6 text-gray-900">
      {/* Show progress bar indicating current step */}
      <ProgressBar currentStep="Confirmation" />

      {/* Header section: Confirmation icon and message */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white text-2xl font-bold mb-4 shadow-md">
          ✓ {/* Checkmark icon for confirmation */}
        </div>
        <h2 className="text-2xl font-bold mb-1">Reservation Confirmed</h2>
        <p className="text-gray-500 text-sm">
          Please keep this ticket ID for entry.
        </p>
      </div>

      {/* Ticket-style card showing payment and ticket details */}
      <div className="mt-10 bg-white rounded-xl shadow-md border border-gray-300 relative overflow-hidden">
        {/* Decorative perforated sides */}
        <div className="absolute top-0 left-0 h-full w-3 bg-gray-100" />
        <div className="absolute top-0 right-0 h-full w-3 bg-gray-100" />

        <div className="p-8 text-center space-y-6">
          {/* Total amount paid */}
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Total Paid
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {reservationData.totalPrice.toFixed(2)} € {/* Format price with 2 decimals */}
            </p>
          </div>

          {/* Ticket ID section */}
          <div className="border-t border-dashed border-gray-300 pt-6">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Ticket ID
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {reservationData.ticketId} {/* Display the unique ticket ID */}
            </p>
          </div>
        </div>
      </div>

      {/* Button to navigate to the user's bookings page */}
      <button
        onClick={() => navigate("/view-reservations")} // Navigate programmatically
        className="mt-10 w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800"
      >
        My bookings
      </button>
    </div>
  );
};

export default Confirmation;
