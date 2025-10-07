// dataFidelity.js
// This file defines the data structure for the cinema loyalty program.
// It includes information about loyalty features, membership tiers, and icons used in the UI.

import { Gift, Popcorn, Ticket, Trophy, Star, Lock } from "lucide-react";

// List of loyalty program features with their titles, descriptions, and icons
export const loyaltyFeatures = [
  {
    title: "Earn Points",
    description: "Earn 20 points for every entry you purchase at our cinema.",
    // Icon representing ticket purchases
    icon: <Ticket className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Redeem Rewards",
    description: "Use your points to get free popcorn, drinks, or tickets.",
    // Icon representing snack rewards
    icon: <Popcorn className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Birthday Bonus",
    description: "Receive 100 bonus points if you come on your birthday!",
    // Icon representing birthday gifts
    icon: <Gift className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
  {
    title: "Exclusive Tiers",
    description: "Unlock Silver, Gold, and Platinum tiers with extra perks based on your points.",
    // Icon representing tier progression and achievements
    icon: <Trophy className="w-10 h-10 mx-auto mb-4 text-black" />,
  },
];

// Definition of loyalty program tiers and their respective benefits
export const loyaltyTiers = [
  {
    tier: "Silver", // Entry-level tier
    min: 0, // Minimum points required
    max: 250, // Maximum points before upgrading to the next tier
    description: ["Earn extra discounts to our snacks!"], // Perks for Silver members
    badge: "Level 1",
  },
  {
    tier: "Gold", // Mid-level tier
    min: 251,
    max: 1200,
    description: [
      "General discounts",
      "VIP screening invites", // Additional rewards for Gold members
    ],
    badge: "Level 2",
  },
  {
    tier: "Platinum", // Highest tier with exclusive rewards
    min: 1201,
    max: Infinity, // No maximum limit for points
    description: [
      "General discounts",
      "Exclusive cinema experiences",
      "VIP screening invites",
      "Free tickets for 3 seasons on a year",
    ],
    badge: "Level 3",
  },
];

// Exporting icon components used in other parts of the loyalty system UI
export const icons = {
  Star,
  Lock,
};
