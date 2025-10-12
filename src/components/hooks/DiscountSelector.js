import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ApplyOffers = ({ selectedDate, onSelectDiscount }) => {
  const fixedDiscounts = [
    { id: "d1", name: "10% Off", value: 0.1, available: true },
    { id: "d2", name: "20% Off", value: 0.2, available: true },
    { id: "d3", name: "Student 15% Off", value: 0.15, available: true },
  ];

  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const userBirthday = "1995-08-20";

  useEffect(() => {
    const today = new Date();
    const movieDay = new Date(selectedDate);
    const extraDiscounts = [];

    const birthdayDate = new Date(userBirthday);
    const isBirthdayToday =
      today.getDate() === birthdayDate.getDate() &&
      today.getMonth() === birthdayDate.getMonth();

    extraDiscounts.push({
      id: "bday",
      name: "Birthday Free Ticket",
      value: 1,
      available: isBirthdayToday,
    });

    extraDiscounts.push({
      id: "tue",
      name: "2x1 Tuesday",
      value: 0.5,
      available: movieDay.getDay() === 2,
    });

    setAvailableDiscounts([...fixedDiscounts, ...extraDiscounts]);
  }, [selectedDate]);

  const handleSelect = (discount) => {
    if (!discount.available) return;
    setSelectedDiscount(discount);
    onSelectDiscount(discount);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Available Discounts
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {availableDiscounts.map((discount) => {
          const isSelected = selectedDiscount?.id === discount.id;
          const disabled = !discount.available;

          return (
            <motion.div
              key={discount.id}
              whileHover={!disabled ? { scale: 1.03 } : {}}
              transition={{ duration: 0.2 }}
              onClick={() => !disabled && handleSelect(discount)}
              className={`relative border rounded-2xl p-5 shadow-sm flex flex-col justify-between transition cursor-pointer
                ${isSelected ? "border-black ring-2 ring-black" : "border-gray-200 hover:border-black/60"}
                ${disabled ? "opacity-40 cursor-not-allowed bg-gray-50" : "bg-white"}`}
            >
              {/* Header section */}
              <div>
                <h4 className="text-lg font-bold text-gray-900">{discount.name}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {discount.id === "bday"
                    ? "1 Free Ticket"
                    : discount.id === "tue"
                    ? "2x1 Tuesday"
                    : `${discount.value * 100}% Off`}
                </p>
              </div>

              {/* Radio circle */}
              <div className="flex justify-end mt-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all 
                    ${isSelected ? "border-black" : "border-gray-300"} 
                    ${disabled ? "border-gray-300" : "hover:border-black"}`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selectedIndicator"
                      className="w-3 h-3 bg-black rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </div>

              {/* Disabled label */}
              {disabled && (
                <span className="absolute top-2 right-3 text-[11px] text-gray-400 italic">
                  Not available
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplyOffers;
