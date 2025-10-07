import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewReserve from "../components/ViewReserve";

jest.mock("../../utils/firebase", () => ({
  auth: { currentUser: { uid: "testuser" } },
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

jest.mock("../../context/NotificationContext", () => ({
  useNotification: () => ({ notify: jest.fn() }),
}));

test("renderiza reservas y abre modal QR", async () => {
  render(<ViewReserve />);

  // Espera que aparezca el título principal
  expect(await screen.findByText(/My Bookings/i)).toBeInTheDocument();

  // Película cargada correctamente
  expect(await screen.findByText(/Inception/i)).toBeInTheDocument();

  // Simula click en cancel
  fireEvent.click(screen.getByText(/Cancel reservation/i));

  // Aparece el modal
  expect(await screen.findByText(/Cancel reservation/i)).toBeInTheDocument();
});
