// Import tools for testing React components
import { render, screen, fireEvent } from "@testing-library/react";
import ViewReserve from "../components/ViewReserve";
import React from "react";

// Mock Firebase utilities to simulate database and user
jest.mock("../../utils/firebase", () => ({
  auth: { currentUser: { uid: "testuser" } }, // Simulate a logged-in user
  default: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get: jest.fn(() =>
          Promise.resolve({
            docs: [
              {
                id: "1",
                data: () => ({
                  selectedMovie: "Matrix",
                  selectedDate: "10-10-2025",
                  selectedTime: "20:00",
                  room: "B",
                  selectedSeats: ["C1", "C2"],
                  totalPrice: 14.5,
                  ticketId: "XYZ999",
                }),
              },
            ],
          })
        ),
      })),
    })),
  },
}));

// Mock notification context to prevent real notifications during tests
jest.mock("../../context/NotificationContext", () => ({
  useNotification: () => ({ notify: jest.fn() }),
}));

// Test: check if the QR modal opens and closes correctly
test("opens and closes QR modal correctly", async () => {
  render(<ViewReserve />); // Render the ViewReserve component

  // Click on the movie name to open the QR modal
  const movie = await screen.findByText(/Matrix/i);
  fireEvent.click(movie);

  // Check that the modal content is visible (Ticket ID should appear)
  expect(await screen.findByText(/Ticket ID/i)).toBeInTheDocument();

  // Close the modal by clicking the "×" button
  fireEvent.click(screen.getByText("×"));

  // Confirm that the modal is no longer visible
  expect(screen.queryByText(/Ticket ID/i)).not.toBeInTheDocument();
});
