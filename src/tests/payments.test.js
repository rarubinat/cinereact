// __tests__/components/Payment.test.jsx
// Import tools for testing React components
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Payment from "../../src/components/payment/Payment";

// --- Mock Firebase ---
// Simulate Firebase functionality so no real database is needed
jest.mock("../../src/utils/firebase", () => ({
  __esModule: true,
  default: { collection: jest.fn(() => ({ add: jest.fn() })) }, // mock adding to collection
  auth: { currentUser: { uid: "user123", email: "test@example.com" } }, // simulate logged-in user
}));

// --- Mock react-router-dom ---
// Simulate navigation and location state for testing without a real router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate, // intercept navigation calls
  useLocation: () => ({               // provide fake location state
    state: {
      selectedMovie: "Dune 2",
      selectedDate: "2025-10-04",
      selectedTime: "20:00",
      selectedSeats: ["A1", "A2"],
      selectedRow: 3,
      room: "Sala 5",
      totalPrice: 24,
      selectedFood: [{ snack: "Popcorn", quantity: 1, price: 4 }],
      foodPrice: 4,
    },
  }),
}));

// ------------------------------
// Payment Component Tests
// ------------------------------
describe("Payment Component", () => {

  // Test that the reservation summary is rendered correctly
  test("renders reservation summary", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    expect(screen.getByText("Reservation Summary")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText(/24.00 €/)).toBeInTheDocument();
  });

  // Test that clicking the Pay button opens the confirmation modal
  test("opens confirmation modal on Pay button click", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Pay 24.00 €/i)); // simulate clicking "Pay" button
    expect(screen.getByText("Confirm Payment")).toBeInTheDocument(); // modal should appear
  });

  // Test that confirming payment triggers navigation to confirmation page
  test("confirms payment and navigates to confirmation page", async () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Pay 24.00 €/i)); // open confirmation modal
    fireEvent.click(screen.getByText(/Yes, Pay/i));    // confirm payment

    // Wait for navigation function to be called
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        "/confirmation",     // navigation target
        expect.any(Object)   // with some state object
      )
    );
  });
});
