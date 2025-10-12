// This function takes a "raw" date input and converts it into a JavaScript Date object
const parseReservationDate = (raw) => {
  // If no input is provided, return null
  if (!raw) return null;

  // If the input is a string in the format "DD-MM-YYYY"
  if (typeof raw === "string" && /^\d{2}-\d{2}-\d{4}$/.test(raw)) {
    // Split the string into day, month, year and convert them to numbers
    const [d, m, y] = raw.split("-").map(Number);

    // Create a new Date object (months are 0-indexed in JavaScript)
    return new Date(y, m - 1, d);
  }

  // If the input is already a Date or some other format, just convert it using Date constructor
  return new Date(raw);
};

// This function formats a "raw" date input into a string "DD-MM-YYYY"
const formatDate = (raw) => {
  const d = parseReservationDate(raw); // Convert the raw input into a Date object

  // Build a string with day, month, and year, padding with zero if needed
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getFullYear()}`;
};

// Test: Check if parseReservationDate correctly converts "DD-MM-YYYY" strings
test("parseReservationDate correctly converts DD-MM-YYYY", () => {
  const date = parseReservationDate("04-10-2025");
  expect(date.getFullYear()).toBe(2025); // Year should be 2025
  expect(date.getMonth()).toBe(9);       // Month is 9 because JavaScript months are 0-indexed (0 = Jan, 9 = Oct)
});

// Test: Check if formatDate returns the correct formatted string
test("formatDate returns the correct format", () => {
  expect(formatDate("04-10-2025")).toBe("04-10-2025"); // Should return the same formatted string
});
