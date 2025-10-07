// __tests__/helpers/paymentUtils.test.js
import {
  generateTicketId,
  parseBirthdateToDayMonth,
} from "../../src/components/payment/Payment"; // Ajusta la ruta según tu estructura

describe("generateTicketId()", () => {
  it("should return a unique uppercase ticket ID", () => {
    const id = generateTicketId();
    expect(id).toMatch(/^T-[A-Z0-9]+-[A-Z0-9]+$/);
  });

  it("should generate different IDs each time", () => {
    const id1 = generateTicketId();
    const id2 = generateTicketId();
    expect(id1).not.toEqual(id2);
  });
});

describe("parseBirthdateToDayMonth()", () => {
  it("should parse YYYY-MM-DD strings correctly", () => {
    expect(parseBirthdateToDayMonth("1990-12-25")).toEqual({ day: 25, month: 12 });
  });

  it("should parse DD/MM/YYYY strings correctly", () => {
    expect(parseBirthdateToDayMonth("25/12/1990")).toEqual({ day: 25, month: 12 });
  });

  it("should handle Date objects", () => {
    const d = new Date("1990-12-25");
    expect(parseBirthdateToDayMonth(d)).toEqual({ day: 25, month: 12 });
  });

  it("should return null for invalid values", () => {
    expect(parseBirthdateToDayMonth("abc")).toBeNull();
  });
});
