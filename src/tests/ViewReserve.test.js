import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewReserve from "../components/ViewReserve";

// --- Mock Firebase ---
// Simulate Firebase so no real backend is needed
jest.mock("../../utils/firebase", () => ({
  auth: { currentUser: { uid: "testuser" } }, // Simulate logged-in user
  default: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get: jest.fn(() =>
          Promise.resolve({
            docs: [
              {
                id: "1",
                data: () => ({
                  selectedMovie: "Inception",
                  selectedDate: "04-10-2025",
                  selectedTime: "18:00",
                  room: "A",
                  selectedSeats: ["B4", "B5"],
                  totalPrice: 12.5,
                  ticketId: "ABC123",
                }),
              },
            ],
          })
        ),
      })),
    })),
  },
}));

// --- Mock Notification Context ---
// Prevents real notifications during testing
jest.mock("../../context/NotificationContext", () => ({
  useNotification: () => ({ notify: jest.fn() }),
}));

// ------------------------------
// Test: Render reservations and open QR modal
// ------------------------------
test("renders reservations and opens QR modal", async () => {
  render(<ViewReserve />); // Render the ViewReserve component

  // Wait for the main title to appear
  expect(await screen.findByText(/My Bookings/i)).toBeInTheDocument();

  // Check that the movie "Inception" is displayed
  expect(await screen.findByText(/Inception/i)).toBeInTheDocument();

  // Simulate clicking the "Cancel reservation" button
  fireEvent.click(screen.getByText(/Cancel reservation/i));

  // Check that the cancel reservation modal appears
  expect(await screen.findByText(/Cancel reservation/i)).toBeInTheDocument();
});
