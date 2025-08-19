import React from "react";
import { Gift, Percent, Popcorn, Ticket, Film, Trophy } from "lucide-react";

const generalPromotions = [
  {
    title: "2x1 Tuesdays",
    description: "Buy one ticket and get the second free every Tuesday.",
    icon: <Ticket className="w-10 h-10 mx-auto mb-4 text-black" />,
    badge: "Weekly",
  },
  {
    title: "Free Popcorn Combo",
    description: "Get a free popcorn with any large drink purchase on weekends.",
    icon: <Popcorn className="w-10 h-10 mx-auto mb-4 text-black" />,
    badge: "Weekend",
  },
  {
    title: "Student Discount",
    description: "15% off with valid student ID, all week long.",
    icon: <Percent className="w-10 h-10 mx-auto mb-4 text-black" />,
    badge: "Always",
  },
  {
    title: "Birthday Special",
    description: "Enjoy a free ticket on your birthday! Celebrate with us 🎉",
    icon: <Gift className="w-10 h-10 mx-auto mb-4 text-black" />,
    badge: "Special",
  },
];

const moviePromotions = [
  {
    movie: "Deadpool & Wolverine",
    description:
      "Buy your ticket and enter to win exclusive passes to the red carpet premiere.",
    icon: <Film className="w-10 h-10 mx-auto mb-4 text-black" />,
    badge: "Premiere",
  },
  {
    movie: "28 Años Después",
    description:
      "Each ticket purchased gives you the chance to win an official merchandising survival pack.",
    icon: <Film className="w-10 h-10 mx-auto mb-4 text-black" />,
    badge: "Contest",
  },
];

const contests = [
  {
    title: "F1: The Movie – VIP Experience",
    description:
      "With every ticket, you’re entered into a draw to win official F1 merchandise and access to a private screening.",
    icon: <Trophy className="w-10 h-10 mx-auto mb-4 text-black" />,
    badge: "Special",
  },
  {
    title: "Sé lo que hicistéis el último verano – Horror Mystery Pack",
    description:
      "Buy a ticket and join the contest to win an exclusive horror-themed mystery box full of surprises.",
    icon: <Trophy className="w-10 h-10 mx-auto mb-4 text-black" />,
    badge: "Exclusive",
  },
];

const Promotions = () => {
  return (
    <div className="min-h-screen bg-[#fdfcfb] px-6 md:px-12 py-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-6">
          Promotions & Contests
        </h1>
      </div>

      {/* General Promotions */}
      <h2 className="text-2xl font-bold text-black mb-6">General Promotions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {generalPromotions.map((promo, index) => (
          <div
            key={index}
            className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
          >
            {promo.icon}
            <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {promo.badge}
            </span>
            <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
            <p className="text-gray-600 text-sm">{promo.description}</p>
          </div>
        ))}
      </div>

      {/* Movie Promotions */}
      <h2 className="text-2xl font-bold text-black mb-6">Movie Specials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {moviePromotions.map((promo, index) => (
          <div
            key={index}
            className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
          >
            {promo.icon}
            <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {promo.badge}
            </span>
            <h3 className="text-lg font-bold mb-2">{promo.movie}</h3>
            <p className="text-gray-600 text-sm">{promo.description}</p>
          </div>
        ))}
      </div>

      {/* Contests */}
      <h2 className="text-2xl font-bold text-black mb-6">Contests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contests.map((contest, index) => (
          <div
            key={index}
            className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
          >
            {contest.icon}
            <span className="inline-block bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {contest.badge}
            </span>
            <h3 className="text-lg font-bold mb-2">{contest.title}</h3>
            <p className="text-gray-600 text-sm">{contest.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
