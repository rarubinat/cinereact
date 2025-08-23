// ApplyOffers.js
import { useEffect, useState } from "react";

const ApplyOffers = ({ selectedDate, selectedSeats, onSelectDiscount }) => {
  const fixedDiscounts = [
    { id: "d1", name: "10% Off", value: 0.1 },
    { id: "d2", name: "20% Off", value: 0.2 },
    { id: "d3", name: "Student 15% Off", value: 0.15 },
  ];

  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const userBirthday = "1995-08-20"; // Puedes recibir esto como prop si quieres hacerlo dinámico

  useEffect(() => {
    const today = new Date();
    const movieDay = new Date(selectedDate);

    let extraDiscounts = [];

    const birthdayDate = new Date(userBirthday);
    const isBirthdayToday = today.getDate() === birthdayDate.getDate() && today.getMonth() === birthdayDate.getMonth();

    // Descuento de cumpleaños
    extraDiscounts.push({ id: "bday", name: "Birthday Free Ticket", value: 1, available: isBirthdayToday });

    // 2x1 Martes
    if (movieDay.getDay() === 2) {
      extraDiscounts.push({ id: "tue", name: "2x1 Tuesday", value: 0.5, available: true });
    }

    setAvailableDiscounts([...fixedDiscounts, ...extraDiscounts]);
  }, [selectedDate]);

  const handleSelect = (discount) => {
    if (!discount.available) return;
    setSelectedDiscount(discount);
    onSelectDiscount(discount); // Informamos al padre del cambio
  };

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
                ${disabled ? "opacity-40 cursor-not-allowed" : ""}
              `}
            >
              <p className="text-lg font-bold">{discount.name}</p>
              <p className="text-sm text-gray-500">
                {discount.id === "bday" ? "🎂 1 Free Ticket" :
                 discount.id === "tue" ? "🎟️ 2x1 Tuesday" :
                 `${discount.value * 100}% off`}
              </p>
              {isSelected && !disabled && <span className="mt-2 text-green-600 font-semibold">✔ Selected</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplyOffers;
