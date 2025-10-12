// __tests__/helpers/paymentUtils.test.js
// Import the functions we want to test from the Payment module
import {
  generateTicketId,
  parseBirthdateToDayMonth,
} from "../../src/components/payment/Payment"; // Adjust the path if needed

// ------------------------------
// Tests for generateTicketId()
// ------------------------------
describe("generateTicketId()", () => {
  // Test that the function returns a ticket ID in the expected format
  it("should return a unique uppercase ticket ID", () => {
    const id = generateTicketId();
    // Check that the ID matches the pattern: T-XXXX-XXXX (letters and numbers, uppercase)
    expect(id).toMatch(/^T-[A-Z0-9]+-[A-Z0-9]+$/);
  });

  // Test that each call generates a different ID (not the same as previous ones)
  it("should generate different IDs each time", () => {
    const id1 = generateTicketId();
    const id2 = generateTicketId();
    expect(id1).not.toEqual(id2);
  });
});

// ------------------------------
// Tests for parseBirthdateToDayMonth()
// ------------------------------
describe("parseBirthdateToDayMonth()", () => {
  // Test parsing a date string in YYYY-MM-DD format
  it("should parse YYYY-MM-DD strings correctly", () => {
    expect(parseBirthdateToDayMonth("1990-12-25")).toEqual({ day: 25, month: 12 });
  });

  // Test parsing a date string in DD/MM/YYYY format
  it("should parse DD/MM/YYYY strings correctly", () => {
    expect(parseBirthdateToDayMonth("25/12/1990")).toEqual({ day: 25, month: 12 });
  });

  // Test parsing a JavaScript Date object
  it("should handle Date objects", () => {
    const d = new Date("1990-12-25");
    expect(parseBirthdateToDayMonth(d)).toEqual({ day: 25, month: 12 });
  });

  // Test that invalid values return null
  it("should return null for invalid values", () => {
    expect(parseBirthdateToDayMonth("abc")).toBeNull();
  });
});
