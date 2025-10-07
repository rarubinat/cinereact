import { useEffect, useState } from "react";

/**
 * ApplyOffers component
 * Displays available discounts and allows the user to select one.
 * Explains logic inline for developers.
 *
 * Props:
 * - selectedDate: string, the date of the movie (YYYY-MM-DD)
 * - selectedSeats: array, list of selected seat numbers
 * - onSelectDiscount: function, callback to inform parent when a discount is selected
 */
const ApplyOffers = ({ selectedDate, selectedSeats, onSelectDiscount }) => {
  // ----------------- Fixed discounts -----------------
  // These discounts are always available
  const fixedDiscounts = [
    { id: "d1", name: "10% Off", value: 0.1 },
    { id: "d2", name: "20% Off", value: 0.2 },
    { id: "d3", name: "Student 15% Off", value: 0.15 },
  ];

  // ----------------- Component state -----------------
  const [availableDiscounts, setAvailableDiscounts] = useState([]); // Discounts shown to user
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Currently selected discount

  // ----------------- Conditional discounts -----------------
  // Hardcoded birthday for demonstration; in real app, pass from user profile
  const userBirthday = "1995-08-20";

  // ----------------- Compute discounts whenever selectedDate changes -----------------
  useEffect(() => {
    const today = new Date();
    const movieDay = new Date(selectedDate);

    let extraDiscounts = [];

    // Birthday discount: free ticket if today is user's birthday
    const birthdayDate = new Date(userBirthday);
    const isBirthdayToday =
      today.getDate() === birthdayDate.getDate() &&
      today.getMonth() === birthdayDate.getMonth();

    extraDiscounts.push({
      id: "bday",
      name: "Birthday Free Ticket",
      value: 1, // full discount
      available: isBirthdayToday,
    });

    // 2x1 Tuesday: applies if movie is on Tuesday
    if (movieDay.getDay() === 2) {
      extraDiscounts.push({
        id: "tue",
        name: "2x1 Tuesday",
        value: 0.5,
        available: true,
      });
    }

    // Merge fixed discounts with conditional ones
    setAvailableDiscounts([...fixedDiscounts, ...extraDiscounts]);
  }, [selectedDate]);

  // ----------------- Handle user selecting a discount -----------------
  const handleSelect = (discount) => {
    if (!discount.available) return; // Prevent selecting unavailable discounts
    setSelectedDiscount(discount);
    onSelectDiscount(discount); // Notify parent component of selection
  };

  // ----------------- Render -----------------
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Available Discounts</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableDiscounts.map((discount) => {
          const isSelected = selectedDiscount?.id === discount.id;
          const disabled = !discount.available;

          return (
            <div
              key={discount.id}
              onClick={() => !disabled && handleSelect(discount)}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition shadow-sm
                ${isSelected ? "border-black ring-2 ring-black" : "border-gray-300 hover:border-black"}
                ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {/* Discount title */}
              <p className="text-lg font-bold">{discount.name}</p>

              {/* Discount description */}
              <p className="text-sm text-gray-500">
                {discount.id === "bday"
                  ? "1 Free Ticket" // Birthday discount
                  : discount.id === "tue"
                  ? "2x1 Tuesday" // Tuesday discount
                  : `${discount.value * 100}% off`} // Fixed discount
              </p>

              {/* Show selected state */}
              {isSelected && !disabled && (
                <span className="mt-2 text-green-600 font-semibold">✔ Selected</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplyOffers;
