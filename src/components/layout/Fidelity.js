import React from "react";
import { Gift, Percent, Popcorn, Ticket, Trophy } from "lucide-react";

const loyaltyFeatures = [
  {
    title: "Earn Points",
    description: "Get 10 points for every ticket you buy at our cinema.",
    icon: <Ticket className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Redeem Rewards",
    description: "Use your points to get free popcorn, drinks, or tickets.",
    icon: <Popcorn className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Birthday Bonus",
    description: "Receive 100 bonus points on your birthday 🎉",
    icon: <Gift className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Exclusive Tiers",
    description: "Unlock Silver, Gold, and Platinum tiers with extra perks.",
    icon: <Trophy className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
];

const loyaltyTiers = [
  {
    tier: "Silver",
    description: "Earn 1.2x points and early access to tickets.",
    badge: "Level 1",
  },
  {
    tier: "Gold",
    description: "Earn 1.5x points, free upgrades, and VIP screening invites.",
    badge: "Level 2",
  },
  {
    tier: "Platinum",
    description: "Earn 2x points, exclusive backstage experiences, free tickets.",
    badge: "Level 3",
  },
];

const LoyaltyPage = () => {
  return (
    <div className="min-h-screen bg-[#fdfcfb] px-6 md:px-12 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">Cinema Loyalty Program</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Join our loyalty program to earn points, unlock rewards, and enjoy exclusive perks at our cinema.
        </p>
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

      {/* Tiers */}
      <h2 className="text-2xl font-bold text-black mb-6">Membership Tiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loyaltyTiers.map((tier, index) => (
          <div
            key={index}
            className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
          >
            <span className="inline-block bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {tier.badge}
            </span>
            <h3 className="text-lg font-bold mb-2">{tier.tier}</h3>
            <p className="text-gray-600 text-sm">{tier.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoyaltyPage;
