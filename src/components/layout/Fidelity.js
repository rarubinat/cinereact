import React from "react";
import { Gift, Popcorn, Ticket, Trophy, Star, Lock } from "lucide-react";
import useReservationCount from "../hooks/ReservationCount";

const loyaltyFeatures = [
  {
    title: "Earn Points",
    description: "Earn 20 points for every entry you purchase at our cinema.",
    icon: <Ticket className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Redeem Rewards",
    description: "Use your points to get free popcorn, drinks, or tickets.",
    icon: <Popcorn className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Birthday Bonus",
    description: "Receive 100 bonus points if you come on your birthday!",
    icon: <Gift className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Exclusive Tiers",
    description: "Unlock Silver, Gold, and Platinum tiers with extra perks based on your points.",
    icon: <Trophy className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
];

const loyaltyTiers = [
  {
    tier: "Silver",
    min: 0,
    max: 250,
    description: ["Earn extra discounts to our snacks!"],
    badge: "Level 1",
  },
  {
    tier: "Gold",
    min: 251,
    max: 1200,
    description: ["General discounts", "VIP screening invites"],
    badge: "Level 2",
  },
  {
    tier: "Platinum",
    min: 1201,
    max: Infinity,
    description: [
      "General discounts",
      "Exclusive cinema experiences",
      "VIP screening invites",
      "Free tickets for 3 seasons on a year",
    ],
    badge: "Level 3",
  },
];

const LoyaltyPage = () => {
  const { totalPoints } = useReservationCount();

  // Función para calcular el siguiente tier
  const nextTier = loyaltyTiers.find((tier) => totalPoints < tier.min);

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-6 md:px-12 py-12">
      {/* Header */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-black mb-4">Cinema Loyalty Program</h3>
      </div>

      {/* Features */}
      <h2 className="text-2xl font-bold text-black mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loyaltyFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
          >
            {feature.icon}
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Tiers with Benefits */}
      <h2 className="text-2xl font-bold text-black mb-6">Membership Tiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loyaltyTiers.map((tier, index) => {
          const isUnlocked = totalPoints >= tier.min;
          const isCurrent =
            totalPoints >= tier.min && (tier.max === Infinity || totalPoints <= tier.max);
          const progress =
            tier.max === Infinity
              ? isUnlocked
                ? 100
                : 0
              : Math.min(100, Math.max(0, ((totalPoints - tier.min) / (tier.max - tier.min)) * 100));

          return (
            <div
              key={index}
              className={`border rounded-2xl p-6 text-center shadow-sm transition relative
                ${isUnlocked ? "bg-white hover:shadow-lg" : "bg-gray-200 text-gray-400"}
                ${isCurrent ? "border-4 border-yellow-400" : ""}`}
            >
              {/* Candado si está bloqueado */}
              {!isUnlocked && (
                <div className="absolute top-4 right-4 text-gray-500">
                  <Lock className="w-6 h-6" />
                </div>
              )}

              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
                  isUnlocked ? "bg-yellow-500 text-white" : "bg-gray-400 text-gray-200"
                }`}
              >
                {tier.badge}
              </span>
              <h3 className="text-lg font-bold mb-2">{tier.tier}</h3>

              {/* Beneficios */}
              <ul className="text-sm mb-3 text-left mx-8">
                {tier.description.map((benefit, idx) => (
                  <li key={idx} className="flex items-center mb-1" title={benefit}>
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="w-full bg-gray-300 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    isUnlocked ? "bg-yellow-500" : "bg-gray-400"
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs mb-2">
                {totalPoints} / {tier.max === Infinity ? "∞" : tier.max} points
              </p>

              {/* Mensaje motivador */}
              {isCurrent && nextTier && (
                <p className="text-xs text-gray-700 mt-1">
                  {nextTier.min - totalPoints} points to reach {nextTier.tier}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoyaltyPage;
