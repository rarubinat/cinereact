const parseReservationDate = (raw) => {
  if (!raw) return null;
  if (typeof raw === "string" && /^\d{2}-\d{2}-\d{4}$/.test(raw)) {
    const [d, m, y] = raw.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(raw);
};

const formatDate = (raw) => {
  const d = parseReservationDate(raw);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getFullYear()}`;
};

test("parseReservationDate convierte correctamente DD-MM-YYYY", () => {
  const date = parseReservationDate("04-10-2025");
  expect(date.getFullYear()).toBe(2025);
  expect(date.getMonth()).toBe(9); // Octubre
});

test("formatDate devuelve formato correcto", () => {
  expect(formatDate("04-10-2025")).toBe("04-10-2025");
});
