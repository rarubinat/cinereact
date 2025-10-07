// __tests__/components/Payment.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Payment from "../../src/components/payment/Payment";

// --- Mock Firebase ---
jest.mock("../../src/utils/firebase", () => ({
  __esModule: true,
  default: { collection: jest.fn(() => ({ add: jest.fn() })) },
  auth: { currentUser: { uid: "user123", email: "test@example.com" } },
}));

// --- Mock react-router-dom ---
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
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

describe("Payment Component", () => {
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

  test("opens confirmation modal on Pay button click", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Pay 24.00 €/i));
    expect(screen.getByText("Confirm Payment")).toBeInTheDocument();
  });

  test("confirms payment and navigates to confirmation page", async () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Pay 24.00 €/i));
    fireEvent.click(screen.getByText(/Yes, Pay/i));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        "/confirmation",
        expect.any(Object)
      )
    );
  });
});
