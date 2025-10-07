import { render, screen, fireEvent } from "@testing-library/react";
import ViewReserve from "../components/ViewReserve";
import React from "react";

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

jest.mock("../../context/NotificationContext", () => ({
  useNotification: () => ({ notify: jest.fn() }),
}));

test("abre y cierra modal QR correctamente", async () => {
  render(<ViewReserve />);

  // Clic en la película para abrir modal QR
  const movie = await screen.findByText(/Matrix/i);
  fireEvent.click(movie);

  // Modal visible
  expect(await screen.findByText(/Ticket ID/i)).toBeInTheDocument();

  // Cerrar modal
  fireEvent.click(screen.getByText("×"));
  expect(screen.queryByText(/Ticket ID/i)).not.toBeInTheDocument();
});
