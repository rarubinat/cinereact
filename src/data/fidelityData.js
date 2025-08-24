// dataFidelity.js
import { Gift, Popcorn, Ticket, Trophy, Star, Lock } from "lucide-react";

export const loyaltyFeatures = [
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

export const loyaltyTiers = [
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

export const icons = {
  Star,
  Lock,
};
